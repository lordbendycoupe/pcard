function validateForm(event, state) {
    /* clear all error messages to prepare for resetting them */
    const inputs = document.getElementsByClassName("badValue");
    for (let i = 0; i < inputs.length; i++) 
    {
        if (!inputs[i].classList.contains("error")) 
        {
            inputs[i].classList.remove("badValue");
        }
    }
  
    if (state.hasOwnProperty("email") && state.email === "") 
    {
        document.getElementById("email").classList.add("badValue");
        return { blankfield: true };
    }
    
    if (state.hasOwnProperty("firstname") && state.firstname === "") 
    {
        document.getElementById("firstname").classList.add("badValue");
        return { blankfield: true };
    }

    if (state.hasOwnProperty("lastname") && state.lastname === "") 
    {
        document.getElementById("lastname").classList.add("badValue");
        return { blankfield: true };
    }

    if (state.hasOwnProperty("verificationcode") && state.verificationcode === "") 
    {
        document.getElementById("verificationcode").classList.add("badValue");
        return { blankfield: true };
    }

    if (state.hasOwnProperty("password") && state.password === "") 
    {
        document.getElementById("password").classList.add("badValue");
        return { blankfield: true };
    }

    if (state.hasOwnProperty("oldpassword") && state.oldpassword === "") 
    {
        document.getElementById("oldpassword").classList.add("badValue");
        return { blankfield: true };
    }

    if (state.hasOwnProperty("newpassword") && state.newpassword === "") 
    {
        document.getElementById("newpassword").classList.add("badValue");
        return { blankfield: true };
    }
    
    if (state.hasOwnProperty("confirmpassword") && state.confirmpassword === "") 
    {
        document.getElementById("confirmpassword").classList.add("badValue");
        return { blankfield: true };
    }

    if (state.hasOwnProperty("password") && state.hasOwnProperty("confirmpassword") && state.password !== state.confirmpassword)
    {
        document.getElementById("password").classList.add("badValue");
        document.getElementById("confirmpassword").classList.add("badValue");
        return { passwordmatch: true };
    }

    if (state.hasOwnProperty("newpassword") && state.hasOwnProperty("confirmpassword") && state.newpassword !== state.confirmpassword)
    {
        document.getElementById("newpassword").classList.add("badValue");
        document.getElementById("confirmpassword").classList.add("badValue");
        return { passwordmatch: true };
    }

    return;
  }
  
  export default validateForm;