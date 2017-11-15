import React from 'react';
import axios from 'axios';


export default class ProfilePicture extends React.Component {
    constructor(props) {
        super(props);
    }

    clickHandler() {
        if(!this.props.uploaderVisible) {
            return this.props.showUploader(true)
        } else {
            return this.props.showUploader(false)
        }
    }

    render(props) {
        if(!this.props.picturename) {
            return (
                <div>
                    <img id="profile-picture" alt={`${this.props.firstname}-${this.props.lastname}`}  src={`https://api.adorable.io/avatars/95/${this.props.userId}`} onClick={() => this.clickHandler()}/>
                </div>
            )
        } else {
            if(this.props) {
                console.log('this.props at profile.picture: ', this.props);
                return (
                    <div >
                    <img id="profile-picture" alt={`${this.props.firstname}-${this.props.lastname}`}  src={`https://s3.amazonaws.com/raulsbucket2/${this.props.picturename}`} onClick={() => this.clickHandler()}/>
                    </div>
                )
            }
        }
    }
}
