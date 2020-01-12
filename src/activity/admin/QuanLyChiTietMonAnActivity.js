import React, {Component} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {COLOR_HEADER} from '../../asset/MyColor';
import {connect} from 'react-redux';
import * as actions from '../../redux/actions';
class QuanLyChiTietMonAnActivity extends Component {
  static navigationOptions = ({navigation}) => ({
    title: `${navigation.state.params.monAn.TenMonAn}`,
    headerStyle: {
      backgroundColor: COLOR_HEADER,
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
    };
  }

  // Lưu lại số người
  numericInputOnchange(value) {
    this.setState({soLuong: value < 0 ? 0 : value});
  }

  render() {
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
            <Text style={styles.tieuDe}>{this.state.monAn.Calo}</Text>
          </View>
          <View style={styles.xo}>
            <Text style={styles.tieuDe}>Xơ (gam) </Text>
            <Text style={styles.tieuDe}>{this.state.monAn.Xo}</Text>
          </View>
          <View style={styles.beo}>
            <Text style={styles.tieuDe}>Béo (gam) </Text>
            <Text style={styles.tieuDe}>{this.state.monAn.Beo}</Text>
          </View>
          <View style={styles.dam}>
            <Text style={styles.tieuDe}>Đạm (gam) </Text>
            <Text style={styles.tieuDe}>{this.state.monAn.Dam}</Text>
          </View>
        </View>
        <View style={styles.bottom}>
          <Text style={[styles.tieuDe,{fontSize:22}]}>Đơn vị tính : {this.state.monAn.DonViTinh} </Text>
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
    email: state.taiKhoan.email,
  };
}

export default connect(mapStateToProps, actions)(QuanLyChiTietMonAnActivity);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  top: {
    flex: 9,
    borderBottomWidth: 2,
  },
  mid: {
    flex: 2,
    flexDirection: 'row',
    borderBottomWidth: 2,
    padding: 5,
    paddingBottom:20
  },
  bottom: {
    flex: 5,
    marginTop:20,
    alignContent: 'center',
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
    fontSize: 18,
    marginTop: 5,
  },
});
