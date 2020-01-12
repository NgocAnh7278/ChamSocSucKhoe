import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, FlatList } from 'react-native';
export default class DanhSachMonAnComponent extends Component {
    constructor(props) {
        super(props);
      }
    
      render() {
        return (
          <>
            <View key={this.props.item.Id} style={styles.container}>
              <View style={styles.left}>
                <Image
                  style={styles.avatarLogin}
                  source={{
                    uri: this.props.item.AnhMonAn,
                  }}
                />
              </View>
              <View style={styles.right}>
                <View style={styles.rightTop}>
                  <Text style={{ fontSize: 18 }}>{this.props.item.TenMonAn}</Text>
                  <Text style={{ fontSize: 20, color: 'red' }}>
                    {' '}
                    {this.props.item.Calo}
                  </Text>
                </View>
                <View style={styles.rightBottom}>
                  <Text>{this.props.item.DonViTinh}</Text>
                </View>
              </View>
            </View>
            <View
              style={{
                height: 2,
                backgroundColor: 'black',
              }}
            />
          </>
        );
      }
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      padding: 5,
    },
    avatarLogin: {
      width: 80,
      height: 80,
      marginBottom: 3,
    },
    left: {
      flex: 1,
    },
    right: {
      flex: 3,
      paddingLeft: 5,
    },
    rightTop: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 15,
    },
    rightBottom: { flex: 1 },
    flatListItem: {
      color: 'black',
      padding: 10,
      fontSize: 16,
    },
  });
  