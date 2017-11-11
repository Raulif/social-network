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
    .then(({ data }) => {
        return {
            type: 'ACCEPT_FRIENDSHIP',
            user
        }
    }).catch(err => console.log("THERE WAS AN ERROR IN /action acceptFriendRequests", err));
}

export function endFriendship(user) {
    return axios.post(`/end-friendship/${user.id}`)
    .then(({data}) => {
        return {
            type: 'END_FRIENDSHIP',
            user
        }
    }).catch(err => console.log("THERE WAS AN ERROR IN /action endFriendship", err));
}

export function connectLoggedInUser(socketId) {
    return axios.post(`/connect/${socketId}`)
    .then(() => {
        return {
            type: 'CONNECT_LOGGEDIN_USER'
        }
    }).catch(err => console.log("THERE WAS AN ERROR IN /action connectLoggedInUser", err));
}

export function createOnlineUsers(onlineUsers) {
    console.log('onlineUsers in action CREATE ONLINE USERS are: ', onlineUsers);
    return {
        type: 'CREATE_ONLINE_USERS',
        onlineUsers
    }
}
