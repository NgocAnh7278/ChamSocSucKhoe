import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import NumericInput from 'react-native-numeric-input';
import { Button } from 'react-native-elements';
import {
  COLOR_FIREBRICK,
} from '../../asset/MyColor';
import {
  IP_SERVER,
  LAY_THUC_DON,
  COLOR_WHITE,
  THEM_MON_AN,
  URLThucDon,
} from '../../asset/MyConst';
import moment from 'moment';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions';
class ChiTietMonAnActivity extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.monAn.TenMonAn}`,
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  });

  constructor(props) {
    super(props);
    this.state = {
      soLuong: 1,
      monAn: this.props.navigation.getParam('monAn'),
      isActive: true
    };
  }

  async _onPress() {
    const { soLuong } = this.state;
    if (soLuong < 1) {
      Alert.alert(
        'Chú ý!',
        'Số lượng phải lớn hơn 0',
        [
          {
            text: 'Xác nhận',
            onPress: () => {
            }
          }
        ],
        { cancelable: false },
      );
    }
    else {
      this.setState({
        isActive: false
      });
      let monAn = JSON.stringify({
        loai: THEM_MON_AN,
        ChuTaiKhoanId: this.props.email,
        BuaAnId: this.props.buaAn.loaiBua,
        MonAnId: this.state.monAn.Id,
        NgayAn: this.props.ngayChon,
        SoLuong: this.state.soLuong,
      });
      await this.props.themMonAnAsync(monAn, this.props.email, this.props.ngayChon).then(() => {
        this.props.myNavigation.navigate('ManHinhChinhActivity');
      }).then(() => {
        this.setState({
          isActive: false
        });
      });
    }

  };

  render() {
    const { Calo, Xo, Dam, Beo } = this.state.monAn;
    const { soLuong } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.top}>
          <Image
            style={styles.avatarLogin}
            source={{
              uri: this.state.monAn.AnhMonAn,
            }}
          />
        </View>
        <View style={styles.mid}>
          <View style={styles.calo}>
            <Text style={styles.tieuDe}>Năng lượng (Kcal) </Text>
            <Text style={styles.tieuDe}>{Number(Calo) * soLuong}</Text>
          </View>
          <View style={styles.xo}>
            <Text style={styles.tieuDe}>Xơ (g) </Text>
            <Text style={styles.tieuDe}>{Number(Xo) * soLuong}</Text>
          </View>
          <View style={styles.beo}>
            <Text style={styles.tieuDe}>Béo (g) </Text>
            <Text style={styles.tieuDe}>{Number(Beo) * soLuong}</Text>
          </View>
          <View style={styles.dam}>
            <Text style={styles.tieuDe}>Đạm (g) </Text>
            <Text style={styles.tieuDe}>{Number(Dam) * soLuong}</Text>
          </View>
        </View>
        <View style={styles.bottom}>
          <View style={styles.soLuong}>
            <NumericInput
              style={styles.numberUpDown}
              type="up-down"
              value={this.state.soLuong}
              onChange={soLuong => this.setState({ soLuong })}
              totalWidth={100}
              totalHeight={40}
              initValue={this.state.soLuong}
            />
            <Text style={{ marginLeft: 20, marginTop: 10, fontSize: 16 }}>
              {this.state.monAn.DonViTinh.split(' ')[1].trim()}
            </Text>
          </View>
          <TouchableOpacity onPress={() => this._onPress()} disabled={!this.state.isActive} style={this.state.isActive ? styles.buttonluu : styles.button_disabled}>
            <Text style={{ fontSize: 20 }}>Lưu</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    myNavigation: state.myNavigation,
    buaAn: state.thucDon.buaAn,
    ngayChon: state.thucDon.ngayChon,
    email: state.taiKhoan.email
  }
}

export default connect(
  mapStateToProps,
  actions
)(ChiTietMonAnActivity)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  top: {
    flex: 4,
    borderBottomWidth: 2,
  },
  mid: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 2,
    padding: 5,
  },
  bottom: {
    flex: 5,
    borderBottomWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLogin: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
  calo: {
    flex: 2,
  },
  xo: {
    flex: 1,
  },
  beo: {
    flex: 1,
  },
  dam: {
    flex: 1,
  },
  tieuDe: {
    fontSize: 16,
    marginTop: 5,
  },
  soLuong: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  numberUpDown: {
    textAlign: 'center',
    fontSize: 14,
    margin: 150,
  },
  buttonluu: {
    width: 200,
    height: 45,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR_FIREBRICK,
    marginTop: 10,
  },
  luu: {
    color: COLOR_WHITE,
  },
  button_disabled: {
    backgroundColor: '#cccccc',
    color: '#666666',
    borderWidth: 1,
    borderColor: '#999999',
    width: 200,
    height: 45,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  }
});
