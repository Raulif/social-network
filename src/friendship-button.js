import React from 'react';
import axios from 'axios';

export default class FriendshipButton extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            nextAction: null
        }
        this.clickHandler = this.clickHandler.bind(this)
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
        console.log(this.props);
        let otherUserId = this.props.otherUserId
        axios.post(`/update-friendship/${otherUserId}`)
        .then(({data}) => {
            this.setState({nextAction: data.nextAction})
        })
    }

    render(props) {
        let nextAction = this.state.nextAction
        return(
            <div id='friendship-button'>
                {this.state.nextAction && <button id="update-friendship" onClick={this.clickHandler}>{nextAction}</button>}

                {!this.state.nextAction && <div>Friendship Button</div>}

                {this.state.nextAction == 'Accept Friendship' && <button id="reject-friendship">Reject Friendship</button>}

            </div>

        )
    }
}
