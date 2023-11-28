import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { CheckBox } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import Layout from '../../constants/Layout';
import Host from '../../constants/Host';

import { getLocationPermission, setLocation, getAllShops, selectShopForList, getUserLists } from '../../store/actions/actions';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

import ListServices from '../../services/ListServices';
//_getAllShops

class AddPrice extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            Cena: "",
        };
    }

    onChangeText = (value) => {
        this.setState({
            Cena: value
        });
    }

    closePressed = () => {
        const { goBack } = this.props.navigation;
        //this.cleanSelectedShop();
        goBack();
    }

    acceptPressed = () => {
        let cenaWSklepie = {
            Sklep: this.props.selectedShop.id,
            Produkt: this.props.product[0][0].id,
            Cena: this.state.Cena,
            Uzytkownik: this.props.appInstanceUser.id
        };
        console.log(cenaWSklepie);
        ListServices._addPriceToProduct(cenaWSklepie)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                alert("Dodano cenę");
            })
            .then(()=>this.props.navigation.goBack())
        //console.log(this.props.navigation.state.params.GTIN);
    }
    render(){
        return (
            <View style={styles.container}>
                <Text>Kod kreskowy produktu: {this.props.navigation.state.params.GTIN}</Text>
                <Text>Sklep: {this.props.selectedShop.ShopName}</Text>
                <View style={{borderWidth: 1, padding: 10, paddingTop: 0, margin: 10, marginTop: 10}}>
                    <Text style={{ fontSize: 20, }}>Cena (w zł): </Text>
                    <TextInput
                        keyboardType="numeric"
                        onChangeText={text => this.onChangeText(text)}
                        placeholder={"Wpisz cenę tego produktu w tym sklepie..."}
                        style={{ padding: 5, fontSize: 20 }} />
                </View>
                <View style={{ position: "absolute", right: 20, bottom: 60 }}>
                    <TouchableOpacity
                        style={{...styles.buttons, backgroundColor: 'green'}}
                        onPress={() => this.acceptPressed()}
                        underlayColor='#fff'>
                        <Ionicons
                            name="md-checkmark"
                            size={40}
                            color="white"
                            style={{ marginLeft: 7 }}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{ position: "absolute", left: 20, bottom: 60 }}>
                    <TouchableOpacity
                        style={{ ...styles.buttons, backgroundColor: 'red' }}
                        onPress={() => this.closePressed()}
                        underlayColor='#fff'>
                        <Ionicons
                            name="md-close"
                            size={40}
                            color="white"
                            style={{ marginLeft: 7 }}
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
        paddingTop: 25
    },
    buttons: {
        padding: 10,
        width: 60,
        height: 60,
        borderRadius: 30
    },
});

AddPrice.navigationOptions = {
    headerTitle: () => (<Text style={{ color: "white", fontSize: 20}}>Dodaj cenę produktu w wybranym sklepie</Text>),
    headerLeft: null
};

const mapStateToProps = state => {
    return {
        hasLocationPermissions: state.hasLocationPermissions,
        locationResult: state.locationResult,
        selectedShop: state.selectedShop,
        appInstanceUser: state.appInstanceUser,
        product: state.product
    };
};


const mapDispatchToProps = dispatch => {
    return {
        onGetLocationPermission: () => dispatch(getLocationPermission()),
        onSetLocation: (location) => dispatch(setLocation(location)),
        onGetAllShops: (shops) => dispatch(getAllShops(shops)),
        handleSelectShopForList: (shop) => dispatch(selectShopForList(shop)),
        handleGetUserLists: (responseJson) => dispatch(getUserLists(responseJson)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddPrice);