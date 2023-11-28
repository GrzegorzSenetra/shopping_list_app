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
    GET_ANALIZE} from './actionTypes';

export const startScan = () => {
    return {
        type: START_SCAN,
    };
}

export const stopScan = () => {
    return {
        type: STOP_SCAN,
    };
}

export const onScannedBarcode = (product) => {
    return {
        type: ON_SCANNED_BARCODE,
        product: product
    };
}

export const getLocationPermission = () => {
    return {
        type: GET_LOCATION_PERMISSION,
    }
}

export const setLocation = (location) => {
    return {
        type: SET_LOCATION,
        location: location
    }
}

export const addAppInstanceUserInfo = (appInstanceUser) => {
    return {
        type: ADD_APP_INSTANCE_USER_INFO,
        appInstanceUser: appInstanceUser
    }
}

export const getUserLists = (userLists) => {
    return {
        type: GET_USER_LISTS,
        userLists: userLists
    }
}

export const getProductsInList = (productsInList) => {
    return {
        type: GET_PRODUCTS_IN_LIST,
        productsInList: productsInList
    }
}

export const getAllShops = (allShops) => {
    return {
        type: GET_ALL_SHOPS,
        allShops: allShops
    }
}

export const selectShopForList = (selectedShop) => {
    return {
        type: SELECT_SHOP_FOR_LIST,
        selectedShop: selectedShop
    }
}

export const selectShopForProduct = (shopForProduct) => {
    return {
        type: SELECT_SHOP_FOR_PRODUCT,
        shopForProduct: shopForProduct
    }
}

export const selectNotification = (notification) => {
    return {
        type: SELECT_NOTIFICATION,
        notification: notification
    }
}

export const selectShopForScan = (shop) => {
    return {
        type: SELECT_SHOP_FOR_SCAN,
        shopForProduct: shop
    }
}

export const trybChange = (tryb) => {
    return {
        type: TRYB_CHANGER,
        tryb: tryb
    }
}

export const newListChange = (isNewListRequired) => {
    return {
        type: NEW_LIST_CHANGER,
        isNewListRequired: isNewListRequired
    }
}

export const selectList = (list) => {
    return {
        type: SELECT_LIST,
        list: list
    }
}

export const getAnalize = (analize) => {
    return {
        type: GET_ANALIZE,
        analize: analize
    }
}