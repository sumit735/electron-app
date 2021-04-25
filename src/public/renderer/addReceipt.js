const { getConsginerById, getConsgineeById, getProductById, addReceipt, getNextReceiptCount, getAllReceipts }  = require('../knex');
const { dialog } = require('@electron/remote');

const dateFormatter = () => {
    let today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    return today = dd + '-' + mm + '-' + yyyy;
}
// * Delete each product when clicked
const deleteItem = (id) => {
    console.log(id);
    let productInput = document.getElementById('productInput');
    let productsArray = JSON.parse(productInput.value);
    let updatedValue = productsArray.filter(product => {
        return product.id !== id;
    });
    console.log('updated value is ',updatedValue);
    productInput.value = JSON.stringify(updatedValue);
    document.getElementById(`product${id}`).remove();
    calculateFreightValueFromProduct();
}

// * Core Calculation Part

const calculateCharges = (taxable, gst) => {
    taxable = taxable ? parseInt(taxable) : parseInt(0.00);
    gst = gst ? parseInt(gst) : parseInt(0.00);
    let total = 0;
    total = taxable + (taxable * gst) / 100;
    return total;
}

const calculateTotalAndPayableAmount = (freight, advance) => {
    freight = freight ? parseFloat(freight) : parseFloat('0.00');
    // labour = labour ? parseFloat(labour) : parseFloat('0.00');
    // loading = loading ? parseFloat(loading) : parseFloat('0.00');
    // unloading = unloading ? parseFloat(unloading) : parseFloat('0.00');
    // packaging = packaging ? parseFloat(packaging) : parseFloat('0.00');
    // unpackaging = unpackaging ? parseFloat(unpackaging) : parseFloat('0.00');
    // other = other ? parseFloat(other) : parseFloat('0.00');
    // dharmakanta = dharmakanta ? parseFloat(dharmakanta) : parseFloat('0.00');
    advance = advance ? parseFloat(advance) : parseFloat('0.00');

    let totalAmt = Number(freight).toFixed(2);

    let payableAmt = Number(totalAmt - advance).toFixed(2);
    
    return {totalAmt, payableAmt};
}

const setConsignee = () => {
  if (document.getElementById('setConsigneeAdd').checked) 
  {
    try {
        // fetch consignee
        let consignee = JSON.parse(document.getElementById('consigneeInput').value);
        if(consignee) {
            document.getElementById('addressOfDelivery').value = `${consignee.address}, ${consignee.city}, ${consignee.state}`;
        } else {
            const options = {
                type: 'error',
                buttons: ['Ok'],
                defaultId: 0,
                title: 'Consignee',
                message: '',
                detail: "It seems Consignee hasn't been selected. If this is a mistake please contact developer",
              };
            
              dialog.showMessageBox(null, options, (response, checkboxChecked) => {
                console.log(response);
                console.log(checkboxChecked);
              });
            document.getElementById('setConsigneeAdd').checked = false;
        }
    } catch(e) {
        console.log(e);
        const options = {
            type: 'error',
            buttons: ['Ok'],
            defaultId: 0,
            title: 'Consignee',
            message: 'Select Consignee First',
            detail: "It seems Consignee hasn't been selected. If this is a mistake please contact developer",
          };
        
          dialog.showMessageBox(null, options, (response, checkboxChecked) => {
            console.log(response);
            console.log(checkboxChecked);
          });
        document.getElementById('setConsigneeAdd').checked = false;
    }
    
  } else {
    document.getElementById('addressOfDelivery').innerHTML = document.getElementById('consigneeInput').value;

  }
}
const setConsigner = () => {
  if (document.getElementById('setConsignerAdd').checked) 
  {
    try {
        // fetch consignee
        let consigner = JSON.parse(document.getElementById('consignerInput').value);
        if(consigner) {
            document.getElementById('addressOfSource').value = `${consigner.address}, ${consigner.city}, ${consigner.state}`;
        } else {
            const options = {
                type: 'error',
                buttons: ['Ok'],
                defaultId: 0,
                title: 'Consigner',
                message: '',
                detail: "It seems Consigner hasn't been selected. If this is a mistake please contact developer",
            };
            
            dialog.showMessageBox(null, options, (response, checkboxChecked) => {
                console.log(response);
                console.log(checkboxChecked);
            });
            document.getElementById('setConsignerAdd').checked = false;
        }
    } catch(e) {
        console.log(e);
        const options = {
            type: 'error',
            buttons: ['Ok'],
            defaultId: 0,
            title: 'Consignee',
            message: 'Select Consigner First',
            detail: "It seems Consigner hasn't been selected. If this is a mistake please contact developer",
        };
        
        dialog.showMessageBox(null, options, (response, checkboxChecked) => {
            console.log(response);
            console.log(checkboxChecked);
        });
        document.getElementById('setConsignerAdd').checked = false;
    }
    
  } else {
    document.getElementById('addressOfDelivery').innerHTML = document.getElementById('consigneeInput').value;

  }
}

