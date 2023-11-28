import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';


import TabBarIcon from '../components/TabBarIcon';
import ProductDataScreen from '../screens/ProductScreens/ProductDataScreen';
import MapScreen from '../screens/ProductScreens/MapScreen';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});
//---------

const ProductStack = createStackNavigator(
  {
    Home: ProductDataScreen,
  },
  config
);

ProductStack.navigationOptions = {
  tabBarLabel: 'Ceny',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-pricetag' : 'md-pricetag'} />
  ),
  tabBarOptions: {
    activeTintColor: 'white',
    labelStyle: {
      fontSize: 14,
    },
    style: {
      backgroundColor: '#313039',
    },
  }
};

ProductStack.path = '';

const MapStack = createStackNavigator(
    {
      Map: MapScreen,
    },
    config
  );
  
  MapStack.navigationOptions = {
    tabBarLabel: 'Mapa',
    tabBarIcon: ({ focused }) => (
      <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-map' : 'md-map'} />
    ),
    tabBarOptions: {
      activeTintColor: 'white',
      labelStyle: {
        fontSize: 14,
      },
      style: {
        backgroundColor: '#313039',
      },
    }
  };
  
  MapStack.path = '';

const tabNavigator = createBottomTabNavigator({
  ProductStack,
  MapStack,
});

tabNavigator.path = '';


export default tabNavigator;
