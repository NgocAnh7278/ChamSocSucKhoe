import React, { Component } from 'react'
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TextInput
} from "react-native";
import { List, ListItem, SearchBar } from "react-native-elements";
import { connect } from 'react-redux'
import * as actions from '../redux/actions'
import { getUsers } from "../api/index";

class DemoActivity extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
      error: null,
    };
  }
  arrayholder = []
  makeRemoteRequest = () => {
    const url = `https://randomuser.me/api/?&results=20`;
    this.setState({ loading: true });

    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
          data: res.results,
          error: res.error || null,
          loading: false,
        });

        this.arrayholder = res.results;
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });
  };

  searchFilterFunction = text => {

    const newData = this.arrayholder.filter(item => {
      const itemData = `${item.name.title.toUpperCase()}   
      ${item.name.first.toUpperCase()} ${item.name.last.toUpperCase()}`;
      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });
    // this.setState({ data: newData });
  };

  componentDidMount() {
    this.makeRemoteRequest();
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: "14%"
        }}
      />
    );
  };

  renderHeader = () => {
    return (
      <TextInput
        autoCapitalize="none"
        onChangeText={text => this.searchFilterFunction(text)}
        value={this.state.name}
      />
    );
  };

  render() {
    return (
      <FlatList
        data={this.state.data}
        renderItem={({ item }) => (
          <ListItem
            roundAvatar
            title={`${item.name.first} ${item.name.last}`}
            subtitle={item.email}
            avatar={{ uri: item.picture.thumbnail }}
            containerStyle={{ borderBottomWidth: 0 }}
          />
        )}
        keyExtractor={item => item.email}
        ItemSeparatorComponent={this.renderSeparator}
        ListHeaderComponent={this.renderHeader}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    counter: state.counter,
    email: state.taiKhoan.email,
    password: state.taiKhoan.password
  }
}

export default connect(
  mapStateToProps,
  actions
)(DemoActivity)
