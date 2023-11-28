import Host from '../constants/Host';

const _getUserLists = async (data) => {
    try {
        const response = await fetch(`${Host.server_host}/wyswietl_listy?id=${data}`, {
            method: 'GET',
            headers: new Headers({
                'Accept': "application/json",
                'Content-Type': 'application/json'
            }),
        });
        //const responseJson = await response.json();
        return new Promise((resolve,reject) => {
            if(response.ok) {
                resolve(response);
            } else {
                reject(new Error("Błędne dane"));
            }
        });
    }
    catch (error) {
        console.error(error);
    }
}

const _getProductsInList = async (data) => {
    try {
        const response = await fetch(`${Host.server_host}/wyswietl_produkty_w_liscie?idListy=${data}`, {
            method: 'GET',
            headers: new Headers({
                'Accept': "application/json",
                'Content-Type': 'application/json'
            }),
        });
        return new Promise((resolve,reject) => {
            if(response.ok) {
                resolve(response);
            } else {
                reject(new Error("Błędne dane"));
            }
        });
    }
    catch (error) {
        console.error(error);
    }
}

const _getAllShops = async () => {
    try {
        const response = await fetch(`${Host.server_host}/sklepy`, {
            method: 'GET',
            headers: new Headers({
                'Accept': "application/json",
                'Content-Type': 'application/json'
            }),
        });
        return new Promise((resolve,reject) => {
            if(response.ok) {
                resolve(response);
            } else {
                reject(new Error("Błędne dane"));
            }
        });
    }
    catch (error) {
        console.error(error);
    }
}

const _getSelectedShop = async (data) => {
    try {
        const response = await fetch(`${Host.server_host}/wybierz_sklep?id=${data}`, {
            method: 'GET',
            headers: new Headers({
                'Accept': "application/json",
                'Content-Type': 'application/json'
            }),
        });
        return new Promise((resolve,reject) => {
            if(response.ok) {
                resolve(response);
            } else {
                reject(new Error("Błędne dane"));
            }
        });
    }
    catch (error) {
        console.error(error);
    }
}

const _deleteSelectedLists = async (data) => {
    try {
        const response = await fetch(`${Host.server_host}/dodaj_liste/${data}`, {
            method: 'DELETE',
        });
        return new Promise((resolve,reject) => {
            if(response.ok) {
                resolve(response);
            } else {
                reject(new Error("Błędne dane"));
            }
        });
    }
    catch (error) {
        console.error(error);
    }
}

const _addProductToList = async (data) => {
    try {
        const response = await fetch(`${Host.server_host}/wyswietl_produkty_w_liscie/`, {
            method: 'POST',
            headers: new Headers({
                'Accept': "application/json",
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(data)
        });
        return new Promise((resolve,reject) => {
            if(response.ok) {
                resolve(response);
            } else {
                reject(new Error("Błędne dane"));
            }
        });
    }
    catch (error) {
        console.error(error);
    }
}

const _deleteSelectedProductFromList = async (data) => {
    try {
        const response = await fetch(`${Host.server_host}/wyswietl_produkty_w_liscie/${data}`, {
            method: 'DELETE',
        });
        return new Promise((resolve,reject) => {
            if(response.ok) {
                resolve(response);
            } else {
                reject(new Error("Błędne dane"));
            }
        });
    }
    catch (error) {
        console.error(error);
    }
}


const _addProduct = async (data) => {
    try {
        const response = await fetch(`${Host.server_host}/dodaj_produkt/`, {
            method: 'POST',
            headers: new Headers({
                'Accept': "application/json",
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(data)
        });
        return new Promise((resolve,reject) => {
            if(response.ok) {
                resolve(response);
            } else {
                reject(new Error("Błędne dane"));
            }
        });
    }
    catch (error) {
        console.error(error);
    }
}

const _addPriceToProduct = async (data) => {
    try {
        const response = await fetch(`${Host.server_host}/dodaj_cene_produktu_w_sklepie/`, {
            method: 'POST',
            headers: new Headers({
                'Accept': "application/json",
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(data)
        });
        return new Promise((resolve,reject) => {
            if(response.ok) {
                resolve(response);
            } else {
                reject(new Error("Błędne dane"));
            }
        });
    }
    catch (error) {
        console.error(error);
    }
}

const _addNotification = async (data) => {
    try {
        const response = await fetch(`${Host.server_host}/dodaj_zgloszenie/`, {
            method: 'POST',
            headers: new Headers({
                'Accept': "application/json",
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(data)
        });
        return new Promise((resolve,reject) => {
            if(response.ok) {
                resolve(response);
            } else {
                reject(new Error("Błędne dane"));
            }
        });
    }
    catch (error) {
        console.error(error);
    }
}

const _getUser = async (data) => {
    try {
        const response = await fetch(`${Host.server_host}/znajdz_uzytkownika/${data}`, {
            method: 'GET',
            headers: new Headers({
                'Accept': "application/json",
                'Content-Type': 'application/json'
            }),
        });
        return new Promise((resolve,reject) => {
            if(response.ok) {
                resolve(response);
            } else {
                reject(new Error("Błędne dane"));
            }
        });
    }
    catch (error) {
        console.error(error);
    }
}

const _postShop = async (data) => {
    try {
        const response = await fetch(`${Host.server_host}/wybierz_sklep/`, {
            method: 'POST',
            headers: new Headers({
                'Accept': "application/json",
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(data)
        });
        return new Promise((resolve,reject) => {
            if(response.ok) {
                resolve(response);
            } else {
                reject(new Error("Błędne dane"));
            }
        });
    }
    catch (error) {
        console.error(error);
    }
}

const _getAnalize = async (data) => {
    try {
        const response = await fetch(`${Host.server_host}/analizuj_cene/${data}`, {
            method: 'GET',
            headers: new Headers({
                'Accept': "application/json",
                'Content-Type': 'application/json'
            }),
        });
        return new Promise((resolve,reject) => {
            if(response.ok) {
                resolve(response);
            } else {
                reject(new Error("Błędne dane"));
            }
        });
    }
    catch (error) {
        console.error(error);
    }
}


export default ListServices = {
    _getUserLists, 
    _getProductsInList, 
    _getAllShops, 
    _getSelectedShop, 
    _deleteSelectedLists, 
    _addProductToList, 
    _deleteSelectedProductFromList, 
    _addProduct, 
    _addPriceToProduct,
    _addNotification,
    _getUser,
    _postShop,
    _getAnalize
};