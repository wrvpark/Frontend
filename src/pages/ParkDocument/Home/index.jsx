import { useEffect, useState, Fragment } from "react";
import { useHistory } from 'react-router-dom';
import {
    Card, Select, Table, Button, Input, message,
    DatePicker
} from 'antd';
import { NavLink } from "react-router-dom";
import { PlusOutlined } from '@ant-design/icons';
import {
    getParkDocs, searchParkDocs, fetchSubCategoriesByMainCategoryName
} from '../../../api/apifunction';

import './index.css'

//destructing 
const { Search } = Input;
const { Option } = Select;
export default function Home(props) {
    //get the token from local storage
    const token = localStorage.getItem("access_token");
    const history = useHistory();
    //define the documents with an empty array
    const [documents, setDocuments] = useState([]);
    //define table columns
    const [columns, setColumns] = useState([]);
    //define sub-categories 
    const [subCategories, setSubCategories] = useState([]);
    //search parameter
    const [param, setParam] = useState("");
    //filter by sub-category
    const [subId, setSubId] = useState("");
    //define the filter date
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    //loading all the park documents from the server API
    useEffect(() => {
        //initialize the table columns
        initializeColumns();
        //get all the sub-categories
        fetchSubCategories();
        localStorage.setItem("load_files", null);
    },
        //acts ac componentDidMount, the callback function will only be executed once after the first rendering
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []);

    /*
    *search by parameter, subId, a specific day
   as long as the param, or the subId has been updated,
   execute the callback function to search park documents
    */
    useEffect(() => {
        //fetch data from the server API
        fetchDocuments(param, subId, startTime, endTime);
    }, [param, subId, startTime, endTime]);





    //loading data from the server API
    const fetchDocuments = async (name, subId, startTime, endTime) => {
        let response;
        //get the current logged  user id
        const uId = "";
        //if all are empty, get all park documents
        if (name === "" && subId === "" && startTime === "" && endTime === "" && uId === "") {
            // console.log("WORKING")
            response = await getParkDocs();

        }
        //otherwise, search by parameter, sub-category, and a specific date
        else {
            // console.log("search function-----");
            response = await searchParkDocs(name, subId, startTime, endTime, uId);
        }
        const responseData = response.data;
        //if there is data, store it in the state
        if (response !== "Network Error" && typeof response.data !== 'undefined') {
            if (responseData.status === "SUCCESS" && responseData.data !== null) {
                setDocuments(responseData.data);
            }
            //fails, just display the error message
            else {
                message.error(responseData.message);
            }
        }
    }
    //fetch sub-categories from the server API
    const fetchSubCategories = async () => {
        const responseData = await fetchSubCategoriesByMainCategoryName("Park Document");
        //if there is data, store it in the state
        if (responseData.status === "SUCCESS" && responseData.data !== null) {
            setSubCategories(responseData.data);
        }
        //fails, just display the error message
        else {
            message.error(responseData.message);
        }
    }

    // Check for permission to add, modify and delete post
    const checkAccountPermission = () => {
        if (token !== null) {
            const token_info = JSON.parse(localStorage.getItem("session_details"));
            // console.log(token_info)
            for (let i = 0; i < token_info.realm_access.roles.length; i++) {
                //only "admin","park management","board member" can add, delete, update park document
                if (token_info.realm_access.roles[i] === "admin"
                    || token_info.realm_access.roles[i] === "park management"
                    || token_info.realm_access.roles[i] === "board member")

                    return true;
            }
        }
        return false;
    }

    const updatePost = (document) => {
        let files = [];
        // console.log(document.fileName.length)

        // console.log(document.fileName.length !== 0)
        if (document.fileName !== null) {
            if (document.fileName.length !== 0) {
                files.push(document.fileName)
            } else {
                files = null;
            }
        } else {
            files = null;
        }

        // console.log(files)
        localStorage.setItem("load_section", 1);

        localStorage.setItem("load_files", JSON.stringify(files))
        history.push('/documents/addupdate', document)
    }


    //initialize the table columns
    function initializeColumns() {
        const columns = [
            //first column
            {
                title: ' Name',
                className: 'cell_font-size',
                dataIndex: 'name'
            },
            //second column
            {
                title: 'Description',
                className: 'cell_font-size',
                dataIndex: 'description'
            },

            {
                title: 'Category',
                width: 200,
                className: 'cell_font-size',
                dataIndex: 'subCategory',
                render: (subCategory) => {
                    return subCategory.name;
                }
            },
            //third column
            {
                title: 'Last Modified',
                className: 'cell_font-size',
                width: 200,
                dataIndex: 'updateTime'
            },
            //fourth column
            {
                title: 'Creator',
                width: 200,
                className: 'cell_font-size',
                dataIndex: 'creator',
                render: (creator) => {
                    return creator.firstName;
                }
            },
            //fifth column
            {
                title: 'Action',
                width: 200,
                className: 'cell_font-size',
                dataIndex: '',
                key: 'x',
                render: (document) =>
                    <Fragment>
                        {/* <LinkButton
                            // go to the detail page and pass product to it
                            onClick={() => history.push("/documents/detail", document)}>
                            Detail
                        </LinkButton> */}

                        <p className="action_box">
                            <Button
                                type="button"
                                className="checkBtn"
                                onClick={() =>
                                    history.push("/documents/detail", document)
                                }
                            >
                                DETAIL
                        </Button>

                            {/* only admin/park management/board member can delete/update a park document */}
                            {
                                checkAccountPermission() &&
                                <>
                                    {/* pass the current product object to the addUpdate page */}




                                    <Button type="button" className="checkBtn" onClick={() => updatePost(document)}>
                                        UPDATE
                                </Button>


                                    <Button type="button"
                                        className="checkBtn"
                                        onClick={() => history.push('/documents/delete', document)}>
                                        DELETE
                                </Button>

                                    {/* <LinkButton onClick={() => history.push('/documents/addupdate', document)}
                                > Update
                               </LinkButton >

                                <LinkButton onClick={() => history.push('/documents/delete', document)}
                                >Delete
                               </LinkButton> */}
                                </>
                            }
                        </p>
                    </Fragment>
            },
        ];
        setColumns(columns);
    }
    //define the Card title
    const title = (
        <Fragment>
            <div>
                <NavLink to="/documents" exact className="backToEvent">
                    PARK DOCUMENTS
            </NavLink>
                <h1> {">"} </h1>
            </div>
            <br />
            <Search placeholder="Search for doc" size="large" style={{ width: 200, marginRight: 20 }} onSearch={value => setParam(value)} />
            {/* display the sub-categories for the Park Document */}
            <Select placeholder="Category" size="large" onChange={value => setSubId(value)}>
                <Option key="" value="">Category</Option>
                {
                    subCategories.map(c =>
                        <Option key={c.id} value={c.id}>{c.name}</Option>
                    )
                }
            </Select>
            <DatePicker
                placeholder="From:"
                size="large"
                onChange={(date, dateString) => setStartTime(dateString)}
                style={{ width: 200, marginLeft: 20 }} />
            <DatePicker
                placeholder="To:"
                size="large"
                onChange={(date, dateString) => setEndTime(dateString)}
                style={{ width: 200, marginLeft: 20 }} />

            {/* CHANGE THIS CODE COULDN'T FIGURE OUT CSS -CHARLES */}
            {/* === */}
            &emsp;
            &emsp;
            {/* === */}

            {/* <p>EASTER</p> */}
            <Fragment>
                {/* only admin/park management/board member can add a park document */}
                {
                    checkAccountPermission() &&
                    <Button type='primary'
                        className='add_button'
                        size="large"
                        onClick={() => props.history.push('/documents/addupdate')}>
                        <PlusOutlined />
                     Add
             </Button>
                }
            </Fragment>
        </Fragment>
    );



    return (
        <>
            <Card title={title} >
                <Table
                    bordered
                    rowKey='id'
                    pagination={{
                        defaultPageSize: 5,
                        showQuickJumper: true,
                        showSizeChanger: true
                    }}
                    //set the table column names
                    columns={columns}
                    //load the park documents
                    dataSource={documents}
                >
                </Table>
            </Card>
        </>
    );

}