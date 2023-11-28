import React from 'react';
import { connect } from 'react-redux';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
//import { MapView } from 'expo';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import Layout from '../../constants/Layout';
import Constants from 'expo-constants';
import ListServices from '../../services/ListServices';
import { selectShopForList, trybChange, newListChange } from '../../store/actions/actions';

class MapForShopChecking extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            mapRegion: { latitude: this.props.locationResult.coords.latitude, longitude: this.props.locationResult.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 },
            mapRegionForMarker: { latitude: this.props.locationResult.coords.latitude, longitude: this.props.locationResult.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 },
            hasLocationPermissions: this.props.hasLocationPermissions,
            locationResult: JSON.stringify(this.props.locationResult),
            wasShopSelected: false
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

    shopSelected = (id) => {
      console.log("CALLOUT HAS BEEN PRESSED!"+id);
      const { goBack } = this.props.navigation;
      ListServices._getSelectedShop(id)
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({wasShopSelected: true});
          this.props.handleSelectShopForList(responseJson)
        })
        .then(() => goBack())
       // ListServices._getProductsInList(data)
  // .then((response) => response.json())
  // .then((responseJson) => {
  //   this.props.handleGetProductsInList(responseJson);
  // })
  // .then(() => this.navigateToProductsInList())
    }

    componentWillUnmount = () => {
      if(!this.state.wasShopSelected){
        this.props.handleTrybChange(this.state.wasShopSelected);
        this.props.handleNewListChange(true);
      }
    }
    render(){
        let handleMapRegionChange = (mapRegion) => {
            //console.log(mapRegion);
            //this.setState({ mapRegion });
            this.setState({mapRegionForMarker: mapRegion});
        }
      return (
        <View style={styles.container}>
          {
            this.props.locationResult === null ?
              <Text>Szukanie twojej obecnej lokalizacji...</Text> :
              this.props.hasLocationPermissions === false ?
                <Text>Zezwolenie na korzystanie z lokalizacji nie zostało przyznane.</Text> :
                this.props.mapRegion === null ?
                  <Text>Nie istnieje obszar mapy.</Text> :
                  this.state.mapRegionForMarker === null ?
                    <Text>Nie można pobrać bierzącej lokalizacji</Text> :
                    <MapView
                      style={{ alignSelf: 'stretch', height: Layout.window.height, backgroundColor: 'black' }}
                      region={this.state.mapRegion}
                      customMapStyle={this.mapStyle}
                      onUserLocationChange={handleMapRegionChange}
                    >
                      <Marker
                        coordinate={{ latitude: this.state.mapRegionForMarker.latitude, longitude: this.state.mapRegionForMarker.longitude }}
                        title={"Moja lokalizacja"}
                        description={"Tu się znajduję!"}
                        pinColor={"orange"}
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
                            onCalloutPress={()=>this.shopSelected(marker.id)}
                          />
                        );
                      })}
                    </MapView>
          }
        </View>
        );
    }
}
MapForShopChecking.navigationOptions = {
  headerTitle: () => {
    return (
    <View>
      <Text style={{color: "white", fontSize: 16}}>Dotknij pinezkę sklepu w którym chcesz zrobić listę zakupów</Text>
      <Text style={{color: "white", fontSize: 12}}>A następnie dotknij jego nazwę..</Text>
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
  });

const mapStateToProps = state => {
    return {
        hasLocationPermissions: state.hasLocationPermissions,
        locationResult: state.locationResult,
        allShops: state.allShops,
        tryb: state.tryb
    };
};

const mapDispatchToProps = dispatch => {
    return {
        handleSelectShopForList: (shop) => dispatch(selectShopForList(shop)),
        handleTrybChange: (tryb) => dispatch(trybChange(tryb)),
        handleNewListChange: (isNewListRequired) => dispatch(newListChange(isNewListRequired)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MapForShopChecking);