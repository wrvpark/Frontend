
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css';
import { NavLink} from "react-router-dom";
import { useEffect, useState } from 'react';
import { getLogs, searchLogs, getCategories } from '../../../api/apifunction'
import React from 'react';
import { Card, Table, message,Select} from 'antd'

const { Option } = Select;
export default function LogPage() {

    const [logs, setLogs] = useState([]);
    //define table columns
    const [columns, setColumns] = useState([]);
    //define sub-categories 
    const [categories, setCategories] = useState([]);
 
    //search parameter
    const [param, setParam] = useState("");
    //filter by sub-category
    const [subId, setSubId] = useState("");
 //define the filter date
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [uId, setUid] = useState("");

    //initialize the table columns
    useEffect(() => {
        //initialize the table columns
        initializeColumns();
        //get all the sub-categories
        fetchCategories();
    }, []);

    //get the logs or search logs
    useEffect(() => {
        fetchLogs(param, subId, startTime,endTime,uId);
    }, [param, subId, startTime,endTime,uId]);

    //get logs or search logs
    const fetchLogs = async (name, subId,  startTime,endTime,uId) => {
        let response;
        //get all logs
        if (name === "" && subId === "" && startTime === ""
            && endTime === "" && uId === "") {
            response = await getLogs();

        }
        //otherwise, search by parameter, sub-category, and a specific date
        else {
            response = await searchLogs(name, subId, startTime,endTime,uId);
        }

        if (response !== "Network Error" && typeof response !== 'undefined') {
            if (response.data.status === "SUCCESS") {
                if (response.data.data !== null) {
                    setLogs(response.data.data)
                } else {
                    setLogs([])
                }
            } else {
                message.error(response.data.message);
            }
        }
    }

    //get all the categories
    const fetchCategories = async () => {

        let response = await getCategories();

        if (response !== "Network Error" && typeof response !== 'undefined') {
            if (response.data.status === "SUCCESS") {
                if (response.data.data !== null) {
                    setCategories(response.data.data)
                } else {
                    setCategories([])
                }
                // console.log(response.data.data)
                // setForumSection(response.data.data);
            } else {
                message.error(response.data.message);
            }
        }
    }


    //initialize the table columns
    function initializeColumns() {
        const columns = [
            //first column
            {
                title: ' Title',
                dataIndex: 'title'
            },
            //second column
            {
                title: 'Description',
                dataIndex: 'description'
            },

            {
                title: 'Category',
                width: 200,
                dataIndex: 'category',
                render: (category) => {
                     return category.name;
                }
            },
            {
                title: 'Log Created',
                width: 200,
                dataIndex: 'createTime'
            },
            //fourth column
            {
                title: 'Modifier',
                width: 200,
                dataIndex: 'modifier',
                render: (modifier) => {
                    return modifier.firstName;
                }
            },
            {
                title: 'Action',
                width: 200,
                dataIndex: 'action'
            },
        ];
        setColumns(columns);
    }

    const handleClick = (e) => {
        e.preventDefault()
    }

    const title = (
        <span>
            {/* Header title with link */}
            <div>
                <NavLink to="/" onClick={handleClick} exact className="backToHome">
                    ADMIN
                </NavLink>
                <h1> {">"} </h1>
                <NavLink to="/admin/logs" exact className="currPage">
                    LOGS
                </NavLink>
             </div>
            {/* display the sub-categories for the Park Document */}
                <Select placeholder="Category"
                    style={{width:'200px'}}
                    onChange={value => setSubId(value)}>
                 <Option key="" value="">Category</Option>
                {
                    categories.map(c =>
                        <Option key={c.id} value={c.id}>{c.name}</Option>
                    )
                }
            </Select>
          

           
        </span>
    );

    return (

        <>
            <Card title={title}>
                <Table
                    bordered
                    rowKey='id'
                    pagination={{
                        defaultPageSize:5,
                        showQuickJumper: true,
                        showSizeChanger: true
                    }}
                    //set the table column names
                    columns={columns}
                    //load the park documents
                    dataSource={logs}
                >

                </Table>
            </Card>
        </>
    );
}