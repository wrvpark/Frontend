import {Switch, Route,Redirect} from "react-router-dom"

import AccountsDetails from "./AccountsDetails";
import UserInfo from "./AccountsDetails/Details";
import LogPage from "./LogPage";


// Index page for Admin section
export default function Admin() { 
    return (
       <Switch>
                {/* {/* exact=true  will only match if the path matches the 
                location.pathname exactly.*/}
                <Route path="/admin/accountsDetails" component={AccountsDetails} exact/>
                <Route path="/admin/accountsDetails/userInfo" component={UserInfo} exact/>
                <Route path="/admin/logs" component={LogPage} exact/>
                {/* if no path matches, go to the product page */}
                <Redirect to='/'/> 
    </Switch>
    );

}