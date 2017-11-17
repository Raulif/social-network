import React from 'react';
import {Button} from './reusables';
import {Link } from 'react-router'


export default function Friend({friend, requester, endFriendship, acceptFriendship}) {
    const user = friend || requester
    console.log('inside a friend');
    return (

        <div className="friend-profile">
            <div className='friend-img-container'>
            <Link to={`/user/${user.id}`} style={{textDecoration: 'none', color: 'black'}}>
                <img  src={`https://s3.amazonaws.com/raulsbucket2/${user.picture_name}`} />
            </Link>
            </div>

            <h3>{user.firstname} {user.lastname}</h3>

            {friend && <Button className='friend-end-button' onClick={() => endFriendship(friend)}>End Friendship</Button>}

            {requester && <Button className='friend-accept-button' onClick={() => acceptFriendship(requester)}>Accept Friendship</Button>}
        </div>
    )
}
