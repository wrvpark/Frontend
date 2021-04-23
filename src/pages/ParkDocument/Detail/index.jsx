
import { Card, List, } from 'antd';
import { ArrowLeftOutlined } from "@ant-design/icons";
import LinkButton from '../../../Components/LinkButton';
import { NavLink } from "react-router-dom";

const Item = List.Item;
export default function Detail(props) {

    //get the park document information that passed from the Home component
    const { name, description, fileName, creator, subCategory, url } = props.location.state;

    // Prevent redirect when clicking on Post deleting header
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
                POST DETAILS
            </NavLink>
        </span>
    );

    return (
        <Card title={title}>
            <List>
                <Item>
                    <span className='left'>Park Document Name:</span>
                    <span>{name}</span>
                </Item>
                <Item>
                    <span className='left'>Description:</span>
                    <span>{description}</span>
                </Item>
                <Item>
                    <span className='left'>Sub-category:</span>
                    <span>{subCategory.name}</span>
                </Item>
                <Item>
                    <span className='left'>Creator:</span>
                    <span>{creator.firstName}</span>
                </Item>
                <Item>
                    <span className='left'>File:</span>
                    <span>
                        <a rel="noreferrer" href={url} target="_blank">
                            {fileName && fileName.substring(fileName.lastIndexOf("-") + 1)}
                        </a></span>
                </Item>
            </List>
        </Card>
    );
}
