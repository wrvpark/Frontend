
import {Switch, Route,Redirect} from "react-router-dom"

import Home from "./Home";
import Detail from "./Detail";
import AddUpdate from "./AddUpdate";
import DeleteParkDocument from "./Delete";

export default function ParkDocument() { 
    return (
       <Switch>
                {/* exact=true  will only match if the path matches the 
                location.pathname exactly.*/}
                <Route path="/documents" component={Home} exact/>
                <Route path="/documents/addupdate" component={AddUpdate} exact/>
                <Route path="/documents/detail" component={Detail} exact />
                <Route path="/documents/delete" component={DeleteParkDocument} exact/>
                {/* if no path matches, go to the product page */}
                <Redirect to='/documents'/>
    </Switch>
    );

}