import * as io from 'socket.io-client';
import { store } from './start';
import { connectLoggedInUser, updateOnlineUsers, userJoined, userLeft, storeUserInfo } from './actions';
import axios from 'axios';

let socket;

function getSocket() {
    if (!socket) {
        socket = io.connect();

        socket.on('connect', () => {
            axios.get(`/connect/${socket.id}`)
            .then(({data})=>
            store.dispatch(storeUserInfo(data.user))
        ).catch(err => console.log('error on connect socket: ', err))
        });

        socket.on('onlineUsers', function(onlineUsers) {
            store.dispatch(updateOnlineUsers(onlineUsers));
        });

        socket.on('userJoined', function(newUser) {
            store.dispatch(userJoined(newUser));
        });

        socket.on('userLeft', function(userId) {
            store.dispatch(userLeft(userId));
        });
    }
    return socket;
}

export {getSocket as socket};
