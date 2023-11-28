import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import Constants from 'expo-constants';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  ActivityIndicator,
  Modal,
  Switch
} from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Host from '../../constants/Host';

import {
  TextButton,
  RaisedTextButton
} from 'react-native-material-buttons';
import AwesomeButton from "react-native-really-awesome-button/src/themes/rick";
import { Icon } from 'react-native-elements'

import { connect } from 'react-redux';
import { 
  startScan, 
  stopScan, 
  getLocationPermission, 
  setLocation, 
  addAppInstanceUserInfo, 
  getUserLists, 
  getAllShops, 
  selectShopForList, 
  trybChange, 
  newListChange,
  selectList,
} from '../../store/actions/actions';
import ListServices from '../../services/ListServices';
import Layout from '../../constants/Layout';

import LoadingScreen from './LoadingScreen';




class ScanScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDataLoaded: false,
      modalVisible: false,
      tekst: "Szukanie lokalizacji urządzenia...",
      checked: false,
    };
  }

  fetchUser = () => {
    const data = {
      "AppInstanceId": Constants.installationId
    };
    return fetch(`${Host.server_host}/wpisz_uzytkownika/`, {
      method: 'POST',
      headers: new Headers({
        'Accept': "application/json",
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //console.log(responseJson[0]);
        this.props.onAddAppInstanceUserInfo(responseJson[0]);
        this.setState({tekst: "Pobieranie list zakupów użytkownika..."}); 
        console.log("GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG");
        console.log(this.props.appInstanceUser);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async componentDidMount() {
    this.getLocationAsync()
      .then((response) => {
        this.props.onSetLocation(response);
        this.setState({tekst: "Pobieranie danych użytkownika..."}); 
      })
      .then(() =>this.fetchUser())
      .then(() => {
        ListServices._getUserLists(this.props.appInstanceUser.id)
          .then((response) => response.json())
          .then((responseJson) => {
            this.props.handleGetUserLists(responseJson);
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .then(()=> {
        this.setState({isDataLoaded: true});
      })
      .catch((error) => {
        console.error(error);
      });
    
  }

  getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.props.onSetLocation('Permission to access location was denied');
    } else {
      this.props.onGetLocationPermission();
      let location = await Location.getCurrentPositionAsync({});
      //this.props.onSetLocation(location);
      return new Promise((resolve,reject) => {
        if(location){
          resolve(location);
        }else{
          reject(new Error("Błąd lokacji"));
        }
      })
    }
  }

//   const _getUserLists = async (data) => {
//     try {
//         const response = await fetch(`${Host.server_host}/wyswietl_listy?id=${data}`, {
//             method: 'GET',
//             headers: new Headers({
//                 'Accept': "application/json",
//                 'Content-Type': 'application/json'
//             }),
//         });
//         //const responseJson = await response.json();
//         return new Promise((resolve,reject) => {
//             if(response.ok) {
//                 resolve(response);
//             } else {
//                 reject(new Error("Błędne dane"));
//             }
//         });
//     }
//     catch (error) {
//         console.error(error);
//     }
// }



  // ListServices._getProductsInList(data)
  // .then((response) => response.json())
  // .then((responseJson) => {
  //   this.props.handleGetProductsInList(responseJson);
  // })
  // .then(() => this.navigateToProductsInList())

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }



  // tryb zakupowy - checkbox
  handleSwitchChange = () => {
    //this.setState({ checked: !this.state.checked });
    this.props.handleNewListChange(true);
    this.props.handleTrybChange(!this.props.tryb);
    if (!this.props.tryb) {
      this.fetchShops();
    } else {
      this.cleanSelectedShop();
    }
  }

  waitForElement() {
    if (typeof this.props.locationResult !== "undefined" && this.props.locationResult != null && typeof this.props.locationResult !== undefined && typeof this.props.navigation !== "undefined") {
      //variable exists, do what you want
      const { navigate } = this.props.navigation;
      console.log(this.props.locationResult);
      navigate('MapForShopChecking');
    }
    else {
      setTimeout(this.waitForElement, 500);
    }
  }

  fetchShops = () => {
    ListServices._getAllShops()
      .then((response) => response.json())
      .then((responseJson) => {
        this.props.onGetAllShops(responseJson);
      })
      .then(() => this.waitForElement())
  }
  cleanSelectedShop = () => {
    let shop = Object();
    this.props.handleSelectShopForList(shop);
  }


  //big button pressed
  scanPressed = () => {
    if (this.props.tryb && this.props.isNewListRequired == true) {
      let nazwa = "Zakupy w "+this.props.selectedShop.ShopName
      let body = {
        "Nazwa": nazwa,
        "Uzytkownik": this.props.appInstanceUser.id
      }
      fetch(`${Host.server_host}/dodaj_liste/`, {
        method: 'POST',
        headers: new Headers({
          'Accept': "application/json",
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify(body)
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          this.props.handleNewListChange(false);
          this.props.handleSelectList(responseJson);
          ListServices._getUserLists(this.props.appInstanceUser.id)
            .then((response) => response.json())
            .then((responseJson) => {
              this.props.handleGetUserLists(responseJson);
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .then(() => this.props.navigation.navigate('Scanning'))
        .catch((error) => {
          console.error(error);
        });
    }else if(this.props.tryb && this.props.isNewListRequired == false){
      //this.props.handleNewListChange(true);
      this.props.navigation.navigate('Scanning');
    }else{
      this.props.navigation.navigate('Scanning');
    }
    
  }


  render() {
    const { navigate } = this.props.navigation;
    
    return (
      <View style={styles.container}>
        {
          this.state.isDataLoaded ? <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}>
          
          <View style={{position:"absolute", top:15, right: 15, flexDirection: "row"}}>
            <Text style={{color: "white", fontFamily: 'space-mono'}}>Tryb zakupowy: </Text>
            <Switch onChange={this.handleSwitchChange} value={this.props.tryb} />
          </View>

          <View
            style={styles.helloTextContainer}>
            <Text
              style={styles.helloStyle}>
              Witaj w BCSkanerze,{'\n'}
              Wciśnij przycisk SKANUJ,{'\n'}
              aby zeskanować kod kreskowy...
            </Text>
          </View>
          
          <AwesomeButton
            type="anchor"
            onPress={() => this.scanPressed()}
            height={250}
            width={250}
            backgroundColor={"#08fdd8"}
            backgroundDarker={"#08bda8"}
            raiseLevel={20}
            textSize={50}
            textFontFamily={"space-mono"}
          >
            SKANUJ
          </AwesomeButton>
          {/* <Text style={{color:'white',fontSize:20}}>{Constants.installationId}</Text> */}
        </ScrollView> :
            <View style={{backgroundColor: '#313039',}}>
              <Modal
                animationType="fade"
                transparent={true}
                visible={!this.state.isDataLoaded}
                onRequestClose={() => {
                  alert('Modal has been closed.');
                }}>
                <View style={{ backgroundColor: '#313039' }}>
                  <LoadingScreen tekst={this.state.tekst} />
                </View>
              </Modal>
            </View>
        
        }
        
      </View>
    );
  }
}



ScanScreen.navigationOptions = {
  header: null,
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#313039',
    color: "#feffff",
  },
  contentContainer: {
    flex: 1,
    paddingTop: 30,
    flexDirection: 'column',
    alignItems: 'center'
  },
  helloTextContainer: {
    marginTop: 70,
    marginBottom: 10,
  },
  helloStyle: {
    textAlign: "center",
    color: "#feffff",
    fontFamily: "space-mono",
  },
  buttonStyle: {
    width: 250,
    height: 250,
    borderRadius: 20,
  }
});

const mapStateToProps = state => {
  return {
    isScanOpen: state.isScanOpen,
    appInstanceUser: state.appInstanceUser,
    locationResult: state.locationResult,
    selectedShop: state.selectedShop,
    tryb: state.tryb,
    isNewListRequired: state.isNewListRequired
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onStartScan: () => dispatch(startScan()),
    onStopScan: () => dispatch(stopScan()),
    onGetLocationPermission: () => dispatch(getLocationPermission()),
    onSetLocation: (location) => dispatch(setLocation(location)),
    onAddAppInstanceUserInfo: (appInstanceUser) => dispatch(addAppInstanceUserInfo(appInstanceUser)),
    handleGetUserLists: (responseJson) => dispatch(getUserLists(responseJson)),
    onGetAllShops: (shops) => dispatch(getAllShops(shops)),
    handleSelectShopForList: (shop) => dispatch(selectShopForList(shop)),
    handleTrybChange: (tryb) => dispatch(trybChange(tryb)),
    handleNewListChange: (isNewListRequired) => dispatch(newListChange(isNewListRequired)),
    handleSelectList: (responseJson) => dispatch(selectList(responseJson))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ScanScreen);