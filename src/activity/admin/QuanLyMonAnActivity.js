import React, { Component } from 'react';
import {
  FlatList,
  TouchableHighlight,
  Text,
  View,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { LAY_MON_AN, XOA_MON_AN } from '../../asset/MyConst';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions';
import DanhSachMonAnComponent from '../../components/admin/DanhSachMonAnComponent';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import ThemMonAnModal from './ThemMonAnModal';
import Loader from '../../components/Loader';
import {
  COLOR_HEADER,
} from '../../asset/MyColor';
import { SearchBar } from "react-native-elements";

class QuanLyMonAnActivity extends Component {

  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
    this.state = {
      idDanhMuc: this.props.navigation.getParam('idDanhMuc'),
      tenDanhMuc: this.props.navigation.getParam('tenDanhMuc'),
      monAn: [],
      search: ''
    };
    this._onPressAdd = this._onPressAdd.bind(this);
  }

  componentWillMount() {
    this.props.loadingMonAn(false);
  }

  componentDidMount() {
    this.layMonAn();
  }

  async  layMonAn() {
    await this.props.layMonAnAsync(JSON.stringify({
      loai: LAY_MON_AN,
      idDanhMuc: this.state.idDanhMuc
    })).then(() => {
      this.setState({
        monAn: this.props.monAn
      })
    })
  }

  searchFilterFunction = text => {
    const { monAn } = this.props;
    if (monAn.length > 0) {
      const newData = monAn.filter(item => {
        const itemData = `${item.TenMonAn.toUpperCase()}`;
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      this.setState({
        monAn: newData,
        search: text
      })
    }
    this.setState({
      search: text
    })
  };

  async  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.isLoading !== nextProps.isLoading) {
      this.setState({
        monAn: this.props.monAn,
        search: ''
      })
    }
    return false;
  }

  _onPressAdd() {
    this.child.showAddMemberModal(1);
  }

  _onPressEdit(monAn) {
    this.child.showAddMemberModal(2, monAn);
  }

  _onPressDelete(id, tenMonAn) {
    Alert.alert(
      'Bạn có chắc chắn không? ',
      'Món ăn ' + tenMonAn + ' sẽ bị xóa!',
      [
        {
          text: 'Hủy',
          style: 'login',
        },
        {
          text: 'Xác nhận',
          onPress: () => {
            let monAn = JSON.stringify(
              {
                loai: XOA_MON_AN,
                idMonAn: id
              }
            );
            this.props.monAnAsync(monAn, this.props.danhMucDaChon);
          }
        }
      ],
      { cancelable: false },
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View >
          {
            this.props.isLoading ? <View style={{ flex: 1, justifyContent: "center", alignContent: "center" }}>
              <Loader />
            </View> : null
          }
        </View>
        <View style={{
          backgroundColor: COLOR_HEADER,
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
          height: 64
        }}>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 28, color: 'white' }}>Danh sách món ăn</Text>
            <Text style={{ fontSize: 22, color: 'white' }}>{this.state.tenDanhMuc} </Text>
          </View>
          <TouchableHighlight
            style={{ marginRight: 10 }}
            underlayColor='tomato'
            onPress={this._onPressAdd}
          >
            <IconAntDesign
              style={{ color: 'white' }}
              name="pluscircleo"
              size={35}
            />
          </TouchableHighlight>
        </View>
        <SearchBar
          placeholder="Nhập món ăn..."
          onChangeText={text => this.searchFilterFunction(text)}
          value={this.state.search}
          style={{backgroundColor : 'red'}}
        />
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={this.state.monAn}
          renderItem={({ item, index }) => {
            return (
              <DanhSachMonAnComponent parentFlatList={this} key={item.Id} item={item} />
            );
          }}
        />
        <ThemMonAnModal onRef={ref => (this.child = ref)} />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    myNavigation: state.myNavigation,
    monAn: state.monAn.monAn,
    isLoading: state.monAn.isLoadingMonAn,
    danhMucDaChon: state.monAn.danhMucDaChon,
  }
}

export default connect(
  mapStateToProps,
  actions
)(QuanLyMonAnActivity)
