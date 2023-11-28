import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { connect } from 'react-redux';
import Layout from '../../constants/Layout';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

import ListServices from '../../services/ListServices';
import { addAppInstanceUserInfo } from '../../store/actions/actions';

class NotificationScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tekst: "",
            tryb: 0,
        };
    }
    componentDidMount = () => {
        console.log(this.props.selectedNotification);
        if(this.props.selectedNotification.Cena){
            this.setState({tryb:1})
        }else if(this.props.selectedNotification.ProductName){
            this.setState({tryb:2})
        }
    }
    onChangeText = (val) => {
        this.setState({tekst: val});
    }

    fetchZgloszenie = () => {
        if(this.props.appInstanceUser.IloscZgloszen <= 0){
            alert("Wykorzystano dzienne zgłoszenia");
            this.props.navigation.goBack();
            return;
        }else if(this.state.tekst.length > 200){
            alert("Tekst zawiera za dużo znaków");
            return;
        }else{
            let notification = Object();
            if(this.state.tryb == 1){
                notification = {
                    Tresc: this.state.tekst,
                    CenaProduktuWSklepie: this.props.selectedNotification.id,
                    Produkt: null,
                    Sklep: null,
                    Uzytkownik: this.props.appInstanceUser.id
                };
            }else if(this.state.tryb == 2){
                notification = {
                    Tresc: this.state.tekst,
                    CenaProduktuWSklepie: null,
                    Produkt: this.props.selectedNotification.id,
                    Sklep: null,
                    Uzytkownik: this.props.appInstanceUser.id
                };
            }
            ListServices._addNotification(notification)
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson);
                    alert("Zgłoszenie przebiegło pomyślnie!");
                    ListServices._getUser(this.props.appInstanceUser.id)
                        .then((response) => response.json())
                        .then((responseJson) => {
                            this.props.onAddAppInstanceUserInfo(responseJson);
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                })
                .then(() => {
                    this.props.navigation.goBack();
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }

    render() {
        let iloscZnakow = 200 - this.state.tekst.length;
        return (
            <View style={styles.container}>
                <View style={{ padding: 15, backgroundColor: "orange", flexDirection: "row", borderRadius: 30, marginLeft: 'auto', marginRight: 15 }}>
                    <Text style={styles.text}>Pozostałe zgłoszenia: {this.props.appInstanceUser.IloscZgloszen}</Text>
                    <Ionicons
                        name="md-flag"
                        size={26}
                        style={{ marginBottom: -3 }}
                        color="white"
                    />
                </View>
                <TextInput
                    style={{ borderColor: 'gray', borderWidth: 1, width: (Layout.window.width - 20), ...styles.text, marginTop: 10, marginBottom: 10, padding: 5 }}
                    onChangeText={text => this.onChangeText(text)}
                    value={this.state.tekst}
                    placeholder="Podaj przyczynę zgłoszenia.."
                    multiline={true}
                />
                <Text style={{...styles.text, color: iloscZnakow >= 0 ? "green" : "red", marginLeft:'auto', marginRight: 15}}>{iloscZnakow}</Text>
                <View style={{...styles.buttons, backgroundColor: "green", bottom: 20, right: 20, position: "absolute"}}>
                    <TouchableOpacity onPress={() => this.fetchZgloszenie()}>
                        <Ionicons
                            name="md-checkmark"
                            size={40}
                            style={{ marginBottom: -3, marginLeft: 6 }}
                            color="white"
                        />
                    </TouchableOpacity>
                </View>
                <View style={{...styles.buttons, backgroundColor: "red", bottom: 20, left: 20, position: "absolute"}}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Ionicons
                            name="md-close"
                            size={40}
                            style={{ marginBottom: -3, marginLeft: 7 }}
                            color="white"
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
        paddingTop: 50,
        alignItems: "center",
        backgroundColor: "#313039"
    },
    text: {
        color: "white",
        fontSize: 16,
        fontFamily: 'space-mono',
        marginRight: 10
    },
    buttons: {
        padding: 10,
        width: 60,
        height: 60,
        borderRadius: 30
    },
});

NotificationScreen.navigationOptions = {
    header: null
};

const mapStateToProps = state => {
    return {
        product: state.product,
        appInstanceUser: state.appInstanceUser,
        selectedNotification: state.selectedNotification
    };
};


const mapDispatchToProps = dispatch => {
    return {
        onAddAppInstanceUserInfo: (appInstanceUser) => dispatch(addAppInstanceUserInfo(appInstanceUser)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationScreen);