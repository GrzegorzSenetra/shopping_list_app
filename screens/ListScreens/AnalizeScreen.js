import React from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import ListServices from '../../services/ListServices';
import { getUserLists, getProductsInList } from '../../store/actions/actions';

import UserLists from '../../components/shoppingList/UserLists';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Updates } from 'expo';
import { CheckBox } from 'react-native-elements';
import Layout from '../../constants/Layout';


class AnalizeScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      userLists: [],
      uLids: []
    }
  }
  componentWillMount(){
    // ListServices._getUserLists(this.props.appInstanceUser.id)
    //   .then((response) => response.json())
    //   .then((responseJson) => {
    //     console.log(responseJson);
    //     // this.setState({
    //     //   userLists: responseJson
    //     // });
    //     this.props.handleGetUserLists(responseJson);
    //   });
    // let tmp = [];
    // for(let i=0;i< this.props.userLists.length;i++){
    //   tmp[i] = false;
    // }
    // this.setState({ userLists: tmp });
  }

  fetchList = (data) => {
    this.props.handleGetProductsInList(data);
    this.navigateToProductsInList();
  }

  navigateToProductsInList = () => {
    const {navigate} = this.props.navigation;
    navigate('ProductsInList');
  }

  setSelectedIds = () => {
    let lists = this.props.userLists;
    let checked = this.state.userLists;

    let endTab = [];
    let i = 0
    lists.map((item,index)=>{
      if(checked[index] && typeof checked[index] !== undefined){
        endTab[i] = item.id;
        i++;
      }
    })
    //console.log(endTab);
    this.setState({ uLids: endTab });
    console.log(this.state.uLids);
  }
  

    render() {
        let userList = () => (<Text>Brak list</Text>);
        let tab = [];
        if(this.props.userLists && typeof this.props.userLists !== "undefined") {
        userList = this.props.analize.map((item, index) => {
            tab = this.state.userLists;
            colors = [255 - item.Taniosc, item.Taniosc];
            let bgc = '#313039';
            if(colors[1] == 255){
              bgc = 'green';
            }
            return (
                <View key={index} style={{ flexDirection: 'row', borderLeftWidth: 10, borderLeftColor: `rgb(${colors[0]}, ${colors[1]}, 0)`, backgroundColor: bgc}}>

                    <TouchableOpacity onPress={() => { this.fetchList(item.produkty); }}
                        onLongPress={() => {
                            tab[index] = !tab[index];
                            this.setState({ userLists: tab });
                            console.log(this.state.userLists);
                            this.setSelectedIds();
                        }}>
                        <UserLists item={item} />
                    </TouchableOpacity>
                    {/* <View style={{ position: "relative", right: 50, top: 6 }}>
                        <CheckBox
                            containerStyle={{ backgroundColor: "white", borderWidth: 0 }}
                            style={{ width: 30, height: 30 }}
                            title={<Text></Text>}
                            checked={this.state.userLists[index]}
                            onPress={() => {
                                tab[index] = !tab[index];
                                this.setState({ userLists: tab });
                                this.setSelectedIds();
                            }}
                        />
                    </View> */}
                </View>
            );
        })
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
          {userList}
        </ScrollView>
      </View>

    );
  };
}

AnalizeScreen.navigationOptions = {
    headerTitle: () => (<Text style={{color: "white", fontSize: 20}}>Wynik analizy cen</Text>),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#313039',
    color: "#feffff",
  },
  addButton: {
    backgroundColor: 'green',
    padding: 10,
    width: 60,
    height: 60,
    borderRadius: 30
  }
});


const mapStateToProps = state => {
  return {
    appInstanceUser: state.appInstanceUser,
    userLists: state.userLists,
    productsInList: state.productsInList,
    analize: state.analize
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handleGetUserLists: (responseJson) => dispatch(getUserLists(responseJson)),
    handleGetProductsInList: (responseJson) => dispatch(getProductsInList(responseJson)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AnalizeScreen);