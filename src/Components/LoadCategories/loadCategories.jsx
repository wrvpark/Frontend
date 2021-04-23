// Imports
import { useEffect} from 'react';

// API calls
import { getCategoryIDs } from '../../api/apifunction'


/**
 * Logic for getting categories id 
 * 
 * @author Charles Breton
 */
export const LoadCategories = () => {
    
    // Initial function when first loaded
    useEffect(() => {
        fetchCategories();
    })

    // Fetch all categories id
    const fetchCategories = async () => {
        let data = null;
        const response = await getCategoryIDs();
        
        // Ensure that we have a valid response
        if (response !== "Network Error" && typeof response.data !== 'undefined') {
            if (response.data.status === "SUCCESS" && response.data.data !== null) {
                
                data = response.data.data

                // store categories based of data received
                data.map((item) => {
                    // console.log(item)
                    if (item.name === "Park Document") {
                        localStorage.setItem("park_doc_cat_id", item.id);
                    } else if (item.name === "Event") {
                        localStorage.setItem("event_cat_id", item.id);
                    } else if (item.name === "Services") {
                        localStorage.setItem("services_cat_id", item.id);
                    } else if (item.name === "For Sale or Rent") {
                        localStorage.setItem("sr_cat_id", item.id);
                    } else if (item.name === "Lost & Found") {
                        localStorage.setItem("lf_cat_id", item.id);
                    } else if (item.name === "Forum") {
                        localStorage.setItem("forum_cat_id", item.id);
                    }
                })
            }
        } else {

            // Remove stored data
            localStorage.setItem("park_doc_cat_id", null);
            localStorage.setItem("event_cat_id", null);
            localStorage.setItem("services_cat_id", null);
            localStorage.setItem("sr_cat_id", null);
            localStorage.setItem("lf_cat_id", null);
            localStorage.setItem("forum_cat_id", null);
        }

    }

    return (
        <></>   
    )

}