import React, { Component } from 'react';
import FormErrors from "../utility/FormErrors";
import Validate from "../utility/FormValidation";
import { Auth } from "aws-amplify";


class Login extends Component {
    state = 
    {
      email: "",
      password: "",
      errors: {
        cognito: null,
        blankfield: false
      }
    };

    /* resets errors for further input validation */
    clearErrorState = () => 
    {
      this.setState({
        errors: {
          cognito: null,
          blankfield: false
        }
      });
    };

    /* handles form submission */
    handleSubmit = async event => 
    {
      event.preventDefault(); /* prevents page resubmission */

      /* Validating form data */
      this.clearErrorState();
      const error = Validate(event, this.state);
      if (error) 
      {
          this.setState({
            errors: { ...this.state.errors, ...error }
          });
      }

      try
      {
          const user = await Auth.signIn(this.state.email, this.state.password);
          this.props.authObj.setAuthStatus(true);
          this.props.authObj.setUser(user);
          this.props.history.push('/');
          window.location.reload(false);
      }
      catch(error)
      {
          let err = null;
          !error.message ? err = {"message": error} : err = error; /* ensuring error is in proper format */
          this.setState({
              errors:
              {
                  ...this.state.errors, /* preserve current errors */
                  cognito: err
              }
          })
      }
    };

    /* on input change, remove the targeted field from the list of 'bad' values */
    onInputChange = event => 
    {
      this.setState({
          [event.target.id]: event.target.value
      });
      document.getElementById(event.target.id).classList.remove("badValue");
    };

    render() 
    {
        return (
            <div className="container">
                <br/>
                <h1>Log In</h1>
                <FormErrors formerrors={this.state.errors} />

                <form onSubmit={this.handleSubmit}>
                    
                    {/* Email input */}
                    <div className="formgroup">
                        <input 
                        className="input form-control" 
                        type="text"
                        id="email"
                        aria-describedby="emailHelp"
                        placeholder="Enter email"
                        value={this.state.email}
                        onChange={this.onInputChange}
                        />
                    </div>

                    {/* Password input */}
                    <div className="formgroup">
                        <input 
                        className="input form-control" 
                        type="password"
                        id="password"
                        placeholder="Password"
                        value={this.state.password}
                        onChange={this.onInputChange}
                        />
                        <a href="/forgotpassword">Forgot password?</a>
                    </div>
                
                    <button className="btn btn-primary">Login</button>
                </form>
            </div>
      );
    }
}

export default Login;