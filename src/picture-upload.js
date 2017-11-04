import React from 'react'
import axios from 'axios'
import {Button} from './reusables'

export default class PictureUpload extends React.Component {
    constructor(props){
        super(props),
        this.state = {}
    }

    inputHandler(e) {
        console.log(e.target.files[0]);

        this.setState({ pictureFile: e.target.files[0]})
    }

    submit() {

        var formData = new FormData();
        console.log(this.state);
        formData.append('file', this.state.pictureFile);
        axios.post('/uploadPicture', formData )
        .then(({data}) => {
            if(data.success) {
                this.setState({
                    pictureUploadVisible: false
                })
                this.props.updateImage(data.pictureName)
            }
        })
        .catch(err => console.log("THERE WAS AN ERROR IN /newuser",err));
    }

    componentDidMount() {
        console.log('in pictureUpload');
    }

    render(props) {

        if(this.props.visible == false) {
            return null
        } else {
            return (
                <div >
                    <label htmlFor="file">Upload Picture</label>
                    <input type="file" id="file" onChange={e => this.inputHandler(e)}/>
                    <Button type="submit" id="uploadbutton" name="button" onClick={() => this.submit() } >Upload!</Button>
                </div>
            )
        }
    }
}


//do ajax request in this Component
/*
this compnent needs to be passed a function to update the image when new image is uploaded.
*/
