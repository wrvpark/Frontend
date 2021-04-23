import { Switch, Route, Redirect } from "react-router-dom"

import Home from "./Home";
import Detail from "./Detail";
import AddUpdate from "./AddUpdate";


/**
 * Index page for Services section
 * 
 * @author Charles Breton
 * 
 * @returns Sale & Rent Section 
 */
export default function Services() {
    return (
        <Switch>
            {/* Display Home page with list and search feature */}
            <Route path="/services" component={Home} exact />
            {/* Display Creating or Updating Page */}
            <Route path="/services/addupdate" component={AddUpdate} exact />
            {/* Display details about specific post */}
            <Route path="/services/detail" component={Detail} exact />
            {/* if no path matches, go to the product page */}
            <Redirect to='/services' />
        </Switch>
    );

}