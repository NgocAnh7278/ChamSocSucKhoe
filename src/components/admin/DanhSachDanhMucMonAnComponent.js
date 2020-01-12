import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import Swipeout from 'react-native-swipeout';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions';
class DanhSachDanhMucComponent extends Component {


    constructor(props) {
        super(props);
    }

    async  chonDanhMuc(danhMuc) {
        await this.props.chonDanhMucMonAn(danhMuc.id);
        this.props.myNavigation.navigate('QuanLyMonAnActivity', {
            idDanhMuc: danhMuc.id,
            tenDanhMuc: danhMuc.tenDanhMucMonAn,
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
                        this.props.parentFlatList._onPressEdit(this.props.item.id, this.props.item.anhDanhMuc, this.props.item.tenDanhMucMonAn);
                    },
                    text: 'Sửa', type: 'primary'
                },
                {
                    onPress: () => {
                        this.props.parentFlatList._onPressDelete(this.props.item.id, this.props.item.tenDanhMucMonAn);
                    },
                    text: 'Xóa', type: 'delete'
                }
            ],
            rowId: this.props.index,
            sectionId: 1,
        };

        return (
            <Swipeout  {...swipeSettings}>
                <TouchableOpacity onPress={() => this.chonDanhMuc(this.props.item)}>

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
                </TouchableOpacity>

            </Swipeout>
        );
    }
}

function mapStateToProps(state) {
    return {
        myNavigation: state.myNavigation,
        danhMucMonAn: state.monAn.danhMucMonAn,
        isLoading: state.monAn.isLoading,
        danhMucDaChon: state.monAn.danhMucDaChon,
    }
}

export default connect(
    mapStateToProps,
    actions
)(DanhSachDanhMucComponent)

const styles = StyleSheet.create({
    flatListItem: {
        color: 'black',
        padding: 10,
        fontSize: 16,
    },
});
