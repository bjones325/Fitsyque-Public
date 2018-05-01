import { AsyncStorage } from 'react-native';

export default class Network {

    static noAuthCall(url, onSuccess, onFailure, onError, onFinish, body) {
        return fetch(url, {
            method: "post",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: body
        })
            .then((response) =>
                response.json())
            .then((responseJson) => {
                onFinish();
                if (responseJson.success) {
                    onSuccess(responseJson);
                } else {
                    onFailure(responseJson);
                }
            })
            .catch((error) => {
                console.log(error);
                onError();
            });
    }

    static authCall(url, type, specialHeaders, body, onSuccess, onFailure, onError, onFinish) {
        AsyncStorage.getItem('@app:session').then((token) => {
            return fetch(url, {
                method: type,
                headers: Object.assign({
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token,
                    }, specialHeaders),
                body: body
            })
        })
        .then((response) =>
            response.json())
        .then((responseJson) => {
            onFinish();
            if (responseJson.success) {
                onSuccess(responseJson);
            } else {
                onFailure(responseJson);
            }
        })
        .catch((error) => {
            console.log(error);
            onError();
        });
    }
}