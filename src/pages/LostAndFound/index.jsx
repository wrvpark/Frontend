import { Switch, Route, Redirect } from "react-router-dom"

import Home from "./Home";
import Detail from "./Detail";
import AddUpdate from "./AddUpdate";


/**
 * Index page for Lost & Found section
 * 
 * @author Charles Breton
 * 
 * @returns Lost & Found Section 
 */

export default function LostAndFound() {
    return (
        <Switch>
            {/* Display Home page with list and search feature */}
            <Route path="/lostAndFound" component={Home} exact />
            {/* Display Creating or Updating Page */}
            <Route path="/lostAndFound/addupdate" component={AddUpdate} exact />
            {/* Display details about specific post */}
            <Route path="/lostAndFound/detail" component={Detail} exact />
            {/* if no path matches, go to the product page */}
            <Redirect to='/lostAndFound' />
        </Switch>
    );

}