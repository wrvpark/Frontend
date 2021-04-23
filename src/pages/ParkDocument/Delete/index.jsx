import React from 'react'
import { Card, Button, Input, Form } from "antd";
import LinkButton from "../../../Components/LinkButton";
import { NavLink } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { deleteParkDocument } from "../../../api/apifunction";

const { TextArea } = Input;
const { Item } = Form;


const formItemLayout = {
  labelCol: { span: 2.5 },
  wrapperCol: { span: 5 },
};

//define a ref for the form
const ref = React.createRef();
function DeleteParkDocument(props) {

  // Prevent redirect when clicking on Post deleting header
  const handleClick = (e) => {
    e.preventDefault();
  };


  const deleteDocument = () => {
    ref.current
      .validateFields()
      .then(async (values) => {
        const { reason, description } = ref.current.getFieldsValue();
        const modifierId = "";
        const itemId = props.location.state.id;
        //check if add a parkdocument
        var response = await deleteParkDocument(itemId, description, reason, modifierId);

        if (response.data.status === "SUCCESS" && response.data.data !== null) {
          props.history.goBack();
        }
      })
      .catch((errorInfo) => {
        //fields has errors
        console.log("errorInfo:" + errorInfo);
      });
  }
  //define a sub-title
  const title = (
    <span>
      <div>

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
          POST DELETION
        </NavLink>
      </div>
    </span>
  );
  return (
    <Card title={title}>
      <Form className="form" {...formItemLayout} ref={ref}>
        <Item
          label="Reason to delete:"
          name="reason"
          rules={[
            {
              required: true,
              message: "Please enter the reason",
            },
          ]}
        >
          <Input placeholder="Why delete it?" />
        </Item>
        <Item
          label="Description"
          name="description"
        >
          <TextArea row={4} />
        </Item>

        <Item>
          <Button type="primary" htmlType="submit" onClick={deleteDocument}>
            Delete
          </Button>
        </Item>
      </Form>
    </Card>
  );
}

export default DeleteParkDocument;
