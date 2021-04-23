
// Imports
import React , { useEffect, useState } from 'react';
import { NavLink, useHistory } from "react-router-dom";
import { Card, List, message } from 'antd'
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

// API calls
import { getUserInfo, postUserInfo } from '../../../../api/apifunction'

// Css files
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css';


const Item = List.Item;

/**
 *  Account Detail Component that handles updating accounts info
 * 
 * @param {*} props info about state of pages use for Routing purposes
 * @returns User Details Page
 */
export default function UserInfo(props) {
    // State of website
    const history = useHistory();
    
    // Post info
    const id = props.history.location.state.id
    const [userData, setUserData] = useState();
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [lotNumber, setLotNumber] = useState([]);
    
    // Access types
    const [approvedAccount, setApprovedAccount] = useState('');
    const [visitorAccess, setVisitorAccess] = useState(false);
    const [renterAccess, setRenterAccess] = useState(false);
    const [ownerAccess, setOwnerAccess] = useState(false);
    
    // Permisions 
    const [parkManagementAccess, setParkManagementAccess] = useState(false);
    const [boardMemberAccess, setBoardMemberAccess] = useState(false);
    const [adminAccess, setAdminAccess] = useState(false);
    
    const [rolesLoaded, setRolesLoaded] = useState(false)
    const [infoChanged, setInfoChanged] = useState(false)
    
    // Error Message
    const [errorMessage, setErrorMessage] = useState();
    
    // Initial function when first loading
    useEffect(() => {
        fetchUserInfo()
    }, []);

    // Ensure atleast some data is changed before being able to update user
    useEffect(() => {
        setInfoChanged(true)
    }, [email, firstName, lastName, lotNumber, renterAccess, ownerAccess, approvedAccount, parkManagementAccess, boardMemberAccess, adminAccess]);

    // Fetch users info using id
    const fetchUserInfo = async () => {
        const response = await getUserInfo(id)
        try {
            if (response !== "Network Error") {
                console.log(response.data)
                if (response.data.status === "SUCCESS" && response.data.data !== null) {
                    setUserData(response.data.data)
                    loadUserFields(response.data.data)
                } else {
                    message.error("Fetching wasn't successfull")
                }
            } else {
                message.error("Error with connecting to backend")
            }
        } catch (error) {

        }
    }

    // Set state for different users info after fetch call
    const loadUserFields = (data) => {
        setEmail(data.email)
        setFirstName(data.firstName)
        setLastName(data.lastName)
        
        // Can have multiple lot number
        let lot_number = JSON.stringify(data.lotNo)
        lot_number = lot_number.replace('[', '')
        lot_number = lot_number.replace(']', '')
        setLotNumber(lot_number)

        setRenterAccess(data.renter)
        setOwnerAccess(data.owner)
        console.log(data.owner)

        setApprovedAccount(!data.unapproved)
        setParkManagementAccess(data.parkManagement)
        setBoardMemberAccess(data.boardMember)
        setAdminAccess(data.admin)

        setRolesLoaded(true)
        setInfoChanged(false)
    }

     // Ensure page doesn't update when pressing on Users Details header
    const handleClick = (e) => {
        e.preventDefault()
    }

    // Header of the page and link to go back to main section page
    const title = (
        <span>
            <NavLink to="/" onClick={handleClick} exact className="backToEvent">
                ADMIN
            </NavLink>
            <h1> {">"} </h1>

            <NavLink to="/admin/accountsDetails" exact className="currPage">
                USER DETAILS
            </NavLink>
            <h1> {">"} </h1>
            <NavLink to="/forum/addupdate" onClick={handleClick} exact className="currPage">
                USER INFO
            </NavLink>

        </span>
    );

    // Component about checkbox for general roles and privileges
    const RolesInfoDisplay = () => {
        return (
            <div>
                <Form.Group className="col-md-12">
                    <h5>GENERAL ROLES</h5>
                </Form.Group>

                <Form.Group className="col-md-12">
                    <span className="col-md-3">
                        <label className="form-check-label" htmlFor="flexCheckDefault">
                            Visitor
                        </label>
                        &emsp;&emsp;
                        <input className="form-check-input" type="checkbox" defaultChecked={visitorAccess} onChange={() => setVisitorAccess(!visitorAccess)} />
                    </span>
                    <span className="col-md-3">
                        <label className="form-check-label" htmlFor="flexCheckDefault">
                            Renter
                        </label>
                        &emsp;&emsp;
                        <input className="form-check-input" type="checkbox" defaultChecked={renterAccess} onChange={() => setRenterAccess(!renterAccess)} />
                    </span>
                    <span className="col-md-3">
                        <label className="form-check-label" htmlFor="flexCheckDefault">
                            Owner
                        </label>
                        &emsp;&emsp;
                        <input className="form-check-input" type="checkbox" defaultChecked={ownerAccess} onChange={() => setOwnerAccess(!ownerAccess)} />
                    </span>

                </Form.Group>

                <Form.Group className="col-md-12">
                    <h5>PRIVILEGES</h5>
                </Form.Group>
                <Form.Group className="col-md-12">
                    <span className="col-md-3">
                        <label className="form-check-label" htmlFor="flexCheckDefault">
                            Approved
                        </label>
                        &emsp;&emsp;
                        <input className="form-check-input" type="checkbox" defaultChecked={approvedAccount} onChange={() => setApprovedAccount(!approvedAccount)} />
                    </span>
                    <span className="col-md-3">
                        <label className="form-check-label" htmlFor="flexCheckDefault">
                            Park Management
                        </label>
                        &emsp;&emsp;
                        <input className="form-check-input" type="checkbox" defaultChecked={parkManagementAccess} onChange={() => setParkManagementAccess(!parkManagementAccess)} />
                    </span>
                    <span className="col-md-3">
                        <label className="form-check-label" htmlFor="flexCheckDefault">
                            Board Member
                        </label>
                        &emsp;&emsp;
                        <input className="form-check-input" type="checkbox" defaultChecked={boardMemberAccess} onChange={() => setBoardMemberAccess(!boardMemberAccess)} />
                    </span>
                    <span className="col-md-3">
                        <label className="form-check-label" htmlFor="flexCheckDefault">
                            Admin
                        </label>
                        &emsp;&emsp;
                        <input className="form-check-input" type="checkbox" defaultChecked={adminAccess} onChange={() => setAdminAccess(!adminAccess)} />
                    </span>
                </Form.Group>
            </div>
        )
    }


    // Determine the type of editing (approving / updating ) users button
    const HeaderType = () => {
        if (props.history.location.state.unapproved) {
            setInfoChanged(true)
            return (
                <span className="confirmBtn_header">APPROVE USER</span>
            )
        } else {
            return (
                <span className="confirmBtn_header">UPDATE INFO</span>
            )
        }
    }

    // Verify data before updating user details
    const verifyData = () => {
        let valid = true;

        if (firstName === "" || firstName.length > 255) {
            valid = false;
            setErrorMessage("Missing First Name")
        }
        else if (lastName === "" || lastName.length > 255) {
            valid = false;
            setErrorMessage("Missing Last Name")
        }
        else if (lotNumber === "" || lastName.length > 255) {
            valid = false;
            setErrorMessage("Missing Lot Number")
        }

        if (valid) {
            setErrorMessage("")
            handleSubmit();
        }
    }

    // Handle submitting button to update user details
    const handleSubmit = async () => {
        const first_name = firstName;
        const last_name = lastName;
        const lot_no = JSON.parse("[" + lotNumber + "]");
        const is_owner = ownerAccess;
        const is_renter = renterAccess;
        const is_board_member = boardMemberAccess;
        const is_park_management = parkManagementAccess;
        const is_admin = adminAccess;
        const is_visitor = visitorAccess;
        const is_unapproved = !approvedAccount;

        const response = await postUserInfo(id, first_name, last_name, lot_no, is_owner, is_renter, is_board_member, is_park_management, is_admin, is_visitor, is_unapproved);

        try {
            if (response !== "Network Error") {
                if (response.data.status === "SUCCESS") {
                    // Successfull
                    props.history.goBack();
                    message.success("Account has been updated")
                } else {
                    // Error
                    message.error("Error adding post to server")
                }
            } else {
                message.error("Server is down")
            }
        } catch (error) {

        }
    }

    return (
        <Card title={title}>
            <span className='error_message'>{errorMessage}</span>
            <Form.Row className="first_row">
                <Form.Group className="col-md-6">
                    <h5>FIRST NAME</h5>
                </Form.Group>

                <Form.Group className="col-md-6">
                    <h5>LAST NAME</h5>
                </Form.Group>

                <Form.Group className="col-md-6">
                    <Form.Control
                        placeholder="User First Name"
                        className="userDetails"
                        id="userFirstName"
                        // disabled='false'
                        fluid='true'
                        value={firstName}
                        onChange={(event) => setFirstName(event.target.value)}
                    />
                </Form.Group>

                <Form.Group className="col-md-6">
                    <Form.Control
                        placeholder="User Last Name"
                        className="userDetails"
                        id="userLastName"
                        fluid='true'
                        value={lastName}
                        onChange={(event) => setLastName(event.target.value)}
                    />
                </Form.Group>
            </Form.Row>
            <Form.Row className='second_row'>
                <Form.Group className="col-md-6">
                    <h5>EMAIL</h5>
                </Form.Group>

                <Form.Group className="col-md-6">
                    <h5>LOT</h5>
                </Form.Group>

                <Form.Group className="col-md-6">
                    <Form.Control
                        placeholder="Users Email"
                        className="userDetails"
                        id="userEmail"
                        disabled={true}
                        fluid='true'
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </Form.Group>

                <Form.Group className="col-md-6">
                    <Form.Control
                        placeholder="Users Lot Number"
                        className="userDetails"
                        id="forumTitle"
                        fluid='true'
                        value={lotNumber}
                        onChange={(event) => setLotNumber(event.target.value)}
                    />
                </Form.Group>
            </Form.Row>

            <Form.Row className='third_row'>
                {rolesLoaded ?
                    // Need to way to load data before displaying content
                    <RolesInfoDisplay />
                    //   
                    : null}
            </Form.Row>
                    <br/>
            <Form.Row>
                {/* Allow updating user only if info has changed */}
                {infoChanged ?
                    <Button type="button" onClick={() => verifyData()} className="confirmBtn">
                        <HeaderType />
                    </Button>
                    //   
                    :
                    <Button type="button" disabled className="confirmBtn">
                        <HeaderType />
                    </Button>
                }

            </Form.Row>
        </Card>
    )




}