const { getCompanyDetails, getConsginerById, getConsgineeById, getProductById }  = require('../knex');

// ! TODO- Delete each product when clicked
const deleteItem = (id) => {
    console.log(id);
}

// * Core Calculation Part

const calculateCharges = (taxable, gst) => {
    taxable = taxable ? parseInt(taxable) : parseInt(0.00);
    gst = gst ? parseInt(gst) : parseInt(0.00);
    let total = 0;
    total = taxable + (taxable * gst) / 100;
    return total;
}

// * Element wise calculation part

const calculateFreightCharges = () => {
    console.log('freight calculation invoked');
    let freightTaxable = document.getElementById('freightTaxable').value;
    let freightGst = document.getElementById('freightGst').value;
    
    let freightTotalAmount = calculateCharges(freightTaxable, freightGst); 
    console.log('freight total amount is ', freightTotalAmount);
    document.getElementById('freightTotal').value = freightTotalAmount ? freightTotalAmount.toFixed(2) : '0.00';
    calculateTotalAmount();
}
const calculateLabourCharges = () => {
    console.log('Labour calculation invoked');
    let labourTaxable = document.getElementById('labourTaxable').value;
    let labourGst = document.getElementById('labourGst').value;
    
    let labourTotalAmount = calculateCharges(labourTaxable, labourGst);
    console.log('labour total amount is ', labourTotalAmount);
    document.getElementById('labourTotal').value = labourTotalAmount ? labourTotalAmount.toFixed(2) : '0.00';
    calculateTotalAmount();
}
const calculateLoadingCharges = () => {
    console.log('loading calculation invoked');
    let loadingTaxable = document.getElementById('loadingTaxable').value;
    let loadingGst = document.getElementById('loadingGst').value;
    
    let loadingTotalAmount = calculateCharges(loadingTaxable, loadingGst);
    console.log('loading total amount is ', loadingTotalAmount);
    document.getElementById('loadingTotal').value = loadingTotalAmount ? loadingTotalAmount.toFixed(2) : '0.00';
    calculateTotalAmount();
}
const calculateUnloadingCharges = () => {
    console.log('unloading calculation invoked');
    let UnloadingTaxable = document.getElementById('UnloadingTaxable').value;
    let UnloadingGst = document.getElementById('UnloadingGst').value;
    
    let UnloadingTotalAmount = calculateCharges(UnloadingTaxable, UnloadingGst);
    console.log('Unloading total amount is ', UnloadingTotalAmount);
    document.getElementById('UnloadingTotal').value = UnloadingTotalAmount ? UnloadingTotalAmount.toFixed(2) : '0.00';
    calculateTotalAmount();
}
const calculatePackagingCharges = () => {
    console.log('Packaging calculation invoked');
    let PackagingTaxable = document.getElementById('PackagingTaxable').value;
    let PackagingGst = document.getElementById('PackagingGst').value;
    
    let PackagingTotalAmount = calculateCharges(PackagingTaxable, PackagingGst);
    console.log('Packaging total amount is ', PackagingTotalAmount);
    document.getElementById('PackagingTotal').value = PackagingTotalAmount ? PackagingTotalAmount.toFixed(2) : '0.00';
    calculateTotalAmount();
}
const calculateUnpackagingCharges = () => {
    console.log('Unpackaging calculation invoked');
    let UnpackagingTaxable = document.getElementById('UnpackagingTaxable').value;
    let UnpackagingGst = document.getElementById('UnpackagingGst').value;
    
    let UnpackagingTotalAmount = calculateCharges(UnpackagingTaxable, UnpackagingGst);
    console.log('Unpackaging total amount is ', UnpackagingTotalAmount);
    document.getElementById('UnpackagingTotal').value = UnpackagingTotalAmount ? UnpackagingTotalAmount.toFixed(2) : '0.00';
    calculateTotalAmount();
}
const calculateOtherCharges = () => {
    console.log('Other calculation invoked');
    let OtherTaxable = document.getElementById('OtherTaxable').value;
    let OtherGst = document.getElementById('OtherGst').value;
    
    let OtherTotalAmount = calculateCharges(OtherTaxable, OtherGst);
    console.log('Other total amount is ', OtherTotalAmount);
    document.getElementById('OtherTotal').value = OtherTotalAmount ? OtherTotalAmount.toFixed(2) : '0.00';
    calculateTotalAmount();
}

const calculateTotalAmount = () => {
    console.log('total amount work pending');
}
 
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
    ipcRenderer.on('productDetails', (evt, products) => {
        console.log('productDetails is',products);
        document.getElementById('productDetails').innerHTML += `<p id="product${products.id}">${products.productName} <br> ${products.weight} ${products.unit.toUpperCase()} <span class='text-danger' style='margin-left: 3rem; cursor: pointer;'><i onclick=deleteItem('${products.id}') class="fas fa-trash-alt"></i></span></p>`;
    });
    ipcRenderer.on('oldProductDetails', async (evt, msg) => {
        console.log('old productDetails is',msg);
        let productData = await getProductById(msg.id);
        console.log('product data ', productData);
        if(productData[0]) {
            document.getElementById('productDetails').innerHTML += `<p id="product${productData[0].id}">${productData[0].productName} <br> ${productData[0].weight} ${productData[0].unit.toUpperCase()} <span class='text-danger' style='margin-left: 3rem; cursor: pointer;'><i onclick=deleteItem('${productData[0].id}') class="fas fa-trash-alt"></i></span></p>`;
        } else {
            document.getElementById('productDetails').innerHTML = 'No Data Exist';
        }
    });
})
