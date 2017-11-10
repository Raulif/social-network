import React from 'react'

export default function OnlineUsers(props) {
    const listOnlineUsers = props.onlineUsers.map ((onlineUser) => {
        let {id, firstName, lastName, pictureName} = onlineUser
        return (
            <div key={id}>
                <img src={`https://s3.amazonaws.com/raulsbucket2/${pictureName}`}/>
                <h3>{firstName} {lastName}</h3>
            </div>
        )
    })
    return(
        <div id='online-users'>
            {listOnlineUsers}
        </div>
    )
}
