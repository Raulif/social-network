import React from 'react'

export default function ChatMessage(props) {

    if(!props.messages) {
        props.messages = {}
        return(
            <div>Not chat messages to show yet!</div>
        )
    }
    else {
        const listChatMessages = props.messages && props.messages.map((chatMessage) => {
            let {message, message_id, sender_firstname, sender_lastname, sender_id, sender_picture} = chatMessage;

            let pictureUrlPrefix = !sender_picture ? 'https://api.adorable.io/avatars/285/' : 'https://s3.amazonaws.com/raulsbucket2/'

            let picturename = !sender_picture ? sender_id : sender_picture

            let applyClass = function(userId) {
                if(sender_id == userId) {
                    return 'own-message single-chat-message'
                }
                else {
                    return 'others-message single-chat-message'
                }
            }

            return(
                <div className={props.user && applyClass(props.user.id)} key={message_id} >
                    <img className="chat-img" src={`${pictureUrlPrefix}${picturename}`}/>
                    <div className="chat-text-content">
                        <p className="chat-username"><span className="chat-nametags">{sender_firstname}</span> says:</p>
                        <p className="chat-message-text">{message}</p>
                    </div>
                </div>
            )
        })
        return(
            <div>
                {listChatMessages}
            </div>
        )
    }
}
