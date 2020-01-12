import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import Swipeout from 'react-native-swipeout';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions';

class DanhSachMonAnComponent extends Component {
  constructor(props) {
    super(props);
  }


  chonMonAn(monAn) {
    console.log(3,monAn);
    
    this.props.myNavigation.navigate('QuanLyChiTietMonAnActivity', {
      themMonAnThanhCong: this.themMonAnThanhCong,
      monAn: monAn,
    });
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
            this.props.parentFlatList._onPressEdit(this.props.item);
          },
          text: 'Sửa', type: 'primary'
        },
        {
          onPress: () => {
            this.props.parentFlatList._onPressDelete(this.props.item.Id, this.props.item.TenMonAn);
          },
          text: 'Xóa', type: 'delete'
        }
      ],
      rowId: this.props.index,
      sectionId: 1,
    };

    return (
      <>
        <Swipeout style={{ backgroundColor: 'tranparent' }}  {...swipeSettings}>
          <TouchableOpacity onPress={() => this.chonMonAn(this.props.item)}>
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
          </TouchableOpacity>
        </Swipeout>

      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    myNavigation: state.myNavigation,
    isLoading: state.monAn.isLoading,
    danhMucDaChon: state.monAn.danhMucDaChon,
  }
}

export default connect(
  mapStateToProps,
  actions
)(DanhSachMonAnComponent)



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
