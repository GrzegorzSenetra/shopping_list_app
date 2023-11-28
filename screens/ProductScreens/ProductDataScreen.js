import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationActions } from 'react-navigation';

import { connect } from 'react-redux';

import Item from '../../components/product/Item';

import { selectShopForProduct, selectNotification } from '../../store/actions/actions';

class ProductDataScreen extends React.Component {
  constructor(props){
    super(props);
  }
  navigateToMaps = (id) => {
    let sklep = Object();
    sklep = id;
    this.props.handleSelectedShop(sklep);
    this.props.navigation.navigate("Map", sklep);
    console.log(sklep);
  }
  navigateToNotification = (obj) => {
    this.props.handleSelectNotification(obj);
    this.props.navigation.navigate("Notification");
  }
  render() {
    return (
      <View style={styles.container}>
        <Item 
          product={this.props.product} 
          modalHandler={() => this.setModalVisible(!this.state.modalVisible)} 
          navigateToMaps={(id) => this.navigateToMaps(id)}
          navigateToNotification={(obj) => this.navigateToNotification(obj)} />
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#313039',
  },
});

const mapStateToProps = state => {
    return {
      product: state.product
    };
  };

  ProductDataScreen.navigationOptions = {
    header: null
  };
  
  const mapDispatchToProps = dispatch => {
    return {
      handleSelectedShop: (responseJson) => dispatch(selectShopForProduct(responseJson)),
      handleSelectNotification: (responseJson) => dispatch(selectNotification(responseJson))
    };
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(ProductDataScreen);