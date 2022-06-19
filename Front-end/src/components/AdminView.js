import React, { Component } from 'react';
import { DataTable } from './utility/DataTable';
import ReactDOM from 'react-dom';
import axios from "axios";
import EditProfile from './EditProfile';
import { Auth } from '@aws-amplify/auth';
import FormErrors from "./utility/FormErrors";
import Validate from "./utility/FormValidation";

const config = require('../config.json');
const $ = require('jquery');

class AdminView extends Component {

    /* note: with more understanding of how DataTables integrates into React (and with a paid subscription),
    everything here could be done within a JS Datatable as it allows selection AND on-the-fly editing */

    state = 
    {
        email: '',
        errors: {
            blankfield: false
        }
    }

    /* resets errors for further input validation */
    clearErrorState = () => 
    {
        this.setState({
            email: '',
            errors: {
            blankfield: false
            }
        });
    }

    redirectUnauthorizedUsers = event =>
    {
        if (!this.props.authObj.isAdmin)
        {
            this.props.history.push('/');
        }
    }

    readUsers = async () =>
    {
        $(".adminViewElem").hide();
        $("#infoText").text("You may have to refresh for recent changes to take effect.");
        $("#infoText").show();
        this.clearErrorState();
        $("#submitBtn").off(); /* prevents events from stacking */
        $("#submitBtn").on("click", this.readUsers);
        let userListDirty = await axios.get(`${config.api.invokeUrl}/users`);
        userListDirty = userListDirty.data.Items;
        ReactDOM.render(<DataTable data={userListDirty}/>, document.getElementById('readUsersDiv'));
        $("#readUsersDiv").show();
    }

    displayProfileFields = async (operation) =>
    {   
        $(".adminViewElem").hide();
        $("#pfpfileinput").hide();  
        this.clearErrorState();
        
        /* reset elements */
        $("#infoText").text('');
        $("#emailFormGroup").show();  
        $("#fullnameFormGroup").show(); 
        $("#birthdayFormGroup").show(); 
        $("#jobtitleFormGroup").show(); 
        $("#employerFormGroup").show(); 
        $("#cityFormGroup").show(); 
        $("#phonenumberFormGroup").show();

        /* importing the normal profile details page as template */
        const editProfileSect = ReactDOM.render(<EditProfile { ...this.props } authObj= { this.props.authObj } />, document.getElementById('createUserOptDiv'));
        document.getElementById("email").classList.remove("badValue");
        

        /* making minor adjustments to the above code to fit new requirements */
        $("#passwordForm").hide();
        if (operation === 'create')
        {
            $("#submitBtn").off(); /* prevents events from stacking */
            $("#submitBtn").text("Create User");
            $("#submitBtn").on("click", this.createUser); 
            $("#infoText").text("User will be sent a verification email; they are not added to the DB or Cognito until their information is verified.");
            $("#infoText").show();
            $("#pfpfileinput").hide();
            $("#emailFormGroup").show();  
            $("#fullnameFormGroup").hide(); 
            $("#birthdayFormGroup").hide(); 
            $("#jobtitleFormGroup").hide(); 
            $("#employerFormGroup").hide(); 
            $("#cityFormGroup").hide(); 
            $("#phonenumberFormGroup").hide();
        }     
        else if (operation === 'update')
        {
            $("#submitBtn").off(); /* prevents events from stacking */
            $("#pfpfileinput").hide();
            $("#emailFormGroup").show();  
            $("#submitBtn").text("Update User");
            $("#submitBtn").on("click", this.updateUser);
            $("#infoText").text("Only works on existing users.");
            $("#infoText").show();
        }
        else
        {
            $("#submitBtn").off(); /* prevents events from stacking */
            $("#submitBtn").text("Delete User");
            $("#pfpfileinput").hide();
            $("#submitBtn").on("click", this.deleteUser);
            $("#emailFormGroup").show();
            $("#fullnameFormGroup").hide(); 
            $("#birthdayFormGroup").hide(); 
            $("#jobtitleFormGroup").hide(); 
            $("#employerFormGroup").hide(); 
            $("#cityFormGroup").hide(); 
            $("#phonenumberFormGroup").hide();
        }

        editProfileSect.setState(
        {
            "email": ''
        });


        $("#createUserOptDiv").show()
    }

    
    createUser = async (event) =>
    {
        event.preventDefault();
        this.clearErrorState();
        $("#submitBtn").off(); /* prevents events from stacking */
        $("#submitBtn").on("click", this.createUser);

        this.setState({email: $("#email").val()});
        const error = Validate(event, this.state);
        if (error)
        {
            this.setState({
                errors: { ...this.state.errors, ...error }
            });
        }
        else
        {
            try
            {
    
                const params =
                {
                    "email": $("#email").val(),
                    "fullname": $("#fullname").val(),
                    "birthday": $("#birthday").val(),
                    "job_title": $("#jobtitle").val(),
                    "employer": $("#employer").val(),
                    "city": $("#city").val(),
                    "phone_number": $("#phonenumber").val()
                }
                
                /* call sign up method, which will trigger a confirmation email to be sent */
                /* lambda function set up to add user to user group and db upon confirmation */
                /* for a user created this way, they first have to confirm their account, then request a
                password reset. */
    
                /* the signup function requires a password on execution. The following code will generate a cryptographically sound
                password that is guaranteed to meet the Cognito password policy */
    
                /* generating number that acts as the base for the password */
                let cryptoArray = new Uint32Array(1);
                window.crypto.getRandomValues(cryptoArray);
                let cryptoPassInitial = cryptoArray[0].toString().split("");
    
                /* generating placement of the characters that will satisfy Cognito requirements */
                let cryptoPassCapitalPlacement = Math.floor(Math.random() * (cryptoPassInitial.length - 0) + 0);
                let cryptoPassLowerPlacement = Math.floor(Math.random() * (cryptoPassInitial.length - 0) + 0);
                let cryptoPassSymbolPlacement = Math.floor(Math.random() * (cryptoPassInitial.length - 0) + 0);
    
                /* generating the characters themselves */
                let capitalLetter = String.fromCharCode(Math.floor(Math.random() * (90 - 65) + 65));
                let smallLetter = String.fromCharCode(Math.floor(Math.random() * (122 - 97) + 97));
                let symbol = String.fromCharCode(94,36,42,46,40,41,60,61,63,44).split("")[Math.floor(Math.random() * (9 - 0) + 0)];
    
                /* adding the characters in at their designated indices */
                let cryptoPassFull = [];
                for (let i = 0; i < cryptoPassInitial.length; i++)
                {
                    if (i === cryptoPassCapitalPlacement)
                    {
                        cryptoPassFull.push(capitalLetter);
                    }
    
                    if (i === cryptoPassSymbolPlacement)
                    {
                        cryptoPassFull.push(symbol);
                    }
    
                    if (i === cryptoPassLowerPlacement)
                    {
                        cryptoPassFull.push(smallLetter);
                    }
    
                    cryptoPassFull.push(cryptoPassInitial[i]);
                }
    
                cryptoPassFull = cryptoPassFull.join("");
                const { email } = params;
                await Auth.signUp({
                    username: email,
                    "password": cryptoPassFull
                }); 

                $(".adminViewElem").hide();
                $("#successText").text("User successfully added. They will appear in the database once they have verified their email.");
                $("#successText").show();
            }
            catch(error)
            {
                $("#errorText").text(error);
                $("#errorText").show();
                console.log(error);
            }
        }
    }

