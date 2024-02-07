const project_id = "b."+raw_project_id
const raw_project_id = "76c59b97-feaf-413c-9bd0-43cf8aaa3133"
const parent_folder_id ="urn:adsk.wipemea:fs.folder:co.D8o701jySTipdr8pFm7aIg"
const start_folder_id = "urn:adsk.wipemea:fs.folder:co.ERixcV73TDiScaKZqmtOZg"

function ACCAccessToken(){
    const client_id = "UMPIoFc8iQoJ2eKS6GsJbCGSmMb4s1PY";
    const client_secret = "3VP1GrzLLvOUoEzu";
    const token_endpoint = "https://developer.api.autodesk.com/authentication/v1/authenticate";

    const token_body = {
        client_id: client_id,
        client_secret: client_secret,
        grant_type: "client_credentials",
        scope: "data:read"  // Set the appropriate scope here
    };

    fetch(token_endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(token_body)
    })
    .then(response => response.json())
    .then(data => {
        if (data.access_token) {
            const access_token = data.access_token;
            console.log(access_token);
            return access_token
        } else {
            console.error(`Error: ${data.error}`);
        }
    })
    .catch(error => console.error('Error:', error));
}

function getdatafromACCFolder(){

    const apiUrl = 'https://developer.api.autodesk.com/bim360/docs/v1/projects/'+raw_project_id+'/versions:batch-get'; // Replace with actual endpoint


    fetch(apiUrl, {
    method: 'GET',
    headers: {
        'Authorization': 'Bearer '+ACCAccessToken(), // Include your access token here
    }
    })
    .then(response => response.json())
    .then(data => response)
    return data

}

async function getFileDetailsRequest(projectId, folderId, accessToken) {
    const apiGetContentsBaseUrl = `https://developer.api.autodesk.com/data/v1/projects/${projectId}/folders/${folderId}/contents`;
    
    const headers = {
        "Authorization": `Bearer ${ACCAccessToken()}`
    };

    try {
        const response = await fetch(apiGetContentsBaseUrl, { headers });
        
        if (response.status === 200) {
            const data = await response.json();
            return data;
        } else {
            throw new Error(`Error: ${response.status}`);
        }
    } catch (error) {
        console.error('Error:', error);
        throw error; // Re-throwing the error for handling in the calling code.
    }
}


function getFileCustomAttributes(fileData) {
    let customAttributes = fileData.results[0].customAttributes;

    let revision = "No Revision Found!";
    let title1 = "No Title 1 Found";
    let title2 = "No Title 2 Found";
    let title3 = "No Title 3 Found";
    let title4 = "No Title 4 Found";
    let status = "No Status Found";
    let state = "No State Found";
    let PCFStage = "No PCF Stage Found";
    let revDescription = "No Revision Description Found";

    for (let attr of customAttributes) {
        if (attr.id == 1032414) {
            revision = attr.value;
        }
        if (attr.id == 1032603) {
            title1 = attr.value;
        }
        if (attr.id == 1032604) {
            title2 = attr.value;
        }
        if (attr.id == 1032605) {
            title3 = attr.value;
        }
        if (attr.id == 1064303) {
            title4 = attr.value;
        }
        if (attr.id == 1063219) {
            status = attr.value;
        }
        if (attr.id == 1032433) {
            state = attr.value;
        }
        if (attr.id == 1063221) {
            PCFStage = attr.value;
        }
        if (attr.id == 1032429) {
            revDescription = attr.value;
        }
    }

    return [revision, title1, title2, title3, title4, status, state, PCFStage, revDescription];
}

async function getFileDetailsRequest(projectId, folderId, accessToken) {
    const apiGetContentsBaseUrl = `https://developer.api.autodesk.com/data/v1/projects/${projectId}/folders/${folderId}/contents`;
    
    const headers = {
        "Authorization": `Bearer ${accessToken}`
    };

    try {
        const response = await fetch(apiGetContentsBaseUrl, { headers });
        
        if (response.status === 200) {
            const data = await response.json();
            return data;
        } else {
            throw new Error(`Error: ${response.status}`);
        }
    } catch (error) {
        console.error('Error:', error);
        throw error; // Re-throwing the error for handling in the calling code.
    }
}

async function getFileCustomDetailsRequest(itemId, accessToken) {
    const apiGetFileDetailsBaseUrl = `https://developer.api.autodesk.com/bim360/docs/v1/projects/${raw_project_id}/versions:batch-get`;
    const headers = {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
    };

    const urn = [itemId];

    const data = {
        urns: urn
    };

    try {
        const response = await fetch(apiGetFileDetailsBaseUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        });

        if (response.status === 200) {
            const fileData = await response.json();
            return fileData;
        } else {
            throw new Error(`Error: ${response.status}`);
        }
    } catch (error) {
        console.error('Error:', error);
        throw error; // Re-throwing the error for handling in the calling code.
    }
}

async function getFolderContentsToExcel(projectId, rawProjectId, folderId, accessToken, baseUrl, folderPath = "") {
    try {
        const data = await getFileDetailsRequest(projectId, folderId);
        
        for (const item of data.data) {
            const itemId = item.id;
            const itemType = item.type;
            const itemName = item.attributes.displayName;
            
            const fileData = await getFileCustomDetailsRequest(itemId, accessToken);
            
            if (itemType === 'items') {
                const itemLink = item.links.webView.href;
                const [revision, title1, title2, title3, title4, status, state, PCFStage, revDescription] = getFileCustomAttributes(fileData);
                
                console.log(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} Name: ${itemName}, Folder Path: ${folderPath}`);
                
                // Add code to write metadata, URL, description, and folder path to Excel here
                
            } else if (itemType === 'folders') {
                const newFolderPath = folderPath ? `${folderPath}/${itemName}` : itemName;
                await getFolderContentsToExcel(projectId, rawProjectId, itemId, accessToken, baseUrl, newFolderPath);
            }
        }
    } catch (error) {
        console.error('Error:', error);
        throw error; // Re-throwing the error for handling in the calling code.
    }
}


function createHtmlTable(data) {
    const table = document.createElement('table');

    // Create header row
    const headerRow = table.insertRow();
    for (const key in data[0]) {
        const th = document.createElement('th');
        th.textContent = key;
        headerRow.appendChild(th);
    }

    // Populate data rows
    data.forEach(item => {
        const row = table.insertRow();
        for (const key in item) {
            const cell = row.insertCell();
            cell.textContent = item[key];
        }
    });

    return table;
}

// Inside getFolderContentsToCsv function
async function getFolderContentsToHtml(projectId, rawProjectId, folderId, accessToken, baseUrl, folderPath = "") {
    const records = [];

    try {
        const data = await getFileDetailsRequest(projectId, folderId);

        for (const item of data.data) {
            // ...
            // Rest of the code to retrieve item details
            // ...

            records.push({
                Name: item.itemName,
                Revision: item.revision,
                Title1: item.title1,
                Title2: item.title2,
                Title3: item.title3,
                Title4: item.title4,
                Status: item.status,
                state: item.state, 
                PCFStage: item.PCFStage, 
                revDescription: item.revDescription,
                link: item.itemLink,
                


                // ... (populate other fields accordingly)
            });
        }

        // Create HTML table
        const table = createHtmlTable(records);

        // Append the table to a container in your HTML (make sure to have an element with id 'table-container')
        const tableContainer = document.getElementById('table-container');
        tableContainer.innerHTML = '';
        tableContainer.appendChild(table);

    } catch (error) {
        console.error('Error:', error);
        throw error; // Re-throwing the error for handling in the calling code.
    }
}

