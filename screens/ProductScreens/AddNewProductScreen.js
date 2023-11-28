import React from 'react';
import { View,Text, StyleSheet } from 'react-native';

import ImageForm from '../../components/ImageForm';

export default class AddNewProductScreen extends React.Component {

  componentDidMount = () => {
    alert("Niestety w bazie danych nie znaleziono produktu o tym kodzie kreskowym. Wesprzyj projekt i dodaj produkt do bazy,poprzez wypełnienie formularza i kliknięcie przycisku zatwierdź.Dodanie błędnych danych skutkować będzie zablokowaniem możliwości dodawania produktów.");
  }

  render(){
    return (
      <View style={styles.container}>
        <ImageForm barCode={this.props.navigation.state.params.barCode} navig={this.props.navigation} />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#313039',
    color: "#feffff",
  },
  tekst: {
    color: "white",
    fontFamily: "space-mono",
    textAlign: "center"
  }
});
