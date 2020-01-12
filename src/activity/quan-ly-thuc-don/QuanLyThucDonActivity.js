import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {COLOR_DEEPSKY_BLUE} from '../../asset/MyColor';
import {
  IP_SERVER,
  LAY_THUC_DON,
  DATE_FORMAT,
  DATE_FORMAT_COMPARE,
  URLThucDon,
} from '../../asset/MyConst';
import DanhSachBuaAnComponent from '../../components/quan-ly-thuc-don/DanhSachBuaAnComponent';
import * as Progress from 'react-native-progress';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import {connect} from 'react-redux';
import * as actions from '../../redux/actions';
import Loader from '../../components/Loader';

class QuanLyThucDonActivity extends Component {
  menuList = [{id: '1'}, {id: '2'}, {id: '3'}, {id: '4'}];

  setStateAsync(state) {
    return new Promise(resolve => {
      this.setState(state, resolve);
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      progress: 0.1,
      btnSelected: moment().format('DD'),
      dayOfWeek: this.taoLich(moment().format(DATE_FORMAT)),
      totalCalo: 0,
      isLoading: false,
      thongTinCacNgayDaAn: [],
      khoangThoiGianTimKiem: [],
    };

    this.renderFood = this.renderFood.bind(this);
  }

  // sau khi màn hình hiển thị lên thì lấy dữ liệu thực đơn từ trên server về
  async componentDidMount() {
    await this.layDuLieu(moment().format(DATE_FORMAT));
  }

  // Nếu có dữ liệu thì cấp nhật lại giao diện
  async shouldComponentUpdate(nextProps, nextState) {
    if (this.props.isLoading !== nextProps.isLoading) {
      this.layMauCacNgayDaAn();
      return true;
    }
    return false;
  }

  // Khi chọn ngày từ nút bấm
  async onPress(item) {
    // Gán ngày đã chọn trong tuần
    await this.props.chonNgayThucDon(
      moment(item, DATE_FORMAT).format(DATE_FORMAT_COMPARE),
    );
    await this.setStateAsync({
      btnSelected: moment(item, DATE_FORMAT).format('DD'),
      ngayChon: item,
    });
    // Lấy dữ liệu
    await this.layDuLieu(item);
  }

  // Lấy dữ liệu từ trên server về
  async layDuLieu(ngayChon) {
    this.props.taiLaiTrang(true);
    await this.props
      .layThucDonAsync(LAY_THUC_DON, {
        email: this.props.email,
        ngayAn: moment(ngayChon, DATE_FORMAT).format(DATE_FORMAT_COMPARE),
      })
      .then(async () => {
        await this.tinhCaloCacDaChon().then(() => {
          this.props.taiLaiTrang(false);
        });
      });
  }

  // Tính toán lượng calo mà người dùng đã chọn
  async tinhCaloCacDaChon() {
    let totalCalo = 0;
    // if (this.props.thucDon !== null)
    {
      this.props.thucDon.DanhSachMon.forEach(element => {
        element.Mon.map(w => {
          totalCalo += w.SoLuong * w.Calo;
        });
      });
      await this.setStateAsync({
        totalCalo: totalCalo,
        progress:
          this.props.thucDon.TongNangLuong !== null
            ? totalCalo / this.props.thucDon.TongNangLuong > 1
              ? 1
              : totalCalo / this.props.thucDon.TongNangLuong
            : 0,
      });
    }
  }

  getProgress() {
    let totalCalo = 1;
    if (
      this.props.thucDon !== null &&
      this.props.thucDon.DanhSachMon.length > 0
    ) {
      for (
        let index = 0;
        index < this.props.thucDon.DanhSachMon.length;
        index++
      ) {
        const element = this.props.thucDon.DanhSachMon[index];
        for (let index = 0; index < element.Mon.length; index++) {
          const item = element.Mon[index];
          totalCalo += item.SoLuong * item.Calo;
        }
      }
      let tongNangLuong = this.props.thucDon.TongNangLuong;
      return tongNangLuong !== null
        ? totalCalo / tongNangLuong > 1
          ? 1
          : totalCalo / tongNangLuong
        : 0;
    }
    return 0;
  }

  tinhCaloDaAn() {
    let totalCalo = 0;
    this.props.thucDon.DanhSachMon.forEach(element => {
      element.Mon.map(w => {
        totalCalo += w.SoLuong * w.Calo;
      });
    });
    return totalCalo;
  }

  // Chọn ngày ở lịch
  async chonNgay(date) {
    await this.props.chonNgayThucDon(
      moment(date, DATE_FORMAT).format(DATE_FORMAT_COMPARE),
    );
    await this.setStateAsync({
      ngayChon: moment(date, DATE_FORMAT).format(DATE_FORMAT), // lưu lại ngày đã chọn
      btnSelected: moment(date, DATE_FORMAT).format('DD'), // lưu lại ngày chọn để sáng nút
      dayOfWeek: this.taoLich(date), // tạo mảng các nút ngày trong tuần
    });
    await this.layDuLieu(date);
  }

  // Tạo ra các button ngày trong tuần
  taoLich(date) {
    // Lấy ngày đầu tuần của ngày đã chọn
    let start = moment(date, DATE_FORMAT).startOf('isoWeek');
    // Lấy ngày cuối tuần của ngày đã chọn
    let end = moment(date, DATE_FORMAT).endOf('isoWeek');
    // Tạo mảng các ngày trong tuần đã chọn
    let dayOfWeek = [];
    let khoangThoiGian = [];
    for (let index = start; index <= end; index.add(1, 'day')) {
      dayOfWeek.push(index.format(DATE_FORMAT));
      khoangThoiGian.push(index.format(DATE_FORMAT_COMPARE));
    }

    fetch(URLThucDon, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        loai: 3,
        email: this.props.email,
        khoangThoiGian: khoangThoiGian,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        // Láy dữ liệu thành công
        this.setStateAsync({
          thongTinCacNgayDaAn: responseJson,
          khoangThoiGianTimKiem: khoangThoiGian,
        });
      })
      .catch(error => {
        console.error(error);
      });
    return dayOfWeek;
  }

