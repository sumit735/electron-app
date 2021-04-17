const { getAllconsignees, editconsignee, addConsigneeDb, deleteconsignee }  = require('../knex');
const remote = require('@electron/remote');


const deleteconsigneeDb = async (id) => {
    try {
        let result = await deleteconsignee(id);
        console.log(result);
        document.getElementById(`row${id}`).remove();
    } catch(e) {
        console.log('exception', e);
        document.querySelector('.error').innerHTML = "<p class='alert alert-danger'>Sorry! Failed to Delete</p>"
    }
    
}

document.addEventListener('DOMContentLoaded', async () => {

    let addconsigneeForm = document.getElementById('addconsigneeForm');
    addconsigneeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        let formData = new FormData(e.target);
        // check if consignee db already exist
        try {
            let allconsignees = await getAllconsignees();
            console.log('all consignees', allconsignees);
            consignees = allconsignees;
            console.log('consignee db exists');

        } catch(e) {
            console.log('create consignee db');
            consignees = [];
        }
        
        
        let consignee = {};
        for (var key of formData.keys()) {
            consignee[key] = formData.get(key);
        }
        if(consignee.id == '') {
            consignee.id = new Date().getTime().toString();
        }
        consignees.push(consignee);
        console.log('consignees are ',consignees);

        const result = await addConsigneeDb(consignees);
        console.log(result);
        if(result.errCode == 2000) {
            // close window
            console.log(result.consignee[result.consignee.length - 1]);
            let window = remote.getCurrentWindow();
            ipcRenderer.send('consigneeDetails', result.consignee[result.consignee.length - 1]);
            window.close()
        } else {
            document.querySelector('.error').innerHTML = `<p class='alert alert-danger'>${message}</p>`
        }
    });

    
    
    // let editCompanyForm = document.getElementById('editCompanyForm')
    // editCompanyForm.addEventListener('submit', async (e) => {
    //     e.preventDefault();
    //     let formData = new FormData(e.target)
    //     let company = {};
    //     for (var key of formData.keys()) {
    //         company[key] = formData.get(key);
    //     }
    //     if(company.id == '') {
    //         company.id = new Date().getTime().toString();
    //     }
    //     console.log(company);

    //     const result = await editCompanyDetails(company);
    //     console.log(result);
    //     if(result.errCode == 2000) {
    //         // close window
    //         let window = remote.getCurrentWindow();
    //         // window.close()
    //         ipcRenderer.send('companyDetails', result.company);
    //         window.close()
    //     } else {
    //         document.querySelector('.error').innerHTML = `<p class='alert alert-danger'>${message}</p>`
    //     }
    // })
});


