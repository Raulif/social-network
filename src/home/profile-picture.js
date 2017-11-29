import React from 'react';
import axios from 'axios';


export default class ProfilePicture extends React.Component {
    constructor(props) {
        super(props);
        this.clickHandler = this.clickHandler.bind(this);
    }

    clickHandler() {
        /*We toggle the visibility of the image uploader on click. The function
        uploaderVisible is passed down by the parent element. The value set here
        will be sent up to the parent element.*/
        if(!this.props.uploaderVisible) {
            return this.props.showUploader(true)
        }
        else {
            return this.props.showUploader(false)
        }
    }

    render() {

        if(!this.props.picturename) {
            /*if the user has no picture_name (no profile picture has been uploaded)
            an individual profile picture will be generated using the Adorable API
            and the user's #ID*/
            return (
                <div>
                    <img id="profile-picture"
                        alt={`${this.props.firstname}-${this.props.lastname}`}
                        src={`https://api.adorable.io/avatars/95/${this.props.userId}`}
                        onClick={() => this.clickHandler()}/>
                </div>
            )
        }

        else {
            if(this.props) {
                
                return (
                    <div >
                        <img id="profile-picture"
                            alt={`${this.props.firstname}-${this.props.lastname}`}
                            src={`https://s3.amazonaws.com/raulsbucket2/${this.props.picturename}`}
                            onClick={() => this.clickHandler()}/>
                    </div>
                )
            }
        }
    }
}
