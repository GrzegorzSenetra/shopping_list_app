import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

import Layout from '../../constants/Layout';
import { createBottomTabNavigator, BottomTabBar, tabBarOnPress } from 'react-navigation-tabs';

export default class PricesList extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        pricesList = [];
        let jsxList = (
            <Text style={{alignSelf: 'flex-start', fontFamily: 'rajdhani-medium', top:3, fontSize: 17,color: 'white',}}>Brak cen</Text>
        );
        if (typeof this.props.pricesList[0] !== "undefined") {
            console.log("(((((((((((((((((((((((((((((((((((((((((((");
            console.log(this.props.pricesList);
            pricesList = this.props.pricesList;
            pricesArr = [];
            // tutaj dać sortowania w zależności od ceny (kolor obramowania zależny od ceny np. drogo = czerwony, tanio = zielony) bądź od odległości sklepu od użytkownika
            for(i = 0; i<pricesList.length;i++){
                pricesArr[i] = pricesList[i].Cena;
            }
            console.log(pricesArr);
            
            jsxList = pricesList.map((price,key) => {
                return (
                    // onPress={()=>this.props.modalHandler()} 
                    
                    <View style={styles.listItem} key={key}>
                        <TouchableOpacity onPress={() => this.props.navigateToMaps(price)} style={{width: (Layout.window.width - 70),paddingTop: 15, paddingBottom: 20 }}>
                            <Text style={{ alignSelf: 'flex-start', fontFamily: 'rajdhani-medium', top: 3, fontSize: 17, color: 'white', }}>
                                {price.Sklep}
                            </Text>
                        </TouchableOpacity>
                        <Text style={{...styles.listItemText,paddingTop:15}}>
                            {price.Cena.toFixed(2)} zł
                        </Text>
                        <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => this.props.navigateToNotification(price)}>
                            <Ionicons
                                name="md-flag"
                                size={20}
                                style={{ marginBottom: -3 }}
                                color="yellow"
                            />
                        </TouchableOpacity>
                    </View>
                    
                );
            });
        }

        return (
            <View style={{flex: 1}}>
                <ScrollView style={styles.listView}>
                    {jsxList}
                </ScrollView>
                
            </View>
        );
    };
}

const styles = StyleSheet.create({
    listView: {
        marginTop: 20,
        //backgroundColor: "red",
        width: Layout.window.width,
    },
    listItem: {
        //backgroundColor: "green",
        width: Layout.window.width,
        paddingLeft: 15,
        paddingRight: 15,
        flexDirection: 'row',
        borderLeftWidth: 10,
        borderLeftColor: 'green',
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
    },
    listItemText: {
        fontSize: 18,
        //alignSelf: 'flex-end',
        //justifyContent: 'flex-end'
        marginLeft: 'auto',
        fontFamily: 'space-mono',
        color: 'white',
    },
    
});