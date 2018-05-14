import { AsyncStorage } from 'react-native';

export default class NetworkCall {

    set url(newURL) {
        this._url = newURL
    }

    set type(newType) {
        this._type = newType
    }

    set extraHeaders(newHeader) {
        this._extraHeaders = newHeader
    }

    set body(newBody) {
        this._body = newBody
    }

    set onSuccess(func) {
        this._onSuccess = func
    }

    set onFailure(func) {
        this._onFailure = func
    }

    set onError(func) {
        this._onError = func
    }

    set onFinish(func) {
        this._onFinish = func
    }

    execute(auth) {
        if (auth) return this._authCall();

        return fetch(this._url, {
            method: "post",
            headers: Object.assign({
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }, this._extraHeaders),
            body: this._body
        })
        .then((response) => 
            response.json())
        .then((responseJson) => {
            if (responseJson.success && this._onSuccess) {
                this._onSuccess(responseJson);
            } else if (this._onFailure) {
                this._onFailure(responseJson);
            }
            if (this._onFinish) this._onFinish();
        })
        .catch((error) => {
            console.log(error);
            if (this._onError) this._onError();
        });
    }

    _authCall() {
        AsyncStorage.getItem('@app:session').then((token) => {
            var message = {
                method: this._type,
                headers: Object.assign({
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                }, this._extraHeaders)}
            message = this._body ? Object.assign(message, {body: this._body}) : message
            return fetch(this._url, message)
        })
        .then((response) =>
            response.json())
        .then((responseJson) => {
            if (responseJson.success && this._onSuccess) {
                this._onSuccess(responseJson);
            } else if (this._onFailure) {
                this._onFailure(responseJson);
            }
            if (this._onFinish) this._onFinish();
        })
        .catch((error) => {
            console.log(error);
            if (this._onError) this._onError();
        });
    }
}