import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import Layout from '../../constants/Layout';
import { NavigationEvents } from 'react-navigation';

class LoadingScreen extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        return (
            <View style={{ flex: 1, backgroundColor: '#313039', flexDirection: 'column', alignItems: 'center', top: Layout.window.height / 2 - 100 }}>
                <Text style={{ color: "white", fontSize: 25, fontFamily: "space-mono", textAlign: "center" }}>{this.props.tekst}</Text>
                <ActivityIndicator size="large" color="#08fdd8" style={{marginTop:20}} />
            </View>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        
    },
});

LoadingScreen.navigationOptions = {
    header: null,
};

export default LoadingScreen;