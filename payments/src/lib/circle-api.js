import  axios  from 'axios';
import * as openpgp from './openpgp';
//import {OpenPGP as openpgp} from "react-native-fast-openpgp";

import publicIP from 'react-native-public-ip';

 class CircleApi {
    constructor(){
                       
        this.baseUrl = 'https://api-sandbox.circle.com/v1/'; 
        this.mApiKey = 'QVBJX0tFWTo1NzBhMWI5YTM0NzRiNTc1MmQ5NGU5MzgwN2U5ZjJlNzo5MjA0NTA1ZTRiYWJiMzQxMGJlMmY0MGI5NmJmMDNmNw==';
        //this.mApiKey = 'QVBJX0tFWTpkY2U4M2QzYzk0YmZiYzI5MGFjY2VkNjM5ZjFkMTU1ODo1ZDliNzI0MzY3OWFjNTM3MjIxNjhkZDE5ODI3Y2NhMA=='

        this.options = {
            headers: {
                authorization: 'Bearer ' + this.mApiKey
            },
        };

        Object.assign(this, {
            getPCIPublicKey() {        
                return axios.get(this.baseUrl + 'encryption/public', this.options)
                .then(response => {
                    return response.data;
                }).catch(error => {
                    console.log(error)
                })
            }
        });

        Object.assign(this, {
            uuidv4() {        
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            }
        });
    }  
      
    createWallet (description) {
        var payload = {
            'idempotencyKey': this.uuidv4(),
            'description': description
        };

        return axios.post(this.baseUrl + 'wallets', payload , this.options)
        .then(response => {
            return response.data
        }).catch(error => {
            console.log(error)
        })
    }

    createWalletAddresss (walletId) {
        var payload = {
            'idempotencyKey': this.uuidv4(),
            'currency': 'USD',
            'chain': 'ETH'
        };

        return axios.post(this.baseUrl + 'wallets/' + walletId + '/addresses', payload , this.options)
        .then(response => {
            return response.data
        }).catch(error => {
            console.log(error)
        })
    }

    createWalletTransfer (walletId) {
        var payload = {
            'idempotencyKey': this.uuidv4(),
            'source': {
                'type': 'wallet',
                'id': walletId,
            },
            'destination': {
                "type": "blockchain", 
                "address": "0x4750b9eCC57847de41129B03A8A531839f3CEd9f", 
                "chain": "ETH"
            }, 
            "amount": {
                "amount": "10", 
                "currency": "USD"
            }
        };

        return axios.post(this.baseUrl + 'transfers', payload , this.options)
        .then(response => {
            return response.data
        }).catch(error => {
            console.log(error)
        })
    }

    getTransferStatus (id) {
        return axios.get(this.baseUrl + 'transfers/' + id , this.options)
        .then(response => {
            console.log(response.data);
            return response.data
        }).catch(error => {
            console.log(error)
        })
    }

    getWallet (walletId){
        return axios.get(this.baseUrl + 'wallets/' + walletId, this.options)
        .then(response => {
            return response.data;
        }).catch(error => {
            console.log(error)
        })
    }

    async getCard(){
        return axios.get(this.baseUrl + 'cards', this.options)
            .then(response => {
                return response.data
            }).catch(error => {
                console.log(error.response)
            })
    }

    async createCard(){
        const cardDetails = {
            number: '4200000000000000'.replace(/\s/g, ''),
            cvv: '111',
          }

        var encryptedData =  await this.encryptCardData(cardDetails);

        var payload = {
            idempotencyKey: this.uuidv4(),
            keyId: encryptedData.keyId,
            expMonth: 1,
            expYear: 2023,
            billingDetails: {
                name: 'RSMIT',
                country: 'ZA',
                district: 'FH',
                line1: '111',
                line2: 'EC',
                city: 'CT',
                postalCode: '7974',
            },
            metadata : {
                phoneNumber: '+27646909349',
                email: 'ruan@segment.money',
                sessionId: 'xxx',
                ipAddress: '172.33.222.1',
            },
            encryptedData: encryptedData,
        };

        return axios.post(this.baseUrl + 'cards', this.options)
            .then(response => {
                return response.data
            }).catch(error => {
                console.log(error.response)
            })
    }

    async createPayment(paymentData){
        const encryptedData =  await this.encryptCardData(paymentData.cardNumber, paymentData.cvv);
        //var encryptedData =  await this.encryptCardData('4007400000000007', '111');
        
        var cards = await this.createCard();

        //console.log(cards.data[0])
        var payload = {
            'idempotencyKey': this.uuidv4(),
            'keyId': encryptedData.keyId,
            'metadata' : {
               'email' : paymentData.email,
                'phoneNumber': paymentData.phoneNumber,
                'sessionId': 'xxx',
                'ipAddress': '172.33.222.1',
            },
            'amount': {
                'amount': paymentData.amount,
                'currency': paymentData.currency
            },
            'verification': 'cvv',
            'source': {
                'id': cards?.data[0].id,
                'type': 'card'
            },
            'encryptedData': encryptedData.encryptedMessage,
            'cvv': paymentData.cvv
        };

        return axios.post(this.baseUrl + 'payments', payload , this.options)
            .then(response => {
                return response.data
            }).catch(error => {
                console.log(error.response)
            })
    }

    async getPayment(paymentId){
        //var encryptedData =  await this.encryptCardData(paymentData.cardNumber, paymentData.cvv);

        return axios.get(this.baseUrl + 'payments/' + paymentId , this.options)
            .then(response => {
                console.log(response)
                return response.data.data
            }).catch(error => {
                console.log(error.response)
            })
    }

    async encryptCardData(number, cvv){
        return this.getPCIPublicKey()
        .then(async response => {    
            var decodedPublicKey = atob(response.data.publicKey);

            var options = {
                message: openpgp.message.fromText(JSON.stringify({number: number, cvv: cvv})),
                publicKeys: (await openpgp.key.readArmored(decodedPublicKey)).keys
            };

            return openpgp.encrypt(options).then((ciphertext) => {
                return {
                    encryptedData: btoa(ciphertext.data),
                    keyId: response.data.publicKey
                  };
            });
            
        }).catch(error => {
            console.log(error)
        })
    }
}

export default CircleApi = new CircleApi()


