
// Imports
import { message, Upload } from "antd";
import { useEffect, useState } from "react";

// Custom components
import { InboxOutlined } from "@ant-design/icons";
import { BASE_FILE } from "../../constant/constants";

// API calls
import { deleteFile } from '../apifunction'

// Css file
import "./fileUpload.css";



/**
 * Upload files system and handle all the logic to upload, deleting files
 * 
 * @author Charles Breton
 * @param {*} onUpload function to call to pass data to parent component
 * @returns onUpload(***) pass files array to parent component
 */
export const UploadFile = ({ onUpload }) => {
    
    // Retrieve data for upload component
    const files = JSON.parse(localStorage.getItem("load_files"));
    const uploadType = localStorage.getItem("upload_type");
    let maxFiles = localStorage.getItem("load_section");
    let accept = localStorage.getItem("upload_type");
    
    // State of all files
    const [filesUploaded, setFilesUploaded] = useState([]);

    // Token for uploading , deleting files
    const token = localStorage.getItem("access_token");

    // Formatted File List with first load 
    const [fileListItems, setFileListItems] = useState([])

    // Ensure file formatted is complete before displaying element
    const [filesLoaded, setFilesLoaded] = useState(false)


    // Initial function call when loading component
    useEffect(() => {
        // Determine if need to format files
        if (files !== null && files.length !== 0) {
            formatFiles()
        } else {
            setFilesLoaded(true)
        }
    }, [])

    // Send files to parent function when upload or deleting file happens
    useEffect(() => {
        onUpload(filesUploaded)
    }, [filesUploaded])


    // Formating files to be compatible with Antd component
    const formatFiles = () => {
        // With updating posts adding all files to current file list
        addImages(files, 2);

        // Format files to Antd standards
        let formattedList = [];
        for (let i = 0; i < files.length; i++) {
            let object = {
                uid: files[i],
                name: styleNameFormat(files[i]),
                status: 'done',
                url: files[i],
                thumbUrl: files[i]
            };

            formattedList.push(object);
        }

        // Setting states
        setFileListItems(formattedList)
        setFilesLoaded(true)

        // Format file to remove id attached for display file name
        function styleNameFormat(item) {
            if (item !== null) {
                let name = item.split('-')[5];
                return name;
            }
            return '';
        }

    }


    // Upload component properties
    let fileProps = {
        name: "files",

        // Max amount of files allowed
        maxCount: maxFiles,
        
        // File types
        accept,
        defaultFileList: [...fileListItems],
        multiple: false,

        // API info
        action: BASE_FILE,
        headers: {
            'Authorization': `bearer ${token}`
        },

        // Handle upload component state changes (updating / deleting)
        onChange(info) {
            const { status } = info.file;
            // Handle removing a file
            if (status === "removed") {
                const response = info.file.response

                // Determine the type of deleting if a previous uploaded file (UPDATING POST) or just added file
                if (response !== '' && typeof response !== 'undefined') {
                    removeImage(response.data[0], 1)
                } else {
                    removeImage(info.file.uid, 2)
                }
            }

            // Handle adding a file
            if (status === "done") {
                const response = info.file.response
                if (response !== "Network Error") {
                    if (response.status === "SUCCESS" && response.data !== null) {
                        // console.log(response.data)
                        addImages(response.data, 1)
                    } else {
                        message.error("Fetching wasn't successfull");
                    }
                } else {
                    addImages("BLANK")
                    message.error("Error with connecting to backend");
                }

                message.success(`${info.file.name} File Uploaded Successfully.`);
            } else if (status === "error") {
                message.error(`${info.file.name} File Upload Failed.`);
            }

        },
    };

    // Add a picture to files state
    const addImages = (info, type) => {
        let allImages = [];
        const currentfiles = filesUploaded;

        // Creating a new list with all files currently stored
        if (typeof currentfiles !== 'undefined' && currentfiles !== null) {
            for (let i = 0; i < currentfiles.length; i++) {
                allImages.push(currentfiles[i]);
            }
        }

        // Extra part if upload new file for first time
        if (type === 1) {
            allImages.push(info[0])
        } else {
            for (let i = 0; i < info.length; i++) {
                allImages.push(info[i]);
            }
        }

        // Update files state
        setFilesUploaded(allImages)
    };


    // Remove a picture to files state
    const removeImage = (info, type) => {
        let remainingImages = [];
        const currentfiles = filesUploaded;

        // Creating a new list with all files currently stored
        for (let i = 0; i < currentfiles.length; i++) {
            if (currentfiles[i] !== info) {
                remainingImages.push(currentfiles[i])
            }
        }

        deleteFileItem(info);

        // Update files state
        setFilesUploaded(remainingImages)

    };

    // Deleting file from backend
    const deleteFileItem = async (id) => {
        const response = await deleteFile(id);
        try {
            if (response !== "Network Error") {
                if (response.data.status === "SUCCESS") {
                } else {
                    message.error("Deleting file wasn't successfull");
                }
            } else {
                message.error("Error with connecting to backend");
            }
        } catch (error) {

        }
    }

    // Render component for upload files
    return (
        <div>
            { filesLoaded ?
                <div className="upload_system">
                    <Upload {...fileProps}
                        className="">
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="upload_text">
                            Click or drag images to this area to upload
                 </p>
                    </Upload>
                </div>
                : null}

        </div>


    )

}