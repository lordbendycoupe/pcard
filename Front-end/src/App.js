/* react elements / other packages */
import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Auth } from 'aws-amplify';

/* components */
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Welcome from './components/auth/Welcome';
import Generate from './components/Generate';
import EditProfile from './components/EditProfile';
import ForgotPassword from './components/auth/ForgotPassword';
import Verify from './components/auth/Verify';
import Confirm from './components/auth/Confirm';
import ChangePassword from './components/auth/ChangePassword';
import AdminView from './components/AdminView';

/* style sheets */
import './mainstyle.css';

class App extends Component {

    state =
    {
        isAuthenticated: false,
        isAuthenticating: true,
        user: null,
        isAdmin : false
    }


    /* setting current authentication status globally for use across all components */
    setAuthStatus = authenticated =>
    {
        this.setState({ isAuthenticated: authenticated});
    }

    setUser = user =>
    {
        this.setState({user: user });
    }

    setAdminStatus = adminStatusBool =>
    {
        this.setState({isAdmin: adminStatusBool });
    }

    /* allows for session persistence */
    async componentDidMount()
    {
        try
        {
            const user = await Auth.currentAuthenticatedUser();
            if (user.signInUserSession.accessToken.payload["cognito:groups"][0] === 'Administrators')
            {
                this.setAdminStatus(true);
            }
            else
            {
                this.setAdminStatus(false);
            }

            this.setAuthStatus(true);
            this.setUser(user);
        }
        catch(error)
        {
            console.log(error);
        }

        this.setState({ isAuthenticating: false });
    }

    render()
    {
        const authObj =
        {
            isAuthenticated: this.state.isAuthenticated,
            user: this.state.user,
            isAdmin: this.state.isAdmin,
            setAuthStatus: this.setAuthStatus,
            setUser: this.setUser,
            setAdminStatus: this.setAdminStatus
        }

        return (
            !this.state.isAuthenticating &&
            <div>
                {/* Bootstrap and jquery */}
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossOrigin="anonymous" />
                <link rel="stylesheet" href="mainstyle.css" />
                
                {/* JS Datatable */}
                <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/dt/dt-1.11.3/sc-2.0.5/sp-1.4.0/sl-1.3.3/datatables.min.css"/>

                <Router>
                    <Navbar authObj = { authObj }/>
                    <Route exact path="/" render={(props) => <Home { ...props } authObj= { authObj } />} />
                    <Route exact path="/login" render={(props) => <Login { ...props } authObj= { authObj } />} />
                    <Route exact path="/register" render={(props) => <Register { ...props } authObj= { authObj } />} />
                    <Route exact path="/welcome" render={(props) => <Welcome { ...props } authObj= { authObj } />} />
                    <Route exact path="/generate" render={(props) => <Generate { ...props } authObj= { authObj } />} />
                    <Route exact path="/editprofile" render={(props) => <EditProfile { ...props } authObj= { authObj } />} />
                    <Route exact path="/forgotpassword" render={(props) => <ForgotPassword { ...props } authObj= { authObj } />} />
                    <Route exact path="/verify" render={(props) => <Verify { ...props } authObj= { authObj } />} />
                    <Route exact path="/confirm" render={(props) => <Confirm { ...props } authObj= { authObj } />} />
                    <Route exact path="/changepassword" render={(props) => <ChangePassword { ...props } authObj= { authObj } />} />
                    <Route exact path="/adminview" render={(props) => <AdminView { ...props } authObj= { authObj } />} />
                </Router>
            
            </div>

        );
    }
}

export default App;
