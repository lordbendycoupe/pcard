import React, { Component } from 'react';
import FormErrors from "../utility/FormErrors";
import Validate from "../utility/FormValidation";
import { Auth } from 'aws-amplify';

class Verify extends Component
{
    state = 
    {
        verificationcode: "",
        email: "",
        newpassword: "",
        errors: {
            cognito: null,
            blankfield: false
        }
    };

    clearErrorState = () => {
        this.setState({
            errors: {
            cognito: null,
            blankfield: false
            }
        });
    };

    passwordVerificationHandler = async event => 
    {
        event.preventDefault();

        // Form validation
        this.clearErrorState();
        const error = Validate(event, this.state);
        if (error) {
            this.setState({
            errors: { ...this.state.errors, ...error }
            });
        }

        try
        {
            await Auth.forgotPasswordSubmit(this.state.email, this.state.verificationcode, this.state.newpassword);
            this.props.history.push('/confirm');
        }
        catch(error)
        {
            console.log(error);
        }
    };

        onInputChange = event =>
        {
            this.setState({
                [event.target.id]: event.target.value
            });
            document.getElementById(event.target.id).classList.remove("badValue");
        };

        render() {
        return (
            <section>
            <div className="container">
                <h1>Set new password</h1>
                <p>
                Enter the verification code sent to your email address below,
                your email address and a new password.
                </p>
                <FormErrors formerrors={this.state.errors} />

                <form onSubmit={this.passwordVerificationHandler}>
                <div className="field">
                    <input
                        type="text"
                        className="input"
                        id="verificationcode"
                        aria-describedby="verificationCodeHelp"
                        placeholder="Enter verification code"
                        value={this.state.verificationcode}
                        onChange={this.onInputChange}
                    />
                </div>

                <div className="field">
                    <input 
                        className="input" 
                        type="email"
                        id="email"
                        aria-describedby="emailHelp"
                        placeholder="Enter email"
                        value={this.state.email}
                        onChange={this.onInputChange}
                    />
                </div>

                <div className="field">
                    <input
                        type="password"
                        className="input"
                        id="newpassword"
                        placeholder="New password"
                        value={this.state.newpassword}
                        onChange={this.onInputChange}
                    />
                </div>

                <div className="field"><button className="btn btn-success">Confirm reset</button></div>
                </form>
            </div>
            </section>
        );
    }
}

export default Verify;