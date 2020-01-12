import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LAY_MON_AN } from '../../asset/MyConst';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions';
import { SearchBar } from "react-native-elements";

import DanhSachMonAnComponent from '../../components/quan-ly-thuc-don/DanhSachMonAnComponent';

class DanhSachMonAnActivity extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.tenDanhMuc}`,
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
      idDanhMuc: this.props.navigation.getParam('idDanhMuc'),
      tenDanhMuc: this.props.navigation.getParam('tenDanhMuc'),
      monAn: [],
      search: ''
    };
  }

  componentWillMount() {
    this.props.loadingMonAn(false);
  }

  themMonAnThanhCong = data => {
    alert('come back status: ' + data);
  };

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
        <SearchBar
          placeholder="Nhập món ăn..."
          onChangeText={text => this.searchFilterFunction(text)}
          value={this.state.search}
        />
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={this.state.monAn}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity onPress={() => this.chonMonAn(item)}>
                <DanhSachMonAnComponent key={item.Id} item={item} />
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  }

  chonMonAn(monAn) {
    this.props.myNavigation.navigate('ChiTietMonAnActivity', {
      themMonAnThanhCong: this.themMonAnThanhCong,
      monAn: monAn,
      tenMonAn: monAn.TenMonAn,
      email: this.state.email,
      buaAnId: this.state.buaAnId,
      ngayAn: this.state.ngayAn,
    });
  }
}

function mapStateToProps(state) {
  return {
    myNavigation: state.myNavigation,
    monAn: state.monAn.monAn,
    isLoading: state.monAn.isLoading,
    danhMucDaChon: state.monAn.danhMucDaChon,
  }
}

export default connect(
  mapStateToProps,
  actions
)(DanhSachMonAnActivity)
