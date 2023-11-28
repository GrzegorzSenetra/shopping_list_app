import React from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { connect } from 'react-redux';
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
import Layout from '../../constants/Layout';
import { Ionicons } from '@expo/vector-icons';
import ListServices from '../../services/ListServices';
import { getAllShops } from '../../store/actions/actions';


class UserScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Nazwa: ""
        };
    }

    onChangeText = (value) => {
        this.setState({
            Nazwa: value
        });
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


    render() {
        return (
            <View style={styles.container}>
                <View style={{ borderWidth: 1, padding: 10, paddingTop: 0, margin: 10, marginTop: -10 }}>
                    <Text style={{ fontSize: 20, }}>Nazwa: </Text>
                    <TextInput
                        onChangeText={text => this.onChangeText(text)}
                        placeholder="Wpisz nazwę sklepu..."
                        style={{ padding: 5, fontSize: 20 }} />
                        <Button
                            title="Wybierz miejsce"
                            onPress={() => this.handleSelectPlace()}
                        />
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