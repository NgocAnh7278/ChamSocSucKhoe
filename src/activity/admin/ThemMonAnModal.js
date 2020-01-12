import React from 'react';
import {
  Text,
  Image,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import Modal from 'react-native-modalbox';
import * as actions from '../../redux/actions';
import {connect} from 'react-redux';
import {
  TITLE_FONT_SIZE,
  URL_UPLOAD,
  THEM_MON_AN,
  SUA_MON_AN,
} from '../../asset/MyConst';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
class ThemMonAnModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      uri: null,
      id: null,
      imageEmpty:
        'https://nameproscdn.com/a/2018/05/106343_82907bfea9fe97e84861e2ee7c5b4f5b.png',
      loai: 1,
      tenMonAn: 'tenMonAn',
      anhMonAn: '',
      donViTinh: 'donViTinh',
      caLo: '1',
      dam: '2',
      beo: '3',
      xo: '4',
      danhMucId: this.props.danhMucDaChon,
    };
    this.onClose = this.onClose.bind(this);
    this.uploadImageToServer = this.uploadImageToServer.bind(this);
  }

  showAddMemberModal = (loai, monAn = null) => {
    this.setState({
      loai: loai,
      uri: monAn !== null ? monAn.AnhMonAn : null,
      id: monAn !== null ? monAn.Id : null,
      tenMonAn: monAn !== null ? monAn.TenMonAn : '',
      donViTinh: monAn !== null ? monAn.DonViTinh : '',
      anhMonAn: monAn !== null ? monAn.AnhMonAn : '',
      caLo: monAn !== null ? monAn.Calo : '',
      dam: monAn !== null ? monAn.Dam : '',
      beo: monAn !== null ? monAn.Beo : '',
      xo: monAn !== null ? monAn.Xo : '',
      danhMucId: monAn !== null ? monAn.IdDanhMucMonAn : this.state.danhMucId,
    });
    this.refs.modal1.open();
  };

  handleChoosePhoto = () => {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        this.setState({
          uri: response.uri,
          data: response.data,
        });
      }
    });
  };

  onClose() {
    this.setState({
      id: null,
      data: null,
      tenMonAn: 'tenMonAn',
      anhMonAn: '',
      loai: 1,
      donViTinh: 'donViTinh',
      caLo: '1',
      dam: '2',
      beo: '3',
      xo: '4',
    });
  }

  async uploadImageToServer() {
    const {data} = this.state;
    var monAn = null;
    const {
      id,
      tenMonAn,
      anhMonAn,
      donViTinh,
      caLo,
      dam,
      beo,
      xo,
      danhMucId,
    } = this.state;

    if (data === null && this.state.loai === 1) {
      alert('Bạn chưa chọn ảnh');
    } else {
      // Nếu chọn ảnh thì mới up lên server
      if (data !== null) {
        await this.uploadImage().then(async () => {
          // Thêm mới
          if (this.state.loai === 1) {
            monAn = JSON.stringify({
              loai: THEM_MON_AN,
              Id: null,
              TenMonAn: tenMonAn,
              AnhMonAn: this.state.anhMonAn,
              DonViTinh: donViTinh,
              Calo: caLo,
              Dam: dam,
              Beo: beo,
              Xo: xo,
              IdDanhMucMonAn: danhMucId,
            });
          }
          // update
          else {
            monAn = JSON.stringify({
              loai: SUA_MON_AN,
              Id: id,
              TenMonAn: tenMonAn,
              AnhMonAn: this.state.anhMonAn,
              DonViTinh: donViTinh,
              Calo: caLo,
              Dam: dam,
              Beo: beo,
              Xo: xo,
              IdDanhMucMonAn: danhMucId,
            });
          }
        });
      } else {
        monAn = JSON.stringify({
          loai: SUA_MON_AN,
          Id: id,
          TenMonAn: tenMonAn,
          AnhMonAn: this.state.anhMonAn,
          DonViTinh: donViTinh,
          Calo: caLo,
          Dam: dam,
          Beo: beo,
          Xo: xo,
          IdDanhMucMonAn: danhMucId,
        });
      }
      await this.props.monAnAsync(monAn, this.state.danhMucId);
      this.refs.modal1.close();
    }
  }

  async uploadImage() {
    const {data} = this.state;
    await RNFetchBlob.fetch(
      'POST',
      URL_UPLOAD,
      {
        Authorization: 'Bearer access-token',
        otherHeader: 'foo',
        'Content-Type': 'multipart/form-data',
      },
      [{name: 'image', filename: 'image.png', type: 'image/png', data: data}],
    )
      .then(async resp => {
        var uri = resp.data;
        uri = uri.replace(/^"|"$/g, '');
        await this.setState({
          anhMonAn: uri,
        });
      })
      .catch(err => {
        console.log(2, err);
      });
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  render() {
    const {uri} = this.state;
    return (
      <Modal
        style={[styles.modal]}
        onClosed={this.onClose}
        position={'center'}
        ref={'modal1'}
        isDisabled={this.state.isDisabled}>
        <Text style={styles.title}>
          {this.state.loai === 1 ? 'Thêm món ăn' : 'Sửa món ăn'}{' '}
        </Text>
        <View style={styles.textInputContainer}>
          <Text>Tên món ăn</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={tenMonAn => this.setState({tenMonAn})}
            value={this.state.tenMonAn}
          />

          <Text>Đơn vị tính</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={donViTinh => this.setState({donViTinh})}
            value={this.state.donViTinh}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}>
            <View style={{flex: 1, marginRight: 15}}>
              <Text>Calo (Kcal)</Text>
              <TextInput
                keyboardType="numeric"
                style={styles.textInput}
                onChangeText={caLo => this.setState({caLo})}
                value={this.state.caLo}
              />
            </View>
            <View style={{flex: 1}}>
              <Text>Đạm (gam)</Text>
              <TextInput
                keyboardType="numeric"
                style={styles.textInput}
                onChangeText={dam => this.setState({dam})}
                value={this.state.dam}
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}>
            <View style={{flex: 1, marginRight: 15}}>
              <Text>Béo (gam)</Text>
              <TextInput
                keyboardType="numeric"
                style={styles.textInput}
                onChangeText={beo => this.setState({beo})}
                value={this.state.beo}
              />
            </View>
            <View style={{flex: 1}}>
              <Text>Xơ (gam)</Text>
              <TextInput
                keyboardType="numeric"
                style={styles.textInput}
                onChangeText={xo => this.setState({xo})}
                value={this.state.xo}
              />
            </View>
          </View>

          <Text>Ảnh mô tả </Text>
          <TouchableOpacity onPress={this.handleChoosePhoto}>
            <Image
              source={{uri: uri !== null ? uri : this.state.imageEmpty}}
              style={{width: 150, height: 150, marginBottom: 15, marginTop: 10}}
            />
          </TouchableOpacity>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={this.uploadImageToServer}
              style={styles.loginButton}>
              <Text style={styles.loginButtonTitle}>Lưu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}
function mapStateToProps(state) {
  return {
    email: state.taiKhoan.email,
    danhMucDaChon: state.monAn.danhMucDaChon,
  };
}

export default connect(mapStateToProps, actions)(ThemMonAnModal);

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 50,
    flex: 1,
  },

  modal: {
    width: 400,
    height: 700,
    marginTop: -30,
    borderRadius: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: TITLE_FONT_SIZE,
    margin: 10,
    marginTop: 30,
  },
  textInputContainer: {
    width: '90%',
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 30,
    backgroundColor: 'rgba(255,255,255,0.2)', // a = alpha = opacity
  },
  textInput: {
    height: 45,
    borderBottomColor: 'black',
    borderWidth: 2,
    marginTop: 10,
    padding: 8,
    marginBottom: 10,
  },
  loginButton: {
    width: 100,
    height: 40,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
  },
  loginButtonTitle: {
    margin: 10,
    fontSize: 18,
    color: 'white',
  },
});
