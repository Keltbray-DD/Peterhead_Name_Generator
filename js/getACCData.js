const folders =[
    "urn:adsk.wipemea:fs.folder:co.TTt9faNOTnGEWOC8ji055g", // 0C.KELTBRAY - WIP
    "urn:adsk.wipemea:fs.folder:co.ORSGzENuSvGxU0z8Nu3erg", // 0D.SUB-CONTRACTORs - JACOBS - WIP
    "urn:adsk.wipemea:fs.folder:co.C7KA83Y2Q-KlPVGuXZXS3Q", // 0D.SUB-CONTRACTORs - WENTWORTH HOUSE - WIP
    "urn:adsk.wipemea:fs.folder:co.WG2nMXrER3iYLE5sSrBlKg",
    "urn:adsk.wipemea:fs.folder:co.4--FVVhGT62O7VqORc17LA",
    "urn:adsk.wipemea:fs.folder:co.PM3ASkyKTYed__3kzLcA7w",
    "urn:adsk.wipemea:fs.folder:co.ouxOilcSTm2z9mimcuUQrw", // 0E.SHARED
    "urn:adsk.wipemea:fs.folder:co.1U7RIHcTQhK0MuiFVKmBBw", // 0F.CLIENT_SHARED
    //"urn:adsk.wipemea:fs.folder:co.fI4I2_NUQCab66s_Ifswow", // 0G.PUBLISHED
    "urn:adsk.wipemea:fs.folder:co.UuWWDGCXTsOeTF98U6pIuw", // 0H.ARCHIVED

]
const clientId = "UMPIoFc8iQoJ2eKS6GsJbCGSmMb4s1PY";
const clientSecret = "3VP1GrzLLvOUoEzu";


const projectID = "e119c525-f9f1-44a2-86db-9e4bb07a18fa";
const namingstandardID ="d5a0e865-dea7-532e-b4c8-dfbcbb8b36cd"

let namingstandard;
let filelist =[];
let arrayContractCode=[];
let arrayOriginatorCode=[];
let arrayfunction=[];
let arrayLocationCode=[];
let arraySequenceCode=[];
let arraySubjectDiscipline=[];
let arrayDocType =[];

let SubjectDiscipline

getfileslist()
getNamingStandard()

function generateDocName(){
    ContractCode = document.querySelector('#ProjectPin_input')
    console.log(ContractCode.value)
    OriginatorCode = document.querySelector("#Originator_input")
    console.log(OriginatorCode.value)
    vFunction = document.querySelector('#Function_input')
    console.log(vFunction.value)
    LocationCode = document.querySelector("#Spatial_input")
    console.log(LocationCode.value)
    DocType = document.querySelector("#DocType_input")
    console.log(DocType.value)
    SubjectDiscipline = document.querySelector("#Discipline_input")
    console.log(SubjectDiscipline.value)
    const varDocNumber_noNum = ContractCode.value+"-"+LocationCode.value+"-"+vFunction.value+"-"+DocType.value+"-"+SubjectDiscipline.value+"-"+OriginatorCode.value
    console.log(varDocNumber_noNum)

    const PartialMatch = filelist.filter(item => item.includes(varDocNumber_noNum));

    if (PartialMatch.length >=1) {
        console.log(`Partial match '${varDocNumber_noNum}' found in the array.`);
        const partialMatchesArray = PartialMatch.map(match => match.replace(/\.[^.]+$/, ''));
        console.log('Partial matches array:', partialMatchesArray);

        // Extract the numbers from the filenames
        const numbers = partialMatchesArray.map(filename => {
            const match = filename.match(/(\d+)$/);
            return match ? parseInt(match[1], 10) : null;
        });

        // Find the maximum number
        const maxNumber = Math.max(...numbers);

        // Calculate the next number
        const nextNumber = maxNumber + 1;

        // Pad the next number with zeros and set the fixed length to 6
        const paddedNextNumber = String(nextNumber).padStart(3, '0');

        console.log('Next number with padded zeros and fixed length 3:', paddedNextNumber);

        newNumber = paddedNextNumber
    } else {
        console.log(`No partial match '${varDocNumber_noNum}' found in the array.`);
        newNumber = "001"
    }

    
    console.log(DocType.options[DocType.selectedIndex].text)
    var vDocType = DocType.options[DocType.selectedIndex].text
    if (vDocType.includes("dwg")) {
        console.log(`Partial match '${varDocNumber_noNum}' found in the array.`);
        const partialMatchesArray = PartialMatch.map(match => match.replace(/\.[^.]+$/, ''));
        console.log('Partial matches array:', partialMatchesArray);

        // Extract the numbers from the filenames
        const numbers = partialMatchesArray.map(filename => {
            const match = filename.match(/(\d+)$/);
            return match ? parseInt(match[1], 10) : null;
        });

        // Find the maximum number
        const maxNumber = Math.max(...numbers);

        // Calculate the next number
        const nextNumber = maxNumber + 1;

        // Pad the next number with zeros and set the fixed length to 6
        const paddedNextNumber = String(nextNumber).padStart(2, '0');

        console.log('Next number with padded zeros and fixed length 3:', paddedNextNumber);

        newDrawingNumber = paddedNextNumber
    } else if (vDocType.includes("Doc")){
        console.log(`No partial match '${varDocNumber_noNum}' found in the array.`);
        newDrawingNumber = "00"
    }

    const varDocNumber_Full = varDocNumber_noNum+"-"+newNumber+"-"+newDrawingNumber
    console.log('New Document Number: ', varDocNumber_Full);
    document.getElementById("DocNumber").value = varDocNumber_Full.toString()


}

