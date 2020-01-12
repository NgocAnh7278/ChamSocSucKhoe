import React, { Component } from 'react';
import moment from 'moment';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { COLOR_BLUE } from '../../asset/MyColor';
import DatePicker from 'react-native-datepicker';
import RadioForm from 'react-native-simple-radio-button';
import { Dropdown, DropDownData } from 'react-native-material-dropdown';
import {
  CAP_NHAT_THONG_TIN_CALO_THANH_VIEN,
  DATE_FORMAT,
  DATE_FORMAT_COMPARE
} from '../../asset/MyConst';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions';
class CaloComponent extends Component {

  static navigationOptions = {
    header: null,
  };

  radio_props = [
    { label: 'Nam', value: 0 },
    { label: 'Nữ', value: 1 },
  ];
  data = [
    {
      value: 1,
      label: 'Ít vận động',
    },
    {
      value: 2,
      label: 'Vận động nhẹ',
    },
    {
      value: 3,
      label: 'Vận động vừa',
    },
    {
      value: 4,
      label: 'Vận động nặng',
    },
    {
      value: 5,
      label: 'Vận động rất nặng',
    },
  ];
  constructor(props) {
    super(props);
    console.log(this.props.data.info.ngaySinh);
    
    this.state = {
      checked: true,
      id: this.props.data.info.id,
      chucDanh: this.props.data.info.chucDanh, // Chức danh
      gioiTinh: Number(this.props.data.info.gioiTinh), // Giới tính
      ngaySinh:
        this.props.data.info.ngaySinh === null
          ? moment()
          : moment(this.props.data.info.ngaySinh, DATE_FORMAT),
      chieuCao: this.props.data.info.chieuCao, // Chiều cao
      canNang: this.props.data.info.canNang, // Cân nặng
      mucDoHoatDong: Number(this.props.data.info.mucDoHoatDong), // Mức độ hoạt động thể chất
      soTuoi: '0', // Tính tuổi
      nangLuongCanThiet: '0', // Năng lượng cần thiết để duy trì
      nhuCauNangLuong: '0', // Tổng nhu cầu năng lượng
      chiSoBMI: '', // chỉ số BMI
      ketLuan: '', // Cân nặng
    };
  }

  chucDanh = '';

  async calulate(loai = 0) {
    let ketLuan = '';
    if (this.batLoi(loai)) {
      await this.calulateAge();
      await this.calulateEnergy();
      await this.calulateCalo();
      await this.calulateBMI();
      if (this.state.chiSoBMI < 18.5) {
        ketLuan = 'Bị thiếu cân';
      } else if (18.5 <= this.state.chiSoBMI < 25) {
        ketLuan = 'Cân đối';
      } else if (25 <= this.state.chiSoBMI < 30) {
        ketLuan = 'Bị thừa cân';
      } else if (this.state.chiSoBMI >= 30) {
        ketLuan = 'Bị béo phì';
      }
      await this.setStateAsync({
        ketLuan: ketLuan,
      });

      // cập nhật vào DB
      let sql_Query =
        "UPDATE `thongtinthanhvien` SET `ChucDanh`= '" +
        this.state.chucDanh +
        "',`GioiTinh`=" +
        this.state.gioiTinh +
        ',`NgaySinh`=' +
        moment(this.state.ngaySinh, DATE_FORMAT).format(DATE_FORMAT_COMPARE) +
        ',`ChieuCao`=' +
        this.state.chieuCao +
        ',`CanNang`=' +
        this.state.canNang +
        ',`MucDoHoatDong`=' +
        this.state.mucDoHoatDong +
        ',`TongNangLuong`=' +
        this.state.nhuCauNangLuong +
        ' WHERE Id = ' +
        this.state.id;
      this.props.capNhatThongTinCaloThanhVienAsync(
        CAP_NHAT_THONG_TIN_CALO_THANH_VIEN,
        { query: sql_Query, email: this.props.email });
    }
  }

  batLoi(loai) {
    if (loai !== 0) {
      if (Number(this.state.chieuCao) === 0) {
        alert('Bạn chưa nhập chiều cao');
        return false;
      }
      if (Number(this.state.canNang) === 0) {
        alert('Bạn chưa nhập cân nặng');
        return false;
      }
    }
    return true;
  }

  componentDidMount() {
    this.calulate();
  }

  // Tính tuổi
  async calulateAge() {
    let year = moment().year();
    let soTuoi = 0;
    if (this.state.ngaySinh === '') {
      soTuoi = '0';
    } else {
      soTuoi = year - moment(this.state.ngaySinh, DATE_FORMAT_COMPARE).year();
    }
    this.setState({
      soTuoi: soTuoi,
    });
  }

  // Tính năng lượng cần thiết để duy trì
  async calulateEnergy() {
    let nangLuongCanThiet = 0;
    // Nam
    if (this.state.gioiTinh === 0) {
      nangLuongCanThiet =
        88.362 +
        13.397 * this.state.canNang +
        4.799 * this.state.chieuCao -
        5.677 * this.state.soTuoi;
    } else {
      // Nữ
      nangLuongCanThiet =
        447.593 +
        9.247 * this.state.canNang +
        3.098 * this.state.chieuCao -
        4.33 * this.state.soTuoi;
    }
    await this.setStateAsync({
      nangLuongCanThiet: Math.round(nangLuongCanThiet),
    });
  }

