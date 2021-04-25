const ipcRenderer = require('electron').ipcRenderer;

function createBrowserWindow() {
  ipcRenderer.send('renderer', 'createNewWindow');
}
function viewAllReceipts() {
  ipcRenderer.send('renderer', 'viewAllReceipts');
}
function addConsigner() {
  ipcRenderer.send('renderer', 'addConsigner');
}
function addConsignee() {
  ipcRenderer.send('renderer', 'viewConsignee');
}
function editCompany() {
  ipcRenderer.send('renderer', 'editCompany');
}
function addTransport() {
  ipcRenderer.send('renderer', 'addTransport');
}
function addProduct() {
  let productDetails = document.getElementById('productDetails');
  let oldClasses = productDetails.getAttribute('class') ? productDetails.getAttribute('class') : '';
  if(!oldClasses.includes('changed')) {
    console.log('class are ',productDetails.getAttribute('class'));
    productDetails.innerHTML = ''
    oldClasses += ' changed';
    productDetails.setAttribute('class', oldClasses);
  }
  
  ipcRenderer.send('renderer', 'viewProduct');
}
