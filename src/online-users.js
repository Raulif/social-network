import React from 'react'

export default function OnlineUsers(props) {
    console.log('props are: ', props);
    const listOnlineUsers = props.onlineUsers.map ((onlineUser) => {

        let pictureUrlPrefix = !onlineUser.picturename ? 'https://api.adorable.io/avatars/285/' : 'https://s3.amazonaws.com/raulsbucket2/'

        let pictureName = !onlineUser.picturename ? onlineUser.id : onlineUser.picturename


        let {id, firstname, lastname, picturename} = onlineUser
        return (
            <div key={id}>
            <img src={`${pictureUrlPrefix}${pictureName}`}/>
            <h3>{firstname} {lastname}</h3>
            </div>
        )
    })
    
    return(
        <div id='list-online-users'>
            {listOnlineUsers}
        </div>
    )
}
