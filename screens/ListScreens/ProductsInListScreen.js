import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import Layout from '../../constants/Layout';
import { NavigationEvents } from 'react-navigation';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { CheckBox } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';

import { getProductsInList, getUserLists } from '../../store/actions/actions';
import ListServices from '../../services/ListServices';

class ProductsInListScreen extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            products: [],
            uLids: []
        };
    }

    setSelectedIds = () => {
        let lists = this.props.products;
        let checked = this.state.products;

        let endTab = [];
        let i = 0
        lists.map((item, index) => {
            if (checked[index] && typeof checked[index] !== undefined) {
                endTab[i] = item.id;
                i++;
            }
        })
        //console.log(endTab);
        this.setState({ uLids: endTab });
        console.log(this.state.uLids);
    }

    deleteSelectedProduct = () => {
        let localProducts = this.props.products;
        this.state.uLids.map((item, index) => {
            ListServices._deleteSelectedProductFromList(item)
                .then((response) => {
                    if (response.ok) {
                        console.log("Sukces!");
                    }
                })
                .then(() => {
                    this.setState({ products: [false] });
                    console.log(this.state.products);
                    this.setSelectedIds();
                })
                .then(() => {
                    if (this.state.uLids.length == 0) {
                        ListServices._getProductsInList(localProducts[0].ListaZakupow)
                            .then((response) => response.json())
                            .then((responseJson) => {
                                this.props.handleGetProductsInList(responseJson);
                            })
                            .then(() => {
                                ListServices._getUserLists(this.props.appInstanceUser.id)
                                    .then((response) => response.json())
                                    .then((responseJson) => {
                                        console.log("Wszysko ok");
                                        this.props.handleGetUserLists(responseJson);
                                    })
                                    .catch((error) => {
                                        console.error(error);
                                    });
                            })
                            .catch((error) => {
                                console.error(error);
                            });
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        });
    }

    render(){
        let products = (<Text>Brak produktów w liście</Text>);
        let tab = [];
        if(typeof this.props.products !== undefined && this.props.products){
            products = this.props.products.map((item,index) => {
                tab = this.state.products;
                return (
                    <View key={index} style={styles.listItem}>
                        <TouchableOpacity  onPress={() => {
                            tab[index] = !tab[index];
                            this.setState({ products: tab });
                            console.log(this.state.products);
                            this.setSelectedIds();
                        }}>
                            <View style={{ width: Layout.window.width - 150, flexDirection: 'column' }}>
                                <Text style={styles.listItemText}>{item.Produkt}</Text>
                                <Text style={{ ...styles.listItemText, top: 5 }}>Ilość: {item.Ilosc}</Text>
                            </View>
                            <Text style={styles.listItemPrice}>{item.Cena.toFixed(2)} zł</Text>
                        </TouchableOpacity>
                        <View style={{ position: "relative", marginLeft: "auto", top: 6 }}>
                            <CheckBox
                                containerStyle={{ backgroundColor: "white", borderWidth: 0 }}
                                style={{ width: 30, height: 30 }}
                                title={<Text></Text>}
                                checked={this.state.products[index]}
                                onPress={() => {
                                    tab[index] = !tab[index];
                                    this.setState({ products: tab });
                                    this.setSelectedIds();
                                }}
                            />
                        </View>
                    </View>
                );
            });
        }
        let checked = 0;
        this.state.uLids.forEach(element => {
            if (element) {
                checked++;
            }
        });
        return (
            <View style={styles.container}>
                <ScrollView>
                    {products}
                </ScrollView>
                {checked !== 0 ? <View style={{ position: "absolute", right: 20, bottom: 20, flexDirection: 'row', }}>
                    <TouchableOpacity
                        style={{ ...styles.addButton, backgroundColor: "red", marginRight: 10 }}
                        onPress={() => { this.deleteSelectedProduct(); tab = [] }}
                        underlayColor='#fff'>
                        <Ionicons
                            name="md-trash"
                            size={40}
                            color="white"
                            style={{ marginLeft: 7 }}
                        />
                    </TouchableOpacity>
                </View> : <Text></Text>
                }
            </View>
          );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    listItem: {
        //backgroundColor: "green",
        width: Layout.window.width,
        padding: 20,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
    },
    listItemText: {
        fontSize: 14,
        fontFamily: 'space-mono',
        
    },
    listItemPrice: {
        fontSize: 20,
        fontFamily: 'space-mono',
        color: 'green',
        marginLeft: "auto"
    },
    addButton: {
        backgroundColor: 'green',
        padding: 10,
        width: 60,
        height: 60,
        borderRadius: 30
    }
});

ProductsInListScreen.navigationOptions = {
    title: 'Wróć',
    headerStyle: {
        backgroundColor: '#214e4c',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
        fontWeight: 'bold',
    },
};

const mapStateToProps = state => {
    return {
        products: state.productsInList,
        appInstanceUser: state.appInstanceUser
    };
};


const mapDispatchToProps = dispatch => {
    return {
        handleGetProductsInList: (responseJson) => dispatch(getProductsInList(responseJson)),
        handleGetUserLists: (responseJson) => dispatch(getUserLists(responseJson)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductsInListScreen);