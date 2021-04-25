const { getReceiptById }  = require('../knex');

document.addEventListener('DOMContentLoaded', async () => {
    ipcRenderer.on('pdfInit', async (evt, receiptId) => {
        console.log('receipt Id is ', receiptId);
        try {
            let result = await getReceiptById(receiptId);
            console.log(result);
            let { 
                addressOfDelivery, addressOfSoruce, advanceAmt, consigneeInput, consignerInput, payableAmt, freightTotal, productInput, 
                totalBags, totalFreight, totalWeight, transportInput, valueOfGoods, receiptNo, date, prefix
            } = result[0];
            consigneeInput = JSON.parse(consigneeInput);
            consignerInput = JSON.parse(consignerInput);
            transportInput = JSON.parse(transportInput);
            document.getElementById('receiptNumber').innerHTML = prefix && receiptNo ? prefix+receiptNo.toString() : '';
            document.getElementById('date').innerHTML = date ? date : '';
            document.getElementById('lorryNumber').innerHTML = transportInput ? transportInput.vehicleNumber.toUpperCase() : '';
            document.getElementById('source').innerHTML = addressOfSoruce ? addressOfSoruce : ''; //sorry a typo here
            document.getElementById('destination').innerHTML = addressOfDelivery ? addressOfDelivery : '';
            document.getElementById('consigner').innerHTML = consignerInput ? consignerInput.consignerName : '';
            document.getElementById('consignerAddress').innerHTML = consignerInput ? consignerInput.address + ', ' + consignerInput.city : '';
            document.getElementById('consignerState').innerHTML = consignerInput ? consignerInput.state : '';
            document.getElementById('consignerGst').innerHTML = consignerInput ? consignerInput.gstin : '';
            document.getElementById('consignee').innerHTML = consigneeInput ? consigneeInput.consigneeName : '';
            document.getElementById('consigneeAddress').innerHTML = consigneeInput ? consigneeInput.address + ', ' + consigneeInput.city : '';
            document.getElementById('consigneeState').innerHTML = consigneeInput ? consigneeInput.state : '';
            document.getElementById('consigneeGst').innerHTML = consigneeInput ? consigneeInput.gstin : '';
            document.getElementById('weightTotal').innerHTML = totalWeight ? totalWeight : '';
            document.getElementById('bagTotal').innerHTML = totalBags ? totalBags : '';
            document.getElementById('freightTotal').innerHTML = totalFreight ? totalFreight : '';
            document.getElementById('advance').innerHTML = advanceAmt ? advanceAmt  : '';
            document.getElementById('amountToBePaid').innerHTML = payableAmt ? payableAmt : '';
            document.getElementById('valueOfGoods').innerHTML = valueOfGoods ? valueOfGoods : '';
            document.getElementById('vehicleOwnerName').innerHTML = transportInput ? transportInput.vehicleOwnerName+', ' : '';
            document.getElementById('ownerAddress').innerHTML = transportInput ? transportInput.vehicleOwnerAddress : '';
            document.getElementById('addressOfDelivery').innerHTML = addressOfDelivery ? addressOfDelivery : '';
            document.getElementById('driverName').innerHTML = transportInput ? transportInput.driverName+',' : '';
            document.getElementById('dlNumber').innerHTML = transportInput ? transportInput.dlNumber : '';
            document.getElementById('eway').innerHTML = transportInput ? transportInput.ebillNumber : '';
            // product
            productInput = JSON.parse(productInput);
            let slno = 1;
            let rows = '';
            productInput.map(product => {
                console.log(product);
                let { productName, packets, packetUnit, unit, weight } = product;
                rows += `<tr>`;
                rows += "<td>"+ slno +"</td>";
                rows += "<td>"+ packets+' '+packetUnit  +"</td>";
                rows += "<td>"+ productName +"</td>";
                rows += "<td>"+ weight + ' '+ unit +"</td>";
                rows += "</tr>";
                slno++;
            });
            document.getElementById('productTable').innerHTML = rows;
        } catch(e) {
            console.log('exception', e);
        }
    })
})