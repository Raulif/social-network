import React from 'react';
import axios from 'axios';

export default class FriendshipButton extends React.Component {

    constructor(props) {
        super(props)
        this.state = {}
        this.clickHandler = this.clickHandler.bind(this)
        this.rejectionHandler = this.rejectionHandler.bind(this)
    }

    componentWillMount(props) {
        let otherUserId = this.props.otherUserId
        axios.get(`/get-current-friendship/${otherUserId}`)
        .then(({data}) => {
            console.log(data);
            this.setState({
                nextAction: data.nextAction
            })
        }).catch(err => console.log("THERE WAS AN ERROR IN /friendship-button",err));
    }

    clickHandler(props) {
        let otherUserId = this.props.otherUserId
        axios.post(`/update-friendship/${otherUserId}`)
        .then(({data}) => {
            console.log(data);
            this.setState({nextAction: data.nextAction})
        }).catch(err => console.log("THERE WAS AN ERROR IN 'update-friendship click-handler'",err));
    }

    rejectionHandler(props) {
        let otherUserId = this.props.otherUserId
        axios.post(`/reject-friendship-request/${otherUserId}`)
        .then(({data}) => {
            console.log(data);
            this.setState({nextAction: data.nextAction})
        }).catch(err => console.log("THERE WAS AN ERROR IN 'rejection handler'",err));
    }

    render(props) {
        let nextAction = this.state.nextAction

        let cancelRequest = this.state.nextAction == 'Cancel Request' ? 'cancel-request' : null;

        return(
            <div id='friendship-button' onChange={(e) => { console.log('there was a change in friendship : ', e)}}>

                {this.state.nextAction && <button className={cancelRequest} id="update-friendship" onClick={this.clickHandler}>{nextAction}</button>}

                {!this.state.nextAction && <button id="create-friendship" onClick={this.clickHandler}>{nextAction}</button>}

                {this.state.nextAction == 'Accept Request' && <button id="reject-friendship" onClick={this.rejectionHandler}>Reject Friendship</button>}

            </div>

        )
    }
}
