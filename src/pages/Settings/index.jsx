// Imports
import {Switch, Route,Redirect} from "react-router-dom"
import UserInfo from "./UserInfo";


/**
 * Index page for Settings section
 * 
 * @author Charles Breton
 * 
 * @returns Settings Section 
 */
export default function Settings() { 
    return (
       <Switch>
                {/* {/* exact=true  will only match if the path matches the 
                location.pathname exactly.*/}
                <Route path="/settings" component={UserInfo} exact/>
                {/* if no path matches, go to the product page */}
                <Redirect to='/settings'/> 
    </Switch>
    );

}