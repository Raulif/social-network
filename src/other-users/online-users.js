import React from 'react'
import { Link } from 'react-router'

export default function OnlineUsers(props) {

    const listOnlineUsers = props.onlineUsers.map((onlineUser) => {
        /*if the other user has no picture name (no profile picture has been uploaded)
        an individual profile picture will be generated using the Adorable API
        and the other user's #ID*/
        let pictureUrlPrefix = !onlineUser.picturename ? 'https://api.adorable.io/avatars/285/' : 'https://s3.amazonaws.com/raulsbucket2/'

        let picturename = !onlineUser.picturename ? onlineUser.id : onlineUser.picturename


        let {id, firstname, lastname } = onlineUser

        return (
            <div key={id} className='online-users-single-user'>
                <Link to={`/user/${id}`} style={{arialHidden: true, textDecoration: 'none', color: 'black'}}>
                    <div className='online-users-img-container'>
                        <img src={`${pictureUrlPrefix}${picturename}`}/>
                    </div>
                    <h3>{firstname} {lastname}</h3>
                </Link>
            </div>
        )
    })

    return(
        <div>
            <h1 id="online-users-title">Bohemians online</h1>
            <div id='list-online-users'>
                {listOnlineUsers}
            </div>
        </div>
    )
}
