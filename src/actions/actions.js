import axios from 'axios';


//RECEIVE FRIENDSHIP REQUESTS FROM DB
export function receiveFriendshipRequests() {
    return axios.get('/get-friendship-requests')

            .then(({ data }) => {
                console.log('data is: ',data);
                return {
                    type: 'RECEIVE_USERS',
                    friendships: data.friendships
                }

            }).catch(err => console.log("THERE WAS AN ERROR IN /action receiveFriendRequests", err));
}


//ACCEPT FRIENDSHIP
export function acceptFriendship(user) {

    return axios.post(`/accept-friendship/${user.id}`)

            .then(() => {
                return {
                    type: 'ACCEPT_FRIENDSHIP',
                    user
                }

            }).catch(err => console.log("THERE WAS AN ERROR IN /action acceptFriendRequests", err));
}


//END EXISTING FRIENDSHIP
export function endFriendship(user) {

    return axios.post(`/end-friendship/${user.id}`)

            .then(() => {
                return {
                    type: 'END_FRIENDSHIP',
                    user
                }

            }).catch(err => console.log("THERE WAS AN ERROR IN /action endFriendship", err));
}


//STORE USER INFO IN STATE
export function storeUserInfo(user) {

    return{
        type: 'STORE_USER_INFO',
        user
    }
}


//UPDATE ONLINE USERS
export function updateOnlineUsers(onlineUsers){

    return {
        type: 'UPDATE_ONLINE_USERS',
        onlineUsers
    }
}


//USER JOINED NETWORK
export function userJoined(newUser){

    return{
        type: 'USER_JOINED',
        newUser
    }
}


//USER LEFT NETWORK
export function userLeft(userId){

    return{
        type: 'USER_LEFT',
        userId
    }
}

//CHAT MESSAGES
export function chatMessages(messages){

    return{
        type: 'CHAT_MESSAGES',
        messages
    }
}

//INCOMING CHAT MESSAGE
export function incomingMessage(message) {

    return{
        type: 'INCOMING_MESSAGE',
        message
    }
}

//GET ALL USERS FROM DB
export function getAllUsersFromDb(allUsers) {

    return{
        type: 'GET_ALL_USERS',
        allUsers
    }
}
