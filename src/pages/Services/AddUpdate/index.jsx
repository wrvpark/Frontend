// Import dependancies
import { useEffect, useState } from 'react';
import Form from "react-bootstrap/Form";
import { NavLink } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { Card } from 'antd';
import Select from "react-select";

import NotificationBell from "../../../Components/NotificationBell";
import ConfirmationModal from './confirmationModal'
import { UploadFile } from '../../../api/FileUpload/fileupload'

// API calls
import { fetchSubCategories } from '../../../api/apifunction'

// Css files
import 'antd/dist/antd.css';


/**
 * Services Component that handles creating and update sale or rent posts
 * 
 * @author Charles Breton
 * @param {*} props info about post
 * @returns Services AddUpdate Page
 */
export default function AddUpdate(props) {
    // State of component [UPDATE, CREATE]
    const [state, setState] = useState("CREATE");

    // Setting up category
    const [sortedCategories, setSortedCategories] = useState([]);

    // Data for post
    const [rawData, setRawData] = useState([]);
    const [postTitle, setPostTitle] = useState("");
    const [postDesc, setPostDesc] = useState("");
    const [postImages, setPostImages] = useState([]);
    const [postType, setPostType] = useState("");
    const [postPrice, setPostPrice] = useState("");
    const [postLotNumber, setPostLotNumber] = useState("");

    // ConfirmationModal props
    const [confirmationInfo, setConfirmationInfo] = useState();
    const [confirmModal, setConfirmModal] = useState(false);

    // Error message used for invalid data type
    const [errorMessage, setErrorMessage] = useState();


    // Initial load
    useEffect(() => {

        // Determine if we are trying to update post
        if (typeof props.history.location.state !== 'undefined') {
            const data = props.history.location.state

            // Set state for all data
            setRawData(data);
            setPostTitle(data.title);
            setPostPrice(data.price);
            setPostLotNumber(data.lotNo);
            setPostDesc(data.description);

            // Handle category drop-down standard
            const formatPostType = {
                value: data.subcategory.id,
                label: data.subcategory.name
            };
            setPostType(formatPostType);

            // Handle Images
            if (typeof props.history.location.state !== 'undefined') {
                setPostImages(data.images)
            }
            // Set state to update
            setState("UPDATE");
        }

        fetchCategories();
    }, [])

    // Fetch different categories for drop-down menu
    const fetchCategories = async () => {
        let categoriesList = [];
        const response = await fetchSubCategories(localStorage.getItem("services_cat_id"));
        try {
            if (response !== "Network Error") {
                if (response.status === "SUCCESS" && response.data !== null) {
                    formatCategories(response.data);
                } else {
                    setErrorMessage("Fetching wasn't successfull");
                }
            } else {
                setErrorMessage("Error with connecting to backend");
            }
        } catch (error) { }
    }

    // Format Categories data
    const formatCategories = (data) => {
        let formattedList = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i].name === "Needed" || data[i].name === "Offered") {
                let object = {
                    value: data[i].id,
                    label: data[i].name
                };
                formattedList.push(object);
            }
            // Set state of categories
            setSortedCategories(formattedList);
        }
    }

    // Check data is valid before showing confirmation modal
    const checkData = () => {
        let valid = true;

        if (postTitle === "" || postTitle.length > 255) {
            valid = false;
            setErrorMessage("Missing title")
        }
        else if (postDesc === "") {
            valid = false;
            setErrorMessage("Missing description")
        }
        // else if (typeof postImages === 'undefined') {
        //     console.log(3)
        //     valid = false;
        //     setErrorMessage("Missing images")
        // }
        else if (postType === "") {
            valid = false;
            setErrorMessage("Missing category")
        }
        else if (postPrice === "") {
            valid = false;
            setErrorMessage("Missing price")
        }
        // else if (postLotNumber === "" || parseInt(postLotNumber) <= 0) {
        //     valid = false;
        //     setErrorMessage("Missing lot number")
        // }
        return valid;
    }

    // Handle logic behind Confirmation Button
    const handleSubmit = () => {
        // Determine if data entries is valid
        const check = checkData();

        // If pass check question object will all data entered
        if (check) {
            let info = []
            info.push(postTitle);
            info.push(postDesc);
            info.push(postImages);
            info.push(postType);
            info.push(postLotNumber);
            info.push(postPrice);

            setConfirmationInfo(info)
            openModal()
        }
    }

    // Handle opening confirmation modal
    const openModal = () => {
        setConfirmModal(true)
    }

    // Handle closing confirmation modal
    const onCloseWindow = () => {
        setConfirmModal(false);
    };

    // Needed to wait for async function to finish before display category drop-down
    const CustomSelect = () => {
        return (
            <Select
                className='drop-box'
                placeholder="CATEGORY"
                options={sortedCategories}
                id="location"
                fluid='true'
                // value=
                value={postType}
                onChange={(event) => setPostType(event)}
            />
        )
    }

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
            <NavLink to="/services" exact className="backToEvent">
                SERVICES
            </NavLink>
            <h1> {">"} </h1>
            <NavLink to="/services/addupdate" exact className="currPage">
                <HeaderType />
            </NavLink>

            <NotificationBell />
        </span>
    );

    // Handling Upload return data
    const handleUpload = (data) => {
        setPostImages(data)
    }

    // Render component
    return (
        <Card title={title}>
            {/* Confirmation Modal [true / false]  */}
            {confirmModal ?
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
                {/* 
                <Form.Group className="col-md-4">
                    <h5>PRICE</h5>
                </Form.Group> */}
                <Form.Group className="item col-md-8">
                    <Form.Control
                        placeholder="FORUM TITLE"
                        className="postTitle"
                        id="postTitle"
                        fluid='true'
                        value={postTitle}
                        onChange={(event) => setPostTitle(event.target.value)}
                    />
                </Form.Group>

                <Form.Group className="item col-md-4">
                    <CustomSelect />
                </Form.Group>


            </Form.Row>
            {/* Second Row */}
            <Form.Row className="first_row">
                <Form.Group className="col-md-6">
                    <h5>PRICE</h5>
                </Form.Group>

                <Form.Group className="col-md-6">
                    <h5>LOT NUMBER</h5>
                </Form.Group>
                <Form.Group className="col-md-6">
                    <Form.Control
                        placeholder="PRICE"
                        className="postPrice"
                        id="postPrice"
                        fluid='true'
                        value={postPrice}
                        onChange={(event) => setPostPrice(event.target.value)}
                    />
                </Form.Group>

                <Form.Group className="col-md-6">
                    <Form.Control
                        type="number"
                        placeholder="LOT NUMBER"
                        className="postLotNumber"
                        id="postLotNumber"
                        fluid='true'
                        value={postLotNumber}
                        onChange={(event) => setPostLotNumber(event.target.value)}
                    />
                </Form.Group>
            </Form.Row>

            {/* Third Row */}
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
                        value={postDesc}
                        onChange={(event) => setPostDesc(event.target.value)}
                    />
                </Form.Group>
            </Form.Row>


            {/* Fourth Row */}
            <Form.Row >
                <Form.Group className="col-md-6">
                    <h5>UPLOAD IMAGES</h5>
                    <UploadFile onUpload={handleUpload} />
                </Form.Group>
                <Form.Group className="">

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
