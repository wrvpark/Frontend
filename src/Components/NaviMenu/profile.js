import React from 'react';
import styles from './sideMenu.module.css';
import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import Form from 'react-bootstrap/Form'
import { Component } from "react";
import { userLogin, registerUser } from '../../api/apifunction'
import { decodeToken } from "../Account/decodeAccessToken";
import { message } from 'antd';
import { NavLink } from "react-router-dom";
import three_dots from '../../images/three_dots.svg'
import profile_icon from '../../images/profile_icon.svg'

const username = localStorage.getItem("username")

const Profile = (props) => {

  //modal usestate for login
  const [showModalLogin, setShow] = useState(false);

  //modal usestate for registration
  const [showModalRegistration, setShow2] = useState(false);

  //modal usestate for password reset
  const [showModalPasswordReset, setShow3] = useState(false);

  //modal usestate for notification registration
  const [showModalNotifications, setShow4] = useState(false);

  //variables for the access token
  const [accessToken, setAccessToken] = useState('');

  //entered username and password
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  //variables for the registration form
  const [passwordVerify, setPasswordVerify] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [lotNumber, setLotNumber] = useState("");
  const [primaryPhone, setPrimary] = useState("");
  const [secondaryPhone, setSecondary] = useState("");
  const [ownership, setOwnership] = useRadioButtons("ownership");

  //modal usestate handler for the logout
  const [showLogout, setShowLogout] = useState(false);

  //variable and handler for name
  const [name, setName] = useState("");

  //variables for notification settings
  const [parkNotification, setParkNotifications] = useRadioButtons("park");
  const [eventsNotification, setEventNotifications] = useRadioButtons("events");
  const [salesNotification, setSaleNotification] = useRadioButtons("sales");
  const [servicesNotification, setServicesNotification] = useRadioButtons(
    "services");
  const [lostfoundNotification, setLostFoundNotification] = useRadioButtons(
    "lostfound");

  //error message if the credential is incorrect
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessageNotification, setErrorNotification] = useState("");
  const [errorMessageRegistration, setErrorRegistration] = useState("");

  //modal manager for login
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //manager for registration
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

  //manager for password reset
  const handleClose3 = () => setShow3(false);
  const handleShow3 = () => setShow3(true);

  //manager for notification settings
  const handleClose4 = () => setShow4(false);
  const handleShow4 = () => setShow4(true);

  //constants for the state of the login and show profile
  const [showLogin, setShowLogin] = useState(true);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const checkForToken = localStorage.getItem("access_token");
    if (checkForToken !== null) {
      retrieveName();
      setShowLogin(!showLogin);
      setShowProfile(!showProfile);
    }
  }, []);

  useEffect(() => {
    console.log("logOut is " + props.LogOutData);
    if (props.LogOutData === true) {
      setShowLogin(true);
      setShowLogout(false);
      setShowProfile(false);
      message.success("Logout Successful.", 5);
      localStorage.clear();
      props.parentCallback(showLogout, false);
    }
  }, [props.LogOutData]);

  useEffect(() => {
    const checkForToken = localStorage.getItem("access_token");
    if (checkForToken !== null) {
      setShowLogin(!showLogin);
      setShowProfile(!showProfile);
    } else {
      setShowLogin(true);
      setShowProfile(false);
    }
  }, [userName]);

  useEffect(() => {
    if (showLogout === true) {
      setShowLogin(false);
      setShowProfile(false);
    } else if (
      showLogout === false &&
      localStorage.getItem("access_token") !== null
    ) {
      setShowLogin(false);
      setShowProfile(true);
    }
    props.parentCallback(showLogout, false);
  }, [showLogout]);

  //function for verifying the login
  const verifyLogin = async () => {

    //loggin in with the entered credentials

    if (userName === "" || password === "")
    {
        setErrorMessage('Please fill in all the fields')
    }
    else
    {
        const response = await userLogin(userName, password);
        const name = userName.split("@")

        if (response.status === 200) {
              //setting token and username
              localStorage.setItem('access_token', response.data.access_token)
              localStorage.setItem("refresh_token", response.data.refresh_token)

              decodeToken();
              retrieveName();

              handleClose()

              //swiching which state is visible
              setShowLogin(!showLogin)
              setShowProfile(!showProfile)

              //Login message upon successful login
              message.success("Login Successful.", 5)
              setErrorMessage('')
              clearData();

              window.location.reload()
            }
            else {
              //Error message upon unsucessful credentials
              setErrorMessage('Incorrect username or password!')
            }
        }
  }

  // handle verifying the registration
  const verifyRegistration = () => {
    const check = checkData();

    //let validUsername = verifyUsername(username);
    if (check) {
      goToNotification();
      setErrorRegistration('');
    }
  }

  //function for verifying the notification settings form
  const verifyNotification = async () => {

    postRegistrationForm();
  }

  //function for retrieving the name of the user who logged in
  const retrieveName = () => {
    const details = JSON.parse(localStorage.getItem("session_details"));
    if (details !== null) {
      setName(details.name);
    }
    // console.log(details)
  };


  // function for verifying the email
  const checkData = () => {
    console.log("VERIFYING DATA")
    let valid = true;
    //console.log("FIRST " + is_firstName)
    if (firstName === "") {
      valid = false;
      setErrorRegistration('Please enter your first name');
    }
    else if (lastName === "") {
      valid = false;
      setErrorRegistration('Please enter your last name');
    }
    else if (lotNumber === "") {
      valid = false;
      setErrorRegistration('Please enter in your lot number');
    }
    else if (validateEmail(userName) === false) {
      valid = false;
      setErrorRegistration('Please enter in a valid email');
    }
    else if (passwordValidate(password) === false) {
      valid = false;
      setErrorRegistration('Password must contain at least one lowercase letter, one upercase letter, one number, and one special character  ')
    }
    else if (passwordVerify === "") {
      valid = false;
      setErrorRegistration('Please confirm your password');
    }
    else if (password != passwordVerify) {
      valid = false;
      setErrorRegistration('Passwords must match')
    }
    else if (ownership === null) {
      valid = false;
      setErrorRegistration('Please choose your lot ownership status')
    }
    return valid;
  }

  //validate email function
  function validateEmail(email) {
    let emailAddress = /\S+@\S+\.\S+/;
    return emailAddress.test(email);
  }

  // password validation function
  function passwordValidate(password) {
    let strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    return strongRegex.test(password);
  }

  // clears data of the form when a form is exited
  function clearData() {
    setUserName("")
    setPassword("")
    setFirstName("")
    setLastName("")
    setLotNumber("")
    setPasswordVerify("")
  }

  // function for verifying ownership
  function verifyOwnership(ownership) {
    let is_owner = false
    let is_renter = false

    if (ownership === "yes") {
      is_owner = true;
      let is_renter = false;

    } else {
      is_owner = false;
      let is_renter = true;
    }

    return [is_owner, is_renter];
  }

  //function for verifying notification settings
  function verifyNotificationSettings(parkNotification, eventsNotification, salesNotification, servicesNotification, lostfoundNotification) {
    let isPark = false;
    let isEvents = false;
    let isSales = false;
    let isServices = false;
    let isLostFound = false;

    let nullResponse = false;

    //verification
    if (parkNotification === null || eventsNotification === null || salesNotification === null || servicesNotification === null ||
      lostfoundNotification === null) {
      nullResponse = true;
    }
    if (parkNotification === "yes") {
      isPark = true;
    } else {
      isPark = false;
    }
    if (eventsNotification === "yes") {
      isEvents = true;
    } else {
      isEvents = false;
    }
    if (salesNotification === "yes") {
      isSales = true;
    } else {
      isSales = false;
    }
    if (servicesNotification === "yes") {
      isServices = true;
    } else {
      isServices = false;
    }
    if (lostfoundNotification === "yes") {
      isLostFound = true;
    } else {
      isLostFound = false;
    }
    //return an array
    return [isPark, isEvents, isSales, isServices, isLostFound, nullResponse];
  }

  //function for valditing the registration form
  const postRegistrationForm = async () => {
    let primary_phone = "";
    let secondary_phone = "";

    //ownership values;
    let ownershipValues = verifyOwnership(ownership);
    let is_owner = ownershipValues.first;
    let is_renter = ownershipValues.second;

    //type of member;
    let is_board_member = false;
    let is_park_management = false;
    let is_admin = false;
    let picture = "";

    //notification values;
    let notificationsValues = verifyNotificationSettings(parkNotification, eventsNotification, salesNotification, servicesNotification, lostfoundNotification);
    let nullResponse = notificationsValues[5];
    let isPark = notificationsValues[0];
    let isEvents = notificationsValues[1];
    let isSales = notificationsValues[2];
    let isServices = notificationsValues[3];
    let isLostFound = notificationsValues[4];

    if (nullResponse == true) {
      setErrorNotification('Please fill in all fields')
    }
    else {
      const response = await registerUser(firstName, lastName, parseInt(lotNumber), password, passwordVerify, userName, primary_phone, secondary_phone, is_owner, is_renter, is_board_member, is_park_management, is_admin, picture, isPark, isEvents, isSales, isServices, isLostFound);
      console.log(response)
      if (response !== "Network Error" && typeof response !== 'string') {

        console.log(response.data.status)
        if (response.data.status === "SUCCESS") {
          // Successfull
          //                        this.props.props.history.goBack();
          message.success("Account Succesfully Created")
          handleClose4()
          clearData()
        } else {
          // Error
          message.error("Error adding post to server")
        }
      } else {
        message.error("Server is down")
      }
    }
  }

  //handles closing the login page and opening the registration
  function goToRegister() {
    handleClose();
    handleShow2();
    setErrorMessage('');
    setErrorRegistration('');
  }

  //handles closing the password reset and opening the registration page
  function goToRegister2() {
    handleClose3();
    handleShow2();
    setErrorMessage('');
    setErrorRegistration('');
  }

  //handles closing the registration form and opening the login form
  function goToLogin() {
    handleClose2();
    handleShow();
        setErrorMessage('');
            setErrorRegistration('');
  }

  //handles closing the password reset form and opening the login form
  function goToLogin2() {
    handleClose3();
    handleShow();
        setErrorMessage('');
            setErrorRegistration('');
  }

  //handles closing the registration form and opening the registration form
  function goToNotification() {
    handleClose2();
    handleShow4();
        setErrorMessage('');
            setErrorRegistration('');
  }

  //goes to the password reset form from the login form
  function goToReset() {
    handleClose();
    handleShow3();
    setErrorMessage('');
        setErrorRegistration('');
  }

  //clears out all the data in the form upon closing the form
  function handleLoginClose() {
    handleClose();
    setUserName('');
    setPassword('');
    setErrorMessage('');
  }

  //clears out all the data in the form upon closing the form
  function handleRegistrationClear() {
    handleClose2();
    setUserName('');
    setPassword('');
    setLotNumber('');
    setFirstName('');
    setLastName('');
    setPasswordVerify('');
    setErrorRegistration('');
  }

  //logout function
  function Logout() {
    //clearing local storage
    localStorage.clear();

    //making login visible, and profile invisible
    setShowLogin(!showLogin)
    setShowProfile(!showProfile)

    //logout message
    message.success("Logout Successful.", 5)
  }

  function onValueChange(event) {
    this.setState({
      selectedOption: event.target.value
    });
  }

  //radio button usage
  function useRadioButtons(name) {
    const [value, setState] = useState(null);

    const handleChange = e => {
      //       console.log(e.target.value)
      setState(e.target.value);
    };

    const inputProps = {
      name,
      type: "radio",
      onChange: handleChange
    };

    //    console.log(value + inputProps)
    return [value, inputProps];
  }

  const handleProfileChange = () => {
    setShowLogout(!showLogout);
  };

  //all the modal forms are contained in this component
  return (
    <>
      {/* login and profile */}

      <div className={styles.profile}>
        {showLogin && (
          <div>
            {" "}
            <a href="#" onClick={handleShow}>
              Log In
            </a>
            <h3>or</h3>
            <a href="#" onClick={handleShow2}>
              Register
            </a>
          </div>
        )}
        {showProfile && (
          <div>
            {/* <a href={"home"} onClick={Logout}>Logout</a> */}
            {/* <h3
              onClick={() => handleProfileChange()}
              className={styles.profileName}
            >
              {name}
            </h3> */}
            {/* <img src={ThreeDots} className="three_dots" alt="three_dots" /> */}
            <NavLink to="/" exact onClick={() => handleProfileChange()}>
              <h4 className={styles.profileName}>{name}</h4>
              {/* <img src={three_dots} className="three_dots" alt="three_dots" /> */}
              <img src={profile_icon} className="profile_icon" alt="profile_icon" />
            </NavLink>
          </div>
        )}
        {showLogout && (
          <div>
            <h4
              onClick={() => handleProfileChange()}
              className={styles.profileName}
            >
              Go Back
              &ensp;
            </h4>
              <img src={three_dots} className="three_dots" alt="three_dots" />
            {/* <a href="#" onClick={handleShow}>
              Log In
            </a> */}
          </div>
        )}
      </div>

      {/*form for login*/}
      <Modal show={showModalLogin} onHide={handleLoginClose}>
        <Modal.Header closeButton>
          <Modal.Title>Login Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <h5 className='error'>{errorMessage}</h5>
          <Form.Group id="loginForm" >
            <Form.Label>Username: </Form.Label>
            <Form.Control type="text" onChange={e => { setUserName(e.target.value) }} value={userName} />
            <Form.Label>Password: </Form.Label>
            <Form.Control type="password" onChange={e => { setPassword(e.target.value) }} value={password} />
          </Form.Group>
          <a href="#" className="access_links" onClick={goToReset}>
            Forgot your password?
          </a>
        </Modal.Body>
        <Modal.Footer>
          
          <Button variant="primary" type="submit" onClick={() => verifyLogin()}>
            <span className="login_button">Submit</span>
          </Button>
          Not a member?{" "}
          <a className="access_links" href="#" onClick={goToRegister}>
            Register here!
          </a>
        </Modal.Footer>
      </Modal>

      {/* modal form  for registration*/}

      <Modal show={showModalRegistration} onHide={handleRegistrationClear}>
        <Modal.Header closeButton>
          <Modal.Title>Registration Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {<p className='error'>{errorMessageRegistration}</p>}
          <Form.Group id="registrationForm" >
            <div class="modal-body">
              <div class="row">
                <div class="col-md-60">
                  <Form.Label>First Name: </Form.Label>
                  <Form.Control type="text" onChange={e => { setFirstName(e.target.value) }} value={firstName} />
                  <Form.Label>Lot# </Form.Label>
                  <Form.Control type="number" onChange={e => { setLotNumber(e.target.value) }} value={lotNumber} />
                  <Form.Label>Password: </Form.Label>
                  <Form.Control type="password" onChange={e => { setPassword(e.target.value) }} value={password} />
                  {/* <Form.Label>Primary Phone Number: </Form.Label>
                  <Form.Control type="number" onChange={e => { setPrimary(e.target.value) }} value={primaryPhone} /> */}
                </div>
                <div class="col-md-6">
                  <Form.Label>Last Name: </Form.Label>
                  <Form.Control type="text" onChange={e => { setLastName(e.target.value) }} value={lastName} />
                  <Form.Label>Email: </Form.Label>
                  <Form.Control type="email" onChange={e => { setUserName(e.target.value) }} value={userName} />
                  <Form.Label>Password Confirmation: </Form.Label>
                  <Form.Control type="password" onChange={e => { setPasswordVerify(e.target.value) }} value={passwordVerify} />
                 {/* <Form.Label>Secondary Phone Number: </Form.Label>
                 <Form.Control type="number" onChange={e => { setSecondary(e.target.value) }} value={secondaryPhone} /> */}
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                Do you own a lot at the park?
                       </div>
              <div class="col-md-6">
                <fieldset>

                    <input
                    value="yes"
                    checked={ownership === "yes"}
                    {...setOwnership}
                     />
                     Yes
                     &ensp;

                     <input
                    value="no"
                    checked={ownership === "no"}
                    {...setOwnership}
                  />
                  No
                </fieldset>
              </div>
            </div>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          {/*{<p className='error'>{errorMessageRegistration}</p>}*/}
          <Button variant="primary" type="submit" onClick={() => verifyRegistration()}>
                        <span className="login_button">Submit</span>
                        </Button>
                          Already have an account? <a className="access_links" href="#" onClick={goToLogin}>Login here!</a>
        </Modal.Footer>
      </Modal>

      {/* modal form  for password reset*/}

      <Modal show={showModalPasswordReset} onHide={handleClose3}>
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group id="resetForm" >
            <Form.Label>Enter your email address: </Form.Label>
            <Form.Control type="text" onChange={e => { setUserName(e.target.value) }} value={userName} />
          </Form.Group>
          <a className="access_links" href="#" onClick={goToLogin2}>Login Here!</a>
        </Modal.Body>
        <Modal.Footer>
          {/*<p className='error'>{errorMessage}</p> */}
          <Button variant="primary" type="submit" onClick={() => verifyLogin()}>
                        <span className="login_button">Submit</span>
                          </Button>
                            Not a member? <a className="access_links" href="#" onClick={goToRegister2}>Register here!</a>
        </Modal.Footer>
      </Modal>

      {/* notification settings */}

      <Modal show={showModalNotifications} onHide={handleClose4}>
        <Modal.Header closeButton>
          <Modal.Title>Notification Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
                <p className='error'>{errorMessageNotification}</p>
          <div class="row">
            <div class="col-md-6">
              <div> Show Park Documents </div>
              <div> Events </div>
              <div> For Sale or Rent </div>
              <div> Services </div>
              <div> Lost or Found </div>

            </div>
            <div class="col-md-6">
              <div>
                <fieldset>

                    <input
                    value="yes"
                    checked={parkNotification === "yes"}
                    {...setParkNotifications}
                  />
                  Yes
                  &emsp;

                    <input
                    value="no"
                    checked={parkNotification === "no"}
                    {...setParkNotifications}
                  />
                  No
                </fieldset>
              </div>
              <div>
                <fieldset>

                   <input
                    value="yes"
                    checked={eventsNotification === "yes"}
                    {...setEventNotifications}
                  />
                  Yes
                   &emsp;

                    <input
                    value="no"
                    checked={eventsNotification === "no"}
                    {...setEventNotifications}
                  />
                  No
                </fieldset>
              </div>
              <div>
                <fieldset>

                     <input
                    value="yes"
                    checked={salesNotification === "yes"}
                    {...setSaleNotification}
                  />
                  Yes
                 &emsp;

                <input
                    value="no"
                    checked={salesNotification === "no"}
                    {...setSaleNotification}
                  />
                  No
                </fieldset>
              </div>
              <div>
                <fieldset>

                  <input
                    value="yes"
                    checked={servicesNotification === "yes"}
                    {...setServicesNotification}
                  />
                  Yes
                  &emsp;

                  <input
                    value="no"
                    checked={servicesNotification === "no"}
                    {...setServicesNotification}
                  />
                  No
                </fieldset>
              </div>
              <div>
                <fieldset>

                    <input
                    value="yes"
                    checked={lostfoundNotification === "yes"}
                    {...setLostFoundNotification}
                  />
                  Yes
                   &emsp;

                    <input
                    value="no"
                    checked={lostfoundNotification === "no"}
                    {...setLostFoundNotification}
                  />
                  No
                </fieldset>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {/*<p className='error'>{errorMessageNotification}</p> */}
          <Button variant="primary" type="submit" onClick={() => verifyNotification()}>
                        <span className="login_button">Submit</span>
                             </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Profile;