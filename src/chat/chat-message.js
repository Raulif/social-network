import React from 'react'

export default function ChatMessage(props) {

    if(!props) {
        return(
            <div>Not chat messages to show yet!</div>
        )
    }
    else {
        const listChatMessages = props.messages && props.messages.map((chatMessage) => {
            let {   message, message_id, sender_firstname, sender_lastname, sender_id, sender_picture} = chatMessage;

            /*We use Adorable API to display a default user picture, in case the user
            has no 'picture_name' prop, meaning that no picture has been uploaded to
            AWS S3.*/
            let pictureUrlPrefix = !sender_picture ? 'https://api.adorable.io/avatars/285/' : 'https://s3.amazonaws.com/raulsbucket2/'

            /*If there is no picture available, we pass the user's #ID to the Adorable
            API to generate an individual picture.*/
            let picturename = !sender_picture ? sender_id : sender_picture
            let userId = props.userId

            /*If the sender #ID is the same as the #ID of the logged in user,
            the chat message receives the class 'own message' with different
            background color and position to the right. Messages from other
            users have another color and are positioned to the left.*/
            let applyClass =    sender_id == userId
                                ? 'own-message single-chat-message'
                                : 'others-message single-chat-message'


            return(
                <div className={applyClass} key={message_id} >
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
