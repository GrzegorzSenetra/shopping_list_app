import React from 'react';
import { connect } from 'react-redux';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
//import { MapView } from 'expo';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { View, Text, StyleSheet, Image, Button, TextInput, Modal } from 'react-native';
import Layout from '../../constants/Layout';
import Constants from 'expo-constants';
import ListServices from '../../services/ListServices';
import { selectShopForList, trybChange, newListChange } from '../../store/actions/actions';

import LoadingScreen from '../ScanScreens/LoadingScreen';

class MapForSelectingPlace extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            //mapRegion: { latitude: this.props.locationResult.coords.latitude, longitude: this.props.locationResult.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 },
            //mapRegionForMarker: { latitude: this.props.locationResult.coords.latitude, longitude: this.props.locationResult.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 },
            hasLocationPermissions: this.props.hasLocationPermissions,
            locationResult: JSON.stringify(this.props.locationResult),
            markerCoords: { latitude: this.props.locationResult.coords.latitude, longitude: this.props.locationResult.coords.longitude },
            Nazwa: '',
            tekst: '',
            isDataLoaded: true
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

    onChangeText = (value) => {
        this.setState({
            Nazwa: value
        });
    }

    addShop = () => {
        let shop = {
            ShopName: this.state.Nazwa,
            Lat: this.state.markerCoords.latitude.toString(),
            Lon: this.state.markerCoords.longitude.toString(),
            Uzytkownik: this.props.appInstanceUser.id
        }
        this.setState({
          tekst: 'Dodaję sklep do bazy danych',
          isDataLoaded: false
        });
        ListServices._postShop(shop)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log("99999999999999999999999999999999999999999999999999999");
                console.log(responseJson);
            })
            .then(() => this.setState({
              isDataLoaded: true
            }))
            .then(() => this.props.navigation.goBack())
    }


    render(){
      return (
        <View style={styles.container}>
          {this.state.isDataLoaded ? <Text style={{ position: "absolute", height: 0, width: 0 }}></Text> :
            <View style={{ backgroundColor: '#313039', }}>
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
          {
            this.props.locationResult === null ?
              <Text>Szukanie twojej obecnej lokalizacji...</Text> :
              this.props.hasLocationPermissions === false ?
                <Text>Zezwolenie na korzystanie z lokalizacji nie zostało przyznane.</Text> :
                this.props.mapRegion === null ?
                  <Text>Nie istnieje obszar mapy.</Text> :
                    <MapView
                      style={{ alignSelf: 'stretch', height: Layout.window.height, backgroundColor: 'black' }}
                      initialRegion={{ latitude: this.props.locationResult.coords.latitude, longitude: this.props.locationResult.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }}
                      customMapStyle={this.mapStyle}
                      onLongPress={(coordinate) => {
                          console.log("====================================");
                          console.log(coordinate.nativeEvent.coordinate);
                          this.setState({
                              //mapRegion: { latitude: coordinate.nativeEvent.coordinate.latitude, longitude: coordinate.nativeEvent.coordinate.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421},
                              markerCoords: coordinate.nativeEvent.coordinate
                            });
                        }}
                    >
                      <Marker
                        coordinate={{ latitude: this.state.markerCoords.latitude, longitude: this.state.markerCoords.longitude }}
                        title={"Miejsce w którym znajduje się sklep który chcę dodać"}
                        description={"Nazwa sklepu: "+this.state.Nazwa}
                        pinColor={"blue"}
                        //animateMarkerToCoordinate={}
                      />

                      {this.props.allShops.map((marker, key) => {
                        let latitudelongitude = {
                          latitude: parseFloat(marker.Lat),
                          longitude: parseFloat(marker.Lon)
                        };
                        return (
                          <Marker
                            animateMarkerToCoordinate={{ coordinate: latitudelongitude, duration: 1000 }}
                            coordinate={latitudelongitude}
                            title={marker.ShopName}
                            key={key}
                            pinColor={"green"}
                          />
                        );
                      })}
                                  
                                      
                                  
                    </MapView>
          }
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
              }}>
              <TextInput
                        onChangeText={text => this.onChangeText(text)}
                        placeholder="Wpisz nazwę sklepu..."
                        style={{ padding: 5, fontSize: 20 }} />
              </View>
              <View style={{ position: "absolute", bottom: 10, right: 20 }}>

                <TouchableOpacity
                  style={{ ...styles.addButton, backgroundColor: "blue" }}
                  onPress={() => this.addShop()}
                  underlayColor='#fff'>
                  <Ionicons
                    name="md-add"
                    size={40}
                    color="white"
                    style={{ marginLeft: 7 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
        </View>
        );
    }
}
MapForSelectingPlace.navigationOptions = {
  headerTitle: () => {
    return (
    <View>
      <Text style={{color: "white", fontSize: 16}}>Przytrzymaj miejsce w którym chcesz dodać sklep</Text>
    </View>
    );
  }
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
        hasLocationPermissions: state.hasLocationPermissions,
        locationResult: state.locationResult,
        allShops: state.allShops,
        tryb: state.tryb,
        appInstanceUser: state.appInstanceUser
    };
};

const mapDispatchToProps = dispatch => {
    return {
        handleSelectShopForList: (shop) => dispatch(selectShopForList(shop)),
        handleTrybChange: (tryb) => dispatch(trybChange(tryb)),
        handleNewListChange: (isNewListRequired) => dispatch(newListChange(isNewListRequired)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MapForSelectingPlace);