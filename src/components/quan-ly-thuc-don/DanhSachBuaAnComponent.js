import React, { Component } from 'react';
import { StyleSheet, Text, View, Alert, FlatList } from 'react-native';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import { Button } from 'react-native-elements';
import ThongTinMonAnComponent from './ThongTinMonAnComponent';
import { XOA_THUC_DON, URLThucDon } from '../../asset/MyConst';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions';
class DanhSachBuaAnComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: this.props.email,
      ngayAn: this.props.ngayAn,
      listFood: this.props.listFood,
      buaAnId: this.props.buaAnId,
      totalCalo: 0,
    };
  }

  async componentWillReceiveProps(nextProps) {
    if (nextProps !== undefined) {
      await this.setStateAsync({
        email: nextProps.email,
        listFood: nextProps.listFood,
        buaAnId: nextProps.buaAnId,
        ngayAn: nextProps.ngayAn,
      });
      await this.tinhCaloCacDaChon();
    }
  }

  async componentDidMount() {
    await this.tinhCaloCacDaChon();
  }

  percentCalo = 0;
  suggestions = '';
  isLoad = true;
  getSuggestion() {
    switch (this.props.buaAnId) {
      case '1': {
        this.suggestions =
          'Gợi ý : 30% lượng thức ăn (khoảng ' +
          Math.round(this.props.caloTarget * 0.3, 0) +
          ' kcal)';
        break;
      }
      case '2': {
        this.suggestions =
          'Gợi ý : 40% lượng thức ăn (khoảng ' +
          Math.round(this.props.caloTarget * 0.4, 0) +
          ' kcal)';
        break;
      }
      case '3': {
        this.suggestions =
          'Gợi ý : 25% lượng thức ăn (khoảng ' +
          Math.round(this.props.caloTarget * 0.25, 0) +
          ' kcal)';
        break;
      }
      case '4': {
        this.suggestions =
          'Gợi ý : 5% lượng thức ăn (khoảng ' +
          Math.round(this.props.caloTarget * 0.05, 0) +
          ' kcal)';
        break;
      }
    }
    return this.suggestions;
  }
  getMealName() {
    let mealName = '';
    switch (this.props.buaAnId) {
      case '1': {
        mealName = 'Bữa sáng';
        break;
      }
      case '2': {
        mealName = 'Bữa trưa';
        break;
      }
      case '3': {
        mealName = 'Bữa tối';
        break;
      }
      case '4': {
        mealName = 'Bữa ăn vặt';
        break;
      }
    }
    return mealName;
  }

  // Tính toán lượng calo mà người dùng đã chọn
  async tinhCaloCacDaChon() {
    let totalCalo = 0;
    this.state.listFood.Mon.forEach((element) => {
      totalCalo += element.SoLuong * element.Calo;
    });
    await this.setStateAsync({ totalCalo: totalCalo });
  }

  ThemMoiMonAn() {
    let result = '';
    switch (this.state.buaAnId) {
      case '1': {
        result = 'Breakfast';
        break;
      }
      case '2': {
        result = 'Lunch';
        break;
      }
      case '3': {
        result = 'Dinner';
        break;
      }
      case '4': {
        result = 'Nosh';
        break;
      }
      default:
        break;
    }
    this.props.chonBuaAnAsync({
      loaiBua: this.state.buaAnId,
      tenBua: result
    })

    this.props.myNavigation.navigate('DanhSachDanhMucMonAnActivity', {
      email: this.state.email,
      buaAnId: this.state.buaAnId,
      ngayAn: this.state.ngayAn,
      title: result,
    });
  }

  renderFood() {
    return (
      <View style={styles.MainContainer}>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={this.state.listFood.Mon.map(obj => obj)}
          renderItem={({ item, index }) => {
            return (
              <ThongTinMonAnComponent
                key={item.Id}
                food={item}
                parentFlatList={this}
              />
            );
          }}
        />
      </View>
    );
  }

  refreshFlatList = deletedKey => {
    fetch( URLThucDon, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        loai: XOA_THUC_DON,
        thucDonId: deletedKey,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        // Láy dữ liệu thành công
        if (responseJson !== 0) {
          this.props.parentFlatList.layDuLieu(this.props.ngayAn);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.top}>
          <View style={styles.rightTop}>
            <Text style={{ fontSize: 16 }}>{this.getMealName()}</Text>
            <Text style={{ fontSize: 20, color: 'red' }}>
              {this.state.totalCalo}
            </Text>
          </View>
          <View style={styles.rightBottom}>
            <Text style={{ fontSize: 13, margin: -1 }}>
              {this.getSuggestion()}
            </Text>
          </View>
        </View>
        <View style={styles.mid}>{this.renderFood()}</View>
        <View style={styles.bottom}>
          <Button
            buttonStyle={{
              height: 35,
              justifyContent: 'flex-start',
              width: 100,
              marginTop: 2,
            }}
            icon={
              <IconFontAwesome
                name="plus"
                size={16}
                color="white"
                style={{ textAlign: 'center' }}
              />
            }
            title="Thêm"
            titleStyle={{
              justifyContent: 'center',
              marginLeft: 5,
            }}
            onPress={() => {
              this.ThemMoiMonAn();
            }}
          />
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
    myNavigation: state.myNavigation,
    buaAn: state.thucDon.buaAn,
    caloTarget : state.thucDon.thucDon.TongNangLuong,
    ngayAn: state.thucDon.ngayChon,
  }
}

export default connect(
  mapStateToProps,
  actions
)(DanhSachBuaAnComponent)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 2,
    borderColor: 'black',
    paddingLeft: 10,
    paddingTop: 2,
    paddingBottom: 5,
    minHeight: 180,
    marginBottom: 2,
    // maxHeight: 250,
  },
  top: {
    flex: 4,
    paddingRight: 5,
  },
  mid: {
    flex: 6,
    marginTop: 5,
  },
  bottom: {
    flex: 3,
    justifyContent: 'flex-end',
  },
  avatarLogin: {
    width: 70,
    height: 70,
    borderRadius: 100,
  },
  rightTop: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rightBottom: {
    flex: 3,
  },
});