  tinhSoTuan() {
    let ngayTao = moment(this.props.thucDon.NgayTao, 'YYYYMMDD').isoWeek();
    let ngayChon = moment(this.props.ngayChon, 'YYYYMMDD').isoWeek();
    return (ngayChon - ngayTao < 0 ? 0 : ngayChon - ngayTao) + 1;
  }

  tinhThucAnConLai() {
    return this.props.thucDon.TongNangLuong - this.tinhCaloDaAn();
  }

  // Tô viền các ngày đã nhập dữ liệu
  layMauCacNgayDaAn() {
    fetch(URLThucDon, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        loai: 3,
        email: this.props.email,
        khoangThoiGian: this.state.khoangThoiGianTimKiem,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        // Láy dữ liệu thành công
        this.setStateAsync({
          thongTinCacNgayDaAn: responseJson,
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    const items = this.state.dayOfWeek.map(item => {
      return (
        <TouchableOpacity
          key={item}
          style={[
            {
              alignItems: 'center',
              width: 30,
              height: 30,
              borderRadius: 100,
              borderWidth: 2,
              borderColor:
                this.state.thongTinCacNgayDaAn.length > 0
                  ? this.state.thongTinCacNgayDaAn.find(
                      w =>
                        w.NgayAn ===
                        moment(item, DATE_FORMAT).format(DATE_FORMAT_COMPARE),
                    ).Calo === 0
                    ? 'black'
                    : '#3385ff'
                  : 'black',
            },
            {
              backgroundColor:
                moment(item, DATE_FORMAT).format('DD') !== moment().format('DD')
                  ? 'transparent'
                  : '#80ffcc',
            },
            this.state.btnSelected === moment(item, DATE_FORMAT).format('DD')
              ? styles.btnSelected
              : styles.btnNotSelected,
          ]}
          onPress={() => this.onPress(item)}>
          <Text
            style={[
              {marginTop: 3},
              {
                backgroundColor:
                  moment(item, DATE_FORMAT).format('DD') !==
                  moment().format('DD')
                    ? 'transparent'
                    : '#80ffcc',
              },
              this.state.btnSelected === moment(item, DATE_FORMAT).format('DD')
                ? styles.btnSelected
                : styles.btnNotSelected,
            ]}>
            {moment(item, DATE_FORMAT).format('DD')}
          </Text>
        </TouchableOpacity>
      );
    });

    return (
      <View style={styles.container}>
        <View style={styles.calendar}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View>
              {this.props.isLoading ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignContent: 'center',
                  }}>
                  <Loader />
                </View>
              ) : null}
            </View>
            <View style={{flex: 7}}>
              <Progress.Bar
                progress={this.getProgress()}
                animated={false}
                width={300}
                height={25}
              />
            </View>
            <View style={{flex: 1}}>
              <DatePicker
                // minDate={this.props.thucDon.NgayTao}
                mode="date"
                format={DATE_FORMAT}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                style={{width: 25, height: 25}}
                customStyles={{
                  dateIcon: {
                    width: 25,
                    height: 30,
                    marginTop: -15,
                    marginLeft: 15,
                  },
                  dateInput: {
                    marginTop: -20,
                    height: 0,
                    width: 0,
                  },
                }}
                onDateChange={date => {
                  this.chonNgay(date);
                }}
              />
            </View>
          </View>
          <View style={{flex: 1, alignItems: 'center', marginTop: 5}}>
            <Text>
              Tuần {this.tinhSoTuan()} -{' '}
              {moment(this.props.ngayChon, DATE_FORMAT).format('DD/MM/YYYY')}{' '}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginBottom: 10,
            }}>
            {items}
          </View>
        </View>
        <View style={styles.calo}>
          <View style={[{flex: 2, flexDirection: 'row'}]}>
            <View style={styles.mucTieu}>
              <Text style={styles.caloTopText}>
                {this.props.thucDon === null ||
                this.props.thucDon.TongNangLuong === null
                  ? 0
                  : this.props.thucDon.TongNangLuong}
              </Text>
              <Text>Mục tiêu</Text>
            </View>
            <View style={styles.nganCach}>
              <Text style={{fontSize: 24}}> - </Text>
            </View>
            <View style={styles.thucAn}>
              <Text style={styles.caloTopText}>{this.tinhCaloDaAn()}</Text>
              <Text>Thức ăn</Text>
            </View>
            <View style={styles.nganCach}>
              <Text style={{fontSize: 24}}> = </Text>
            </View>
            <View style={styles.conLai}>
              <Text
                style={
                  this.tinhThucAnConLai() > 0
                    ? styles.caloTopText
                    : styles.caloTopVuotQua
                }>
                {this.props.thucDon === null
                  ? 0
                  : this.tinhThucAnConLai() > 0
                  ? this.tinhThucAnConLai()
                  : this.tinhThucAnConLai() * -1}
              </Text>
              <Text>
                {' '}
                {this.tinhThucAnConLai() > 0 ? 'Còn lại' : 'Vượt quá'}
              </Text>
            </View>
          </View>
          <View style={{flex: 1}}>
            <View style={styles.caloBottom}>
              <TouchableOpacity
                onPress={() => {
                  this.props.myNavigation.navigate('BaoCaoActivity', {
                    ngayChon: moment(this.props.ngayChon, DATE_FORMAT).format(
                      DATE_FORMAT,
                    ),
                    email: this.props.email,
                  });
                }}
                style={styles.loginButton}>
                <Text style={styles.lableTitle}>CHI TIẾT </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.menuFood}>{this.renderFood()}</View>
      </View>
    );
  }

  renderFood() {
    return (
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        data={this.menuList.map(item => item)}
        refreshing={this.state.isLoading}
        renderItem={({item, index}) => {
          return (
            <DanhSachBuaAnComponent
              key={item.id}
              buaAnId={item.id}
              listFood={this.props.thucDon.DanhSachMon.find(
                w => w.LoaiBua === item.id,
              )}
              parentFlatList={this}
            />
          );
        }}
      />
    );
  }
}
function mapStateToProps(state) {
  return {
    myNavigation: state.myNavigation,
    thucDon: state.thucDon.thucDon,
    ngayChon: state.thucDon.ngayChon,
    email: state.taiKhoan.email,
    isLoading: state.thucDon.isLoading,
  };
}

export default connect(mapStateToProps, actions)(QuanLyThucDonActivity);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  calendar: {flex: 2, borderBottomWidth: 2, marginBottom: 10},
  calo: {
    flex: 3,
    flexDirection: 'column',
    borderWidth: 2,
    borderColor: 'black',
    marginBottom: 3,
  },
  caloTop: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignContent: 'center',
  },
  caloTopVuotQua: {
    marginTop: 10,
    fontSize: 25,
    color: 'red',
  },
  caloTopText: {
    marginTop: 10,
    fontSize: 25,
  },
  caloMid: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignContent: 'center',
  },
  caloBottom: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: -5,
  },
  menuFood: {flex: 10},
  lableTitle: {
    color: COLOR_DEEPSKY_BLUE,
    fontSize: 30,
  },
  borderAll: {
    borderWidth: 2,
    borderColor: 'black',
  },
  btnSelected: {
    backgroundColor: 'blue',
    color: 'white',
  },
  btnNotSelected: {},
  mucTieu: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thucAn: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  conLai: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nganCach: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ngayDaThemDuLieu: {
    backgroundColor: 'pink',
  },
  ngayHomNay: {
    backgroundColor: 'yellow',
  },
});
