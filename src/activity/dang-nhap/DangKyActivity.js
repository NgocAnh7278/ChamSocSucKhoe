import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {DANG_KY, DATE_FORMAT_COMPARE} from '../../asset/MyConst';
import {COLOR_DEEPSKY_BLUE} from '../../asset/MyColor';
import {connect} from 'react-redux';
import * as actions from '../../redux/actions';
import moment from 'moment';

class DangKyActivity extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    name: '',
    email: '',
    password: '',
    confirmPass: '',
    errorMessage: null,
  };

  handleSignUp = () => {
    const {email, password, confirmPass, name} = this.state;
    if (email.trim() != '' && password.trim() != '') {
      if (!this.validate(email)) {
        Alert.alert('Email không hợp lệ');
      } else if (password !== confirmPass) {
        Alert.alert('Mật khẩu phải trùng nhau');
      } else {
        this.props
          .dangKyAsync(DANG_KY, {
            email,
            password,
            name,
            ngayTao: moment().format(DATE_FORMAT_COMPARE),
          })
          .then(success => {
            if (this.props.trangThaiDangKy) {
              Alert.alert('Đăng ký thành công!');
              this.props.navigation.navigate('DangNhapActivity');
            } else {
              alert('Đăng ký thất bại!');
            }
          });
      }
    }
  };

  validate = email => {
    const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

    return expression.test(String(email).toLowerCase());
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={{fontSize: 25, marginBottom: 30}}>Đăng ký</Text>
        {this.state.errorMessage && (
          <Text style={{color: 'red'}}>{this.state.errorMessage}</Text>
        )}
        <View style={styles.hoTen}>
          <Text>Họ tên</Text>
          <TextInput
            autoCapitalize="none"
            style={styles.textInput}
            onChangeText={name => this.setState({name})}
            value={this.state.name}
          />
        </View>
        <View style={styles.hoTen}>
          <Text>Email</Text>
          <TextInput
            autoCapitalize="none"
            style={styles.textInput}
            onChangeText={email => this.setState({email})}
            value={this.state.email}
          />
        </View>
        <View style={styles.hoTen}>
          <Text>Mật khẩu</Text>
          <TextInput
            secureTextEntry
            autoCapitalize="none"
            style={styles.textInput}
            onChangeText={password => this.setState({password})}
            value={this.state.password}
          />
        </View>
        <View style={styles.hoTen}>
          <Text>Xác nhận mật khẩu</Text>
          <TextInput
            secureTextEntry
            autoCapitalize="none"
            style={styles.textInput}
            onChangeText={confirmPass => this.setState({confirmPass})}
            value={this.state.confirmPass}
          />
        </View>

        <TouchableOpacity
          onPress={this.handleSignUp}
          style={styles.signInButton}>
          <Text style={{fontSize: 20}}>Đăng ký</Text>
        </TouchableOpacity>
        <Text>
          {' '}
          Đã có tài khoản?{' '}
          <Text
            onPress={() => this.props.navigation.navigate('DangNhapActivity')}
            style={{color: '#e93766', fontSize: 18}}>
            {' '}
            Đăng nhập{' '}
          </Text>
        </Text>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    myNavigation: state.myNavigation,
    trangThaiDangKy: state.taiKhoan.trangThaiDangKy,
  };
}

export default connect(mapStateToProps, actions)(DangKyActivity);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    height: 40,
    width: 300,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 8,
  },
  hoTen: {
    // flex: 1,
    marginBottom: 10,
  },
  signInButton: {
    fontSize: 30,
    width: 150,
    height: 45,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR_DEEPSKY_BLUE,
  },
});
