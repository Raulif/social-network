export default function(state = {}, action) {

    //RECEIVE USERS
    if(action.type == 'RECEIVE_USERS') {

        state = Object.assign({}, state, {
            friendships: action.friendships
        })
    }

    //END FRIENDSHIP
    if(action.type == 'END_FRIENDSHIP') {

        state = Object.assign({}, state, {
            friendships: state.friendships.map((user) => {

                if(user.id != action.user.id) {
                    return user
                }
                return Object.assign({}, user, {
                    status: 'terminated'
                })
            })
        })
    }

    //ACCEPT FRIENDSHIP
    if(action.type == 'ACCEPT_FRIENDSHIP') {

        state = Object.assign({}, state, {
            friendships: state.friendships.map((user) => {

                if(user.id != action.user.id) {
                    return user
                }
                return Object.assign({}, user, {
                    status: 'accepted'
                })
            })
        })
    }

    //STORE USER INFO
    if(action.type == 'STORE_USER_INFO') {

        state = Object.assign({}, state, {
            user: action.user
        })
    }

    //UPDATE ONLINE USERS
    if(action.type == 'UPDATE_ONLINE_USERS') {

        state = Object.assign({}, state, {
            onlineUsers: action.onlineUsers
        })

    }

    //USER JOINED
    if(action.type == 'USER_JOINED') {

        if(state.onlineUsers &&
            !state.onlineUsers.find(user => user.id == action.newUser.id)) {

                state = Object.assign({}, state, {
                    onlineUsers: [...state.onlineUsers, action.newUser]
                })
        }
    }

    //USER LEFT
    if(action.type == 'USER_LEFT') {

        state = Object.assign({}, state, {
            onlineUsers: state.onlineUsers.filter(onlineUser => onlineUser.id !== action.userId.id)
        })
    }

    //CHAT MESSAGES
    if(action.type == 'CHAT_MESSAGES') {

        state = Object.assign({}, state, {
            messages: action.messages
        })
    }

    //INCOMING MESSAGE
    if(action.type == 'INCOMING_MESSAGE') {

        state = Object.assign({}, state, {
            messages: [...state.messages, action.message]
        })
    }

    //GET ALL USERS
    if(action.type == 'GET_ALL_USERS') {

        state = Object.assign({}, state, {
            allUsers: action.allUsers
        })
    }

    return state;
}
