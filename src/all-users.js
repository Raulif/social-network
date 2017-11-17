import React from 'react';
import FriendshipButton from './friendship-button'
import {Link} from 'react-router';

export default function AllUsers(props) {

    const listOfAllUsers = props.allUsers.map(user => {
        let pictureUrlPrefix = !user.picturename ? 'https://api.adorable.io/avatars/285/' : 'https://s3.amazonaws.com/raulsbucket2/'

        let picturename = !user.picturename ? user.id : user.picturename

        let {id, firstname, lastname } = user

        return(
            <div key={id} className="all-users-single-user">

                <div className="all-users-img-container">
                    <Link to={`/user/${id}`} style={{textDecoration: 'none', color: 'black'}}>
                    <img src={`${pictureUrlPrefix}${picturename}`}/>
                    </Link>

                </div>
                <h3>{firstname} {lastname}</h3>
                <FriendshipButton className="all-users-friendship-btn" otherUserId={id}/>
            </div>
        )
    })

    return(
        <div>
            <h1 id='all-users-title'>All the users</h1>
            <div className='all-users'>
                {listOfAllUsers}
            </div>
        </div>
    )
}
