import axios from 'axios';

export function receiveFriendshipRequests() {
    console.log('inside action receiveFriendshipRequests');
    return axios.get('/get-friendship-requests')
    .then(({ data }) => {
        return {
            type: 'RECEIVE_USERS',
            friendships: data.friendships
        };
    }).catch(err => console.log("THERE WAS AN ERROR IN /action receiveFriendRequests", err));
}

export function acceptFriendship(user) {
    return axios.post(`/accept-friendship/${user.id}`)
    .then(() => {
        return {
            type: 'ACCEPT_FRIENDSHIP',
            user
        }
    }).catch(err => console.log("THERE WAS AN ERROR IN /action acceptFriendRequests", err));
}

export function endFriendship(user) {
    return axios.post(`/end-friendship/${user.id}`)
    .then(() => {
        return {
            type: 'END_FRIENDSHIP',
            user
        }
    }).catch(err => console.log("THERE WAS AN ERROR IN /action endFriendship", err));
}

export function storeUserInfo(user) {
    return{
        type: 'STORE_USER_INFO',
        user
    }
}

export function updateOnlineUsers(onlineUsers){
    return {
        type: 'UPDATE_ONLINE_USERS',
        onlineUsers
    }
}

export function userJoined(newUser){
    return{
        type: 'USER_JOINED',
        newUser
    }
}

export function userLeft(userId){
    return{
        type: 'USER_LEFT',
        userId
    }
}

export function chatMessages(messages){
    return{
        type: 'CHAT_MESSAGES',
        messages
    }
}

export function incomingMessage(message) {
    return{
        type: 'INCOMING_MESSAGE',
        message
    }
}

export function getAllUsersFromDb(allUsers) {
    return{
        type: 'GET_ALL_USERS',
        allUsers
    }
}
