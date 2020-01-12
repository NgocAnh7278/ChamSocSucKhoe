import React, {Component} from 'react';
import {SafeAreaView} from 'react-navigation';
import {
  View,
  Text,
  StyleSheet,
  processColor,
  TouchableOpacity,
} from 'react-native';
import {BarChart} from 'react-native-charts-wrapper';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
import {
  IP_SERVER,
  URLThucDon,
  DATE_FORMAT,
  DATE_FORMAT_COMPARE,
} from '../../asset/MyConst';
import Loader from '../../components/Loader';

export class BaoCaoTuanActivity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dauTuan: '',
      cuoiTuan: '',
      khoangThoiGianHienThi: [],
      khoangThoiGianTimKiem: [],
      ngayChon: this.props.ngayChon,
      email: this.props.email,
      Obj: null,
      duLieu: [],
      nangLuongHienTai: 0,
      damHienTai: 0,
      chatBotHienTai: 0,
      chatBeoHienTai: 0,
      nangLuongMucTieu: '100%',
      damMucTieu: '50%',
      chatBotMucTieu: '30%',
      chatBeoMucTieu: '20%',
      data: {
        dataSets: [
          {
            values: [{y: 0}, {y: 0}, {y: 0}, {y: 0}, {y: 0}, {y: 0}, {y: 0}],
            label: 'Calo đã ăn',
            config: {
              color: processColor('teal'),
            },
          },
        ],
        config: {
          barWidth: 0.7,
        },
      },
      xAxis: {
        valueFormatter: [],
      },
    };
  }

  async componentDidMount() {
    await this.tinhNgay(this.state.ngayChon);
    await this.layDuLieu(0);
  }

  async tinhNgay(ngayChon) {
    // Lấy ngày đầu tuần của ngày đã chọn
    let start = moment(ngayChon, DATE_FORMAT)
      .startOf('isoWeek')
      .format(DATE_FORMAT);
    // Lấy ngày cuối tuần của ngày đã chọn
    let end = moment(ngayChon, DATE_FORMAT)
      .endOf('isoWeek')
      .format(DATE_FORMAT);

    let khoangThoiGianHienThi = [];
    let khoangThoiGianTimKiem = [];
    for (
      let index = moment(start, DATE_FORMAT);
      index <= moment(end, DATE_FORMAT);
      index.add(1, 'day')
    ) {
      khoangThoiGianHienThi.push(index.format('DD/MM'));
      khoangThoiGianTimKiem.push(index.format(DATE_FORMAT_COMPARE));
    }

    await this.setStateAsync({
      dauTuan: start,
      cuoiTuan: end,
      khoangThoiGianHienThi: khoangThoiGianHienThi,
      khoangThoiGianTimKiem: khoangThoiGianTimKiem,
    });

    await this.setStateAsync({
      xAxis: {
        valueFormatter: this.state.khoangThoiGianHienThi,
        granularityEnabled: true,
        granularity: 1,
        textSize: 14,
      },
    });
  }

  async layDuLieu(ngay) {
    let date;
    if (
      Number(
        moment(this.state.dauTuan, DATE_FORMAT)
          .add(ngay, 'days')
          .format(DATE_FORMAT_COMPARE),
      ) <= Number(moment().format(DATE_FORMAT_COMPARE))
    ) {
      this.setState({
        isLoading: true,
      });
      date = moment(this.state.dauTuan, DATE_FORMAT)
        .add(ngay, 'days')
        .format(DATE_FORMAT_COMPARE);
      await this.tinhNgay(date);
      fetch(URLThucDon, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loai: 3,
          email: this.state.email,
          khoangThoiGian: this.state.khoangThoiGianTimKiem,
        }),
      })
        .then(response => response.json())
        .then(responseJson => {
          // Láy dữ liệu thành công
          this.setStateAsync({
            Obj: responseJson,
          });
          this.tinhToanTyLeDinhDuong();
          this.setState({
            isLoading: false,
          });
        })
        .catch(error => {
          console.error(error);
        });
    }
  }

  setStateAsync(state) {
    return new Promise(resolve => {
      this.setState(state, resolve);
    });
  }

  async tinhToanTyLeDinhDuong() {
    if (this.state.Obj !== undefined) {
      let nangLuongHienTai = 0;
      let tongNangLuong = 0;
      let tongChatDam = 0;
      let tongChatBeo = 0;
      let tongChatBot = 0;
      this.state.Obj.forEach(w => {
        nangLuongHienTai += Number(w.Calo) > 0 ? Number(w.TongNangLuong) : 0;
        tongNangLuong += Number(w.Calo);
        tongChatDam += Number(w.Dam);
        tongChatBeo += Number(w.Beo);
        tongChatBot += Number(w.Xo);

        let total = tongChatDam + tongChatBeo + tongChatBot;
        let tyLeChatDam =
          tongChatDam > 0 ? parseInt((tongChatDam / total) * 100) : 0;
        let tyLeChatBeo =
          tongChatBeo > 0 ? parseInt((tongChatBeo / total) * 100) : 0;
        let tyLeChatBot = total > 0 ? 100 - tyLeChatDam - tyLeChatBeo : 0;

        this.setState({
          nangLuongHienTai:
            tongNangLuong > 0
              ? parseInt((tongNangLuong / nangLuongHienTai) * 100)
              : 0,
          damHienTai: tyLeChatDam,
          chatBotHienTai: tyLeChatBot,
          chatBeoHienTai: tyLeChatBeo,
        });
      });
      let data = {
        dataSets: [
          {
            values: this.state.Obj.map(w => Number(w.Calo)),
            label: 'Calo đã ăn',
            config: {
              color: processColor('teal'),
              valueTextSize: 15,
            },
          },
        ],
        config: {
          barWidth: 0.7,
        },
      };
      await this.setStateAsync({
        data: data,
      });
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.thoiGian}>
          <View style={{flex: 1}}>
            <TouchableOpacity
              style={{marginLeft: 100}}
              onPress={() => {
                this.layDuLieu(-7);
              }}>
              <IconAntDesign
                style={{color: 'black'}}
                name="caretleft"
                size={20}
                color="white"
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>
              <Text style={{fontSize: 18}}>
                {' '}
                {this.state.dauTuan.substring(5)} -{' '}
                {this.state.cuoiTuan.substring(5)}{' '}
              </Text>
            </Text>
          </View>
          <View style={{flex: 1}}>
            <TouchableOpacity
              style={{marginRight: 50}}
              onPress={() => {
                this.layDuLieu(7);
              }}>
              <IconAntDesign
                style={{color: 'black'}}
                name="caretright"
                size={20}
                color="white"
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.tiLeDinhDuong}>
          <Text style={{fontSize: 18}}>Tỷ lệ dinh dưỡng</Text>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text>Hiện tại</Text>
              <View
                style={[
                  styles.thanhPhanDinhDuongHienTai,
                  {backgroundColor: '#FF0000'},
                ]}>
                <Text style={styles.chuDinhDuong}>
                  {this.state.nangLuongHienTai + '%'}
                </Text>
              </View>
              <View
                style={[
                  styles.thanhPhanDinhDuongHienTai,
                  {backgroundColor: '#FFA500'},
                ]}>
                <Text style={styles.chuDinhDuong}>
                  {this.state.damHienTai + '%'}
                </Text>
              </View>
              <View
                style={[
                  styles.thanhPhanDinhDuongHienTai,
                  {backgroundColor: '#32CD32'},
                ]}>
                <Text style={styles.chuDinhDuong}>
                  {this.state.chatBotHienTai + '%'}
                </Text>
              </View>
              <View
                style={[
                  styles.thanhPhanDinhDuongHienTai,
                  {backgroundColor: '#FF4500'},
                ]}>
                <Text style={styles.chuDinhDuong}>
                  {this.state.chatBeoHienTai + '%'}
                </Text>
              </View>
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text />
              <View style={styles.thanhPhanDinhDuong}>
                <Text>Năng lượng</Text>
              </View>
              <View style={styles.thanhPhanDinhDuong}>
                <Text>Chất đạm</Text>
              </View>
              <View style={styles.thanhPhanDinhDuong}>
                <Text>Chất bột</Text>
              </View>
              <View style={styles.thanhPhanDinhDuong}>
                <Text>Chất béo</Text>
              </View>
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text>Mục tiêu</Text>
              <View
                style={[
                  styles.thanhPhanDinhDuongHienTai,
                  {backgroundColor: '#FF0000'},
                ]}>
                <Text style={styles.chuDinhDuong}>
                  {this.state.nangLuongMucTieu}
                </Text>
              </View>
              <View
                style={[
                  styles.thanhPhanDinhDuongHienTai,
                  {backgroundColor: '#FFA500'},
                ]}>
                <Text style={styles.chuDinhDuong}>{this.state.damMucTieu}</Text>
              </View>
              <View
                style={[
                  styles.thanhPhanDinhDuongHienTai,
                  {backgroundColor: '#32CD32'},
                ]}>
                <Text style={styles.chuDinhDuong}>
                  {this.state.chatBotMucTieu}
                </Text>
              </View>
              <View
                style={[
                  styles.thanhPhanDinhDuongHienTai,
                  {backgroundColor: '#FF4500'},
                ]}>
                <Text style={styles.chuDinhDuong}>
                  {this.state.chatBeoMucTieu}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.bieuDo}>
          <BarChart
            style={styles.chart}
            data={this.state.data}
            xAxis={this.state.xAxis}
            animation={{durationX: 2000}}
            gridBackgroundColor={processColor('#000000')}
            visibleRange={{x: {min: 7, max: 7}}}
          />
        </View>
        <View>
          {/* {
            this.state.isLoading ? <View style={{ flex: 1, justifyContent: "center", alignContent: "center" }}>
              <Loader />
            </View> : null
          } */}
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chart: {
    flex: 1,
  },
  thoiGian: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    // justifyContent: 'center',
  },
  tiLeDinhDuong: {
    flex: 6,
    borderWidth: 2,
    borderColor: 'black',
    marginBottom: 3,
    margin: 5,
    padding: 5,
  },
  bieuDo: {
    flex: 9,
    margin: 8,
  },
  thanhPhanDinhDuong: {
    height: 31,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  thanhPhanDinhDuongHienTai: {
    width: 70,
    height: 31,
    borderRadius: 20,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  chuDinhDuong: {
    color: 'white',
    fontSize: 20,
  },
});
