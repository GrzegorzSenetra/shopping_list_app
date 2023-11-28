import React from 'react';
import { View, Text, StyleSheet, Image, Button, TouchableHighlight, Modal } from 'react-native';
import { Dimensions } from 'react-native';
import { Divider } from 'react-native-elements';
import Layout from '../../constants/Layout';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

import PricesList from './PricesList';

export default class Item extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
          };
    }
    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
      }
    render() {
        let produkt = Object();
        let pricesList = [];
        let image = ( <Text style={styles.noimage}>Brak obrazka</Text> );
        if(typeof this.props.product[0] !== "undefined"){
            produkt = this.props.product[0][0];
            pricesList = this.props.product[1];
            image = (
                <Image
                    style={styles.image}
                    source={{ uri: produkt.ProductImage }}
                />
            );
            if (!produkt.ProductImage) {
                image = (
                    <Text style={styles.noimage}>Brak obrazka</Text>
                );
            }
        }

        return (
            <View style={styles.container}>
                {image}
                <View style={styles.titleContainer}>
                    <View style={{flexDirection:"row", alignSelf: "center"}}>
                        <Text style={styles.text}>
                            {produkt.ProductName}
                        </Text>
                        <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => this.props.navigateToNotification(this.props.product[0][0])}>
                            <Ionicons
                                name="md-flag"
                                size={20}
                                style={{ marginBottom: -3 }}
                                color="yellow"
                            />
                        </TouchableOpacity>
                    </View>
                    <Divider style={{ backgroundColor: 'grey', height: 2, top: 20 }} />
                </View>
                <PricesList 
                    pricesList={pricesList} 
                    modalHandler={() => this.setModalVisible(!this.state.modalVisible)} 
                    navigateToMaps={(id)=>this.props.navigateToMaps(id)} 
                    navigateToNotification={(price)=>this.props.navigateToNotification(price)} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#313039',
        height: 400
    },
    image: {
        width: 200,
        height: 200,
    },
    noimage: {
        fontSize: 28,
        fontWeight: "bold",
        color: 'white',
    },
    titleContainer: {
        width: Dimensions.get('window').width - 20,
    },
    text: {
        top: 10,
        fontSize: 18,
        textAlign: 'center',
        fontWeight: "bold",
        color: 'white'
    },
    tabsArea: {
        //position: 'absolute',
        flexDirection: 'row',
        width: Layout.window.width,
        bottom: 0,
        backgroundColor: 'red',
    },
    tabs: {

    }
});