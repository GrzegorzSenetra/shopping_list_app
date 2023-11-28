import React from 'react';
import { connect } from 'react-redux';
import MapView from 'react-native-maps';
import { Marker, AnimatedRegion } from 'react-native-maps';
//import { MapView } from 'expo';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { View, Text, StyleSheet, Image, Button, Picker, TextInput } from 'react-native';
import Layout from '../../constants/Layout';
import Constants from 'expo-constants';
import { onScannedBarcode, getUserLists } from '../../store/actions/actions';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ListServices from '../../services/ListServices';

class MapScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mapRegion: { latitude: this.props.locationResult.coords.latitude, longitude: this.props.locationResult.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 },
      mapRegionForMarker: { latitude: this.props.locationResult.coords.latitude, longitude: this.props.locationResult.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 },
      hasLocationPermissions: this.props.hasLocationPermissions,
      locationResult: JSON.stringify(this.props.locationResult),
      sklep: this.props.shopForProduct,
      selectedList: 0,
      ilosc: "1"
    };

  }
    mapStyle = [
        {
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#ebe3cd"
            }
          ]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#523735"
            }
          ]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#f5f1e6"
            }
          ]
        },
        {
          "featureType": "administrative",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#c9b2a6"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#dcd2be"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#ae9e90"
            }
          ]
        },
        {
          "featureType": "landscape.natural",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#93817c"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#a5b076"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#447530"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#f5f1e6"
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#fdfcf8"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#f8c967"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#e9bc62"
            }
          ]
        },
        {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#e98d58"
            }
          ]
        },
        {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#db8555"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#806b63"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#8f7d77"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#ebe3cd"
            }
          ]
        },
        {
          "featureType": "transit.station",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#b9d3c2"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#92998d"
            }
          ]
        }
      ];

    //shouldComponentUpdate
    //props.navigation.didFocus();
    setNewRegion = () => {
      if(this.props.navigation.state.params){
        this.setState({
          mapRegion: {
            latitude: parseFloat(this.props.navigation.state.params.latlng.Lat),
            longitude: parseFloat(this.props.navigation.state.params.latlng.Lon),
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          },
          sklep: this.props.shopForProduct
        });
      }
    }

    componentWillReceiveProps = () => {
      if(this.props.navigation.state.params){
        this.setState({
          mapRegion: {
            latitude: parseFloat(this.props.navigation.state.params.latlng.Lat),
            longitude: parseFloat(this.props.navigation.state.params.latlng.Lon),
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          },
          sklep: this.props.shopForProduct
        });
      }
      this.props.handleOnScreenReload(this.props.product);
    }

    componentWillUpdate(nextProps, nextState) {
      console.log(nextState); //will show the new state
      console.log(this.state); //will show the previous state
    }


  // static getDerivedStateFromProps(nextProps, prevState) {
  //   if (nextProps.latlng !== prevState.latlng) {
  //     return { latlng: nextProps.latlng };
  //   }
  //   else return null;
  // }

  // componentDidUpdate(prevProps, prevState) {
  //   if(prevProps.latlng!==this.props.latlng){
  //     //Perform some operation here
  //     this.setState({latlng: this.props.navigation.state.params.latlng});
  //     this.classMethod();
  //   }
  // }
    
    onChangeText = (text) =>{
      this.setState({
        ilosc: text
      });
    }

    fetchAddProduct = () => {
      let produkt = {
        Produkt: this.props.product[0][0].id,
        Ilosc: this.state.ilosc,
        ListaZakupow: this.state.selectedList,
        Cena: 0,
        Sklep: this.state.sklep.SklepId
      };
      console.log(produkt);
      if(produkt.Produkt == 0 || produkt.Ilosc == 0 || produkt.ListaZakupow == 0 || produkt.Sklep == 0){
        return alert("Błędne dane");
      }else{
        ListServices._addProductToList(produkt)
          .then(()=> {
            alert("Dodano produkt do listy");
          })
          .then(() =>{
            ListServices._getProductsInList(produkt.ListaZakupow)
              .then(() => {
                ListServices._getUserLists(this.props.appInstanceUser.id)
                  .then((response) => response.json())
                  .then((responseJson) => {
                    this.props.handleGetUserLists(responseJson);
                  })
                  .then(() => {
                    const { goBack } = this.props.navigation;
                    goBack('');
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
    }

    render(){
        let handleMapRegionChange = (mapRegion) => {
            this.setState({mapRegion: mapRegion});
        }
        console.log(this.props.product);
        console.log("GUGUGUGUGUGUUGUGUGUGUGUUGUG");
        console.log(this.props.shopForProduct.SklepId);
        let userList = this.props.userLists.map((item, index) => {
          return(
            <Picker.Item label={item.Nazwa} value={item.id} key={index} />
          );
        });
        return(
            <View style={styles.container}>
                {
                    this.state.locationResult === null ?
                        <Text>Szukanie twojej obecnej lokalizacji...</Text> :
                        this.state.hasLocationPermissions === false ?
                            <Text>Zezwolenie na korzystanie z lokalizacji nie zostało przyznane.</Text> :
                            this.state.mapRegion === null ?
                                <Text>Nie istnieje obszar mapy.</Text> :
                                this.state.mapRegionForMarker === null ?
                                <Text>Nie można pobrać bierzącej lokalizacji</Text> :
                                <MapView
                                    style={{ alignSelf: 'stretch', height: Layout.window.height, backgroundColor: 'black' }}
                                    region={this.state.mapRegion}
                                    customMapStyle={this.mapStyle}
                                    onUserLocationChange={handleMapRegionChange}
                                    loadingEnabled={true}
                                    onMapReady={()=>this.setNewRegion()}
                                >
                                    <Marker
                                                coordinate={{latitude:this.state.mapRegionForMarker.latitude,longitude:this.state.mapRegionForMarker.longitude}}
                                                title={"Moja lokalizacja"}
                                                description={"Tu się znajduję!"}
                                                pinColor={"orange"}
                                            />
                                    {this.props.product[1].map((marker,key) => {
                                      let latitudelongitude = {
                                        latitude: parseFloat(marker.latlng.Lat),
                                        longitude: parseFloat(marker.latlng.Lon)
                                      };
                                      return (
                                        <Marker
                                          animateMarkerToCoordinate={{ coordinate: latitudelongitude, duration: 1000 }}
                                          coordinate={latitudelongitude}
                                          title={marker.Sklep}
                                          description={"Cena: " + marker.Cena.toFixed(2) + " zł"}
                                          key={key}
                                          tracksInfoWindowChanges={true}
                                          pinColor={"green"}
                                          onPress={()=>this.setState({sklep: marker, mapRegion: {
                                            latitude: latitudelongitude.latitude,
                                            longitude: latitudelongitude.longitude,
                                            latitudeDelta: 0.0922,
                                            longitudeDelta: 0.0421
                                          }})}
                                        />
                                      );
                                    }
                                    )} 
                                </MapView>
                }
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'flex-start', alignItems: 'flex-start'}}>
              <View style={{
                backgroundColor: "white", borderRadius: 30, padding: 20, top: 10, left: 10,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 7,
                },
                shadowOpacity: 0.43,
                shadowRadius: 30,
                elevation: 15,
                flexDirection: 'row',
              }}>
                <Text>Lista: </Text>
                <Picker
                  selectedValue={this.state.selectedList}
                  style={{ height: 20, width: 150 }}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({ selectedList: itemValue })
                  }>
                  <Picker.Item label={"Brak"} value={0} />
                  {userList}
                </Picker>
                <Text>Ilość: </Text>
                <TextInput
                  style={{ height: 20, borderColor: 'gray', borderWidth: 1 }}
                  onChangeText={text => this.onChangeText(text)}
                  value={this.state.ilosc}
                  keyboardType={'numeric'}
                />
              </View>
              
            </View>
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
              <View style={{
                position: "absolute", bottom: 10, margin: 'auto',
                padding: 20, backgroundColor: "white", borderRadius: 30, width: 200,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 7,
                },
                shadowOpacity: 0.43,
                shadowRadius: 30,

                elevation: 15
              }}><Text style={{ textAlign: "center" }}>{'Sklep: ' + this.state.sklep.Sklep}</Text>
              </View>
              <View style={{ position: "absolute", bottom: 10, right: 20 }}>

                <TouchableOpacity
                  style={{ ...styles.addButton, backgroundColor: "blue" }}
                  onPress={() => this.fetchAddProduct()}
                  underlayColor='#fff'>
                  <Ionicons
                    name="md-cart"
                    size={40}
                    color="white"
                    style={{ marginLeft: 3 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {this.state.sklep.SklepId != 0 ? <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
              <Ionicons
              name="md-qr-scanner"
              size={26}
              style={{ marginBottom: -3 }}
              color="red"
            />
                
            </View> : <Text></Text>}
            

          </View>
        );
    }
}
MapScreen.navigationOptions = {
    header: null
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ecf0f1',
      paddingTop: Constants.statusBarHeight,
    },
    paragraph: {
      margin: 24,
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#34495e',
    },
    addButton: {
      backgroundColor: 'green',
      padding: 10,
      width: 60,
      height: 60,
      borderRadius: 30
    }
  });

const mapStateToProps = state => {
    return {
        product: state.product,
        hasLocationPermissions: state.hasLocationPermissions,
        locationResult: state.locationResult,
        shopForProduct: state.shopForProduct,
        userLists: state.userLists,
        appInstanceUser: state.appInstanceUser
    };
};

const mapDispatchToProps = dispatch => {
    return {
        handleOnScreenReload: (responseJson) => dispatch(onScannedBarcode(responseJson)),
        handleGetUserLists: (responseJson) => dispatch(getUserLists(responseJson)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);