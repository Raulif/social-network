import React from 'react'

export default function OnlineUsers(props) {
    const listOnlineUsers = props.onlineUsers.map ((onlineUser) => {

        let pictureUrlPrefix = !onlineUser.picturename ? 'https://api.adorable.io/avatars/285/' : 'https://s3.amazonaws.com/raulsbucket2/'

        let picturename = !onlineUser.picturename ? onlineUser.id : onlineUser.picturename


        let {id, firstname, lastname } = onlineUser
        console.log('props.onlineuser at onlineUser are: ', onlineUser);
        return (
            <div key={id}>
            <img src={`${pictureUrlPrefix}${picturename}`}/>
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
