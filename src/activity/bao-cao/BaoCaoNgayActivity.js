import React, { Component } from 'react';
import { SafeAreaView } from 'react-navigation';
import {
  View,
  Text,
  StyleSheet,
  processColor,
  TouchableOpacity,
} from 'react-native';
import { PieChart } from 'react-native-charts-wrapper';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
import {
  LAY_THUC_DON,
  URLThucDon,
  DATE_FORMAT,
  DATE_FORMAT_COMPARE,
} from '../../asset/MyConst';
import Loader from '../../components/Loader';

export class BaoCaoNgayActivity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      thoiGian: '',
      isLoading: true,
      ngayChon: this.props.ngayChon,
      email: this.props.email,
      Obj: null,
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
            values: [
              { value: 0, label: 'Chất bột' },
              { value: 0, label: 'Chất đạm' },
              { value: 0, label: 'Chất béo' },
            ],
            label: '',
            config: {
              colors: [
                processColor('#32CD32'),
                processColor('#FFA500'),
                processColor('#FF4500'),
              ],

              valueTextSize: 30,
              valueTextColor: processColor('white'),
              sliceSpace: 5,
              selectionShift: 13,
              valueFormatter: "#.#'%'",
              valueLineColor: processColor('red'),
              valueLinePart1Length: 0.5,
            },
          },
        ],
      },
      description: {
        text: '',
        textSize: 15,
        textColor: processColor('darkgray'),
      },
    };
  }

  async componentDidMount() {
    this.tinhNgay();
    await this.layDuLieu(0);
  }

  tinhNgay() {
    let ngay = '';
    if (
      Number(
        moment(this.state.ngayChon, DATE_FORMAT_COMPARE).format(
          DATE_FORMAT_COMPARE,
        ),
      ) === Number(moment().format(DATE_FORMAT_COMPARE))
    ) {
      ngay = 'Hôm nay';
    } else {
      ngay = moment(this.state.ngayChon, DATE_FORMAT_COMPARE).format('DD/MM');
    }
    return ngay;
  }

  async layDuLieu(ngay) {
    let date;
    if (
      Number(
        moment(this.state.ngayChon, DATE_FORMAT)
          .add(ngay, 'days')
          .format(DATE_FORMAT_COMPARE),
      ) <= Number(moment().format(DATE_FORMAT_COMPARE))
    ) {
      this.setState({
        isLoading: true
      })
      date = moment(this.state.ngayChon, DATE_FORMAT)
        .add(ngay, 'days')
        .format(DATE_FORMAT_COMPARE);
      this.setState({
        ngayChon: date,
      });
      fetch(URLThucDon, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loai: LAY_THUC_DON,
          email: this.state.email,
          ngayAn: moment(date, DATE_FORMAT_COMPARE).format(DATE_FORMAT_COMPARE),
        }),
      })
        .then(response => response.json())
        .then(responseJson => {
          // Láy dữ liệu thành công
          this.setState({
            Obj: responseJson,
          });
          this.tinhToanTyLeDinhDuong();
          this.setState({
            isLoading: false
          })
        })
        .catch(error => {
          console.error(error);
        });
    }
  }

  async tinhToanTyLeDinhDuong() {
    if (this.state.Obj != undefined) {
      let nangLuongHienTai = Number(this.state.Obj.TongNangLuong);
      let tongNangLuong = 0;
      let tongChatDam = 0;
      let tongChatBeo = 0;
      let tongChatBot = 0;
      this.state.Obj.DanhSachMon.forEach((element) => {
        if (element.Mon.length > 0) {
          element.Mon.map(w => {
            tongNangLuong += Number(w.SoLuong) * Number(w.Calo);
            tongChatDam += Number(w.Dam);
            tongChatBeo += Number(w.Beo);
            tongChatBot += Number(w.Xo);
          });
        } else {
          tongNangLuong += 0;
          tongChatDam += 0;
          tongChatBeo += 0;
          tongChatBot += 0;
        }
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
        let data = {
          dataSets: [
            {
              values: [
                {
                  value: Number(tyLeChatBot),
                  label: 'Chất bột',
                },
                {
                  value: Number(tyLeChatDam),
                  label: 'Chất đạm',
                },
                {
                  value: Number(tyLeChatBeo),
                  label: 'Chất béo',
                },
              ],
              label: 'Pie dataset',
              config: {
                colors: [
                  processColor('#32CD32'),
                  processColor('#FFA500'),
                  processColor('#FF4500'),
                ],
                valueTextSize: 30,
                valueTextColor: processColor('green'),
                sliceSpace: 5,
                selectionShift: 13,
                valueFormatter: "#.#'%'",
                valueLineColor: processColor('red'),
                valueLinePart1Length: 0.5,
              },
            },
          ],
        };
        this.setState({
          data: data,
        });
      });
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.thoiGian}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={{ marginLeft: 100 }}
              onPress={() => {
                this.layDuLieu(-1);
              }}>
              <IconAntDesign
                style={{ color: 'black' }}
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
              <Text style={{ fontSize: 18 }}> {this.tinhNgay()}</Text>
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={{ marginRight: 50 }}
              onPress={() => {
                this.layDuLieu(1);
              }}>
              <IconAntDesign
                style={{ color: 'black' }}
                name="caretright"
                size={20}
                color="white"
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.tiLeDinhDuong}>
          <Text style={{ fontSize: 18 }}>Tỷ lệ dinh dưỡng</Text>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text>Hiện tại</Text>
              <View
                style={[
                  styles.thanhPhanDinhDuongHienTai,
                  { backgroundColor: '#FF0000' },
                ]}>
                <Text style={styles.chuDinhDuong}>
                  {this.state.nangLuongHienTai + '%'}
                </Text>
              </View>
              <View
                style={[
                  styles.thanhPhanDinhDuongHienTai,
                  { backgroundColor: '#FFA500' },
                ]}>
                <Text style={styles.chuDinhDuong}>
                  {this.state.damHienTai + '%'}
                </Text>
              </View>
              <View
                style={[
                  styles.thanhPhanDinhDuongHienTai,
                  { backgroundColor: '#32CD32' },
                ]}>
                <Text style={styles.chuDinhDuong}>
                  {this.state.chatBotHienTai + '%'}
                </Text>
              </View>
              <View
                style={[
                  styles.thanhPhanDinhDuongHienTai,
                  { backgroundColor: '#FF4500' },
                ]}>
                <Text style={styles.chuDinhDuong}>
                  {this.state.chatBeoHienTai + '%'}
                </Text>
              </View>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
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
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text>Mục tiêu</Text>
              <View
                style={[
                  styles.thanhPhanDinhDuongHienTai,
                  { backgroundColor: '#FF0000' },
                ]}>
                <Text style={styles.chuDinhDuong}>
                  {this.state.nangLuongMucTieu}
                </Text>
              </View>
              <View
                style={[
                  styles.thanhPhanDinhDuongHienTai,
                  { backgroundColor: '#FFA500' },
                ]}>
                <Text style={styles.chuDinhDuong}>{this.state.damMucTieu}</Text>
              </View>
              <View
                style={[
                  styles.thanhPhanDinhDuongHienTai,
                  { backgroundColor: '#32CD32' },
                ]}>
                <Text style={styles.chuDinhDuong}>
                  {this.state.chatBotMucTieu}
                </Text>
              </View>
              <View
                style={[
                  styles.thanhPhanDinhDuongHienTai,
                  { backgroundColor: '#FF4500' },
                ]}>
                <Text style={styles.chuDinhDuong}>
                  {this.state.chatBeoMucTieu}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.bieuDo}>
          <PieChart
            style={styles.chart}
            data={this.state.data}
            chartDescription={this.state.description}
            entryLabelColor={processColor('white')}
            entryLabelTextSize={20}
            rotationAngle={45}
            holeRadius={10}
            holeColor={processColor('#f0f0f0')}
            transparentCircleRadius={10}
          />
        </View>
        <View >
          {
            this.state.isLoading ? <View style={{ flex: 1, justifyContent: "center", alignContent: "center" }}>
              <Loader />
            </View> : null
          }
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
