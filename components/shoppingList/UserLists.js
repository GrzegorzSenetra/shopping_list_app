import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Layout from '../../constants/Layout';
import ListServices from '../../services/ListServices';
import { connect } from 'react-redux';
import { getProductsInList } from '../../store/actions/actions';


class UserLists extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <View key={this.props.index} style={styles.listItem}>
                <Text style={styles.listItemText}>{this.props.item.Nazwa}</Text>
                <Text style={styles.listItemPrice}>{this.props.item.Cena.toFixed(2)} zł</Text>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    listItem: {
        //backgroundColor: "green",
        width: Layout.window.width,
        padding: 20,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
    },
    listItemText: {
        fontSize: 18,
        fontFamily: 'space-mono',
        width: 160,
        color: 'white'
    },
    listItemPrice: {
        fontSize: 18,
        fontFamily: 'space-mono',
        marginLeft: 'auto',
        color: 'red',
        right: 30
    },
});

const mapStateToProps = state => {
    return {
    };
  };
  
  const mapDispatchToProps = dispatch => {
    return {
      handleGetProductsInList: (responseJson) => dispatch(getProductsInList(responseJson)),
    };
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(UserLists);