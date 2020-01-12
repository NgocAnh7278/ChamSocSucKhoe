import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  AsyncStorage,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { COLOR_BLUE } from '../../asset/MyColor';
import { XOA_THANH_VIEN, URL_UPLOAD, CAP_NHAT_AVATAR } from '../../asset/MyConst';
import { CheckBox, ListItem } from 'react-native-elements';
import { Button } from 'react-native-elements';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import IconEntypo from 'react-native-vector-icons/Entypo';
import ThemThanhVienModal from '../../components/quan-ly-thong-tin-ca-nhan/ThemThanhVienModal';
import * as actions from '../../redux/actions';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';

class QuanLyThongTinCaNhanActivity extends React.Component {
  modalVisible = false;
  constructor(props) {
    super(props);
    this.state = {
      checked: true,
      visible: false,
      modalVisible: false,
      isOpen: false,
      isDisabled: false,
      swipeToClose: true,
      sliderValue: 0.3,
      quanLyCalo: this.props.quanLyCalo,
      imageEmpty:
        'https://nameproscdn.com/a/2018/05/106343_82907bfea9fe97e84861e2ee7c5b4f5b.png',
      HoTen: '',
      Email: '',
      Avatar: null,
      data: null,
      uri: null,
    };
    this.addMember = this.addMember.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  async componentWillMount() {
    let HoTen = await AsyncStorage.getItem('HoTen');
    let Email = await AsyncStorage.getItem('Email');
    let Avatar = await AsyncStorage.getItem('Avatar');

    console.log('HoTen', HoTen);

    await this.setState({
      HoTen: HoTen,
      Email: Email,
      Avatar: Avatar,
    });

    console.log(this.state.HoTen);

  }

  addMember = () => {
    this.child.showAddMemberModal();
  };

  logOut() {
    Alert.alert(
      'Thoát khỏi ứng dụng? ',
      'Bạn sẽ không nhận được thông báo sau khi đăng xuất!',
      [
        {
          text: 'Hủy',
          onPress: () => console.log('Cancel Pressed'),
          style: 'login',
        },
        {
          text: 'Đăng xuất',
          onPress: () => {
            AsyncStorage.setItem('email', '');
            AsyncStorage.setItem('password', '');
            AsyncStorage.setItem('Avatar', '');
            this.props.myNavigation.navigate('DangNhapActivity');
          },
        },
      ],
      { cancelable: false },
    );
  }

  changePassword = () => {
    // Alert.alert(
    //   'Thoát khỏi ứng dụng? ',
    //   'Bạn sẽ không nhận được thông báo sau khi đăng xuất!',
    //   [
    //     {
    //       text: 'Hủy',
    //       onPress: () => console.log('Cancel Pressed'),
    //       style: 'login',
    //     },
    //     { text: 'Đăng xuất', onPress: () => console.log('OK Pressed') },
    //   ],
    //   { cancelable: false },
    // );
  };

  xoaThanhVien() {
    var out = [];
    for (var i = 0; i < this.props.quanLyCalo.routes.length; i++) {
      let item = this.props.quanLyCalo.routes[i];
      if (item.info.checked) {
        out.push({
          id: item.key,
          name: item.info.chucDanh !== '' ? item.info.chucDanh : item.title,
        });
      }
    }
    let itemName = out.map(e => e.name).join(',');
    let itemId = out.map(e => e.id).join(',');
    Alert.alert(
      'Bạn có chắc chắn không? ',
      'Thành viên ' + itemName + ' sẽ bị xóa!',
      [
        {
          text: 'Hủy',
          style: 'login',
        },
        {
          text: 'Xác nhận',
          onPress: () => {
            this.props.xoaThanhVienAsync(
              JSON.stringify({
                loai: XOA_THANH_VIEN,
                listThanhVienId: itemId,
              }),
              this.props.email,
            );
          },
        },
      ],
      { cancelable: false },
    );
  }

  checkItem = (title, id) => {
    if (title !== 'Tôi') {
      this.props.chonThanhVien(id);
    }
  };

  shouldComponentUpdate(nextProps, nextState) {
    console.log('nextProps', nextState.HoTen);
    return (this.props.quanLyCalo.routes !== nextProps.quanLyCalo.routes) || (this.state.HoTen !== nextState.HoTen)|| (this.state.Avatar !== nextState.Avatar);
  }

  handleChoosePhoto = () => {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.showImagePicker(options, async response => {
      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        await RNFetchBlob.fetch(
          'POST',
          URL_UPLOAD,
          {
            Authorization: 'Bearer access-token',
            otherHeader: 'foo',
            'Content-Type': 'multipart/form-data',
          },
          [
            {
              name: 'image',
              filename: 'image.png',
              type: 'image/png',
              data: response.data,
            },
          ],
        )
          .then(async resp => {
            var uri = resp.data;
            uri = uri.replace(/^"|"$/g, '');

            let avatar = JSON.stringify({
              loai: CAP_NHAT_AVATAR,
              email: this.state.Email,
              uri: uri,
            });
            this.props.capNhatAvatarAsync(avatar, uri);
            await this.setState({
              Avatar: uri,
            });
          })
          .catch(err => {
            console.log(2, err);
          });

        // this.setState({
        //   Avatar: response.uri,
        //   data: response.data
        // });
      }
    });
  };

