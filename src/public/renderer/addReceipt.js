const { getCompanyDetails, getConsginerById, getConsgineeById }  = require('../knex');
// setup company db
document.addEventListener('DOMContentLoaded', async () => {

    try {
        // get company data from the beginning
        let companyData = await getCompanyDetails();
        console.log('res is',companyData);
        document.getElementById('companyDetails').innerHTML = companyData.company
    } catch(e) {
        console.log('failed to fetch company details');
    }

    ipcRenderer.on('companyDetails', (evt, msg) => {
        console.log('companyDetails is',msg);
        document.getElementById('companyDetails').innerHTML = msg.company;
    });
    ipcRenderer.on('consignerDetails', (evt, msg) => {
        console.log('consignerDetails is',msg);
        document.getElementById('consignerDetails').innerHTML = msg.consignerName;
    });
    ipcRenderer.on('oldConsignerDetails', async (evt, msg) => {
        console.log('old consignerDetails is',msg);
        let consignerData = await getConsginerById(msg.id);
        console.log('consigner data ', consignerData);
        if(consignerData[0]) {
            document.getElementById('consignerDetails').innerHTML = consignerData[0].consignerName;
        } else {
            document.getElementById('consignerDetails').innerHTML = 'No Data Exist';
        }
    });
    ipcRenderer.on('consigneeDetails', (evt, msg) => {
        console.log('consigneeDetails is',msg);
        document.getElementById('consigneeDetails').innerHTML = msg.consigneeName;
    });
    ipcRenderer.on('oldConsigneeDetails', async (evt, msg) => {
        console.log('old consigneeDetails is',msg);
        let consigneeData = await getConsgineeById(msg.id);
        console.log('consignee data ', consigneeData);
        if(consigneeData[0]) {
            document.getElementById('consigneeDetails').innerHTML = consigneeData[0].consigneeName;
        } else {
            document.getElementById('consigneeDetails').innerHTML = 'No Data Exist';
        }
    });
})
