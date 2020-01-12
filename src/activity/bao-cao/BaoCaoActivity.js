// import React, {Component} from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { BaoCaoNgayActivity } from './BaoCaoNgayActivity';
import { BaoCaoTuanActivity } from './BaoCaoTuanActivity';
import { BaoCaoThangActivity } from './BaoCaoThangActivity';
import React from 'react';
import { SceneMap, TabView } from 'react-native-tab-view';

export default class BaoCaoActivity extends React.Component {
  static navigationOptions = {
    header: null,
  };
  _handleIndexChange = async index => await this.setState({ index });

  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        { key: 'first', title: 'Ngày' },
        { key: 'second', title: 'Tuần' },
        { key: 'third', title: 'Tháng' },
      ],
      ngayChon: this.props.navigation.getParam('ngayChon'),
      email: this.props.navigation.getParam('email'),
    };
  }
  static navigationOptions = {
    header: null,
  };
  render() {
    return (
      <TabView
        navigationState={this.state}
        renderScene={SceneMap({
          first: () => (
            <BaoCaoNgayActivity
              ngayChon={this.state.ngayChon}
              email={this.state.email}
            />
          ),
          second: () => (
            <BaoCaoTuanActivity
              ngayChon={this.state.ngayChon}
              email={this.state.email}
            />
          ),
          third: () => (
            <BaoCaoThangActivity
              ngayChon={this.state.ngayChon}
              email={this.state.email}
            />
          ),
        })}
        onIndexChange={index => this.setState({ index })}
        initialLayout={{ width: Dimensions.get('window').width }}
      />
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
