const { addProductDb, getAllProducts }  = require('../knex');
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

    let addProductForm = document.getElementById('addProductForm');
    addProductForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        let formData = new FormData(e.target);
        // check if Product db already exist
        try {
            let allProducts = await getAllProducts();
            console.log('all Products', allProducts);
            products = allProducts;
            console.log('Product db exists');

        } catch(e) {
            console.log('create Product db');
            products = [];
        }
        
        
        let product = {};
        for (var key of formData.keys()) {
            product[key] = formData.get(key);
        }
        if(product.id == '') {
            product.id = new Date().getTime().toString();
        }
        products.push(product);
        console.log('Products are ',products);

        const result = await addProductDb(products);
        console.log(result);
        if(result.errCode == 2000) {
            // close window
            console.log(result.products[result.products.length - 1]);
            let window = remote.getCurrentWindow();
            ipcRenderer.send('productDetails', result.products[result.products.length - 1]);
            window.close()
        } else {
            document.querySelector('.error').innerHTML = `<p class='alert alert-danger'>${message}</p>`
        }
    });

    
});