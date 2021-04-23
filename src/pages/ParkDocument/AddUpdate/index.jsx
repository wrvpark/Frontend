import { Card, Button, Input, Form, Select, message, Upload, Divider } from "antd";
import { ArrowLeftOutlined, UploadOutlined, PlusOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import LinkButton from "../../../Components/LinkButton";
import {
  fetchSubCategoriesByMainCategoryName,
  addParkDocument,
  updateParkDocument,
  addParkDocumentSubcateogry
} from "../../../api/apifunction";
import { BASE_FILE } from "../../../constant/constants";
import './index.css'
import { NavLink } from "react-router-dom";
import { UploadFile } from '../../../api/FileUpload/fileupload'


//destructing
const { TextArea } = Input;
const { Item } = Form;
const { Option } = Select;

//style the form
const formItemLayout = {
  labelCol: { span: 2.5 },
  wrapperCol: { span: 5 },
};

export default function AddUpdate(props) {
  //define sub-categories
  const [subCategories, setSubCategories] = useState([]);

  //if this component is for update
  const [isUpdate] = useState(!!props.location.state);
  //filter by sub-category
  // eslint-disable-next-line no-unused-vars
  const [subId, setSubId] = useState();
  // eslint-disable-next-line no-unused-vars
  const [document, setDocument] = useState(props.location.state || {});
  const [fileName, setFileName] = useState();
  const [postFiles, setPostFiles] = useState("");

  const defaultOption = isUpdate ? document.subCategory.id : "";

  //new sub-category
  const [newSubCategory, setNewSubCategory] = useState("");
  //define a ref for the form
  const ref = React.createRef();
  //default file list
  const fileList = isUpdate ? [
    {
      uid: '-1',
      //name: document.fileName,
      status: 'done',
      url: document.url === null ? "" : document.url,
    }
  ] : [];
  //loading all the park documents from the server API
  useEffect(() => {
    //get all the sub-categories
    getSubCategories("Park Document");
    if (isUpdate) {
      // console.log(props)
      // console.log(document.fileName)
      setFileName(document.fileName);
      setPostFiles(document.fileName);
      setSubId(document.subCategory.id);
    }
  },
    //acts ac componentDidMount, the callback function will only be executed once after the first rendering
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // useEffect(() => {
  //   // console.log(postFiles)
  // }, [postFiles])

  //get all the sub-categories for park document
  const getSubCategories = async (pName) => {
    const responseData = await fetchSubCategoriesByMainCategoryName(pName);

    //if there is data, store it in the state
    if (responseData.status === "SUCCESS" && responseData.data !== null) {
      // console.log(responseData)
      setSubCategories(responseData.data);
    }
    //fails, just display the error message
    else {
      message.error(responseData.message);
    }
  };

  //add a update a park document
  const addOrUpdateParkdocument = () => {
    ref.current
      .validateFields()
      .then(async (values) => {
        const { name, description } = ref.current.getFieldsValue();
        //check if add a parkdocument
        var response;
        var file;
        if (postFiles.length === 0) {
          file = ''
        } else {
          file = postFiles[0]
        }

        // console.log(file)
        if (!document.id) {
          response = await addParkDocument(
            name,
            subId,
            description,
            file,
            // creator
          );
        } else {
          response = await updateParkDocument(
            document.id,
            name,
            subId,
            description,
            file
          );
        }

        if (response.data.status === "SUCCESS" && response.data.data !== null) {
          props.history.goBack();
        }
      })
      .catch((errorInfo) => {
        //fields has errors
        console.log("errorInfo:" + errorInfo);
      });
  };


  //add a new sub-category
  const addNewSubcategory = async () => {
    // console.log('addItem');
    //  addParkDocumentSubcateogry
    //1: get the park document id
    const parentId = subCategories[0].parentId;

    const responseData = await addParkDocumentSubcateogry(newSubCategory, parentId, "", "");

    //if there is data, store it in the state
    if (responseData.status === "SUCCESS" && responseData.data !== null) {
      setSubCategories(responseData.data);
      props.history.push('/documents/addupdate');
    }
    //fails, just display the error message
    else {
      message.error(responseData.message);
    }

  };

  // Prevent redirect when clicking on Post header
  const handleClick = (e) => {
    e.preventDefault();
  };

  //define a sub-title
  const title = (
    <span>
      <NavLink to="/documents" exact className="backToEvent">
        PARK DOCUMENTS
        </NavLink>
      <h1> {">"} </h1>
      <NavLink
        to="/saleAndRent/detail"
        onClick={handleClick}
        exact
        className="currPage"
      >
        {isUpdate ? "POST UPDATING" : "POST CREATION"}
      </NavLink>
    </span>
  );

  const onChange = (info) => {
    const { status } = info.file;
    //empty the file when it has been removed
    if (status === "removed") {
      setFileName("");
    }
    if (status === "done") {
      const fileNames = info.file.response.data;
      setFileName(fileNames[0]);
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  }

  // Handling Upload return data
  const handleUpload = (data) => {
    // console.log(data)
    setPostFiles(data)
  }

  return (
    <Card title={title}>
      <Form {...formItemLayout} className="form" ref={ref}>
        <Item
          label="Park Document Name:"
          name="name"
          initialValue={document.name}
          rules={[
            {

              required: true,
              message: "Please enter the document name",
            },
          ]}
        >
          <Input placeholder="Please enter the document name" />
        </Item>
        <Item
          label="Category"
          name="subId"
          rules={[
            {
              required: !{ isUpdate },
              message: "Please select a sub-category",
            },
          ]}
        >
          <Select
            placeholder="Sub-Category"
            onChange={(value) => setSubId(value)}
            defaultValue={defaultOption}
            dropdownRender={menu => (
              <div>
                {menu}
                <Divider style={{ margin: '4px 0' }} />
                <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                  <Input style={{ flex: 'auto' }}
                    value={newSubCategory}
                    onChange={(e) => setNewSubCategory(e.target.value)} />

                  <Button type='primary'
                    className='add_button'
                    onClick={addNewSubcategory}>
                    <PlusOutlined />
                     Add
                 </Button>
                </div>
              </div>
            )}
          >
            {/* map out the park document sub-categories */}
            {subCategories.map((c) => (
              <Option key={c.id} value={c.id}>
                {c.name}
              </Option>
            ))}
          </Select>
        </Item>

        <Item
          label="Description"
          name="description"
          initialValue={document.description}
          rules={[
            {
              required: true,
              message: "Please fill the description",
            },
          ]}
        >
          <TextArea row={4} />
        </Item>

        <UploadFile onUpload={handleUpload} />

          <br/>
        <Item >
          <Button type="primary" htmlType="submit" onClick={addOrUpdateParkdocument}>
            {isUpdate ? "Update" : "Add"}
          </Button>
        </Item>
      </Form>
    </Card>
  );
}
