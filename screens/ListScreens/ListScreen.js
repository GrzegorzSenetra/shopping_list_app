import React from 'react';
import { ScrollView, Text, View, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import ListServices from '../../services/ListServices';
import { getUserLists, getProductsInList, getAnalize } from '../../store/actions/actions';

import UserLists from '../../components/shoppingList/UserLists';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Updates } from 'expo';
import { CheckBox } from 'react-native-elements';
import LoadingScreen from '../ScanScreens/LoadingScreen';

class ListScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      userLists: [],
      uLids: [],
      isDataLoaded: true,
      tekst: ''
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
    this.setState({
      tekst: 'Szukam produktów w tej liście',
      isDataLoaded: false
    });
    ListServices._getProductsInList(data)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("************************************************");
        console.log(responseJson);
        this.props.handleGetProductsInList(responseJson);
      })
      .then(() => this.setState({
        isDataLoaded: true
      }))
      .then(() => this.navigateToProductsInList())
  }

  navigateToProductsInList = () => {
    const {navigate} = this.props.navigation;
    navigate('ProductsInList');
  }

  navigateToAddNewList = () => {
    const {navigate} = this.props.navigation;
    navigate('AddNewList');
  }

  navigateToEditList = () => {
    const {navigate} = this.props.navigation;
    navigate('EditList', { id: this.state.uLids[0] });
  }

  navigateToAnalize = () => {
    let id = this.state.uLids[0];
    this.setState({
      tekst: 'Trwa analiza cen',
      isDataLoaded: false
    });
    ListServices._getAnalize(id)
      .then((response) => response.json())
      .then((responseJson) => {
        this.props.handleGetAnalize(responseJson);
        console.log(this.props.analize);
      })
      .then(() => this.setState({ isDataLoaded: true }))
      .then(() => this.props.navigation.navigate("AnalizeScreen"))
      .catch((error) => {
        console.error(error);
      });
    
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

  deleteSelectedLists = () => {
    this.setState({
      tekst: 'Trwa usuwanie list',
      isDataLoaded: false
    });
    this.state.uLids.map((item,index)=>{
      ListServices._deleteSelectedLists(item)
      .then((response)=> {
        if(response.ok) {
          console.log("Sukces!");
          
        }
      })
      .then(()=>{
        this.setState({userLists: [false]});
        console.log(this.state.userLists);
        this.setSelectedIds();
      })
        .then(() => {
          if(this.state.uLids.length == 0){
            ListServices._getUserLists(this.props.appInstanceUser.id)
            .then((response) => response.json())
            .then((responseJson) => {
              this.props.handleGetUserLists(responseJson);
            })
            .then(() => this.setState({
              isDataLoaded: true
            }))
            .catch((error) => {
              console.error(error);
            });
          }

        })
      .catch((error) => {
        console.error(error);
      });
    });
    
    
  }
  

  render(){
    let userList = () => (<Text>Brak list</Text>);
    let tab = [];
    if(this.props.userLists && typeof this.props.userLists !== "undefined") {
      userList = this.props.userLists.map((item,index) => {
        tab = this.state.userLists;
        
        return (
          <View key={index} style={{flexDirection: 'row'}}>
            
            <TouchableOpacity onPress={() => { this.fetchList(item.id); }} 
              onLongPress={() => {
                tab[index] = !tab[index];
                this.setState({ userLists: tab });
                console.log(this.state.userLists);
                this.setSelectedIds();
               }}>
              <UserLists item={item} style={{color: 'white'}} />
            </TouchableOpacity>
            <View style={{position:"relative",right:50,top:6}}>
              <CheckBox
                containerStyle={{backgroundColor: "#313039", borderWidth: 0}}
                style={{width:30, height: 30 }}
                title={<Text></Text>}
                checked={this.state.userLists[index]}
                onPress={() => {
                  tab[index] = !tab[index];
                  this.setState({userLists: tab});
                  this.setSelectedIds();
                }}
              />
            </View>

          </View>
        );
      })
    }
    let checked = 0;
    this.state.uLids.forEach(element => {
      if(element){
        checked++;
      }
    });
    
    return (
      <View style={styles.container}>
        {this.state.isDataLoaded ? <Text style={{position: "absolute", height: 0, width: 0}}></Text> :
          <View style={{ backgroundColor: '#313039', }}>
            <Modal
              animationType="fade"
              transparent={true}
              visible={!this.state.isDataLoaded}
              onRequestClose={() => {
                alert('Modal has been closed.');
              }}>
              <View style={{ backgroundColor: '#313039' }}>
                <LoadingScreen tekst={this.state.tekst} />
              </View>
            </Modal>
          </View>
        }
        <ScrollView>
          {userList}
        </ScrollView>
        
        {checked !== 0 ? checked == 1 ?
          <View style={{ position: "absolute", right: 20, bottom: 20, flexDirection: 'row', }}>
            <TouchableOpacity
              style={{ ...styles.addButton, backgroundColor: "red", marginRight: 10 }}
              onPress={() => {this.deleteSelectedLists();tab=[]}}
              underlayColor='#fff'>
              <Ionicons
                name="md-trash"
                size={40}
                color="white"
                style={{ marginLeft: 7 }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ ...styles.addButton, backgroundColor: "blue", marginRight: 10 }}
              onPress={() => this.navigateToEditList()}
              underlayColor='#fff'>
              <Ionicons
                name="md-create"
                size={40}
                color="white"
                style={{ marginLeft: 7 }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ ...styles.addButton, backgroundColor: "#212029" }}
              onPress={() => this.navigateToAnalize()}
              underlayColor='#fff'>
              <Ionicons
                name="md-analytics"
                size={40}
                color="#08fdd8"
                style={{ marginLeft: 3 }}
              />
            </TouchableOpacity>
          </View> : 
          <View style={{ position: "absolute", right: 20, bottom: 20, flexDirection: 'row', }}>
              <TouchableOpacity
              style={{ ...styles.addButton, backgroundColor: "red" }}
              onPress={() => {this.deleteSelectedLists();tab=[]}}
              underlayColor='#fff'>
              <Ionicons
                name="md-trash"
                size={40}
                color="white"
                style={{ marginLeft: 7 }}
              />
            </TouchableOpacity>
          </View> :
          <View style={{ position: "absolute", right: 20, bottom: 20 }}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => this.navigateToAddNewList()}
              underlayColor='#fff'>
              <Ionicons
                name="md-add"
                size={40}
                color="white"
                style={{ marginLeft: 7 }}
              />
            </TouchableOpacity>
          </View>
        }
      </View>

    );
  };
}

ListScreen.navigationOptions = {
  header: null,
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
    handleGetAnalize: (responseJson) => dispatch(getAnalize(responseJson))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListScreen);