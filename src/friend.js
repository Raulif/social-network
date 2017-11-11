import React from 'react';
import {Button} from './reusables';

export default function Friend({friend, requester, endFriendship, acceptFriendship}) {
    const user = friend || requester
    console.log('inside a friend');
    return (
        <div className="user">
            <img src={`https://s3.amazonaws.com/raulsbucket2/${user.picture_name}`} />
            <h2>{user.firstname} {user.lastname}</h2>
            {friend && <Button onClick={() => endFriendship(friend)}>End Friendship</Button>}
            {requester && <Button onClick={() => acceptFriendship(requester)}>Accept Friendship</Button>}
        </div>
    )
}
