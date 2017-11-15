import React from 'react';
import axios from 'axios';
import PictureUpload from './picture-upload';


export default class ProfilePicture extends React.Component {
    constructor(props) {
        super(props);
        this.state = {pictureUploadVisible: false}
    }
    componentDidMount() {
        axios.get('/getProfilePicture')
        .then((queryResponse) => {
            let picturename = queryResponse.data.picturename;
            this.setState({picturename: picturename})
       })
    }

    changeHandler() {
        axios.get('/getProfilePicture')
        .then((queryResponse) => {
            let picturename = queryResponse.data.picturename;
            this.setState({
                picturename: picturename,
            })
       })
    }

    render() {
        if(!this.state.picturename) {
            return (
                <div>
                    <img id="profile-picture" alt={`${this.props.firstname}-${this.props.lastname}`}  src={`https://api.adorable.io/avatars/95/${this.props.userId}`}
                    onClick={() => this.setState({pictureUploadVisible: true})}/>

                    {this.state.pictureUploadVisible && <PictureUpload onChange={()=> this.changeHandler()}/>}
                </div>
            )
        } else {
            return (
                <div>
                    <img id="profile-picture" alt={`${this.props.firstname}-${this.props.lastname}`}  src={`https://s3.amazonaws.com/raulsbucket2/${this.state.picturename}`}
                    onClick={() => this.setState({pictureUploadVisible: true})}/>

                    {this.state.pictureUploadVisible && <PictureUpload
                    updateImage = {newPictureName => this.setState({picturename: newPictureName, pictureUploadVisible: false})}
                    onChange={()=> this.changeHandler()} />}
                </div>
            )
        }
    }
}
