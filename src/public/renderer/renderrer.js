const ipcRenderer = require('electron').ipcRenderer;

function createBrowserWindow() {
  ipcRenderer.send('renderer', 'createNewWindow');
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
