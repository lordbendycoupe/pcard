import React, { Component, Fragment } from 'react';

export default class Home extends Component {
    render()
    {
        return (
            <Fragment>
                <div className="container">
                    <div className='row align-items-center'>
                        <div className="col-lg">
                            <div className="shadow-lg jumbotron" style={{marginTop: '5vh'}}>
                                <h1 className="display-4">Citadel Cards are here</h1>
                                <p className="lead">The wait is over. The only business card you'll ever need is waiting to be made.</p>
                                <hr className="my-4" />
                                
                            { !this.props.authObj.isAuthenticated &&
                            (
                                <div>
                                    <p>Sign in to get started</p>
                                    <a className="btn btn-primary btn-lg" href="/login" role="button">Sign in</a>
                                </div>
                            )}

                            {this.props.authObj.isAuthenticated && this.props.authObj.user &&
                            (
                                <a className="btn btn-primary btn-lg" href="/generate" role="button">Generate Now</a>
                            )}

                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}