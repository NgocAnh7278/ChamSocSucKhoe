import React from 'react'
import { createAppContainer } from 'react-navigation'
import { View, StyleSheet, } from 'react-native'
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs'
import Icon from 'react-native-vector-icons/Ionicons'
import QuanLyCaLoActivity from '../quan-ly-calo/QuanLyCaLoActivity'
import QuanLyThongTinCaNhanActivity from '../quan-ly-thong-tin-ca-nhan/QuanLyThongTinCaNhanActivity'
import QuanLyThucDonActivity from '../quan-ly-thuc-don/QuanLyThucDonActivity'

// Tab calo
class CaloScreen extends React.Component {
  render() {
    return <QuanLyCaLoActivity />
  }
}

// Tab thông tin người dùng
class ProfileScreen extends React.Component {
  render() {
    return (
      <QuanLyThongTinCaNhanActivity />
    )
  }
}

// Tab thực đơn
class DiaryScreen extends React.Component {
  render() {
    return <QuanLyThucDonActivity />
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  chart: {
    flex: 1
  }
})

const TabNavigator = createMaterialBottomTabNavigator(
  {
    CaloScreen: {
      screen: CaloScreen,
      navigationOptions: {
        tabBarLabel: 'Calo',
        tabBarIcon: ({ tintColor }) => (
          <View>
            <Icon
              style={[{ color: tintColor }]}
              size={25}
              name={'ios-calculator'}
            />
          </View>
        )
      }
    },
    DiaryScreen: {
      screen: DiaryScreen,
      navigationOptions: {
        tabBarLabel: 'Diary',
        tabBarIcon: ({ tintColor }) => (
          <View>
            <Icon style={[{ color: tintColor }]} size={25} name={'ios-add'} />
          </View>
        )
      }
    },
    Profile: {
      screen: ProfileScreen,
      navigationOptions: {
        tabBarLabel: 'Profile',
        tabBarIcon: ({ tintColor }) => (
          <View>
            <Icon
              style={[{ color: tintColor }]}
              size={25}
              name={'ios-person'}
            />
          </View>
        )
      }
    }
  },
  {
    initialRouteName: initialRouteName,
    activeColor: '#f0edf6',
    inactiveColor: '#3e2465',
    barStyle: { backgroundColor: '#3BAD87' }
  }
)
const initialRouteName = 'DiaryScreen'
const AppContainer = createAppContainer(TabNavigator)

export default class ManHinhChinhActivity extends React.Component {
  constructor(props) {
    super(props)
  }
  static navigationOptions = {
    header: null
  }
  render() {
    return <AppContainer />
  }
}
