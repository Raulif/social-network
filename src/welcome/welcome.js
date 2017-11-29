import React from 'react';
import Logo from '../logo/logo';


export default class Welcome extends React.Component {

    render(props) {
        console.log('in welcome');

        return (
            <div>
                <div id="welcome-top-container">
                    <Logo />
                    <h1>The social network for Bohemians</h1>
                    <h2>Join
                        <span className="boheme-keyword">Bohême</span>
                        now!
                    </h2>
                </div>
                <div>
                    {this.props.children}
                </div>

            </div>
        )
    }
}
