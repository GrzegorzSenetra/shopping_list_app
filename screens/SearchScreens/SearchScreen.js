import React from 'react';
import { connect } from 'react-redux';
import { onScannedBarcode } from '../../store/actions/actions';
import { View, ScrollView, Text, StyleSheet, Image, TouchableOpacity, Modal } from 'react-native';
import { SearchBar } from 'react-native-elements';
import Layout from '../../constants/Layout';
import { Ionicons } from '@expo/vector-icons';
import Host from '../../constants/Host';
import { Button } from 'react-native-paper';
import { CheckBox } from 'react-native-elements';

import LoadingScreen from '../ScanScreens/LoadingScreen';

import ListServices from '../../services/ListServices';
import { getAllShops, selectShopForList } from '../../store/actions/actions';

class SearchScreen extends React.Component {
    state = {
        search: '',
        fetchedData: [],
        Checkbox: false,
        tekst: '',
        isDataLoaded: true
    };

// searcher
    componentWillMount() {
        // This function will be buffered for 300ms
      this.fetchData = createBuffered((query) => {
        // You should make your fetch request here.
        let url = `${Host.server_host}/wyszukiwarka/?Nazwa=${query}&Sklep=`;
        if(this.props.selectedShop.id){
            url = `${Host.server_host}/wyszukiwarka/?Nazwa=${query}&Sklep=${this.props.selectedShop.id}`;
            console.log(url);
        }else{
            url = `${Host.server_host}/wyszukiwarka/?Nazwa=${query}&Sklep=`;
            console.log(url);
        }
        fetch(url,{
            method: 'GET',
            headers: new Headers({
              'Accept': "application/json",
              'Content-Type': 'application/json'
            }), 
          })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log("pppppppppppppppppppppppppppppppppppppppppppppppppp");
                console.log(responseJson);
                if (query.length == 0){
                    this.setState({
                        fetchedData: []
                    });
                }else{
                    this.setState({
                        fetchedData: responseJson,
                    });
                }
                
            })
            .catch((error) => {
              console.error(error);
            });
        
      }, 300);
    }

    load(query) {
        // This will be called constantly but nothing will happen until
        // 300ms without activity on the input field
        this.fetchData(query);
    }

    updateSearch = search => {
        this.setState({ search });
        this.load(search);
    };

    _onPressButton = index => {
        console.log(this.state.fetchedData[index].GTIN);
        let location = this.props.locationResult;
        let latitude = 0;
        let longitude = 0;
        this.setState({
            tekst: 'Pobieranie danych produktu',
            isDataLoaded: false
        });
        if (typeof location !== "undefined") {
            latitude = location.coords.latitude;
            longitude = location.coords.longitude;
        }
        fetch(`${Host.server_host}/produkt?GTIN=${this.state.fetchedData[index].GTIN}&latitude=${latitude}&longitude=${longitude}`,{
            method: 'GET',
            headers: new Headers({
              'Accept': "application/json",
              'Content-Type': 'application/json'
            }), 
          })
            .then((response) => response.json())
            .then((responseJson) => {
                const { navigate } = this.props.navigation;
                this.setState({
                    isDataLoaded: true
                });
                if (!responseJson[0][0]) {
                    console.log("there is no response");
                    navigate('AddNewProductScreen');
                } else {
                    this.props.handleOnScannedBarcode(responseJson);
                    console.log("--------------------------");
                    console.log(this.props.product[0][0].ProductName);
                    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
                    console.log(responseJson);
                    navigate('ProductData');
                }
            })
            .catch((error) => {
              console.error(error);
            });
    }




