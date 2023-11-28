import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, NavigationEvents } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import ScanScreen from '../screens/ScanScreens/ScanScreen';
import ListScreen from '../screens/ListScreens/ListScreen';
import UserScreen from '../screens/UserScreens/UserScreen';
import CameraScanScreen from '../screens/ScanScreens/CameraScanScreen';
import SearchScreen from '../screens/SearchScreens/SearchScreen';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const ScanStack = createStackNavigator(
  {
    Home: ScanScreen,
  },
  config
);

ScanStack.navigationOptions = {
  
  tabBarLabel: 'Skanuj',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-barcode${focused ? '' : '-outline'}`
          : 'md-barcode'
      }
    />
  ),
  tabBarOptions: {
    activeTintColor: 'white',
    labelStyle: {
      fontSize: 12,
    },
    style: {
      backgroundColor: '#313039',
    },
  },
  
};

ScanStack.path = '';

const ListStack = createStackNavigator(
  {
    Links: ListScreen,
  },
    config
);

ListStack.navigationOptions = {
  tabBarLabel: 'Listy Zakupów',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-cart' : 'md-cart'} />
  ),
  tabBarOptions: {
    activeTintColor: 'white',
    labelStyle: {
      fontSize: 12,
    },
    style: {
      backgroundColor: '#313039',
    },
  },
};

ListStack.path = '';

const UserStack = createStackNavigator(
  {
    Settings: UserScreen,
  },
  config
);

UserStack.navigationOptions = {
  tabBarLabel: 'Mój Profil',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-person' : 'md-person'} />
  ),
  tabBarOptions: {
    activeTintColor: 'white',
    labelStyle: {
      fontSize: 12,
    },
    style: {
      backgroundColor: '#313039',
    },
  }
};

UserStack.path = '';

//---------

const CameraScanStack = createStackNavigator(
  {
    Camera: CameraScanScreen,
  },
  config
);

CameraScanStack.navigationOptions = {
  tabBarLabel: 'Camera',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'} />
  ),
  tabBarOptions: {
    activeTintColor: 'white',
    labelStyle: {
      fontSize: 12,
    },
    style: {
      backgroundColor: '#313039',
    },
  }
};



CameraScanStack.path = '';

//--------------------------------------

const SearchStack = createStackNavigator(
  {
    Search: SearchScreen,
  },
  config
);

SearchStack.navigationOptions = {
  tabBarLabel: 'Szukaj',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-search' : 'md-search'} />
  ),
  tabBarOptions: {
    activeTintColor: 'white',
    labelStyle: {
      fontSize: 12,
    },
    style: {
      backgroundColor: '#313039',
    },
  }
};



SearchStack.path = '';

//---------------------

const tabNavigator = createBottomTabNavigator({
  ScanStack,
  SearchStack,
  ListStack,
  UserStack,
});

tabNavigator.path = '';


export default tabNavigator;
