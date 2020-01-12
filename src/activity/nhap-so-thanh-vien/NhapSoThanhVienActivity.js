import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import {
  COLOR_DEEPSKY_BLUE,
  COLOR_BLUE,
  COLOR_WHITE,
} from '../../asset/MyColor';

import { THEM_SO_THANH_VIEN } from "../../asset/MyConst";
import NumericInput from 'react-native-numeric-input';
import { connect } from 'react-redux'
import * as actions from '../../redux/actions'
class NhapSoThanhVienActivity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      soThanhVien: 0,
    };

  }
  static navigationOptions = {
    header: null,
  };

  // Lưu lại số người
  async numericInputOnchange(value) {
    await this.setStateAsync({ soThanhVien: value < 0 ? 0 : value });
  }

  // Nhấn nút Next thì chuyển sang màn hình k
  onPress = () => {
    const { soThanhVien } = this.state;
    this.props.themSoThanhVienAsync( JSON.stringify({loai : THEM_SO_THANH_VIEN, email: this.props.email, soNguoi: soThanhVien })).then(() => {
      if (this.props.soThanhVien > 0) {
        this.props.myNavigation.navigate('ManHinhChinhActivity')
      }
      else {
        alert('Thêm thành viên thất bại!');
      }
    })
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.lableTitle}>My Family</Text>
        <Text style={styles.textContent}>
          Please input the number of members in your family
        </Text>
        <Text style={styles.textSelectNumber}>Number of members</Text>
        <NumericInput
          style={styles.numberUpDown}
          type="up-down"
          value={this.state.soThanhVien}
          onChange={value => this.numericInputOnchange(value)}
          totalWidth={100}
          totalHeight={40}
          initValue={this.state.soThanhVien}
        />
        <TouchableOpacity onPress={this.onPress} style={styles.loginButton}>
          <Text style={styles.loginButtonTitle}>NEXT</Text>
        </TouchableOpacity>
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
    myNavigation: state.myNavigation,
    email: state.taiKhoan.email,
    soThanhVien: state.thanhVien.soThanhVien
  }
}

export default connect(
  mapStateToProps,
  actions
)(NhapSoThanhVienActivity)


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lableTitle: {
    color: COLOR_DEEPSKY_BLUE,
    fontSize: 30,
    textAlign: 'center',
    marginTop: -200,
  },
  textContent: {
    color: COLOR_DEEPSKY_BLUE,
    textAlign: 'center',
    fontSize: 20,
    margin: 20,
  },
  textSelectNumber: {
    // color: COLOR_DEEPSKY_BLUE,
    textAlign: 'center',
    fontSize: 18,
    margin: 15,
  },
  numberUpDown: {
    textAlign: 'center',
    fontSize: 18,
    margin: 150,
  },
  buttonNext: {
    flex: 2,
    width: '100%',
    height: 50,
    backgroundColor: 'red',
  },
  loginButtonTitle: {
    fontSize: 18,
    color: COLOR_WHITE,
  },
  loginButton: {
    width: 300,
    height: 45,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR_BLUE,
    marginTop: 30,
  },
});
