import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { connect } from 'react-redux';
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
import Layout from '../../constants/Layout';
import { Ionicons } from '@expo/vector-icons';
import { getAllShops } from '../../store/actions/actions';


class UserScreen extends React.Component {
  constructor(props){
    super(props);
  }

  handleSelectPlace = () => {
    console.log("hehehehe");
    this.fetchShops();

  }

  fetchShops = () => {
    ListServices._getAllShops()
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.props.onGetAllShops(responseJson);
      })
      .then(() => this.waitForElement())
  }

  waitForElement() {
    if (typeof this.props.locationResult !== "undefined" && this.props.locationResult != null && typeof this.props.locationResult !== undefined && typeof this.props.navigation !== "undefined") {
      //variable exists, do what you want
      const { navigate } = this.props.navigation;
      console.log(this.props.locationResult);
      navigate('MapForSelectingPlace');
    }
    else {
      setTimeout(this.waitForElement, 500);
    }
  }

  render(){
    return (
      <View style={styles.container}>
        <TouchableHighlight
        onPress={() => console.log(Layout.window.height)}
        style={styles.avatar}>
          <Image
            style={{ width: 200, height: 200, borderRadius: 200 / 2, borderColor: 'aqua', borderWidth: 2 }}
            source={{ uri: this.props.appInstanceUser.Avatar }}
          />
        </TouchableHighlight>
        <Text style={styles.userName}>{this.props.appInstanceUser.UserName}</Text>
        <View style={{ position: "absolute", right: 20, bottom: 20, flexDirection: 'row', }}>
          <TouchableOpacity
            style={{ ...styles.addButton, backgroundColor: "green", marginRight: 10 }}
            onPress={() => { this.handleSelectPlace() }}
            underlayColor='#fff'>
            <Ionicons
              name="md-basket"
              size={40}
              color="white"
              style={{ marginLeft: 3 }}
            />
          </TouchableOpacity>
        </View>

      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#313039',
    color: "#feffff",
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: Layout.window.height / 2 - 270
  },
  avatar: {
    width: 200, 
    height: 200, 
    borderRadius: 200 / 2,
  },
  userName: {
    top: 10,
    fontSize: 22,
    color: "white",
    fontFamily: 'space-mono'
  },
  addButton: {
    backgroundColor: 'green',
    padding: 10,
    width: 60,
    height: 60,
    borderRadius: 30
  }
});

UserScreen.navigationOptions = {
  header: null,
};

const mapStateToProps = state => {
  return {
    appInstanceUser: state.appInstanceUser,
    locationResult: state.locationResult
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetAllShops: (shops) => dispatch(getAllShops(shops)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserScreen);