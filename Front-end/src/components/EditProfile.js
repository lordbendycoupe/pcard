import React, { Component } from 'react';
import axios from "axios";
import Cropper from 'react-easy-crop';
import { getCroppedImg } from './utility/CropImage.js';
import Amplify, { Storage } from 'aws-amplify';
const $ = require('jquery');

const config = require('../config.json');


class EditProfile extends Component {

    state =
    {
        "username": this.props.authObj.user.username,
        "email": this.props.authObj.user.attributes.email,
        
        /* props used by the Cropper and Slider components */
        crop: { x: 0, y: 0 },
        croppedAreaPixels: null,
        imageSrc: null,
        zoom: 1
    }
        
        

    /* handles form submission */
    handleSubmit = async event => 
    {
        event.preventDefault();
        
        try
        {

            const params =
            {
                "email": this.state.email,
                "username": this.state.username,
                "fullname": $("#fullname").val(),
                "birthday": $("#birthday").val(),
                "job_title": $("#jobtitle").val(),
                "employer": $("#employer").val(),
                "city": $("#city").val(),
                "phone_number": $("#phonenumber").val()
            }
            
            try
            {
                const response = await axios.patch(`${config.api.invokeUrl}/users/${this.state.email}`, params);

                if (response.status === 204)
                {
                    $("#submitBtn").off(); /* prevents events from stacking */
                    $("#successText").text("User successfully updated.");
                    $("#successText").show();
                }
                else
                {
                    $("#errorText").text("There was an error with this request.");
                    $("#errorText").show();
                }
                $("#submitBtn").off(); /* prevents events from stacking */
            }
            catch(error)
            {
                $("#errorText").text("User with this information doesn't exist");
                $("#errorText").show();
            }
        }
        catch(error)
        {
            $("#errorText").text(error);
            $("#errorText").show();
            console.log(error);
        }
    }
    
    redirectUnauthorizedUsers = event =>
    {
        if (!this.props.authObj.isAuthenticated)
        {
            this.props.history.push('/');
        }
    }

    onUsernameChange(value)
    {
        this.setState(
        {
            "username": value
        });
    }

    /* disabled in this view, but is allowed when admin is creating a new user */
    onEmailChange(value)
    {
        this.setState(
        {
            "email": value
        });
    }

    onCropChange = (crop) =>
    {
        this.setState({ crop });
    }
    
    onCropComplete = (croppedArea, croppedAreaPixels) =>
    {
        this.setState({ croppedAreaPixels });
    }
    
    onZoomChange = (zoom) =>
    {
        this.setState({ zoom });
    }


    onSelectFile = (event) =>
    {
        if (event.target.files && event.target.files.length > 0)
        {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(event.target.files[0]);
            fileReader.addEventListener('load', () =>
            {
                this.setState({imageSrc: fileReader.result});
                $("#cropperdiv").show();
                $("#buttondiv").css('display', 'flex');
            });
        }
    }

    onUpload = async (event) =>
    {
        let image = document.createElement("img");
        image.src = this.state.imageSrc;
        

        //const croppedImage = dataURLtoFile(getCroppedImg(image, this.state.croppedAreaPixels), 'temp.jpg');
        const croppedImage = getCroppedImg(image, this.state.croppedAreaPixels);

        const downloadElem = document.createElement('a');
        downloadElem.setAttribute('href', croppedImage);
        downloadElem.setAttribute('download', 'temp.jpg');
        downloadElem.style.display = 'none';
        document.body.appendChild(downloadElem);
        downloadElem.click();
        document.body.removeChild(downloadElem);
    }

    render() 
    {
        this.redirectUnauthorizedUsers();

        return (
            <section>

            { this.props.authObj.isAuthenticated &&
            (
            <div className="container">
                <br/>
                <h1>Profile Details</h1>
                <br/>

                <p id = 'errorText' className = "font-weight-bold text-danger" style={{display: 'none'}}></p>
                <p id = 'successText' className = "font-weight-bold text-success" style={{display: 'none'}}></p>
                <br/>
                <form onSubmit={this.handleSubmit}>

                {/* Profile picture setup */}
                <div className='container'>
                    <input type='file' id = 'pfpfileinput' accept='image/*' onChange={this.onSelectFile}/>
                    <div className='cropper-container' id='cropperdiv' style={{display: 'none'}}>
                        <Cropper
                            image={this.state.imageSrc}
                            crop={this.state.crop}
                            zoom={this.state.zoom}
                            aspect={1}
                            onCropChange={this.onCropChange}
                            onCropComplete={this.onCropComplete}
                            onZoomChange={this.onZoomChange}
                        />
                    </div>
                    <div id = 'buttondiv' style={{display: 'none'}}>
                        <button className='btn btn-success' id='pfpuploadbtn' type='button' onClick={this.onUpload}>Upload</button>
                    </div>
                </div>

                {/* Email input, just for display */}
                <div className="formgroup" id = 'emailFormGroup' style={{display: 'none'}}>
                    <label htmlFor="email">Email</label>
                    <input 
                    className="input form-control" 
                    type="text"
                    id="email"
                    aria-describedby="emailHelp"
                    placeholder="Enter email"
                    value={this.state.email}
                    onChange = {e => this.onEmailChange(e.target.value)}
                    />
                </div>
                
                {/* Username input, just for display */}
                <div className="formgroup" id = 'usernameFormGroup' style={{display: 'none'}}>
                    <label htmlFor="username">Username</label>
                    <input 
                    className="input form-control" 
                    type="text"
                    id="username"
                    aria-describedby="usernameHelp"
                    placeholder="Enter username"
                    value={this.state.username}
                    onChange = {e => this.onUsernameChange(e.target.value)}
                    />
                </div>

                {/* Full name input */}
                <div className="formgroup" id = 'fullnameFormGroup'>
                    <label htmlFor="fullname">Full Name</label>
                    <input 
                    className="input form-control" 
                    type="text"
                    id="fullname"
                    aria-describedby="fullnameHelp"
                    placeholder="Enter full name"
                    
                    />
                </div>
                
                {/* Birthday input */}
                <div className="formgroup" id = 'birthdayFormGroup'>
                    <label htmlFor="birthday">Birthday</label>
                    <input 
                    className="input form-control" 
                    type="text"
                    id="birthday"
                    aria-describedby="birthdayHelp"
                    placeholder="Enter birthday"
                    />
                    <small id="birthdayHelp" className="form-text text-muted">Please use MM/DD/YYYY format</small>
                </div>
                
                {/* Job Title input */}
                <div className="formgroup" id = 'jobtitleFormGroup'>
                    <label htmlFor="jobtitle">Job Title</label>
                    <input 
                    className="input form-control" 
                    type="text"
                    id="jobtitle"
                    aria-describedby="jobtitleHelp"
                    placeholder="Enter Job Title"
                    
                    />
                </div>
                
                {/* Employer input */}
                <div className="formgroup" id = 'employerFormGroup'>
                    <label htmlFor="employer">Employer</label>
                    <input 
                    className="input form-control" 
                    type="text"
                    id="employer"
                    aria-describedby="employerHelp"
                    placeholder="Enter employer"
                    
                    />
                </div>
                
                {/* City input */}
                <div className="formgroup" id = 'cityFormGroup'>
                    <label htmlFor="city">City</label>
                    <input 
                    className="input form-control" 
                    type="text"
                    id="city"
                    aria-describedby="cityHelp"
                    placeholder="Enter city"
                    
                    />
                </div>
                
                {/* Phone number input */}
                <div className="formgroup" id = 'phonenumberFormGroup'>
                    <label htmlFor="phonenumber">Phone Number</label>
                    <input 
                    className="input form-control" 
                    type="text"
                    id="phonenumber"
                    aria-describedby="phonenumberHelp"
                    placeholder="Enter phone number"
                    
                    />
                </div>

                {/* Password input */}
                <br/>
                <br/>
                <div className="formgroup" id = 'passwordForm'>
                    <a className="btn btn-outline-warning" href = '/changepassword'>Change Password</a>
                    <small id="passwordHelp" className="form-text text-muted">This will redirect you to a different page.</small>
                </div>
            
                <div className="formgroup">
                    <button className="btn btn-primary" id = 'submitBtn'>Save Changes</button>
                </div>
                </form>
            </div>
            )}

            </section>
        );
        }
}

export default EditProfile;