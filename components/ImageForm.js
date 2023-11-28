import * as React from 'react';
import { Button, Image, View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { connect } from 'react-redux';

import Host from '../constants/Host';
import ListServices from '../services/ListServices';
import { getAllShops, selectShopForList } from '../store/actions/actions';
import Layout from '../constants/Layout';

class ImageForm extends React.Component {
  state = {
    image: null,
    nazwa: '',
    cena: '0',
    formData: Object()
  };

  onChangeText = (text) =>{
    this.setState({nazwa: text});
  }

  onChangePrice = (text) =>{
    this.setState({cena: text});
  }

  navigateToMapWithAllShops = () => {
    this.fetchShops();
  }

  fetchShops = () => {
    ListServices._getAllShops()
        .then((response) => response.json())
        .then((responseJson) => {
          this.props.onGetAllShops(responseJson);
        })
        .then(() => {
          this.props.navig.navigate('MapForShopChecking');
        })
        .catch((error) => {
          console.error(error);
        });
  }

  fetchAddProduct = async () => {
    await fetch(`${Host.server_host}/dodaj_obrazek/`, {
      method: 'POST',
      body: this.state.formData,
      header: {
        'content-type': 'multipart/form-data',
      },
    })
    .then(() => {
      let GTIN = this.props.barCode;
      while(GTIN.length < 14){
        GTIN = '0' + GTIN;
      }
      let produkt = {
        GTIN: GTIN,
        ProductName: this.state.nazwa,
        ProductImage: `${Host.server_host}/media/${this.state.formData._parts[0][1].name}`,
        Uzytkownik: this.props.appInstanceUser.id
      };
      ListServices._addProduct(produkt)
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          let cenaWSklepie = {
            Sklep: this.props.selectedShop.id,
            Produkt: responseJson.id,
            Cena: parseFloat(this.state.cena),
            Uzytkownik: this.props.appInstanceUser.id
          };
          ListServices._addPriceToProduct(cenaWSklepie)
            .then((response) => response.json())
            .then((responseJson) => {
              console.log(responseJson);
              alert("dodano produkt i cene w wybranym sklepie!");
              let { goBack } = this.props.navig;
              goBack();
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.error(error);
        });
    });
    
    console.log(this.state.formData._parts[0][1].name);
  }
  
  render() {
    let { image } = this.state;

    return (
      <ScrollView style={{top: 20}}>
        <View>
          <View>
            <Text style={{ ...styles.tekst, top: 10 }}>Kod kreskowy: {this.props.barCode}</Text>
            <TextInput style={{ height: 40, borderColor: 'gray', borderWidth: 1, top: 10, color: "white", padding: 5, fontSize: 18 }}
              onChangeText={text => this.onChangeText(text)}
              value={this.state.nazwa}
              placeholder="Wpisz pełną nazwę produktu..." />
          </View>
          <View style={{ flexDirection: "column", marginTop: 20, marginBottom: 20, width: (Layout.window.width - 20) }}>
            <Text style={{ ...styles.tekst }}>Wybrany sklep: {this.props.selectedShop ? this.props.selectedShop.ShopName : "nie wybrano sklepu..."}</Text>
            <Button
              title="Wybierz sklep"
              onPress={() => this.navigateToMapWithAllShops()}
              style={{ top: 30 }}
            />
          </View>
          <View>
            <TextInput style={{ height: 40, borderColor: 'gray', borderWidth: 1, top: 10, color: "white", padding: 5, fontSize: 18 }}
              onChangeText={text => this.onChangePrice(text)}
              value={this.state.cena}
              placeholder="Wpisz pełną nazwę produktu..."
              keyboardType={'numeric'} />
          </View>
        </View>



        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        {image &&
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}


          
        <View style={{flexDirection: "row", marginTop: 30}}>
          <Button
            title="Zrób zdjęcie"
            onPress={this.takeAndUploadPhotoAsync}
          />
          <Button
            title="Galeria zdjęć"
            onPress={this._pickImage}
          />
        </View>
        
        <View>
          <Button
            title="Zatwierdź"
            onPress={() => this.fetchAddProduct()}
            style={{ top: 30 }}
          />
        </View>
        </View>
      </ScrollView>
    );
  }

  

  componentDidMount() {
    this.getPermissionAsync();
    console.log('hi');
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Przepraszamy, potrzebujemy uprawnień do przechyłu kamery!');
      }
    }
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 3],
      quality: 1
    });

    console.log(result);

    if (result.cancelled) {
      return;
    }
    this.setState({ image: result.uri });
    // ImagePicker saves the taken photo to disk and returns a local URI to it
    let localUri = result.uri;
    let filename = localUri.split('/').pop();

    // Infer the type of the image
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    // Upload the image using the fetch and FormData APIs
    let formData = new FormData();
    // Assume "photo" is the name of the form field the server expects
    formData.append('photo', { uri: localUri, name: filename, type });

    this.setState({ image: result.uri, formData: formData });

  }


  takeAndUploadPhotoAsync = async () => {
    // Display the camera to the user and wait for them to take a photo or to cancel
    // the action
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.1
    });
  
    if (result.cancelled) {
      return;
    }
  
    // ImagePicker saves the taken photo to disk and returns a local URI to it
    let localUri = result.uri;
    let filename = localUri.split('/').pop();
  
    // Infer the type of the image
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;
  
    // Upload the image using the fetch and FormData APIs
    let formData = new FormData();
    // Assume "photo" is the name of the form field the server expects
    formData.append('photo', { uri: localUri, name: filename, type });

    this.setState({ image: result.uri, formData: formData });

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#313039',
    color: "#feffff",
  },
  tekst: {
    color: "white",
    fontFamily: "space-mono"
  }
});

const mapStateToProps = state => {
  return {
     // hasLocationPermissions: state.hasLocationPermissions,
     // locationResult: state.locationResult,
      selectedShop: state.selectedShop,
      appInstanceUser: state.appInstanceUser,
  };
};


const mapDispatchToProps = dispatch => {
  return {
      //onGetLocationPermission: () => dispatch(getLocationPermission()),
      //onSetLocation: (location) => dispatch(setLocation(location)),
      onGetAllShops: (shops) => dispatch(getAllShops(shops)),
      handleSelectShop: (shop) => dispatch(selectShopForList(shop)),
      //handleGetUserLists: (responseJson) => dispatch(getUserLists(responseJson)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ImageForm);