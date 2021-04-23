// Import dependancies
import { useEffect, useState } from 'react';
import Form from "react-bootstrap/Form";
import { NavLink } from "react-router-dom";
import NotificationBell from "../../../Components/NotificationBell";
import Button from "react-bootstrap/Button";
import Select from "react-select";
import { Card } from 'antd';

import ConfirmationModal from './confirmationModal'
import { UploadFile } from '../../../api/FileUpload/fileupload'

// API calls
import { fetchSubCategories } from '../../../api/apifunction'

// Css files
import 'antd/dist/antd.css';
import './add_update.css';


/**
 * Forum Component that handles creating and update sale or rent posts
 * 
 * @author Charles Breton
 * @param {*} props info about post
 * @returns Sale and Rent AddUpdate Page
 */
export default function AddUpdate(props) {
    // State of component [UPDATE, CREATE]
    const [state, setState] = useState("CREATE");

    // Setting up category
    const [sortedCategories, setSortedCategories] = useState([]);

    const [rawData, setRawData] = useState([]);
    // Forum Items
    const [forumTitle, setForumTitle] = useState("");
    const [forumDesc, setForumDesc] = useState("");
    const [forumFile, setForumFile] = useState([]);
    const [forumType, setForumType] = useState("");
    const [confirmationInfo, setConfirmationInfo] = useState();

    // Show confirmaiton post
    const [confirmPost, setConfirmPost] = useState(false);

    // Error messages
    const [errorMessage, setErrorMessage] = useState();



    // Load initial data
    useEffect(() => {

        // Determine if we are trying to update post
        if (typeof props.history.location.state !== 'undefined') {


            // Set state for all data
            const data = props.history.location.state
            setRawData(data)
            setForumTitle(data.title)
            setForumDesc(data.details)

            // Handle category drop-down standard
            const formatForumType = {
                value: data.type,
                label: data.type
            };
            setForumType(formatForumType)

            // Handle Images
            if (typeof props.history.location.state !== 'undefined') {
                setForumFile(data.file)
            }

            // Set state to update
            setState("UPDATE");
        }
        fetchCategories();

    }, [])


    // Fetch different categories for drop-down menu
    const fetchCategories = async () => {
        let categoriesList = [];
        const response = await fetchSubCategories(localStorage.getItem("forum_cat_id"))
        try {
            if (response !== "Network Error") {
                if (response.status === "SUCCESS" && response.data !== null) {
                    // Pass data to get standard format 
                    formatCategories(response.data)
                } else {
                    setErrorMessage("Fetching wasn't successfull")
                }
            } else {
                setErrorMessage("Error with connecting to backend")
            }
        } catch (error) { }
    }

    // Format fetched sub-categories
    const formatCategories = (data) => {
        // console.log(data)
        let formattedList = [];
        for (let i = 0; i < data.length; i++) {
            let object = {
                value: data[i].id,
                label: data[i].name
            };
            formattedList.push(object)

        }
        // Set state of categories
        setSortedCategories(formattedList)
    }

    // Check data is valid before showing confirmation modal
    const checkData = () => {
        let valid = true;

        if (forumTitle === "" || forumTitle.length > 255) {
            valid = false;
            setErrorMessage("Error occurred at title")
        }
        else if (forumDesc === "") {
            valid = false;
            setErrorMessage("Error occurred at description")
        }
        // else if (forumFile === "") {
        //     valid = false;
        //     setErrorMessage("Error occurred at file")
        // }
        else if (forumType === "") {
            valid = false;
            setErrorMessage("Error occurred at category")
        }

        return valid;
    }


    // Open up modal to confirm post submition
    const handleSubmit = () => {
        // Determine if data entries is valid
        const check = checkData();

        // If pass check question object will all data entered
        if (check) {

            let info = []
            info.push(forumTitle);
            info.push(forumDesc)
            info.push(forumFile)
            info.push(forumType)

            // console.log(info)
            setConfirmationInfo(info)
            setErrorMessage("")
            openModal()
        }
    }

    // Handle opening confirmation modal
    const openModal = () => {
        setConfirmPost(!confirmPost)
    }

    // Handle closing confirmation modal
    const onCloseWindow = () => {
        setConfirmPost(false);
    };

    // Handle Logic for header is we are updating or creating a post
    const HeaderType = () => {
        if (state === "UPDATE") {
            return (
                <span> POST UPDATING</span>
            )
        } else {
            return (
                <span> POST CREATION</span>
            )
        }

    }

    // Header of the page and link to go back to main section page
    const title = (
        <span>
            <NavLink to="/forum" exact className="backToEvent">
                FORUM
            </NavLink>
            <h1> {">"} </h1>
            <NavLink to="/forum/addupdate" exact className="currPage">
                <HeaderType />
            </NavLink>

            <NotificationBell />
        </span>
    );

    // Handling Upload return data
    const handleUpload = (data) => {
        setForumFile(data)
    }

    // Render component
    return (
        <Card title={title}>
            {/* Confirmation Modal [true / false]  */}
            {confirmPost ?
                <ConfirmationModal onCloseWindow={onCloseWindow} displayPost={confirmationInfo} props={props} rawData={rawData} />
                : null
            }

            {/* Error Message Display */}
            <span className='error_message'>{errorMessage}</span>

            {/* First Row */}
            <Form.Row className="first_row">
                <Form.Group className="col-md-8">
                    <h5>TITLE</h5>
                </Form.Group>

                <Form.Group className="col-md-4">
                    <h5>CATEGORY</h5>
                </Form.Group>

                <Form.Group className="col-md-8">
                    <Form.Control
                        placeholder="FORUM TITLE"
                        className="forumTitle"
                        id="forumTitle"
                        fluid='true'
                        value={forumTitle}
                        onChange={(event) => setForumTitle(event.target.value)}
                    />
                </Form.Group>

                <Form.Group className="col-md-4">
                    <Select
                        className='drop-box'
                        placeholder="CATEGORY"
                        options={sortedCategories}
                        id="location"
                        fluid='true'
                        value={forumType}
                        onChange={(event) => setForumType(event)}
                    />
                </Form.Group>
            </Form.Row>

            {/* Second Row */}
            <Form.Row>
                <Form.Group className="col-md-6">
                    <h5>DESCRIPTION</h5>
                </Form.Group>
                <Form.Group className="col-md-12 descriptionGroup">
                    <Form.Control
                        as="textarea"
                        rows="7"
                        fluid='true'
                        placeholder="DESCRIPTION"
                        className="description"
                        id="description"
                        value={forumDesc}
                        onChange={(event) => setForumDesc(event.target.value)}
                    />
                </Form.Group>
            </Form.Row>


            {/* Third Row */}
            <Form.Row >
                <Form.Group className="col-md-6">
                    <h5>UPLOAD IMAGES</h5>
                    <UploadFile onUpload={handleUpload} />
                </Form.Group>
            </Form.Row>

            {/* Confirmation Button */}
            <Form.Row>
                <Button type="button" onClick={() => handleSubmit()} className="confirmBtn">
                    <span className="confirmBtn_header">CONFIRM</span>
                    </Button>
            </Form.Row>
        </Card>
    )
}