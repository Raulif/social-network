import React from 'react';
import axios from 'axios';
import ProfilePicture from './profile-picture';
import PictureUpload from './picture-upload'
import { socket } from './socket';
import { connect } from 'react-redux';
import { Link } from 'react-router';


class App extends React.Component {
    constructor(props) {
        super(props),
        this.state = {pictureUploadVisible: false}
        this.socket = socket();
        this.changeHandler = this.changeHandler.bind(this)
        this.showUploader = this.showUploader.bind(this)
    }

    componentDidMount() {
        axios.get('/getUser')
        .then(({data}) => {
            console.log('data at app did mount: ', data);
            let user = data.user;
            this.setState({
                userId: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email
            })
            axios.get('/getProfilePicture')
            .then(({data}) => {
                let picturename = data.picturename;
                this.setState({picturename})

           }).catch(err => console.log("THERE WAS AN ERROR IN /app get profile picture",err));

       }).catch(err => console.log("THERE WAS AN ERROR IN /app get user info",err));
    }

    changeHandler() {
        console.log('in changeHandler');
        axios.get('/getProfilePicture')
        .then(({data}) => {
            console.log('getProfilePicture result is: ', data);
            let picturename = data.picturename;
            this.setState({
                picturename
            })
       })
    }

    showUploader(visible) {
        this.setState({
            pictureUploadVisible: visible
        })
    }

    render() {
        const clonedChildren = React.cloneElement(
            this.props.children,
            {
                userId: this.state.userId,
                firstname: this.state.firstname,
                lastname: this.state.lastname,
                emit: (e, payload) => this.socket.emit(e, payload),
                picturename: this.state.picturename
            }
        )
        if(this.props) {
            console.log(this.state);
            return (
                <div>
                    <div id="topBar">
                        <Link to="/" id="home-link"></Link>
                        <ProfilePicture
                        userId={this.state.userId}
                        picturename={this.state.picturename} alt={`${this.state.firstname}-${this.state.lastname}`} showUploader={this.showUploader}
                        uploaderVisible={this.state.pictureUploadVisible} />

                        {this.state.pictureUploadVisible &&
                        <PictureUpload
                        className='picture-uploader'
                        updateImage = {newPictureName => {
                            this.setState({
                                picturename: newPictureName,
                                pictureUploadVisible: false})}}
                        onChange={()=> this.changeHandler()}
                        />}
                    </div>
                        {clonedChildren}
                </div>
            )
        }
    }
}

let mapStateToProps = (state) => ({state: state && state})
export default connect(mapStateToProps)(App)
