import React from "react";

/* updates front-end display of current errors */
function FormErrors(props) {
    if (props.formerrors && (props.formerrors.blankfield || props.formerrors.passwordmatch))
    {
        return (
            <div className="container">
                <div className="font-weight-bold text-danger">
                    {props.formerrors.passwordmatch ? "Password value does not match confirm password value" : ""}
                </div>

                <div className="font-weight-bold text-danger">
                    {props.formerrors.blankfield ? "All fields are required" : ""}
                </div>
            </div>
        );
    } 
    else if (props.apierrors) 
    {
        return (
            <div className="container">
                <div className="font-weight-bold text-danger">{props.apierrors}</div>
            </div>
        );
    } 

    else if (props.formerrors && props.formerrors.cognito) 
    {
        return (
            <div className="container">
                <div className="font-weight-bold text-danger"> {props.formerrors.cognito.message} </div>
            </div>
        );
    }

    else 
    {
        return <div />;
    }
}

export default FormErrors;