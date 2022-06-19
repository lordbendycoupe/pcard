import React, { Component } from 'react';
import FormErrors from "../utility/FormErrors";
import Validate from "../utility/FormValidation";
import { Auth } from 'aws-amplify';

class ForgotPassword extends Component
{
    state = 
    {
        email: "",
        errors: {
            cognito: null,
            blankfield: false
        }
    }

    clearErrorState = () => 
    {
        this.setState({
            errors: {
            cognito: null,
            blankfield: false
            }
        });
    }

    forgotPasswordHandler = async event => 
    {
        event.preventDefault();

        this.clearErrorState();
        const error = Validate(event, this.state);
        if (error) {
            this.setState({
            errors: { ...this.state.errors, ...error }
            });
        }

        try
        {
            await Auth.forgotPassword(this.state.email);
            this.props.history.push('/verify');
        }
        catch(error)
        {
            console.log(error);
        }
    }

    onInputChange = event => 
    {
        this.setState({
            [event.target.id]: event.target.value
        });
        document.getElementById(event.target.id).classList.remove("badValue");
    }

    render()
    {
        return (
            <section>
            <div className="container">
                <h1>Forgot your password?</h1>
                <p>
                Enter your email address and, if it's valid, you will receive instructions on how to reset your password.
                </p>
                <FormErrors formerrors={this.state.errors} />

                <form onSubmit={this.forgotPasswordHandler}>
                <div className="field">
                    <input
                        type="email"
                        className="input"
                        id="email"
                        aria-describedby="emailHelp"
                        placeholder="Enter email"
                        value={this.state.email}
                        onChange={this.onInputChange}
                    />
                </div>
                <br />
                <div className="field"><button className="btn btn-success">Submit</button></div>
                </form>
            </div>
            </section>
        );
    }
}

export default ForgotPassword;