// shop selector

    boxChecked = () => {
        this.setState({ Checkbox: !this.state.Checkbox });
        
        //this.waitForElement();
        if(!this.state.Checkbox){
            this.fetchShops();
        }else{
            this.cleanSelectedShop();
        }
    }

    waitForElement(){
        if(typeof this.props.locationResult !== "undefined" && this.props.locationResult != null && typeof this.props.locationResult !== undefined && typeof this.props.navigation !== "undefined"){
            //variable exists, do what you want
            const { navigate } = this.props.navigation;
            console.log(this.props.locationResult);
            navigate('MapForShopChecking');
        }
        else{
            setTimeout(this.waitForElement, 500);
        }
    }

    fetchShops = () => {
        ListServices._getAllShops()
            .then((response) => response.json())
            .then((responseJson) => {
                this.props.onGetAllShops(responseJson);
            })
            .then(() => this.waitForElement())
    }
    cleanSelectedShop = () => {
        let shop = Object();
        this.props.handleSelectShopForList(shop);
    }





    
    render() {
        const { search } = this.state;
        let jsxList = (
            <Text style={{alignSelf: 'flex-start', fontFamily: 'rajdhani-medium', top:70, fontSize: 17,color: 'white',}}>Brak produktów</Text>
        );
        if(this.state.fetchedData){
            jsxList = this.state.fetchedData.map((product,i) => {
                if(product.Cena){
                    return(
                        <TouchableOpacity key={i} style={styles.listItem} onPress={() => this._onPressButton(i)}>
                            <Image
                                style={styles.image}
                                source={{ uri: product.ProductImage }}
                            />
                            <View style={{width: Layout.window.width - 210, left: 10}}>
                                <Text style={{ alignSelf: 'flex-start', fontFamily: 'rajdhani-medium', top: 20, fontSize: 17, color: 'white', }}>
                                    {product.ProductName}
                                </Text>
                                <Text style={{top:20,color:"green", fontFamily:'space-mono', fontSize:18}}>{product.Cena.toFixed(2)} zł</Text>
                            </View>
                            <View style={{position: "relative", marginLeft:"auto", top: 30, right: -10}}>
                                <Text></Text>
                            </View>
                        </TouchableOpacity>
                    );
                }else{
                    return(
                        <TouchableOpacity key={i} style={styles.listItem} onPress={() => this._onPressButton(i)}>
                            <Image
                                style={styles.image}
                                source={{ uri: product.ProductImage }}
                            />
                            <View style={{width: Layout.window.width - 120, left: 10}}>
                                <Text style={{ alignSelf: 'flex-start', fontFamily: 'rajdhani-medium', top: 20, fontSize: 17, color: 'white', }}>
                                    {product.ProductName}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                }
            });
        }
        return (
            <View style={styles.container}>
                {this.state.isDataLoaded ? <Text style={{ position: "absolute", height: 0, width: 0 }}></Text> :
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
                {this.props.selectedShop.ShopName ?
                <View style={{top: 43, justifyContent: "center", width: Layout.window.width, backgroundColor: "black", flexDirection: "row"}}>
                     <Text style={{color: "white", fontFamily: "space-mono"}}>Wybrany sklep: </Text>
                     <Text style={{color: "#08fdd8", fontFamily: "space-mono"}}>{this.props.selectedShop.ShopName}</Text>
                </View> : <Text></Text>
                }
                <View style={styles.searchBar}>
                    <SearchBar
                        placeholder="Napisz nazwę produktu..."
                        onChangeText={this.updateSearch}
                        value={search}
                        searchIcon={(<Ionicons
                            name={"md-search"}
                            size={26}
                            color={"aqua"}
                          />)}
                    />
                </View>
                <View style={{flex:1}}>
                    <ScrollView style={styles.listView}>
                        {jsxList}
                    </ScrollView>
                </View>
                
            </View>
        );
    };
}

function createBuffered(callback, buffer) {
    var timerId;
  
    return function(...params) {
      if (timerId) {
        clearTimeout(timerId);
      }
  
      timerId = setTimeout(function(){
        callback.apply(this, params);
      }, buffer);
    };
  }




SearchScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
        backgroundColor: '#313039',
    },
    searchBar: {
        position: 'absolute',
        width: Layout.window.width,
        top: 0
    },
    listView: {
        marginTop: 45,
        //backgroundColor: "red",
        width: Layout.window.width,
    },
    listItem: {
        //backgroundColor: "green",
        width: Layout.window.width,
        padding: 15,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: "grey",
    },
    image: {
        width: 100,
        height: 100,
    },
});

const mapStateToProps = state => {
    return {
      product: state.product,
      locationResult: state.locationResult,
      selectedShop: state.selectedShop
    };
  };
  
  const mapDispatchToProps = dispatch => {
    return {
      handleOnScannedBarcode: (responseJson) => dispatch(onScannedBarcode(responseJson)),
      onGetAllShops: (shops) => dispatch(getAllShops(shops)),
      handleSelectShopForList: (shop) => dispatch(selectShopForList(shop)),
    };
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen);