import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Alert,
  AsyncStorage
} from 'react-native'
import {
  COLOR_PINK,
  COLOR_PINK_LIGHT,
  COLOR_PINK_MEDIUM,
} from '../../asset/MyColor';
import {
  DANG_NHAP,
} from "../../asset/MyConst";
import { connect } from 'react-redux';
import * as actions from '../../redux/actions';
class DangNhapActivity extends Component {
  static navigationOptions = {
    header: null
  }
  constructor(props) {
    super(props)
    //this.checkLogin();
    this.state = {
      email: 'ngocanh@gmail.com ',
      password: '1',
      errorMessage: null
    }
  }

  async  componentWillMount() {
    await this.props.khoiDongApp(this.props.navigation);
  }

  async checkLogin() {
    let email = await AsyncStorage.getItem('email');
    let password = await AsyncStorage.getItem('password');
    let laQuanTri = await AsyncStorage.getItem('laQuanTri');
    let soThanhVien = await AsyncStorage.getItem('soThanhVien');
    this.props.dangNhap(email, password, true, laQuanTri === "0" ? false : true)
    if (email === '' || password === '' || email === null || password === null) {

    }
    else {
      if (laQuanTri === '0') {
        if (Number(soThanhVien) > 0) {
          this.props.myNavigation.navigate('ManHinhChinhActivity')
        } else {
          this.props.myNavigation.navigate('NhapSoThanhVienActivity')
        }
      }
      else {
        this.props.myNavigation.navigate('AdminActivity')
      }
    }
  }

  async componentDidMount() {
    this.props.khoiDongApp(this.props.navigation);
  }

  // hàm đăng nhập
  async handleLogin() {
    const { email, password } = this.state
    if (email.trim() !== '' && password.trim() !== '') {
      this.props.dangNhapAsync(DANG_NHAP, { email, password }).then(async success => {
        if (this.props.trangThaiDangNhap) {
          await AsyncStorage.setItem('email', email);
          await AsyncStorage.setItem('password', password);
          await AsyncStorage.setItem('soThanhVien', this.props.soThanhVien.toString());
          await AsyncStorage.setItem('laQuanTri', this.props.laQuanTri ? '1' : '0');
          if (!this.props.laQuanTri) {
            if (this.props.soThanhVien > 0) {
              this.props.myNavigation.navigate('ManHinhChinhActivity')
            } else {
              this.props.myNavigation.navigate('NhapSoThanhVienActivity')
            }
          }
          else {
            this.props.myNavigation.navigate('AdminActivity')
          }
        } else {
          Alert.alert('Thông báo', 'Đăng nhập thất bại')
        }
      })
    } else {
      Alert.alert('Chú ý!', 'Email hoặc mật khẩu không được để trống', {
        cancelable: true
      })
    }
  }

  render() {
    return (
      // Donot dismis Keyboard when click outside of TextInput
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.up}>
            <Image style={styles.avatarLogin} source={require('./Login.png')} />
            <Text
              style={{
                fontSize: 20,
                textAlign: 'center',
                color: 'blue'
              }}
            >
              We are created because of your health
            </Text>
          </View>
          <View style={styles.down}>
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                textContentType='emailAddress'
                keyboardType='email-address'
                placeholder='Enter your email'
                onChangeText={email => this.setState({ email })}
                value={this.state.email}
              />
            </View>
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder='Enter your password'
                secureTextEntry
                onChangeText={password => this.setState({ password })}
                value={this.state.password}
              />
            </View>
            <TouchableOpacity
              onPress={() => this.handleLogin()}
              style={styles.loginButton}
            >
              <Text style={styles.loginButtonTitle}>Đăng nhập</Text>
            </TouchableOpacity>
            <Text style={{ marginTop: 15 }}>
              {' '}
              Chưa có tài khoản?{' '}
              <Text
                onPress={() => this.props.navigation.navigate('DangKyActivity')}
                style={{ color: '#e93766', fontSize: 18, marginTop: 10 }}
              >
                {' '}
                Đăng ký{' '}
              </Text>
            </Text>
            <Text style={{ color: 'blue', fontSize: 18 }}>Quên mật khẩu?</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

function mapStateToProps(state) {
  return {
    myNavigation: state.myNavigation,
    email: state.taiKhoan.email,
    trangThaiDangNhap: state.taiKhoan.trangThaiDangNhap,
    laQuanTri: state.taiKhoan.laQuanTri,
    password: state.taiKhoan.password,
    soThanhVien: state.thanhVien.soThanhVien
  }
}

export default connect(
  mapStateToProps,
  actions
)(DangNhapActivity)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: COLOR_PINK_LIGHT
  },
  up: {
    flex: 3,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 30,
    // marginTop: 60,
    borderRadius: 20,
    backgroundColor: 'white',
    padding: 40
  },
  down: {
    flex: 7, // 70% of column
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  title: {
    color: COLOR_PINK_MEDIUM,
    textAlign: 'center',
    width: 400,
    fontSize: 23
  },
  textInputContainer: {
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.2)' // a = alpha = opacity
  },
  textInput: {
    width: 280,
    height: 45
  },
  loginButton: {
    width: 300,
    height: 45,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR_PINK
  },
  loginButtonTitle: {
    fontSize: 18,
    color: 'white'
  },
  facebookButton: {
    width: 300,
    height: 45,
    borderRadius: 6,
    justifyContent: 'center'
  },
  line: {
    height: 1,
    flex: 2,
    backgroundColor: 'black'
  },
  textOR: {
    flex: 1,
    textAlign: 'center'
  },
  divider: {
    flexDirection: 'row',
    height: 40,
    width: 298,
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarLogin: {
    width: '100%',
    height: '100%',
    alignContent: 'center',
    justifyContent: 'center',
    resizeMode: 'contain'
  }
})
