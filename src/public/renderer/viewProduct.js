const { getAllProducts, deleteProduct }  = require('../knex');
const remote = require('@electron/remote');


// edit Product
const editProduct = (id) => {
    console.log('from view ',id);
    try {
        ipcRenderer.send('renderer',{type: 'editProduct', id});
  
    } catch(e) {
        console.log('exception', e);
        document.querySelector('.error').innerHTML = "<p class='alert alert-danger'>Sorry! Failed to Select</p>"
    }
}

const deleteProductDb = async (id) => {
    try {
        let result = await deleteProduct(id);
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
        let allProducts = await getAllProducts();
        let table = document.getElementById('example');
        console.log('res is',allProducts);
        try {
            if(allProducts) {
                
                let rows = "";
                let slno = 1;
                allProducts.map(Product => {
                    let { id, productName, packets, rate, unit, weight, freight } = Product;
                    rows += `<tr id=row${id}>`;
                    rows += "<td>"+ slno +"</td>";
                    rows += "<td>"+ productName +"</td>";
                    rows += "<td>"+ packets +"</td>";
                    rows += "<td>"+ rate +"</td>";
                    rows += "<td>"+ unit +"</td>";
                    rows += "<td>"+ weight +"</td>";
                    rows += "<td>"+ freight +"</td>";
                    rows += `<td><a style='margin-right: 5%' class='btn btn-danger' onclick='deleteProductDb(${id})'><i class='far fa-trash-alt'></i></a><a class='btn btn-success' onclick='editProduct(${id})'><i class='far fa-check-circle'></i></a></td>`;
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

const addNewProduct = () => {
    ipcRenderer.send('renderer','addNewProduct');
}
