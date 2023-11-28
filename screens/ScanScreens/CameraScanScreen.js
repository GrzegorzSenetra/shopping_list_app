import * as React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
//import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';

import { connect } from 'react-redux';
import { onScannedBarcode, getUserLists } from '../../store/actions/actions';

import AwesomeButton from "react-native-really-awesome-button/src/themes/rick";
import Host from '../../constants/Host';
import ListServices from '../../services/ListServices';

class BarcodeScannerExample extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      hasCameraPermission: null,
      scanned: false,
      locationResult: this.props.locationResult,
    };
  }
  

  async componentDidMount() {
    this.getPermissionsAsync();
  }

  getPermissionsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  };

  render() {
    const { hasCameraPermission, scanned } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Prośba o pozwolenie na korzystanie z kamery</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>Brak dostępu do kamery</Text>;
    }
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-end',
          marginLeft: -13,
          marginRight: -13,
          marginTop: -13,
        }}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />

        {scanned && (
          //<Button title={'Dotknij żeby zeskanować ponownie'} onPress={() => this.setState({ scanned: false })} />
          <Button title={'Skanuj ponownie'} onPress={() => this.setState({ scanned: false })} />
        )}
      </View>
    );
  }

  handleBarCodeScanned = ({ type, data }) => {
    this.setState({ scanned: true });
    //alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    this.getProductFromApiAsync(data);
  };

  // getProductFromApiAsync(data) {
  //   const base64 = require('base-64');
  //   var headers = new Headers();
  //   headers.append("Authorization", "Basic " + base64.encode("rafal.senetra@gmail.com:a79d41998e016dcd88bca52c9ff4622070b09c1cb3797a676178fb0f933b8ef5"));
  //   return fetch(`http://www.produktywsieci.gs1.pl/api/products/${data}?aggregation=SOCIAL`, {
  //     headers: headers
  //   })
  //     .then((response) => response.json())
  //     .then((responseJson) => {
  //       this.props.handleOnScannedBarcode(responseJson);
  //       console.log(responseJson);
  //       // return console.log(responseJson);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }

  fetchAddProduct = (produkt) => {
    
    console.log(produkt);

    ListServices._addProductToList(produkt)
      .then(() => {
        alert("Dodano produkt do listy");
      })
      .then(() => {
        ListServices._getProductsInList(produkt.ListaZakupow)
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
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  }







  getProductFromApiAsync(data) {
    let location = this.props.locationResult;
    let latitude = 0;
    let longitude = 0;
    if(typeof location !== "undefined"){
      latitude = location.coords.latitude;
      longitude = location.coords.longitude;
    }
    //console.log(latitude+"|"+longitude);
    console.log(":::::::::::::::::::::::::::::::::::::::::::");
    console.log("GTIN ZESKANOWANEGO PRODUKTU: "+data);
    return fetch(`${Host.server_host}/produkt?GTIN=${data}&latitude=${latitude}&longitude=${longitude}`,{
      method: 'GET',
      headers: new Headers({
        'Accept': "application/json",
        'Content-Type': 'application/json'
      }), 
    })
      .then((response) => response.json())
      .then((responseJson) => {
        const {navigate} = this.props.navigation;
        if(!responseJson[0][0]) {
          console.log("there is no response");
          navigate('AddNewProductScreen', {barCode: data});
        }else{
          this.props.handleOnScannedBarcode(responseJson);
          console.log("--------------------------");
          console.log(this.props.product[0][0].ProductName);
          console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
          console.log(responseJson);
          // w zaleznosci od trybu skanowania: dodaj produkt lub przekieruj na informacje o produkcie
          if(Object.entries(this.props.selectedShop) != 0){
            console.log(this.props.selectedShop);
            console.log(this.props.product[0][0].id);
            console.log(this.props.selectedList.id);
            //console.log(this.props.product[1]);
            let ileItemowSpelniajacych = 0;
            this.props.product[1].map((item, index) => {
              if(item.SklepId === this.props.selectedShop.id){
                ileItemowSpelniajacych++;
              }
            });
            if(ileItemowSpelniajacych > 0) {
              let produkt = {
                Produkt: this.props.product[0][0].id,
                Ilosc: 1,
                ListaZakupow: this.props.selectedList.id, // wazne
                Cena: 0,
                Sklep: this.props.selectedShop.id
              };
              this.fetchAddProduct(produkt);
            }else{
              alert("W tym sklepie nie dodano ceny tego produktu!");
              this.props.navigation.navigate("AddPrice", {GTIN: data});
            }
          }else{
            navigate('ProductData');
          }
          
        }
      })
      .catch((error) => {
        console.error(error);
      });
      
  }
}

const styles = StyleSheet.create({
  roundButton: {

  }
});

BarcodeScannerExample.navigationOptions = {
  header: null,
};

const mapStateToProps = state => {
  return {
    product: state.product,
    locationResult: state.locationResult,
    selectedShop: state.selectedShop,
    selectedList: state.selectedList,
    appInstanceUser: state.appInstanceUser
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handleOnScannedBarcode: (responseJson) => dispatch(onScannedBarcode(responseJson)),
    handleGetUserLists: (responseJson) => dispatch(getUserLists(responseJson)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BarcodeScannerExample);