const calculateFreightValueFromProduct = () => {
    let productInput = document.getElementById('productInput');
    let freightInput = document.getElementById('freightTaxable');
    let productsArray = JSON.parse(productInput.value);
    console.log(JSON.parse(productInput.value));
    let freightAmt = parseFloat(0);
    let totalWeight = parseInt(0);
    let totalBags = parseInt(0);
    let weightUnit = "";
    let packetUnit = "";
    productsArray.map(product => {
        freightAmt += parseFloat(product.freight);
        totalWeight += parseInt(product.weight);
        totalBags += parseInt(product.packets);
        weightUnit = product.unit;
        packetUnit = product.packetUnit;
    });
    console.log('Amount is ',freightAmt, totalBags, totalWeight, weightUnit, packetUnit);
    freightInput.value = freightAmt;
    freightInput.dispatchEvent(new Event('keyup'));
    document.getElementById('totalWeight').value = totalWeight.toString() + weightUnit;
    document.getElementById('totalBags').value = totalBags.toString() + packetUnit;
    document.getElementById('totalFreight').value = Number(freightAmt).toFixed(2);

}


// * Element wise calculation part
const bindValue = (value, id) => {
    console.log('new value will be ',Number(value).toFixed(2));
    document.getElementById(id).value = Number(value).toFixed(2);
    document.getElementById('freightTaxable').value = Number(document.getElementById('freightTaxable').value).toFixed(2);

}

const calculateFreightCharges = () => {
    console.log('freight calculation invoked');
    let freightTaxable = document.getElementById('freightTaxable').value;
    let freightGst = document.getElementById('freightGst').value;
    
    let freightTotalAmount = calculateCharges(freightTaxable, freightGst); 
    console.log('freight total amount is ', freightTotalAmount);
    document.getElementById('freightTotal').value = freightTotalAmount ? freightTotalAmount.toFixed(2) : '0.00';
    calculateTotalAmount();
}
// const calculateLabourCharges = () => {
//     console.log('Labour calculation invoked');
//     let labourTaxable = document.getElementById('labourTaxable').value;
//     let labourGst = document.getElementById('labourGst').value;
    
//     let labourTotalAmount = calculateCharges(labourTaxable, labourGst);
//     console.log('labour total amount is ', labourTotalAmount);
//     document.getElementById('labourTotal').value = labourTotalAmount ? labourTotalAmount.toFixed(2) : '0.00';
//     calculateTotalAmount();
// }
// const calculateLoadingCharges = () => {
//     console.log('loading calculation invoked');
//     let loadingTaxable = document.getElementById('loadingTaxable').value;
//     let loadingGst = document.getElementById('loadingGst').value;
    
