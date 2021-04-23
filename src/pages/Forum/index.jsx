import { Switch, Route, Redirect } from "react-router-dom"

import Home from "./Home";
import Detail from "./Detail";
import AddUpdate from "./AddUpdate";


/**
 * Index page for Forum section
 * 
 * @author Charles Breton
 * 
 * @returns Forum Section 
 */
export default function Forum() {
    return (
        <Switch>
            {/* Display Home page with list and search feature */}
            <Route path="/forum" component={Home} exact />
            {/* Display Creating or Updating Page */}
            <Route path="/forum/addupdate" component={AddUpdate} exact />
            {/* Display details about specific post */}
            <Route path="/forum/detail" component={Detail} exact />
            {/* if no path matches, go to the product page */}
            <Redirect to='/forum' />
        </Switch>
    );

}