import React from 'react';
import axios from 'axios';
import ProfilePicture from './profile-picture';

export default class App extends React.Component {
    constructor(props) {
        super(props),
        this.state = {}
    }
    componentDidMount() {
        console.log('in App, about to query db for userdata');
        axios.get('/getUser')
        .then((queryResponse) => {
            let user = queryResponse.data.user;
            this.setState({
                userId: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email

            })
        }).catch(err => console.log("THERE WAS AN ERROR IN /app",err));
    }

    render() {
        return (
            <div>
                <div id="topBar">
                    <ProfilePicture userId={this.state.userId} alt={`${this.state.firstName}-${this.state.lastName}`} />
                </div>
            </div>
        )
    }
}
//
// <div>
//     <label htmlFor="file">Upload Picture</label>
//     <input type="file" id="file"/>
// </div>