async function getNamingStandard() {
    try {
        access_token = await generateTokenDataCreate(clientId, clientSecret);
    } catch {
        console.log("Error: Getting Access Token");
    }
    //console.log("Access Token: ", access_token);

    try {
        namingstandard = await getNamingStandardforproject(access_token,namingstandardID,projectID)

    } catch (error) {
        console.error("Error iterating through folders:", error);
    }
    console.log(namingstandard)
    arrayContractCode = namingstandard.find(item => item.name === "Contractor Codes")
    arrayContractCode = arrayContractCode ? arrayContractCode.options : [];

    // Get the dropdown container
    const dropdownContainerProjectPin = document.getElementById("ProjectPin_input");

    // Create and append options to the dropdown
    arrayContractCode.forEach(option => {
        const optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.textContent = `${option.value} - ${option.description}`;
        dropdownContainerProjectPin.appendChild(optionElement);
    });

    arrayOriginatorCode = namingstandard.find(item => item.name === "Originator Code")
    arrayOriginatorCode = arrayOriginatorCode ? arrayOriginatorCode.options : [];

    // Get the dropdown container
    const dropdownContainerOriginator = document.getElementById("Originator_input");
    console.log(arrayOriginatorCode)
    // Create and append options to the dropdown
    arrayOriginatorCode.forEach(option => {
        const optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.textContent = `${option.value} - ${option.description}`;
        dropdownContainerOriginator.appendChild(optionElement);
    });

    arrayfunction = namingstandard.find(item => item.name === "Function")
    arrayfunction = arrayfunction ? arrayfunction.options : [];

    // Get the dropdown container
    const dropdownContainerfunction = document.getElementById("Function_input");
    console.log(arrayfunction)
    // Create and append options to the dropdown
    arrayfunction.forEach(option => {
        const optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.textContent = `${option.value} - ${option.description}`;
        dropdownContainerfunction.appendChild(optionElement);
    });

    arrayLocationCode = namingstandard.find(item => item.name === "Location Code")
    arrayLocationCode = arrayLocationCode ? arrayLocationCode.options : [];

    // Get the dropdown container
    const dropdownContainerSpatial = document.getElementById("Spatial_input");
    console.log(arrayLocationCode)
    // Create and append options to the dropdown
    arrayLocationCode.forEach(option => {
        const optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.textContent = `${option.value} - ${option.description}`;
        dropdownContainerSpatial.appendChild(optionElement);
    });

    arraySubjectDiscipline = namingstandard.find(item => item.name === "Subject & Discipline Code")
    arraySubjectDiscipline = arraySubjectDiscipline ? arraySubjectDiscipline.options : [];

    // Get the dropdown container
    const dropdownContainerDiscipline = document.getElementById("Discipline_input");
    console.log(arraySubjectDiscipline)
    // Create and append options to the dropdown
    arraySubjectDiscipline.forEach(option => {
        const optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.textContent = `${option.value} - ${option.description}`;
        dropdownContainerDiscipline.appendChild(optionElement);
    });

    arrayDocType = namingstandard.find(item => item.name === "Doc-Dwg Type")
    arrayDocType = arrayDocType ? arrayDocType.options : [];

    // Get the dropdown container
    const dropdownContainerDocType = document.getElementById("DocType_input");
    console.log(arrayDocType)
    // Create and append options to the dropdown
    arrayDocType.forEach(option => {
        const optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.textContent = `${option.value} - ${option.description}`;
        dropdownContainerDocType.appendChild(optionElement);
    });

}

