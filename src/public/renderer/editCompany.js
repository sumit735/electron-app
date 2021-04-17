const { getCompanyDetails, editCompanyDetails }  = require('../knex');
const remote = require('@electron/remote');


document.addEventListener('DOMContentLoaded', async () => {
    try {
        let companyData = await getCompanyDetails();
        console.log('res is',companyData);
        try {
            const { id, company, gstin, pancard, address, branchOffice, pincode, phone1, phone2, phone3, email, website } = companyData;
            document.getElementById('id').value = id ? id : '';
            document.getElementById('gstin').value = gstin ? gstin : '';
            document.getElementById('panNo').value = pancard ? pancard : '';
            document.getElementById('companyName').value = company ? company : '';
            document.getElementById('address').value = address ? address : '';
            document.getElementById('branchOffice').value = branchOffice ? branchOffice : '';
            document.getElementById('pinCode').value = pincode ? pincode : '';
            document.getElementById('phone1').value = phone1 ? phone1 : '';
            document.getElementById('phone2').value = phone2 ? phone2 : '';
            document.getElementById('phone3').value = phone3 ? phone3 : '';
            document.getElementById('email').value = email ? email : '';
            document.getElementById('website').value = website ? website : '';
        } catch(e) {
            document.querySelector('.error').innerHTML = "<p class='alert alert-danger'>Sorry! Something Went Wrong. Please Contact Developer</p>"
        }
    } catch(err) {
        console.log(err);
        document.querySelector('.error').innerHTML = `<p class='alert alert-danger'>${err.message}</p>`
    }
    
    let editCompanyForm = document.getElementById('editCompanyForm')
    editCompanyForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        let formData = new FormData(e.target)
        let company = {};
        for (var key of formData.keys()) {
            company[key] = formData.get(key);
        }
        if(company.id == '') {
            company.id = new Date().getTime().toString();
        }
        console.log(company);

        const result = await editCompanyDetails(company);
        console.log(result);
        if(result.errCode == 2000) {
            // close window
            let window = remote.getCurrentWindow();
            // window.close()
            ipcRenderer.send('companyDetails', result.company);
            window.close()
        } else {
            document.querySelector('.error').innerHTML = `<p class='alert alert-danger'>${message}</p>`
        }
    })
});
