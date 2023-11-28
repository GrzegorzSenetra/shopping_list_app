import React from 'react';
import { createAppContainer, createSwitchNavigator, createStackNavigator, Image } from 'react-navigation';
import { fromLeft,fromBottom,fromRight, fadeIn, flipX, zoomIn } from 'react-navigation-transitions';

import MainTabNavigator from './MainTabNavigator';
import ProductScreenTabNavigator from './ProductScreenTabNavigator';
import CameraScanScreen from '../screens/ScanScreens/CameraScanScreen';
import ProductDataScreen from '../screens/ProductScreens/ProductDataScreen';
import AddNewProductScreen from '../screens/ProductScreens/AddNewProductScreen';
import ProductsInListScreen from '../screens/ListScreens/ProductsInListScreen';
import AddNewListScreen from '../screens/ListScreens/AddNewListScreen';
import MapForShopChecking from '../screens/ListScreens/MapForShopChecking';
import EditList from '../screens/ListScreens/EditList';
import LoadingScreen from '../screens/ScanScreens/LoadingScreen';
import NotificationScreen from '../screens/ProductScreens/NotificationScreen';
import MapForSelectingPlace from '../screens/UserScreens/MapForSelectingPlace';
import AddShopScreen from '../screens/UserScreens/AddShopScreen';
import AddPrice from '../screens/ScanScreens/AddPrice';
import AnalizeScreen from '../screens/ListScreens/AnalizeScreen';

import { Dimensions } from 'react-native';

const MainNavigator = createStackNavigator({
  Home: MainTabNavigator,
  Loading: LoadingScreen,
  Scanning: CameraScanScreen,
  Notification: NotificationScreen,
  ProductData: {
    screen: ProductScreenTabNavigator,
    navigationOptions: {
      title: 'Wróć do skanowania',
      headerStyle: {
        backgroundColor: '#214e4c',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  },
  AddNewProductScreen: {
    screen: AddNewProductScreen,
    navigationOptions: {
      title: 'Wróć do skanowania',
      headerStyle: {
        backgroundColor: '#214e4c',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  },
  ProductsInList: ProductsInListScreen,
  AddNewList: AddNewListScreen,
  MapForShopChecking: MapForShopChecking,
  EditList: EditList,
  MapForSelectingPlace: MapForSelectingPlace,
  AddShop: AddShopScreen,
  AddPrice: AddPrice,
  AnalizeScreen: AnalizeScreen,
},
{
  defaultNavigationOptions: {
    title: "BCSkaner",
    headerStyle: {
      backgroundColor: '#313039',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
      fontSize: 25,
      left: Dimensions.get('window').width / 2 - 66,
    },
  },
  initialRouteName: 'Home',
  transitionConfig: () => fromBottom(500),
});

export default createAppContainer(
  createSwitchNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Main: MainNavigator,
  },
  {
    initialRouteName: 'Main',
    transitionConfig: () => fromRight(1000),
  })
);
