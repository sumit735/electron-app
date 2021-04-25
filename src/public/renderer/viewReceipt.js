const { getAllReceipts, deleteReceipt }  = require('../knex');
const remote = require('@electron/remote');


const downloadFile = (id) => {
    console.log(id);
    ipcRenderer.send('viewReceiptDownload', id);
}
const print = (id) => {
    console.log(id);
    ipcRenderer.send('viewReceiptPrint', id);
}
const deleteReceiptDb = async (id) => {
    console.log(id);
    try {
        let result = await deleteReceipt(id);
        console.log(result);
        document.getElementById(`row${id}`).remove();
    } catch(e) {
        console.log('exception', e);
        document.querySelector('.error').innerHTML = "<p class='alert alert-danger'>Sorry! Failed to Delete</p>"
    }
}

ipcRenderer.on('pdfDownload', (evt, msg) => {
    console.log('pdf download is',msg);
    const notyf = new Notyf();
    if(msg == 'success') {
        notyf.success('Successfully Downloaded');
    } else {
        notyf.error('Failed To Download');
    }
});
ipcRenderer.on('print', (evt, msg) => {
    console.log('Print is',msg);
    const notyf = new Notyf();
    if(msg.status == 'success') {
        notyf.success('Successfully Printed');
    } else {
        notyf.error('Failed To Print', msg.failureReason);
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    try {
        new DataTable("#example", {
            searchable: true,
            sortable: true,
            footer: true
        });
        let allProducts = await getAllReceipts();
        let table = document.getElementById('example');
        console.log('res is',allProducts);
        try {
            if(allProducts) {
                
                let rows = "";
                let slno = 1;
                allProducts.map(Product => {
                    console.log(Product);
                    let { id, consigneeInput, consignerInput, date, receiptNo, prefix, totalFreight } = Product;
                    consigneeInput = JSON.parse(consigneeInput);
                    consignerInput = JSON.parse(consignerInput)
                    rows += `<tr id=row${id}>`;
                    rows += "<td>"+ slno +"</td>";
                    rows += "<td>"+ prefix+receiptNo +"</td>";
                    rows += "<td>"+ consignerInput.consignerName +"</td>";
                    rows += "<td>"+ consigneeInput.consigneeName +"</td>";
                    rows += "<td>"+ totalFreight +"</td>";
                    rows += "<td>"+ date +"</td>";
                    rows += `<td><a class='btn btn-success' onclick='downloadFile(${id})'><i class="fas fa-file-download"></i></a><a class='btn btn-success' onclick='print(${id})'><i class="fas fa-print"></i></a><a style='margin-right: 5%' class='btn btn-danger' onclick='deleteReceiptDb(${id})'><i class='far fa-trash-alt'></i></a></td>`;
                    rows += "</tr>";
                    slno++;
                });
                document.getElementById('productTbody').innerHTML = rows;
                
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
});