async function getfileslist() {
    try {
        access_token = await generateTokenDataCreate(clientId, clientSecret);
    } catch {
        console.log("Error: Getting Access Token");
    }
    //console.log("Access Token: ", access_token);

    try {
        for (const folderID of folders) {
            try {
                filelist_temp = await getfolderItems(folderID, access_token, projectID);

            } catch (error) {
                console.error("Error getting folder items:", error);
            }
            filelist = filelist.concat(filelist_temp.data.map(item => item.attributes.displayName))
        }

    } catch (error) {
        console.error("Error iterating through folders:", error);
    }
    console.log(filelist)
}

async function generateTokenDataCreate(clientId,clientSecret){
    const bodyData = {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type:'client_credentials',
    scope:'data:read'
    };

    var formBody = [];
    for (var property in bodyData) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(bodyData[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    };
    formBody = formBody.join("&")

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    };

    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: formBody,
    };
    const apiUrl = 'https://developer.api.autodesk.com/authentication/v1/authenticate';
    //console.log(requestOptions)
    AccessToken_Local = await fetch(apiUrl,requestOptions)
        .then(response => response.json())
        .then(data => {
        //console.log(data)
        //console.log(data.access_token)
        return data.access_token
        })
        .catch(error => console.error('Error fetching data:', error));
        return AccessToken_Local
}

async function getfolderItems(folder_id,AccessToken,project_id){

    const headers = {
        'Authorization':"Bearer "+AccessToken,
    };

    const requestOptions = {
        method: 'GET',
        headers: headers,
    };

    const apiUrl = "https://developer.api.autodesk.com/data/v1/projects/b."+project_id+"/folders/"+folder_id+"/contents";
    //console.log(apiUrl)
    //console.log(requestOptions)
    signedURLData = await fetch(apiUrl,requestOptions)
        .then(response => response.json())
        .then(data => {
            const JSONdata = data
        //console.log(JSONdata)
        //console.log(JSONdata.uploadKey)
        //console.log(JSONdata.urls)
        return JSONdata
        })
        .catch(error => console.error('Error fetching data:', error));
    return signedURLData
    }

async function getNamingStandardforproject(access_token,ns_id,project_id){

    const headers = {
        'Authorization':"Bearer "+access_token,
    };

    const requestOptions = {
        method: 'GET',
        headers: headers,
    };

    const apiUrl = "https://developer.api.autodesk.com/bim360/docs/v1/projects/"+project_id+"/naming-standards/"+namingstandardID;
    //console.log(apiUrl)
    //console.log(requestOptions)
    responseData = await fetch(apiUrl,requestOptions)
        .then(response => response.json())
        .then(data => {
            const JSONdata = data
        //console.log(JSONdata)
        //console.log(JSONdata.uploadKey)
        //console.log(JSONdata.urls)
        return JSONdata.definition.fields
        })
        .catch(error => console.error('Error fetching data:', error));
    return responseData
    }