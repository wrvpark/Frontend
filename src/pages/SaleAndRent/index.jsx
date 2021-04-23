import { Switch, Route, Redirect } from "react-router-dom"

import Home from "./Home";
import Detail from "./Detail";
import AddUpdate from "./AddUpdate";


/**
 * Index page for Sale & Rent section
 * 
 * @author Charles Breton
 * 
 * @returns Sale & Rent Section 
 */
export default function SaleAndRent() {
    return (
        <Switch>
            {/* Display Home page with list and search feature */}
            <Route path="/saleAndRent" component={Home} exact />
            {/* Display Creating or Updating Page */}
            <Route path="/saleAndRent/addupdate" component={AddUpdate} exact />
            {/* Display details about specific post */}
            <Route path="/saleAndRent/detail" component={Detail} exact />
            {/* if no path matches, go to the product page */}
            <Redirect to='/saleAndRent' />
        </Switch>
    );

}