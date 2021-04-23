
//Imports 
import Button from "react-bootstrap/Button";
import React, { useEffect, useState } from 'react';
import { Card, List, Table, message } from 'antd'
import { NavLink, useHistory } from "react-router-dom";

// API calls
import { getUsers, getCategories } from '../../../api/apifunction'

// Css file
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css';
import './styling.css';

const Item = List.Item;


/**
 * Component about Accounts Details in Admin section
 * 
 * @author Charles Breton
 * @returns Accounts Details Home Page
 */
export default function AccountsDetails() {

    // State of website
    const history = useHistory();


    //define table columns
    const [columnsUsers, setColumnsUsers] = useState([]);
    const [columnsApprove, setColumnsApprove] = useState([]);

    const [approvedUsers, setApprovedUsers] = useState([]);
    const [unapprovedUsers, setUnapprovedUsers] = useState([]);

    //search parameter
    const [param, setParam] = useState("");
    //filter by sub-category
    const [subId, setSubId] = useState("");
    //define the filter date
    const [date, setDate] = useState("");

    // Initial functions calls
    useEffect(() => {
        //fetch data from the server API
        fetchUsers(param, subId, date);
        //initialize the table columns
        initializeColumns();
    },
        //acts ac componentDidMount, the callback function will only be executed once after the first rendering
        []);

    // Update user list [FOR FUTURE IMPLEMENTATION]
    useEffect(() => {
        //fetch data from the server API
        fetchUsers(param, subId, date);
        //initialize the table columns
        initializeColumns();
    }, [param, subId, date]);

    // Fetch users
    const fetchUsers = async (name, subId, date) => {
        let response;

        // Fetch users info [capable to add search feature in the future]
        if (name === "" && subId === "" && date === "") {
            response = await getUsers();
        }
        //otherwise, search by parameter, sub-category, and a specific date
        else {
            // response = await searchLogs(name, subId, date);
        }
        try {
            if (response !== "Network Error" && typeof response !== 'undefined') {
                if (response.data.status === "SUCCESS") {
                    if (response.data.data !== null) {
                        filterUsers(response.data.data);
                    } else { }
                } else {
                    message.error(response.data.message);
                }
            }
        } catch (error) {

        }
    }

    // Filter users based off being approved or unapproved to display them in different categories
    const filterUsers = (data) => {
        let approvedUsersList = []
        let unapprovedUsersList = []

        for (let i = 0; i < data.length; i++) {
            if (data[i].unapproved === false) {
                approvedUsersList.push(data[i])
            } else {
                unapprovedUsersList.push(data[i])
            }

        }
        setUnapprovedUsers(unapprovedUsersList)
        setApprovedUsers(approvedUsersList)
    }

    // initialize the table columns for approving users section
    function initializeColumns(type) {
        const columnsApprove = [
            //first column
            {
                title: 'Username',
                dataIndex: 'email'
            },
            //second column
            {
                title: 'First Name',
                dataIndex: 'firstName'
            },
            // third column
            {
                title: 'Last Name',
                dataIndex: 'lastName'
            },
            // fourth column
            {
                title: 'Action',
                width: 200,
                dataIndex: '',
                key: 'x',
                render: (user) =>
                    <span>
                        <Button
                            // go to the detail page and pass product to it
                            className={"viewInfoBtn"}
                            onClick={() => history.push("/admin/accountsDetails/userInfo", user, "APPROVE")}>
                            View Info
                        </Button>
                    </span>
            },
        ];

        // initialize the table columns for users section
        const columnsUsers = [
            //first column
            {
                title: 'Username',
                dataIndex: 'email'
            },
            //second column
            {
                title: 'First Name',
                dataIndex: 'firstName'
            },
            // third column
            {
                title: 'Last Name',
                dataIndex: 'lastName'
            },
            // fourth column
            {
                title: 'Action',
                width: 200,
                dataIndex: '',
                key: 'x',
                render: (user) =>
                    <span>
                        <Button
                            // go to the detail page and pass product to it
                            className={"viewInfoBtn"}
                            onClick={() => history.push("/admin/accountsDetails/userInfo", user, "UPDATE")}>
                            View Info
                        </Button>
                    </span>
            },
        ];
        setColumnsApprove(columnsApprove);
        setColumnsUsers(columnsUsers);
    }

    // Ensure page doesn't update when pressing on Users Details header
    const handleClick = (e) => {
        e.preventDefault()
    }

    // Header of the page and link to go back to main section page
    const main_title = (
        <span>
            {/* Header title with link */}
            <div>
                <NavLink to="/" onClick={handleClick} exact className="backToHome">
                    ADMIN
                </NavLink>
                <h1> {">"} </h1>
                <NavLink to="/admin/accountsDetails" exact className="currPage">
                    USERS DETAILS
            </NavLink>
            </div>

            {/* Search feature and add forum post */}
            <div className="forum_search_feature">
                {/* <Search className="forum_search_box" placeholder="Search for post" onSearch={value => searchPost(value)} /> */}


                {/* <DatePicker className="forum_date_picker" onChange={(date, dateString) => console.log("WORKING")} /> */}

                {/* Button for adding forum post */}
                {/* <Button className="forum_create_post_button" type='primary'
                    onClick={() => props.history.push('/saleAndRent/addupdate')}>
                    <PlusOutlined />
                     Add
                </Button> */}
            </div>
        </span>
    );

    // Sub-Headers
    const unapproved_title = (

        <div>
            <h2>UNAPPROVED USERS</h2>
        </div>
    );

    // Sub-Headers
    const approved_title = (
        <div>
            <h2>APPROVED USERS</h2>
        </div>
    );

    // Render component
    return (
        <>
            <Card title={main_title}>
                <Card title={unapproved_title} >
                    <Table
                        bordered
                        rowKey='id'
                        pagination={{ pageSize: 4, showQuickJumper: true, showSizeChanger: true }}
                        //set the table column names
                        columns={columnsApprove}
                        //load the park documents
                        dataSource={unapprovedUsers}
                    >
                    </Table>
                </Card>
                <Card title={approved_title}>
                    <Table
                        bordered
                        rowKey='id'
                        pagination={{ pageSize: 10, showQuickJumper: true, showSizeChanger: true }}
                        //set the table column names
                        columns={columnsUsers}
                        //load the park documents
                        dataSource={approvedUsers}
                    >

                    </Table>
                </Card>
            </Card>
        </>
    );
}
