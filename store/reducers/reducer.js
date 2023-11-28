import { 
    START_SCAN, 
    STOP_SCAN, 
    ON_SCANNED_BARCODE, 
    GET_LOCATION_PERMISSION, 
    SET_LOCATION, 
    ADD_APP_INSTANCE_USER_INFO, 
    GET_USER_LISTS, 
    GET_PRODUCTS_IN_LIST, 
    GET_ALL_SHOPS, 
    SELECT_SHOP_FOR_LIST, 
    SELECT_SHOP_FOR_PRODUCT, 
    SELECT_SHOP_FOR_SCAN,
    SELECT_NOTIFICATION,
    TRYB_CHANGER,
    NEW_LIST_CHANGER,
    SELECT_LIST,
    GET_ANALIZE} from '../actions/actionTypes';

const initialState = {
    isScanOpen: false,
    product: [],
    hasLocationPermissions: false,
    locationResult: null,
    appInstanceUser: Object(),
    userLists: [],
    productsInList: [],
    allShops: [],
    selectedShop: Object(),
    shopForProduct: {
        "Cena": 0,
        "Sklep": "",
        "SklepId": 0,
        "latlng": {
            "Lat": "0",
            "Lon": "0"
        },
    },
    selectedNotification: Object(),
    selectedShopForScan: Object(),
    tryb: false,
    isNewListRequired: true,
    selectedList: Object(),
    analize: []
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case START_SCAN:
            return {
                ...state,
                isScanOpen: true
            };
        case STOP_SCAN:
            return {
                ...state,
                isScanOpen: false
            };
        case ON_SCANNED_BARCODE:
            return {
                ...state,
                product: action.product
            };
        case GET_LOCATION_PERMISSION:
            return {
                ...state,
                hasLocationPermissions: true
            }
        case SET_LOCATION:
            return {
                ...state,
                locationResult: action.location
            }
        case ADD_APP_INSTANCE_USER_INFO:
            return {
                ...state,
                appInstanceUser: action.appInstanceUser
            }
        case GET_USER_LISTS:
            return {
                ...state,
                userLists: action.userLists
            }
        case GET_PRODUCTS_IN_LIST:
            return {
                ...state,
                productsInList: action.productsInList
            }
        case GET_ALL_SHOPS:
            return {
                ...state,
                allShops: action.allShops
            }
        case SELECT_SHOP_FOR_LIST:
            return {
                ...state,
                selectedShop: action.selectedShop
            }
        case SELECT_SHOP_FOR_PRODUCT:
            return {
                ...state,
                shopForProduct: action.shopForProduct
            }
        case SELECT_NOTIFICATION:
            return {
                ...state,
                selectedNotification: action.notification
            }
        case SELECT_SHOP_FOR_PRODUCT:
            return {
                ...state,
                selectedShopForScan: action.shop
            }
        case TRYB_CHANGER:
            return {
                ...state,
                tryb: action.tryb
            }
        case NEW_LIST_CHANGER:
            return {
                ...state,
                isNewListRequired: action.isNewListRequired
            }
        case SELECT_LIST:
            return {
                ...state,
                selectedList: action.list
            }
        case GET_ANALIZE:
            return {
                ...state,
                analize: action.analize
            }
        default:
            return state;
    }
};

export default reducer;