let projectdetails
let PM_Email
let APM_Email
let DM_Email
let ADM_Email
let HM_Email
let QM_Email
let AQM_Email
let IM_Email
let DC_Email
let ProjectRoles


function getProjectDetails(){

  async function fetchData(){
    var apiUrl_getProjectDetails = 'https://prod-28.uksouth.logic.azure.com:443/workflows/5bd3209073b748bc8b0089d5a52e5670/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Jyr6aOn2mx8vnBHIhhlJBsJU3d-4-3T2I_WWWBiTUUw';
    fetch(apiUrl_getProjectDetails)
      .then(response => response.json())
      .then(data => {
        //console.log(data);
        let projectdetails = []
        for (let i= 0; i<data.length; i++) {
          if (data[i].ProjectName==="Peterhead") {
            projectdetails = [...projectdetails, data[i]];
          }
        }
        var ProjectName_Local = projectdetails[0].ProjectName;
        sessionStorage.setItem('ProjectName',ProjectName_Local);
        //document.getElementById('IMEmail').innerHTML = sessionStorage.getItem('ProjectName');
        var IM_Email_Local = projectdetails[0].IM;
        sessionStorage.setItem('IM_Email',IM_Email_Local);
        //document.getElementById('IMEmail').innerHTML = sessionStorage.getItem('IM_Email');
        var PM_Email_Local = projectdetails[0].PM;
        sessionStorage.setItem('PM_Email',PM_Email_Local);
        //document.getElementById('PMEmail').innerHTML = sessionStorage.getItem('PM_Email');
        var DC_Email_Local = projectdetails[0].DC;
        sessionStorage.setItem('DC_Email',DC_Email_Local);
        //document.getElementById('DCEmail').innerHTML = sessionStorage.getItem('DC_Email');
        var DM_Email_Local = projectdetails[0].DM;
        sessionStorage.setItem('DM_Email',DM_Email_Local);
        //document.getElementById('DMEmail').innerHTML = sessionStorage.getItem(DM_Email);
        var ADM_Email_Local = projectdetails[0].ADM;
        sessionStorage.setItem('ADM_Email',ADM_Email_Local);
        //document.getElementById('ADMEmail').innerHTML = sessionStorage.getItem(ADM_Email);
        var QM_Email_Local = projectdetails[0].QM;
        sessionStorage.setItem('QM_Email',QM_Email_Local);
        //document.getElementById('QMEmail').innerHTML = sessionStorage.getItem(QM_Email);
        var AQM_Email_Local = projectdetails[0].AQM;
        sessionStorage.setItem('AQM_Email',AQM_Email_Local);
        //document.getElementById('AQMEmail').innerHTML = sessionStorage.getItem(AQM_Email);
        var HM_Email_Local = projectdetails[0].HM;
        sessionStorage.setItem('HM_Email',HM_Email_Local);
        //document.getElementById('HMEmail').innerHTML = sessionStorage.getItem(HM_Email);
        var OM_Email_Local = projectdetails[0].OM;
        sessionStorage.setItem('OM_Email',OM_Email_Local);
        //document.getElementById('HMEmail').innerHTML = sessionStorage.getItem(HM_Email);
        console.log(projectdetails);
 
      })
      .catch(error => console.error('Error fetching data:', error));
  }

  fetchData()

}

function getProjectRoles(){
      var apiUrl_getProjectRoles = 'https://prod-21.uksouth.logic.azure.com:443/workflows/e56b0f45849e4042bbb0619e6d98048c/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=NyZXTcmNXZbbC5TioPESi5D7nlG0_xvB5jlyeLVVSQ0';
      fetch(apiUrl_getProjectRoles)
        .then(response => response.json())
        .then(data => {
            let projectRoles_Local = []
            for (let i= 0; i<data.length; i++) {
              if (data[i].IsRole==="True") {
                projectRoles_Local = [...projectRoles_Local, data[i]];
              }
            }
            sessionStorage.setItem(ProjectRoles,JSON.stringify(projectRoles_Local));
            //console.log(data);
            return projectRoles_Local
        })
        .catch(error => console.error('Error fetching data:', error));
    }
