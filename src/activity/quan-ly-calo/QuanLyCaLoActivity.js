import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ProfileActivity
} from 'react-native'
import { TabView, SceneMap, TabViewAnimated } from 'react-native-tab-view'
import CaloComponent from '../../components/quan-ly-calo/CaloComponent'
import { LAY_THONG_TIN_CALO_THANH_VIEN } from '../../asset/MyConst'
import { connect } from 'react-redux'
import * as actions from '../../redux/actions'
class QuanLyCaLoActivity extends React.Component {
  static navigationOptions = {
    header: null
  }
  routes = []
  constructor(props) {
    super(props);
  }

  renderScene = ({ route }) => {
    return <CaloComponent key={route.key} data={route} />
  }

  async componentDidMount() {
    await this.LayDuLieu()
  }

  async LayDuLieu() {
    this.props.layThongTinThanhVienAsync(LAY_THONG_TIN_CALO_THANH_VIEN, { email: this.props.email })
  }
  _handleIndexChange = index => {
    this.props.chonTabThanhVien(index);
  }

  render() {
    return (
      <TabView
        navigationState={this.props.quanLyCalo}
        renderScene={this.renderScene}
        onIndexChange={this._handleIndexChange}
        initialLayout={{ width: Dimensions.get('window').width }}
        style={styles.container}
      />
    )
  }
}
function mapStateToProps(state) {
  return {
    email: state.taiKhoan.email,
    soThanhVien: state.soThanhVien,
    myNavigation: state.myNavigation,
    quanLyCalo: state.quanLyCalo
  }
}

export default connect(
  mapStateToProps,
  actions
)(QuanLyCaLoActivity)

const styles = StyleSheet.create({})
