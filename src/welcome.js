import React from 'react';
// import styled from 'styled-components';
import Logo from './logo';


export default class Welcome extends React.Component {

    render(props) {
        console.log('in welcome');

        return (
            <div>
                <div id="welcome-top-container">
                    <Logo />
                    <h1>The social network for bohemian artists like you</h1>

                    <h2>Join Bohême now!</h2>
                </div>
                <div>
                    {this.props.children}
                </div>

            </div>
        )
    }
}
