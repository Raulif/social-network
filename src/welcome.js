import React from 'react';
// import styled from 'styled-components';
import Logo from './logo';


export default class Welcome extends React.Component {

    render(props) {
        console.log('in welcome');


        // `;
        //
        // const WelcomeH1 = styled.h1`
        //     width: 80%;
        //     font-size: 60px;
        //     margin-bottom: 25px;
        // `;
        //
        // const TitleBoheme = styled.span`
        //     background-color: rgba(55, 23, 88, 1);
        //     color: white;
        // `;
        //
        // const WelcomeH2 = styled.h2`
        //     margin: 0;
        //     width: 100%;
        //     font-size: 30px;
        //     height: 5vh;
        //     background-color: #1899AD;
        //     text-align: center;
        //     padding-top: 40px;
        // `;

        return (
            <div>
                <div id="welcome-top-container">
                    <Logo />
                    <h1>The social network for bohemian artists like you</h1>

                    <h2>Join Bohême now!</h2>
                </div>
                <div id="welcome-bottom-container">
                    {this.props.children}
                </div>

            </div>
        )
    }
}