  // Tính toán nhu cầu năng lượng
  async calulateCalo() {
    let nhuCauNangLuong = 0;
    switch (this.state.mucDoHoatDong) {
      case 1: {
        nhuCauNangLuong = Number(this.state.nangLuongCanThiet) * 1.2;
        break;
      }
      case 2: {
        nhuCauNangLuong = Number(this.state.nangLuongCanThiet) * 1.375;
        break;
      }
      case 3: {
        nhuCauNangLuong = Number(this.state.nangLuongCanThiet) * 1.55;
        break;
      }
      case 4: {
        nhuCauNangLuong = Number(this.state.nangLuongCanThiet) * 1.725;
        break;
      }
      case 5: {
        nhuCauNangLuong = Number(this.state.nangLuongCanThiet) * 1.9;
        break;
      }
    }
    await this.setStateAsync({ nhuCauNangLuong: Math.round(nhuCauNangLuong) });
  }

  // Tính chỉ số BMI
  async calulateBMI() {
    let chiSoBMI = 0;
    if (Number(this.state.chieuCao) > 0 && Number(this.state.canNang) > 0) {
      chiSoBMI =
        (this.state.canNang / (this.state.chieuCao * this.state.chieuCao)) *
        10000;
    }
    await this.setStateAsync({ chiSoBMI: Math.round(chiSoBMI) });
  }

  render() {
    let tilteInput;
    if (this.state.chucDanh === 'Tôi') {
      tilteInput = <Text style={{ marginLeft: 10 }}>Tôi</Text>;
    } else {
      tilteInput = (
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Nhập chức danh thành viên"
            onChangeText={text => this.setStateAsync({ chucDanh: text })}
            value={this.state.chucDanh}
          />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.top}>
          <ScrollView>
            <Text>Chức danh * </Text>
            {tilteInput}
            <Text>Giới tính *</Text>
            <RadioForm
              radio_props={this.radio_props}
              initial={this.state.gioiTinh}
              buttonSize={10}
              onPress={value => {
                this.setStateAsync({ gioiTinh: value });
              }}
            />
            <Text>Ngày sinh *</Text>
            <View style={styles.textInputContainer}>
              <DatePicker
                date={this.state.ngaySinh}
                style={styles.ngaySinh}
                mode="date"
                format="YYYY/MM/DD"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                onDateChange={date => {
                  this.setStateAsync({ ngaySinh: date });
                }}
              />
            </View>
            <Text>Chiều cao *</Text>
            <View style={styles.textInputContainer}>
              <TextInput
                keyboardType="numeric"
                style={styles.textInput}
                onChangeText={text =>
                  this.setStateAsync({
                    chieuCao: text.replace(/[^0-9]/g, ''),
                  })
                }
                value={this.state.chieuCao}
              />
            </View>
            <Text>Cân nặng *</Text>
            <View style={styles.textInputContainer}>
              <TextInput
                keyboardType="numeric"
                style={styles.textInput}
                onChangeText={text =>
                  this.setStateAsync({
                    canNang: text.replace(/[^0-9]/g, ''),
                  })
                }
                value={this.state.canNang}
              />
            </View>
            <Text>Mức độ hoạt động thể chất *</Text>
            <Dropdown
              label="Chọn mức độ"
              data={this.data}
              value={this.state.mucDoHoatDong}
              onChangeText={value => {
                this.setStateAsync({
                  mucDoHoatDong: value,
                });
              }}
            />
          </ScrollView>
        </View>
        <View style={styles.bottom}>
          <TouchableOpacity
            onPress={() => this.calulate(1)}
            style={styles.loginButton}>
            <Text style={styles.loginButtonTitle}>Caculate</Text>
          </TouchableOpacity>
          <View style={styles.result}>
            <ScrollView>
              <Text
                style={
                  ([styles.textResult], { fontWeight: 'bold', fontSize: 18 })
                }>
                Kết quả :{' '}
              </Text>
              <Text style={styles.textResult}>Tuổi : {this.state.soTuoi}</Text>
              <Text style={styles.textResult}>
                Năng lượng cần thiết để duy trì : {this.state.nangLuongCanThiet}{' '}
                Kcal
              </Text>
              <Text style={styles.textResult}>
                Tổng nhu cầu năng lượng : {this.state.nhuCauNangLuong} Kcal
              </Text>
              <Text style={styles.textResult}>
                Chỉ số BMI cơ thể : {this.state.chiSoBMI}
              </Text>
              <Text style={styles.textResult}> => {this.state.ketLuan}</Text>
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }

  setStateAsync(state) {
    return new Promise(resolve => {
      this.setState(state, resolve);
    });
  }
}

function mapStateToProps(state) {
  return {
    email: state.taiKhoan.email,
  }
}


export default connect(
  mapStateToProps,
  actions
)(CaloComponent)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 25,
    paddingRight: 25,
    justifyContent: 'space-around',
  },
  top: {
    flex: 5,
    marginTop: 15,
  },
  bottom: {
    flex: 3,
    marginTop: 20,
  },
  result: {
    flex: 2,
    height: 150,
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    backgroundColor: 'yellow',
  },
  textResult: {
    fontSize: 15,
  },
  textInputContainer: {
    width: '100%',
    // paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 5,
    borderWidth: 1, //a = alpha = opacity
    borderColor: COLOR_BLUE,
    // paddingRight: 0,
  },
  textInput: {
    height: 40,
  },
  loginButton: {
    height: 45,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR_BLUE,
  },
  loginButtonTitle: {
    fontSize: 18,
    color: 'white',
  },
  ngaySinh: {
    textAlign: 'left',
    width: '100%',
    justifyContent: 'flex-start',
    alignContent: 'flex-end',
  },
});
