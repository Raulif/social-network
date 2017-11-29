import React from 'react'
import axios from 'axios'
import { Button, UploaderDiv } from '../../modules/reusables'

export default class PictureUpload extends React.Component {
    constructor(props){
        super(props),
        this.state = {}
    }

    inputHandler(e) {
        //We store the selected file on local state until submit.
        this.setState({ pictureFile: e.target.files[0]})
    }

    submit() {

        var formData = new FormData();
        formData.append('file', this.state.pictureFile);
        axios.post('/upload-picture', formData )

            .then(({data}) => {
                console.log('formData: ', formData);

                if(data.success) {
                    console.log('data on picture-upload: ', data);
                    this.props.updateImage(data.picturename)
                }
            })

            .catch(err => console.log("THERE WAS AN ERROR IN /newuser", err));
    }

    render() {

        if(this.props.visible == false) {
            return null
        }

        else {
            return (
                <div>
                    <UploaderDiv>
                        <label className='upload-label' htmlFor="file">Upload a new picture:</label>
                        <input className='file-field' type='file'/>
                        <input className='hidden-field' type="file" id="file" onChange={e => this.inputHandler(e)}/>
                        <button type="submit" className='upload-button' id="upload-button" name="button" onClick={() => this.submit() } >Upload!</button>
                    </UploaderDiv>
                </div>
            )
        }
    }
}
