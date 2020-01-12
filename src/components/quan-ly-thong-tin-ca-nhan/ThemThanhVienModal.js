import React from 'react';
import { Text, TextInput, View, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modalbox';
import * as actions from '../../redux/actions';
import { connect } from 'react-redux';
import { THEM_THANH_VIEN } from '../../asset/MyConst';

class ThemThanhVienModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      isDisabled: false,
      swipeToClose: true,
      sliderValue: 0.3,
      chucDanh: '',
      email: this.props.email
    };
    this.save = this.save.bind(this)
    this.onClose = this.onClose.bind(this)
  }

  // Nhấn nút lưu thêm thành viên
  save() {
    this.props.themThanhVienAsync(
      JSON.stringify({
        loai: THEM_THANH_VIEN,
        chucDanh: this.state.chucDanh,
        email: this.props.email
      }), this.props.email).then(() => {
        this.refs.modal1.close();
      });
  }

  showAddMemberModal = () => {
    this.refs.modal1.open();
  };

  onClose() {
    //called on modal closed
    console.log('Modal just closed');
    this.setState({
      chucDanh: ''
    })
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  shouldComponentUpdate

  render() {
    return (
      <Modal
        style={[styles.modal, styles.modal1]}
        onClosed={this.onClose}
        position={'center'}
        ref={'modal1'}
        isDisabled={this.state.isDisabled}>
        <Text style={styles.title}>Thêm thành viên</Text>
        <View style={styles.textInputContainer}>
          <Text>Chức danh</Text>
          <TextInput
            style={styles.textInput}
            placeholder='Chức danh'
            onChangeText={chucDanh => this.setState({ chucDanh })}
            value={this.state.chucDanh}
          />
        </View>
        <TouchableOpacity
          onPress={this.save}
          style={styles.loginButton}
        >
          <Text style={styles.loginButtonTitle}>Lưu</Text>
        </TouchableOpacity>
      </Modal>
    );
  }
}
function mapStateToProps(state) {
  return {
    email: state.taiKhoan.email,
  }
}

export default connect(
  mapStateToProps,
  actions
)(ThemThanhVienModal)

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 50,
    flex: 1,
  },

  modal: {
    // justifyContent: 'center',
    alignItems: 'center',
  },

  modal1: {
    height: 240,
    width: 400,
    marginTop: -30
  },
  title: {
    fontSize: 30,
    margin: 10

  },
  textInputContainer: {
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.2)' // a = alpha = opacity
  },
  textInput: {
    width: 280,
    height: 45,
    borderBottomColor: 'black',
    borderWidth: 2,
    marginTop: 10,
    padding: 8
  },
  loginButton: {
    width: 80,
    height: 40,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green'
  },
  loginButtonTitle: {
    fontSize: 18,
    color: 'white'
  },
});
