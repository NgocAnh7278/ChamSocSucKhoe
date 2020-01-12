import React, { Component } from 'react';
import { Image, StyleSheet, View, Text, Alert } from 'react-native';
import Swipeout from 'react-native-swipeout';

export default class ThongTinMonAnComponent extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const swipeSettings = {
      autoClose: true,
      onClose: (secId, rowId, direction) => {
      },
      onOpen: (sectId, rowId, direction) => {
      },
      right: [
        {
          onPress: () => {
            // const deletingRow = this.state.activeRowKey;
            Alert.alert(
              'Chú ý',
              'Món ăn ' + this.props.food.TenMonAn + " sẽ bị xóa?",
              [
                {
                  text: 'Hủy',
                  onPress: () => console.log('Cancel pressed'),
                  style: 'cancel',
                },
                {
                  text: 'Có',
                  onPress: () => {
                    this.props.parentFlatList.refreshFlatList(
                      this.props.food.ThucDonId,
                    );
                  },
                },
              ],
              { cancelable: true },
            );
          },
          text: 'Xóa',
          type: 'delete',
        },
      ],
      rowId: this.props.index,
      sectionId: 1,
    };
    return (
      <Swipeout style={styles.demo} {...swipeSettings}>
        <View style={styles.container}>
          <View style={styles.left}>
            <Image
              style={styles.avatarLogin}
              source={{
                uri: this.props.food.AnhMonAn,
              }}
            />
          </View>
          <View style={styles.right}>
            <View style={styles.rightTop}>
              <Text style={{ fontSize: 18 }}>{this.props.food.TenMonAn}</Text>
              <Text style={{ fontSize: 20, color: 'red' }}>
                {' '}
                {this.props.food.SoLuong * this.props.food.Calo}
              </Text>
            </View>
            <View style={styles.rightBottom}>
              <Text>
                {this.props.food.SoLuong}{' '}
                {this.props.food.DonViTinh.substring(
                  this.props.food.DonViTinh.indexOf(' ') + 1,
                )}
              </Text>
            </View>
          </View>
        </View>
      </Swipeout>
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
  demo: {
    backgroundColor: 'transparent',
  },
});
