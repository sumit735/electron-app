const { getAllconsignees, editconsignee, addconsigneeDb, deleteconsignee }  = require('../knex');
const remote = require('@electron/remote');


// select consignee
const selectconsignee = (id) => {
    console.log('from view ',id);
    try {
        ipcRenderer.send('renderer',{type: 'selectconsignee', id});
  
    } catch(e) {
        console.log('exception', e);
        document.querySelector('.error').innerHTML = "<p class='alert alert-danger'>Sorry! Failed to Set</p>"
    }
}

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
    try {
        new DataTable("#example", {
            searchable: true,
            sortable: true,
            footer: true
        });
        let allconsignees = await getAllconsignees();
        let table = document.getElementById('example');
        console.log('res is',allconsignees);
        try {
            if(allconsignees) {
                
                let rows = "";
                let slno = 1;
                allconsignees.map(consignee => {
                    let { id, consigneeName, gstin, address, city, state, phone } = consignee;
                    rows += `<tr id=row${id}>`;
                    rows += "<td>"+ slno +"</td>";
                    rows += "<td>"+ consigneeName +"</td>";
                    rows += "<td>"+ gstin +"</td>";
                    rows += "<td>"+ address +"</td>";
                    rows += "<td>"+ city +"</td>";
                    rows += "<td>"+ state +"</td>";
                    rows += "<td>"+ phone +"</td>";
                    rows += `<td><a style='margin-right: 5%' class='btn btn-danger' onclick='deleteconsigneeDb(${id})'><i class='far fa-trash-alt'></i></a><a class='btn btn-success' onclick='selectconsignee(${id})'><i class='far fa-check-circle'></i></a></td>`;
                    rows += "</tr>";
                    slno++;
                });
                document.getElementById('consigneeTbody').innerHTML = rows;
                
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

const addNewconsignee = () => {
    ipcRenderer.send('renderer','addNewconsignee');
}
