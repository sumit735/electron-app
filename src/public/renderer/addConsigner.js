const { getAllConsigners, editConsigner, addConsignerDb, deleteConsigner }  = require('../knex');
const remote = require('@electron/remote');


// select consigner
const selectConsigner = (id) => {
    console.log(id);
    try {
        ipcRenderer.send('renderer',{type: 'selectConsigner', id});
  
    } catch(e) {
        console.log('exception', e);
        document.querySelector('.error').innerHTML = "<p class='alert alert-danger'>Sorry! Failed to Set</p>"
    }
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
    try {
        let allConsigners = await getAllConsigners();
        let table = document.getElementById('example');
        console.log('res is',allConsigners);
        try {
            if(allConsigners) {
                
                let rows = "";
                let slno = 1;
                allConsigners.map(consigner => {
                    let { id, consignerName, gstin, address, city, state, phone } = consigner;
                    rows += `<tr id=row${id}>`;
                    rows += "<td>"+ slno +"</td>";
                    rows += "<td>"+ consignerName +"</td>";
                    rows += "<td>"+ gstin +"</td>";
                    rows += "<td>"+ address +"</td>";
                    rows += "<td>"+ city +"</td>";
                    rows += "<td>"+ state +"</td>";
                    rows += "<td>"+ phone +"</td>";
                    rows += `<td><a style='margin-right: 5%' class='btn btn-danger' onclick='deleteConsignerDb(${id})'><i class='far fa-trash-alt'></i></a><a class='btn btn-success' onclick='selectConsigner(${id})'><i class='far fa-check-circle'></i></a></td>`;
                    rows += "</tr>";
                    slno++;
                });
                document.getElementById('consignerTbody').innerHTML = rows;
                var dataTable = new DataTable("#example", {
                    searchable: true,
                    sortable: true,
                    footer: true
                });
            } else {
                // hide table
                table.style.display = 'none';
            }
            // const { id, company, gstin, pancard, address, branchOffice, pincode, phone1, phone2, phone3, email, website } = companyData;
            // start adding to table
        } catch(e) {
            console.log(e);
            document.querySelector('.error').innerHTML = "<p class='alert alert-danger'>Sorry! Something Went Wrong. Please Contact Developer</p>"
        }
    } catch(err) {
        console.log(err);
        document.querySelector('.error').innerHTML = `<p class='alert alert-danger'>${err.message}</p>`
    }
    
    
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

const addNewConsigner = () => {
    ipcRenderer.send('renderer','addNewConsigner');
}
