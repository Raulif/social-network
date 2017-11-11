import React from 'react'

export default function OnlineUsers(props) {
    console.log('props are: ', props);
    let otherOnlineUsers
    const listOnlineUsers = props.onlineUsers.map ((onlineUser) => {
        if(onlineUser.id != props.userId) {
            let {id, firstname, lastname, picturename} = onlineUser
            return (
                <div key={id}>
                <img src={`https://s3.amazonaws.com/raulsbucket2/${picturename}`}/>
                <h3>{firstname} {lastname}</h3>
                </div>
            )
        }
    })
    return(
        <div id='online-users'>
            {listOnlineUsers}
        </div>
    )
}
