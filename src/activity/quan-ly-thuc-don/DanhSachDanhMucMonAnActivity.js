import React, { Component } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import { IP_SERVER, LAY_DANH_MUC_MON_AN } from '../../asset/MyConst';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions';
import DanhSachDanhMucMonAnComponent from '../../components/quan-ly-thuc-don/DanhSachDanhMucMonAnComponent';
import Loader from '../../components/Loader';
class DanhSachDanhMucMonAnActivity extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.title}`,
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  });

  componentWillMount() {
    this.props.loadingDanhMucMonAn(false);
  }

  componentDidMount() {
    this.layDanhMucMonAn();
  }

  async  layDanhMucMonAn() {
    await this.props.layDanhMucMonAnAsync(JSON.stringify({
      loai: LAY_DANH_MUC_MON_AN
    }))
  }

  constructor(props) {
    super(props);
  }

  async  chonDanhMuc(danhMuc) {
    await this.props.chonDanhMucMonAn(danhMuc.id);
    this.props.myNavigation.navigate('DanhSachMonAnActivity', {
      idDanhMuc: danhMuc.id,
      tenDanhMuc: danhMuc.tenDanhMucMonAn,
    });
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
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={this.props.danhMucMonAn}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity onPress={() => this.chonDanhMuc(item)}>
                <DanhSachDanhMucMonAnComponent key={item.Id} item={item} />
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    myNavigation: state.myNavigation,
    danhMucMonAn: state.monAn.danhMucMonAn,
    isLoading: state.monAn.isLoading,
  }
}

export default connect(
  mapStateToProps,
  actions
)(DanhSachDanhMucMonAnActivity)
