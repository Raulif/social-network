import * as io from 'socket.io-client';
import { store } from './start';
import { onlineUsers, userJoined, userLeft } from './actions';

let socket;

function getSocket() {
    if (!socket) {
        socket = io.connect();

        console.log('in socket io');
        socket.on('connection', function(socket) {
            console.log(`socket with the id ${socket.id} is now connected`);
            store.dispatch( connectLoggedInUser(socket.id));

        });

        socket.on('disconnect', () => {
            console.log(`socket with the ${socket.id} is now disconnected`);
        })

        socket.on('onlineUsers', function(onlineUsers) {
            store.dispatch(createOnlineUsers(onlineUsers));
        });

        // socket.on('userJoined', function(user) {
        //     store.dispatch(userJoined(user));
        // });
        //
        // socket.on('userLeft', function(id) {
        //     store.dispatch(userLeft(id));
        // });
    }
    return socket;
}

export {getSocket as socket};