//     let loadingTotalAmount = calculateCharges(loadingTaxable, loadingGst);
//     console.log('loading total amount is ', loadingTotalAmount);
//     document.getElementById('loadingTotal').value = loadingTotalAmount ? loadingTotalAmount.toFixed(2) : '0.00';
//     calculateTotalAmount();
// }
// const calculateUnloadingCharges = () => {
//     console.log('unloading calculation invoked');
//     let UnloadingTaxable = document.getElementById('UnloadingTaxable').value;
//     let UnloadingGst = document.getElementById('UnloadingGst').value;
    
//     let UnloadingTotalAmount = calculateCharges(UnloadingTaxable, UnloadingGst);
//     console.log('Unloading total amount is ', UnloadingTotalAmount);
//     document.getElementById('UnloadingTotal').value = UnloadingTotalAmount ? UnloadingTotalAmount.toFixed(2) : '0.00';
//     calculateTotalAmount();
// }
// const calculatePackagingCharges = () => {
//     console.log('Packaging calculation invoked');
//     let PackagingTaxable = document.getElementById('PackagingTaxable').value;
//     let PackagingGst = document.getElementById('PackagingGst').value;
    
//     let PackagingTotalAmount = calculateCharges(PackagingTaxable, PackagingGst);
//     console.log('Packaging total amount is ', PackagingTotalAmount);
//     document.getElementById('PackagingTotal').value = PackagingTotalAmount ? PackagingTotalAmount.toFixed(2) : '0.00';
//     calculateTotalAmount();
// }
// const calculateUnpackagingCharges = () => {
//     console.log('Unpackaging calculation invoked');
//     let UnpackagingTaxable = document.getElementById('UnpackagingTaxable').value;
//     let UnpackagingGst = document.getElementById('UnpackagingGst').value;
    
//     let UnpackagingTotalAmount = calculateCharges(UnpackagingTaxable, UnpackagingGst);
//     console.log('Unpackaging total amount is ', UnpackagingTotalAmount);
//     document.getElementById('UnpackagingTotal').value = UnpackagingTotalAmount ? UnpackagingTotalAmount.toFixed(2) : '0.00';
//     calculateTotalAmount();
// }
// const calculateOtherCharges = () => {
//     console.log('Other calculation invoked');
//     let OtherTaxable = document.getElementById('OtherTaxable').value;
//     let OtherGst = document.getElementById('OtherGst').value;
    
//     let OtherTotalAmount = calculateCharges(OtherTaxable, OtherGst);
//     console.log('Other total amount is ', OtherTotalAmount);
//     document.getElementById('OtherTotal').value = OtherTotalAmount ? OtherTotalAmount.toFixed(2) : '0.00';
//     calculateTotalAmount();
// }

const calculateTotalAmount = () => {
    console.log('total amount work started');
    let freightTotal = document.getElementById('freightTotal').value;
    // let labourTotal = document.getElementById('labourTotal').value;
    // let loadingTotal = document.getElementById('loadingTotal').value;
    // let UnloadingTotal = document.getElementById('UnloadingTotal').value;
    // let PackagingTotal = document.getElementById('PackagingTotal').value;
    // let UnpackagingTotal = document.getElementById('UnpackagingTotal').value;
    // let OtherTotal = document.getElementById('OtherTotal').value;
    // let dharmakantaAmt = document.getElementById('dharmakantaAmt').value;

    // * advance
    let advanceAmt = document.getElementById('advanceAmt').value;

    // * get result and display in total amount and payable amount
    let calculatedOp = calculateTotalAndPayableAmount(freightTotal, advanceAmt)
    console.log('ca',calculatedOp);
    document.getElementById('totalAmt').value = calculatedOp.totalAmt;
    document.getElementById('payableAmt').value = calculatedOp.payableAmt;
}

const download = (id) => {
    ipcRenderer.send('download', id);
}
 