    updateUser = async (event) =>
    {
        event.preventDefault();
        this.clearErrorState();
        $("#submitBtn").off(); /* prevents events from stacking */
        $("#submitBtn").on("click", this.updateUser);

        this.setState({email: $("#email").val()});
        const error = Validate(event, this.state);
        if (error)
        {
            this.setState({
                errors: { ...this.state.errors, ...error }
            });
        }
        else
        {
            try
            {
    
                const params =
                {
                    "email": $("#email").val(),
                    "username": "filler", /* gets queried by the db based on email */
                    "fullname": $("#fullname").val(),
                    "birthday": $("#birthday").val(),
                    "job_title": $("#jobtitle").val(),
                    "employer": $("#employer").val(),
                    "city": $("#city").val(),
                    "phone_number": $("#phonenumber").val()
                }
                
                try
                {
                    const response = await axios.patch(`${config.api.invokeUrl}/users/${params.email}`, params);

                    if (response.status === 204)
                    {
                        $("#submitBtn").off(); /* prevents events from stacking */
                        $(".adminViewElem").hide();
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
    }

    deleteUser = async (event) =>
    {
        event.preventDefault();
        this.clearErrorState();
        $("#submitBtn").off(); /* prevents events from stacking */
        $("#submitBtn").on("click", this.deleteUser);

        this.setState({email: $("#email").val()});
        const error = Validate(event, this.state);
        if (error)
        {
            this.setState({
                errors: { ...this.state.errors, ...error }
            });
        }
        else
        {
            $("#successText").text("");
            $("#errorText").text("");

            try
            {
                await axios.delete(`${config.api.invokeUrl}/users/${$("#email").val()}`); /* deletes from the db */
                $("#successText").text("\nUser successfully deleted.");
            }
            catch(error)
            {
                console.log(error);
                $("#errorText").text("\nCould not delete user:" + error);
            }

            $(".adminViewElem").hide();
            $("#successText").show();
            $("#errorText").show();
        }

    }
    
    render() 
    {                
        this.redirectUnauthorizedUsers();

        return (
            <section>
            { this.props.authObj.isAdmin &&
            (
            <div className="container">
                <br/>
                <h1>Admin Commands</h1>
                <br/>

                <div className="formgroup form-check-inline">
                    <button className="btn btn-primary" onClick={() => this.displayProfileFields("create")}>Create User</button>
                </div>

                <div className="formgroup form-check-inline">
                    <button className="btn btn-primary" onClick={this.readUsers}>Read Users</button>
                </div>

                <div className="formgroup form-check-inline">
                    <button className="btn btn-primary" onClick={() => this.displayProfileFields("update")}>Update User</button>
                </div>

                <div className="formgroup form-check-inline">
                    <button className="btn btn-primary" onClick={() => this.displayProfileFields("delete")}>Delete User</button>
                </div>
                
                <p id = 'infoText' className = "font-weight-bold adminViewElem" style={{display: 'none'}}></p>
                <p id = 'errorText' className = "font-weight-bold text-danger adminViewElem" style={{display: 'none'}}></p>
                <p id = 'successText' className = "font-weight-bold text-success adminViewElem" style={{display: 'none'}}></p>
            </div>
            )}
            <FormErrors formerrors={this.state.errors} />
            <div className = 'adminViewElem' id = 'readUsersDiv'></div>
            <div className = 'adminViewElem' id = 'createUserOptDiv'></div>

            </section>
        );
    }
}

export default AdminView;