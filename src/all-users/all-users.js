import React from 'react';
import FriendshipButton from '../friendships/friendship-button'
import { Link } from 'react-router';


export default function AllUsers(props) {

    const listOfAllUsers = props.allUsers.map(user => {
        /*We use Adorable API to display a default user picture, in case the user
        has no 'picture_name' prop, meaning that no picture has been uploaded to
        AWS S3.*/
        let pictureUrlPrefix = !user.picturename ? 'https://api.adorable.io/avatars/285/' : 'https://s3.amazonaws.com/raulsbucket2/'

        /*If there is no picture available, we pass the user's #ID to the Adorable
        API to generate an individual picture.*/
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
