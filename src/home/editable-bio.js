import React from 'react';
import axios from 'axios';
import { Button } from '../../modules/reusables';

export default class EditableBio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bioEditorVisible: false
        }
    }

    componentDidMount() {
        //on mount we get the current user bio from db
        axios.get('/getUserBio')

            .then(({data}) => {

                if(!data.success) {
                    return;
                }

                else {
                    let userBio = data.bio
                    this.setState({bio: userBio});
                }

            }).catch(err => console.log('Error retrieving user bio: ', err));
    }

    inputHandler(e) {
        //we update the content of bio to local state on each key stroke
        this.setState({ bio: e.target.value });
    }

    submit() {
        /*on submit we send the current bio from local state to db and set the
        visibility of the bio editor to false*/
        let userBio = {bio: this.state.bio}

        axios.post('/updateUserBio', userBio)

            .then(({data}) => {

                if(data.success) {
                    this.setState({ bioEditorVisible: false })
                }

            }).catch(err => console.log('Error on submitting user bio: ', err));
    }

    render() {

        return(
            <div id="bio-container" >
                {this.state.bio &&
                    <div className="bio-label" for="bio-editor">
                        My bohemian thought of the day:
                    </div>
                }

                {this.state.bioEditorVisible &&
                    <textarea
                        id="bio-editor"
                        type="text"
                        placeholder="enter your bio"
                        onChange={e => this.inputHandler(e)}>
                        {this.state.bio}
                    </textarea>
                }

                {this.state.bioEditorVisible &&
                    <Button
                        className="secondary-button"
                        type="submit"
                        onClick={() => this.submit()} >
                        Update
                    </Button>
                }

                {(this.state.bio && !this.state.bioEditorVisible) &&
                    <div id="bio-text">{this.state.bio}</div>
                }

                {(!this.state.bio &&
                    !this.state.bioEditorVisible) &&
                    <div>
                        <div className="bio-label" for="bio-editor">
                            Enter your bohemian thought of the day:
                        </div>
                        <p className="bio-editor-toggler" onClick={() => this.setState({bioEditorVisible: true})}>
                            Enter thought
                        </p>
                    </div>
                }

                {(this.state.bio && !this.state.bioEditorVisible) &&
                    <p className="bio-editor-toggler" onClick={() => this.setState({bioEditorVisible: true})}>
                        Edit
                    </p>
                }

            </div>
        )
    }
}