  render() {
    return (
      <View style={styles.container}>
        {/*Button to open Basic Modal which is modal1 in this example*/}
        <Text style={styles.title}>My Profile {this.state.HoTen} </Text>
        <View style={styles.info}>
          <View style={styles.infoLeft}>
            <TouchableOpacity onPress={this.handleChoosePhoto}>
              <Image
                style={styles.avatarLogin}
                source={{
                  uri:
                    this.state.Avatar !== null
                      ? this.state.Avatar
                      : this.state.imageEmpty,
                }}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.infoRight}>
            <Text>Họ tên</Text>
            <Text style={{ marginLeft: 20 }}>{this.state.HoTen}</Text>
            <Text>Email</Text>
            <Text style={{ marginLeft: 20 }}>{this.state.Email}</Text>
          </View>
        </View>
        <View style={styles.family}>
          <Text style={{ fontWeight: 'bold', marginBottom: 15 }}>
            Thành viên trong gia đình
          </Text>
          <View style={{ flex: 9 }}>
            {this.props.quanLyCalo.routes.length > 0 ? (
              <FlatList
                keyExtractor={(item, index) => index.toString()}
                data={this.props.quanLyCalo.routes}
                renderItem={({ item }) => (
                  <CheckBox
                    containerStyle={styles.checkBoxMember}
                    title={
                      item.info.chucDanh === ''
                        ? item.title
                        : item.info.chucDanh
                    }
                    checked={item.info.checked}
                    onPress={() =>
                      this.checkItem(item.info.chucDanh, item.info.id)
                    }
                  />
                )}
                ItemSeparatorComponent={this.renderSeparator}
                style={{ backgroundColor: 'transparent' }}
              />
            ) : (
                <Text>2</Text>
              )}
          </View>
          <View style={styles.button}>
            <View style={{ flex: 1, marginRight: 15 }}>
              <Button
                icon={<IconAntDesign name="delete" size={20} color="white" />}
                title="Xóa"
                onPress={() => {
                  this.xoaThanhVien();
                }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Button
                icon={
                  <IconFontAwesome name="user-plus" size={20} color="white" />
                }
                title="Thêm"
                onPress={() => {
                  this.addMember();
                }}
              />
            </View>
          </View>
          <ThemThanhVienModal onRef={ref => (this.child = ref)} />
        </View>
        <View style={styles.login}>
          <Button
            buttonStyle={{ justifyContent: 'flex-start' }}
            icon={<IconEntypo name="log-out" size={20} color="white" />}
            title="Đăng xuất"
            titleStyle={{ marginLeft: 10 }}
            onPress={this.logOut}
          />
          <Button
            buttonStyle={{ justifyContent: 'flex-start' }}
            icon={<IconAntDesign name="lock" size={20} color="white" />}
            title="Thay đổi mật khẩu"
            titleStyle={{ marginLeft: 10 }}
            onPress={() => {
              this.changePassword();
            }}
          />
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    myNavigation: state.myNavigation,
    thongTinCaNhan: state.thongTinCaNhan.thongTin,
    quanLyCalo: state.quanLyCalo,
    email: state.taiKhoan.email,
  };
}

export default connect(mapStateToProps, actions)(QuanLyThongTinCaNhanActivity);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  title: {
    color: COLOR_BLUE,
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    margin: 10,
    marginBottom: 25,
  },
  info: {
    flex: 2,
    width: '100%',
    flexDirection: 'row',
    padding: 15,
  },
  infoLeft: {
    flex: 2,
  },
  infoRight: {
    flex: 4,
    marginLeft: 10,
    marginRight: 10,
  },
  family: {
    flex: 6,
    width: '100%',
    padding: 25,
    maxHeight: '100%',
  },
  login: {
    flex: 2,
    width: '100%',
    justifyContent: 'flex-end',
  },
  avatarLogin: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
  checkBoxMember: {
    borderWidth: 0,
    margin: -2,
    backgroundColor: 'transparent',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    textAlign: 'right',
  },
});
