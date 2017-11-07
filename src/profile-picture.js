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
            let pictureName = queryResponse.data.pictureName;
            this.setState({pictureName: pictureName})
       })
    }

    changeHandler() {
        axios.get('/getProfilePicture')
        .then((queryResponse) => {
            let pictureName = queryResponse.data.pictureName;
            this.setState({
                pictureName: pictureName,
            })
       })
    }

    render() {
        if(!this.state.pictureName) {
            return (
                <div>
                    <img id="profile-picture" alt={`${this.props.firstName}-${this.props.lastName}`}  src={`https://api.adorable.io/avatars/95/${this.props.userId}`}
                    onClick={() => this.setState({pictureUploadVisible: true})}/>

                    {this.state.pictureUploadVisible && <PictureUpload onChange={()=> this.changeHandler()}/>}
                </div>
            )
        } else {
            return (
                <div>
                    <img id="profile-picture" alt={`${this.props.firstName}-${this.props.lastName}`}  src={`https://s3.amazonaws.com/raulsbucket2/${this.state.pictureName}`}
                    onClick={() => this.setState({pictureUploadVisible: true})}/>

                    {this.state.pictureUploadVisible && <PictureUpload
                    updateImage = {newPictureName => this.setState({pictureName: newPictureName, pictureUploadVisible: false})}
                    onChange={()=> this.changeHandler()} />}
                </div>
            )
        }
    }
}