// setup company db
document.addEventListener('DOMContentLoaded', async () => {
    inputProducts = [];
    try {
        // get company data from the beginning
        let { count } = await getNextReceiptCount();
        console.log('receipt count is ', count);
        document.getElementById('lrDate').innerHTML = dateFormatter();
        document.getElementById('date').value = dateFormatter();
        document.getElementById('lrPrefix').innerHTML = "SB";
        document.getElementById('prefix').value = "SB";
        let str = count.toString().padStart(3, "0")
        document.getElementById('lrNumber').innerHTML = str;
        document.getElementById('receiptNo').value = str;
    } catch(e) {
        console.log(e);
        console.log('failed to fetch company details');
    }

    ipcRenderer.on('consignerDetails', (evt, msg) => {
        console.log('consignerDetails is',msg);
        document.getElementById('consignerInput').value = JSON.stringify(msg);
        document.getElementById('consignerDetails').innerHTML = msg.consignerName;
    });
    ipcRenderer.on('pdfDownload', (evt, msg) => {
        console.log('pdf download is',msg);
        const notyf = new Notyf();
        if(msg == 'success') {
            notyf.success('Successfully Downloaded');
        } else {
            notyf.error('Failed To Download');
        }
    });
    ipcRenderer.on('oldConsignerDetails', async (evt, msg) => {
        console.log('old consignerDetails is',msg);
        let consignerData = await getConsginerById(msg.id);
        console.log('consigner data ', consignerData);
        if(consignerData[0]) {
            document.getElementById('consignerInput').value = JSON.stringify(consignerData[0]);
            document.getElementById('consignerDetails').innerHTML = consignerData[0].consignerName;
        } else {
            document.getElementById('consignerDetails').innerHTML = 'No Data Exist';
        }
    });
    ipcRenderer.on('consigneeDetails', (evt, msg) => {
        console.log('consigneeDetails is',msg);
        document.getElementById('consigneeInput').value = JSON.stringify(msg);
        document.getElementById('consigneeDetails').innerHTML = msg.consigneeName;
    });
    ipcRenderer.on('oldConsigneeDetails', async (evt, msg) => {
        console.log('old consigneeDetails is',msg);
        let consigneeData = await getConsgineeById(msg.id);
        console.log('consignee data ', consigneeData);
        if(consigneeData[0]) {
            document.getElementById('consigneeInput').value = JSON.stringify(consigneeData[0]);
            document.getElementById('consigneeDetails').innerHTML = consigneeData[0].consigneeName;
        } else {
            document.getElementById('consigneeDetails').innerHTML = 'No Data Exist';
        }
    });
    ipcRenderer.on('productDetails', (evt, products) => {
        console.log('productDetails is',products);
        inputProducts.push(products);
        console.log('input product is ', typeof inputProducts);
        document.getElementById('productInput').value = JSON.stringify(inputProducts);
        calculateFreightValueFromProduct();
        document.getElementById('productDetails').innerHTML += `<p id="product${products.id}">${products.productName} <br> ${products.weight} ${products.unit.toUpperCase()} <span class='text-danger' style='margin-left: 3rem; cursor: pointer;'><i onclick=deleteItem('${products.id}') class="fas fa-trash-alt"></i></span></p>`;
    });
    
    ipcRenderer.on('oldProductDetails', async (evt, msg) => {
        console.log('old productDetails is',msg);
        let productData = await getProductById(msg);
        console.log('product data ', productData);
        if(productData[0]) {
            console.log(inputProducts);
            inputProducts.push(productData[0]);
            let productInput = document.getElementById('productInput');
            productInput.value = JSON.stringify(inputProducts);
            calculateFreightValueFromProduct()
            document.getElementById('productDetails').innerHTML += `<p id="product${productData[0].id}">${productData[0].productName} <br> ${productData[0].weight} ${productData[0].unit.toUpperCase()} <span class='text-danger' style='margin-left: 3rem; cursor: pointer;'><i onclick=deleteItem('${productData[0].id}') class="fas fa-trash-alt"></i></span></p>`;
        } else {
            document.getElementById('productDetails').innerHTML = 'No Data Exist';
        }
    });

    ipcRenderer.on('transportDetails', (evt, transportData) => {
        console.log('transportDetails is',transportData);
        document.getElementById('transportInput').value = JSON.stringify(transportData);
        document.getElementById('transportDetails').innerHTML = `
            <div class="row">
                <div class="customWidth col-md-8">
                    <p>Vehicle Number</p>
                </div>
                <div class="col-md-4">
                    <p>${transportData.vehicleNumber.toUpperCase()}</p>
                </div>
            </div>
            <div class="row">
                <div class="customWidth col-md-8">
                    <p>E-Bill Number</p>
                </div>
                <div class="col-md-4">
                    <p>${transportData.ebillNumber}</p>
                </div>
            </div>
            <div class="row">
                <div class="customWidth col-md-8">
                    <p>Driver's Name</p>
                </div>
                <div class="col-md-4">
                    <p>${transportData.driverName}</p>
                </div>
            </div>
            <div class="row">
                <div class="customWidth col-md-8">
                    <p>Driving License Number</p>
                </div>
                <div class="col-md-4">
                    <p>${transportData.dlNumber}</p>
                </div>
            </div>
            <div class="row">
                <div class="customWidth col-md-4">
                    <p>Vehicle Owner Name</p>
                </div>
                <div class="col-md-4">
                    <p>${transportData.vehicleOwnerName}</p>
                </div>
            </div>
            <div class="row">
                <div class="customWidth col-md-8">
                    <p>Address</p>
                </div>
                <div class="col-md-4">
                    <p>${transportData.vehicleOwnerAddress}</p>
                </div>
            </div>
        `;
    });

    // * form submit
    let addReceiptForm = document.getElementById('addReceiptForm');
    addReceiptForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        let formData = new FormData(e.target);
        let receiptDetails = {};
        for (var key of formData.keys()) {
            receiptDetails[key] = formData.get(key);
        }
        if(receiptDetails.id == '') {
            receiptDetails.id = new Date().getTime().toString();
        }
        console.log('receipt Details ',receiptDetails);
        try {
            let allReceipts = await getAllReceipts();
            console.log('all Receipts', allReceipts);
            receipts = allReceipts;
            
            console.log('receipt db exists');

        } catch(e) {
            console.log('create receipt db');
            receipts = [];
        }
        receipts.push(receiptDetails)
        console.log('after pushing ', receipts);
        try {
            let addReceiptResponse = await addReceipt(receipts);
            console.log('resposne is ', addReceiptResponse);
            // * TODO - disable button and display download and print option
            let addBtn = document.getElementById('addReceiptBtn');
            let printBtn = document.getElementById('printBtn');
            let downloadBtn = document.getElementById('downloadBtn');
            const notyf = new Notyf();
            if(addReceiptResponse.errCode == 2000) {
                notyf.success('New Receipt Created Successfully.');
                addBtn.setAttribute('disabled', true);
                addBtn.style.display = 'none';
                printBtn.removeAttribute('disabled');
                downloadBtn.removeAttribute('disabled');
                // * TODO- PDF Generate & Download
                downloadBtn.setAttribute('onclick', `download(${addReceiptResponse.receipt.id})`);
                // ! TODO- Print Feature
            } else {
                notyf.error('Failed To Create Receipt. Contact Developer');
                addBtn.removeAttribute('disabled');
                printBtn.setAttribute('disabled', true);
                printBtn.style.display = 'none';
                downloadBtn.setAttribute('disabled', true);
                downloadBtn.style.display = 'none';
            }
        } catch(e) {
            console.log(e);
            document.getElementById('error').innerHTML = `<p class='alert alert-danger'>${e.message ? e.message : "Sorry! Something went wrong"}</p>`
        }
        // ipcRenderer.send('receiptDetails', transportDetails);
    });
    
})
