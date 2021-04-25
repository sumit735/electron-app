const { getProductById, editProductDetails }  = require('../knex');
const path = require('path');
const remote = require('@electron/remote');


const calculateFreightCharge = () => {
    let weightInput = document.getElementById('weight').value;
    let rateInput = document.getElementById('rate').value;

    weightInputValue = weightInput ? parseFloat(weightInput).toFixed(2) : 0.00;
    rateInputValue = rateInput ? parseFloat(rateInput).toFixed(2) : 0.00;

    console.log(weightInputValue, rateInputValue);

    let freightCharge = weightInputValue * rateInputValue;
    
    console.log(freightCharge);
    
    document.getElementById('freight').value = freightCharge.toFixed(2);
}




document.addEventListener('DOMContentLoaded', async () => {
    ipcRenderer.on('editproductdetails', async (evt, product) => {
        try {
            let productData = await getProductById(product.id);
            console.log('res is',productData);
            try {
                const { id, productName, unit, rate, packets } = productData[0];
                document.getElementById('id').value = id ? id : '';
                document.getElementById('name').value = productName ? productName : '';
                document.getElementById('unit').value = unit ? unit : '';
                document.getElementById('rate').value = rate ? rate : '';
                document.getElementById('packets').value = packets ? packets : '';
                
            } catch(e) {
                console.log(e);
                document.querySelector('.error').innerHTML = "<p class='alert alert-danger'>Sorry! Something Went Wrong. Please Contact Developer</p>"
            }
        } catch(err) {
            console.log(err);
            document.querySelector('.error').innerHTML = `<p class='alert alert-danger'>${err.message}</p>`
        }
    });
    
    
    let editProductForm = document.getElementById('editProductForm')
    editProductForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        let formData = new FormData(e.target)
        let product = {};
        for (var key of formData.keys()) {
            product[key] = formData.get(key);
        }
        if(product.id == '') {
            product.id = new Date().getTime().toString();
        }
        console.log(product);

        const result = await editProductDetails(product);
        console.log('result',result);
        if(result.errCode == 2000) {
            // close window
            let window = remote.getCurrentWindow();
            ipcRenderer.send('selectProduct', result.newProduct.id);
            window.close();
            
        } else {
            document.querySelector('.error').innerHTML = `<p class='alert alert-danger'>${result.message}</p>`
        }
    })
});
