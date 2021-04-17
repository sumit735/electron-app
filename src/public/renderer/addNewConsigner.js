const { getAllConsigners, editConsigner, addConsignerDb, deleteConsigner }  = require('../knex');
const remote = require('@electron/remote');

// select consigner
const selectConsigner = (id) => {
    console.log(id);
}

const deleteConsignerDb = async (id) => {
    try {
        let result = await deleteConsigner(id);
        console.log(result);
        document.getElementById(`row${id}`).remove();
    } catch(e) {
        console.log('exception', e);
        document.querySelector('.error').innerHTML = "<p class='alert alert-danger'>Sorry! Failed to Delete</p>"
    }
    
}

document.addEventListener('DOMContentLoaded', async () => {

    let addConsignerForm = document.getElementById('addConsignerForm');
    addConsignerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        let formData = new FormData(e.target);
        // check if consigner db already exist
        try {
            let allConsigners = await getAllConsigners();
            console.log('all consigners', allConsigners);
            consigners = allConsigners;
            console.log('consigner db exists');

        } catch(e) {
            console.log('create consigner db');
            consigners = [];
        }
        
        
        let consigner = {};
        for (var key of formData.keys()) {
            consigner[key] = formData.get(key);
        }
        if(consigner.id == '') {
            consigner.id = new Date().getTime().toString();
        }
        consigners.push(consigner);
        console.log('consigners are ',consigners);

        const result = await addConsignerDb(consigners);
        console.log(result);
        if(result.errCode == 2000) {
            // close window
            console.log(result.consigner[result.consigner.length - 1]);
            let window = remote.getCurrentWindow();
            ipcRenderer.send('consignerDetails', result.consigner[result.consigner.length - 1]);
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


