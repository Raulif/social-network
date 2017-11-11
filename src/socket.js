import * as io from 'socket.io-client';
import { store } from './start';
import { connectLoggedInUser, createOnlineUsers, userJoined, userLeft } from './actions';

let socket;

function getSocket() {
    if (!socket) {
        socket = io.connect();

        console.log('in socket io');
        socket.on('connect', function() {
            console.log(`socket with the id ${socket.id} is now connected`);
            store.dispatch(connectLoggedInUser(socket.id));

        });

        socket.on('disconnect', () => {
            console.log(`socket with the ${socket.id} is now disconnected`);
        })

        socket.on('onlineUsers', function(onlineUsers) {
            console.log('onlineUsers in socket: ', onlineUsers);
            store.dispatch(createOnlineUsers(onlineUsers));
        });

        socket.on('userJoined', function(users) {
            store.dispatch(userJoined(users));
        });

        socket.on('userLeft', function(id) {
            store.dispatch(userLeft(id));
        });
    }
    return socket;
}

export {getSocket as socket};
