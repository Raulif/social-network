import React from 'react';
import axios from 'axios';
import ProfilePicture from './profile-picture';
import PictureUpload from './picture-upload'
import { socket } from '../socket/socket';
import { connect } from 'react-redux';
import { Link } from 'react-router';


class App extends React.Component {
    constructor(props) {
        super(props),
        this.state = {
            pictureUploadVisible: false,
            showMenu: false
        }
        /*on mount the function socket() generates a socket ID and socket connection
        for the user*/
        this.socket = socket();
        this.changeHandler = this.changeHandler.bind(this)
        this.showUploader = this.showUploader.bind(this)
        this.menuToggler = this.menuToggler.bind(this);

    }

    componentDidMount() {
        //on mount we retrieve the information of the logged in user from the db
        axios.get('/getUser')
        .then(({data}) => {
            console.log('get user: ', data);
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

        axios.get('/getProfilePicture')
        .then(({data}) => {
            console.log('getProfilePicture result is: ', data);
            let picturename = data.picturename;
            this.setState({
                picturename
            })
       })
    }


    menuToggler() {
        if(this.state.showMenu) {
            this.setState({showMenu: false})
        }
        else {
            this.setState({showMenu: true})

        }
    }

    showUploader(visible) {
        /* The function showUploader is passed to the child component PictureUploader,
        which will return the value of 'visible' as true when clicked upon.*/
        this.setState({
            pictureUploadVisible: visible
        })
    }

    render() {

        if(!this.state) {
            return null
        }

        const clonedChildren = React.cloneElement(
            this.props.children,
            {
                userId: this.state.userId,
                firstname: this.state.firstname,
                lastname: this.state.lastname,
                emit: (e, payload) => this.socket.emit(e, payload),
                picturename: this.state.picturename,
                showMenu: this.state.showMenu,
                location: this.props.location
            }
        )

        return (
            <div>
                <div id="topBar">
                    <Link to="/" id="home-link"></Link>
                    <ProfilePicture
                        userId={this.state.userId}
                        picturename={this.state.picturename}
                        alt={`${this.state.firstname}-${this.state.lastname}`}
                        showUploader={this.showUploader}
                        uploaderVisible={this.state.pictureUploadVisible} />

                    <div id='menu-toggler' >
                        <i  onClick={() => this.menuToggler()}
                            className="fa fa-bars"
                            aria-hidden="true">
                        </i>
                    </div>

                    {this.state.pictureUploadVisible &&
                        <PictureUpload
                            className='picture-uploader'
                            updateImage = {newPictureName => {
                                this.setState({
                                    picturename: newPictureName,
                                    pictureUploadVisible: false
                                })}}
                            onChange={()=> this.changeHandler()}
                        />}
                </div>
                    {clonedChildren}
            </div>
        )
    }
}

let mapStateToProps = (state) => ({state: state && state})
export default connect(mapStateToProps)(App)
