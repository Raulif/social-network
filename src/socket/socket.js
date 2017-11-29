import * as io from 'socket.io-client';
import { store } from '../start';
import { connectLoggedInUser, updateOnlineUsers, userJoined, userLeft, storeUserInfo, chatMessages, incomingMessage, getAllUsersFromDb } from '../actions/actions';
import axios from 'axios';

let socket;

function getSocket() {
    if (!socket) {
        //Create socket connection
        socket = io.connect();

        //Get Socket #ID on connect
        socket.on('connect', () => {
            axios.get(`/connect/${socket.id}`)
                .then(({data})=>
                    store.dispatch(storeUserInfo(data.user))
                )

                .catch(err => console.log('error on connect socket: ', err))
        });

        //event: 'ONLINE USERS' dispatch action: 'UPDATE ONLINE USERS'
        socket.on('onlineUsers', (onlineUsers) => {
            store.dispatch(updateOnlineUsers(onlineUsers));
        });

        //event: 'USER JOINED' dispatch action: 'USER JOINED'
        socket.on('userJoined', (newUser) => {
            store.dispatch(userJoined(newUser));
        });

        //event: 'USER LEFT' dispatch action: 'USER LEFT'
        socket.on('userLeft', (userId) => {
            store.dispatch(userLeft(userId));
        });

        //event: 'CHAT MESSAGES' dispatch action: 'CHAT MESSAGES'
        socket.on('chatMessages', (messages) => {
            store.dispatch(chatMessages(messages))
        });

        //event: 'BROADCAST NEW MESSAGE' dispatch action: 'INCOMING MESSAGE'
        socket.on('broadcast-new-message', (message) => {
            store.dispatch(incomingMessage(message))
        })

        //event: 'ALL USERS' dispatch action: 'GET ALL USERS FROM DB'
        socket.on('allUsers', (allUsers) => {
            store.dispatch(getAllUsersFromDb(allUsers))
        })
    }

    return socket;
}

export {getSocket as socket};
export {io}
