import React from 'react';
// import styled from 'styled-components';
import axios from 'axios';

export default class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        axios.get('/user',  => {

        }).then(({userInfo}) => {
            this.setState(userInfo)
        }).catch((err)=>{console.log(err)})
    }



    render() {
        <div>
            <Logo />
            <ProfilePic onClick={() => this.setState({imageUploadVisible: true})}/>
            {this.state.imageUploadVisible && <ImageUpload/>}
        </div>
    }
}

function ProfilePic(props) {
    if(!props.id) {
        return null
    }

    const showUploader = () {

    }

    else {

        return (
            <div id="app">
                <Logo/>
                <img onClick={props.showUploader}
                    src={props.image}
                    alt={`${props.firs}${props.last}`}/>
            </div>
        )

    }
}
