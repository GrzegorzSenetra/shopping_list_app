import React from 'react';
import { View, Text, StyleSheet, TextInput, Modal } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { CheckBox } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import Layout from '../../constants/Layout';
import Host from '../../constants/Host';
import LoadingScreen from '../ScanScreens/LoadingScreen';

import { getLocationPermission, setLocation, getAllShops, selectShopForList, getUserLists } from '../../store/actions/actions';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

import ListServices from '../../services/ListServices';
//_getAllShops

class EditList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            Nazwa: "",
            Checkbox: [false,false],
            Lista: Object(),
            isDataLoaded: true,
            tekst: ''
        };
    }

    componentWillMount(){
        fetch(`${Host.server_host}/dodaj_liste/${this.props.navigation.state.params.id}`,{
            method: 'GET',
            headers: new Headers({
              'Accept': "application/json",
              'Content-Type': 'application/json'
            }),
          })
            .then((response) => response.json())
            .then((responseJson) => {
              this.setState({Lista: responseJson});
            })
            .catch((error) => {
              console.error(error);
            });
    }

    onChangeText = (value) => {
        this.setState({
            Nazwa: value
        });
    }


    boxChecked = () => {
        this.setState({ Checkbox: [!this.state.Checkbox[0], this.state.Checkbox[1]] });
        
        //this.waitForElement();
        if(!this.state.Checkbox[0]){
            this.fetchShops();
        }else{
            this.cleanSelectedShop();
        }
    }

    waitForElement(){
        if(typeof this.props.locationResult !== "undefined" && this.props.locationResult != null && typeof this.props.locationResult !== undefined && typeof this.props.navigation !== "undefined"){
            //variable exists, do what you want
            const { navigate } = this.props.navigation;
            console.log(this.props.locationResult);
            navigate('MapForShopChecking');
        }
        else{
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

    closePressed = () => {
        const { goBack } = this.props.navigation;
        this.cleanSelectedShop();
        goBack();
    }

    acceptPressed = () => {
        const { goBack } = this.props.navigation;
        let body = {
            "Nazwa": this.state.Nazwa,
            "Uzytkownik": this.props.appInstanceUser.id,
            "Sklep": this.props.selectedShop.id
        }
        this.setState({
            tekst: 'Zapisuję nazwę listy',
            isDataLoaded: false
          });
        console.log(this.props.navigation.state.params.id);
        fetch(`${Host.server_host}/dodaj_liste/${this.props.navigation.state.params.id}`,{
            method: 'PUT',
            headers: new Headers({
              'Accept': "application/json",
              'Content-Type': 'application/json'
            }),
            body: JSON.stringify(body)
          })
            .then((response) => response.json())
            .then((responseJson) => {
              console.log("99999999999999999999999999999999999999999999999999999");
              console.log(responseJson);
            })
            .then(() => {
                ListServices._getUserLists(this.props.appInstanceUser.id)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        this.props.handleGetUserLists(responseJson);
                    })
                    .then(() => this.setState({
                        isDataLoaded: true
                    }))
                    .then(() => goBack())
                    .then(() => this.cleanSelectedShop())
                    .catch((error) => {
                        console.error(error);
                    });
            })
            .catch((error) => {
              console.error(error);
            });
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
                            <View style={{ backgroundColor: '#313039', color: "black" }}>
                                <LoadingScreen tekst={this.state.tekst} />
                            </View>
                        </Modal>
                    </View>
                }
                <View style={{borderWidth: 1, padding: 10, paddingTop: 0, margin: 10, marginTop: -10}}>
                    <Text style={{ fontSize: 20, }}>Nazwa: </Text>
                    <TextInput
                        onChangeText={text => this.onChangeText(text)}
                        placeholder={this.state.Lista.Nazwa}
                        style={{ padding: 5, fontSize: 20 }} />
                </View>
                <View style={{ position: "absolute", right: 20, bottom: 60 }}>
                    <TouchableOpacity
                        style={{...styles.buttons, backgroundColor: 'blue'}}
                        onPress={() => this.acceptPressed()}
                        underlayColor='#fff'>
                        <Ionicons
                            name="md-create"
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

EditList.navigationOptions = {
    headerTitle: () => (<Text style={{left: Layout.window.width/2 - 85, color: "white", fontSize: 20}}>Edytuj listę zakupów</Text>),
    headerLeft: null
};

const mapStateToProps = state => {
    return {
        hasLocationPermissions: state.hasLocationPermissions,
        locationResult: state.locationResult,
        selectedShop: state.selectedShop,
        appInstanceUser: state.appInstanceUser,
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

export default connect(mapStateToProps, mapDispatchToProps)(EditList);