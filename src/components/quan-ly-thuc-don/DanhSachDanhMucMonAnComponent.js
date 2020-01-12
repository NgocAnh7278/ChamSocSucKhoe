import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, FlatList } from 'react-native';
export default class DanhSachDanhMucComponent extends Component {
    constructor(props) {
        super(props);
        
    }
    render() {
        return (
            <View
                key={this.props.item.Id}
                style={{
                    flex: 1,
                    flexDirection: 'column',
                }}>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                    }}>
                    <Image
                        source={{ uri: this.props.item.anhDanhMuc }}
                        style={{ width: 100, height: 100, margin: 5 }}
                    />
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'column',
                            height: 100,
                            justifyContent: 'center',
                        }}>
                        <Text style={styles.flatListItem}>
                            {this.props.item.tenDanhMucMonAn}
                        </Text>
                    </View>
                </View>
                <View
                    style={{
                        height: 2,
                        backgroundColor: 'black',
                    }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    flatListItem: {
      color: 'black',
      padding: 10,
      fontSize: 16,
    },
  });
  