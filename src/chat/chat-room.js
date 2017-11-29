import React from 'react';
import { connect } from 'react-redux';
import { Button } from '../../modules/reusables'
import ChatMessage from './chat-message'

class ChatRoom extends React.Component {
    constructor(props) {
        super(props)
        this.submit = this.submit.bind(this)
        this.inputHandler = this.inputHandler.bind(this)
    }

    componentDidUpdate() {
        /*Each time that a new chat message is sent, the component updates and
        the scroll of the screen is scrolled down as much as the height of the
        message received. */
        this.elem.scrollTop = this.elem.scrollHeight;
    }

    inputHandler(e) {
        /*We store each new character entered on the state object newMessage */
        this.props.newMessage = e.target.value;
    }

    submit(props){
        /*On submit we use the emit function passed by the parent element, which
        allows us emitting the message through socket.*/
        const {newMessage} = this.props
        this.props.emit('new-chat-message', {newMessage})
        //After submitting, the content of the text input area is cleared.
        this.refs.textarea.value = ""
    }

    keyDownHandler(e) {
        //We trigger 'submit' also if the user presses the 'enter' key.
        if(e.keyCode == 13) {
            e.preventDefault()
            if (!this.refs.textarea.value) {
                return
            }
            this.submit(this.props)
        }
    }

    render() {

        if(!this.props) {
            return(
                <div>LOADING MESSAGES</div>
            )
        }
        console.log('props in chat room: ', this.props);
        return (
            <div id="chat-room">
                <h1>Chat room</h1>
                <div ref={elem => this.elem = elem} id="chat-board" >
                    <ChatMessage userId={this.props.userId} messages={this.props.messages} />
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
