import React from 'react';
import { connect } from 'react-redux';
import { Button } from './reusables'
import ChatMessage from './chat-message'

class ChatRoom extends React.Component {
    constructor(props) {
        super(props)
        this.submit = this.submit.bind(this)
        this.inputHandler = this.inputHandler.bind(this)
    }

    componentDidUpdate() {
        this.elem.scrollTop = this.elem.scrollHeight;
    }

    inputHandler(e) {
        this.props.newMessage = e.target.value;
    }

    submit(props){
        const {newMessage} = this.props
        this.props.emit('new-chat-message', {newMessage})
        this.refs.textarea.value = ""
    }

    keyDownHandler(e) {
        if(e.keyCode == 13) {
            e.preventDefault()
            if (!this.refs.textarea.value) {
                return
            }
            this.submit(this.props)
        }
    }

    render(props) {
        if(!this.props.messages) {
            this.props.messages = {}
        }

        return (
            <div id="chat-room">
                <h1>Chat room</h1>
                <div ref={elem => this.elem = elem} id="chat-board" >
                    <ChatMessage user={this.props.user} messages={this.props.messages} />
                </div>
                <div  id="chat-message-input">
                    <p for="chat-input-textarea">Say something nice:</p>
                    <textarea ref="textarea" id="chat-input-textarea" type="text" onChange={e => this.inputHandler(e)} onKeyDown={(e) => this.keyDownHandler(e)}></textarea>
                    <Button id="chat-button" onClick={() => this.submit()} className="secondary-button">Send</Button>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    console.log('state in chatroom: ', state);
    if(!state.user) {
        state.user = {}
    }
    if(!state.messages) {
        state.messages = {}
    }
    return{
        messages: state.messages && state.messages,
        user: state.user && state.user
    }
}

export default connect(mapStateToProps)(ChatRoom);
