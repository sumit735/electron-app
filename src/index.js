const { app, BrowserWindow } = require('electron');
const path = require('path');
require('@electron/remote/main').initialize();

const ipcMain = require('electron').ipcMain;


// listen from render process
ipcMain.on('renderer', (evt, message) => {
  console.log('event message from renderer is ', message);
  // window related stuff
  if(message == 'createNewWindow') {
    addReceiptWindow = new BrowserWindow({
      width: 1366,
      height: 768,
      minHeight: 711,
      minWidth: 608,
      webPreferences: {
        nodeIntegration: true,
        nodeIntegrationInSubFrames: true,
        enableRemoteModule: true,
        nodeIntegrationInWorker: true,
        contextIsolation: false,
        sandbox: false
      }
    });
  
    // and load the index.html of the app.
    addReceiptWindow.loadFile(path.join(__dirname, '/public/addReceipt.html'));
  }
  if(message == 'addConsigner') {
    // this one is manage consigner. add one is below this
    viewConsigner = new BrowserWindow({
      width: 1200,
      height: 700,
      minHeight: 600,
      minWidth: 1100,
      webPreferences: {
        nodeIntegration: true,
        nodeIntegrationInSubFrames: true,
        enableRemoteModule: true,
        nodeIntegrationInWorker: true,
        contextIsolation: false,
        sandbox: false
      }
    });
  
    // and load the index.html of the app.
    viewConsigner.loadFile(path.join(__dirname, '/public/addConsigner.html'));
  }
  if(message == 'addNewConsigner') {
    addNewConsigner = new BrowserWindow({
      width: 500,
      height: 700,
      minHeight: 500,
      minWidth: 700,
      webPreferences: {
        nodeIntegration: true,
        nodeIntegrationInSubFrames: true,
        enableRemoteModule: true,
        nodeIntegrationInWorker: true,
        contextIsolation: false,
        sandbox: false
      }
    });
  
    // and load the index.html of the app.
    addNewConsigner.loadFile(path.join(__dirname, '/public/addNewConsigner.html'));
  }
  if(message == 'viewConsignee') {
    // this one is manage consignee. add one is below this
    viewconsignee = new BrowserWindow({
      width: 1200,
      height: 700,
      minHeight: 600,
      minWidth: 1100,
      webPreferences: {
        nodeIntegration: true,
        nodeIntegrationInSubFrames: true,
        enableRemoteModule: true,
        nodeIntegrationInWorker: true,
        contextIsolation: false,
        sandbox: false
      }
    });
  
    // and load the index.html of the app.
    viewconsignee.loadFile(path.join(__dirname, '/public/viewConsignee.html'));
  }
  if(message == 'addNewconsignee') {
    addNewconsignee = new BrowserWindow({
      width: 500,
      height: 700,
      minHeight: 500,
      minWidth: 700,
      webPreferences: {
        nodeIntegration: true,
        nodeIntegrationInSubFrames: true,
        enableRemoteModule: true,
        nodeIntegrationInWorker: true,
        contextIsolation: false,
        sandbox: false
      }
    });
  
    // and load the index.html of the app.
    addNewconsignee.loadFile(path.join(__dirname, '/public/addNewconsignee.html'));
  }
  if(message == 'editCompany') {
    const editCompanyWindow = new BrowserWindow({
      width: 500,
      height: 700,
      minHeight: 500,
      minWidth: 700,
      webPreferences: {
        nodeIntegration: true,
        nodeIntegrationInSubFrames: true,
        enableRemoteModule: true,
        nodeIntegrationInWorker: true,
        contextIsolation: false,
        sandbox: false
      }
    });
  
    // and load the index.html of the app.
    editCompanyWindow.loadFile(path.join(__dirname, '/public/editCompany.html'));
  }
  if(message == 'addTransport') {
    const addWindow = new BrowserWindow({
      width: 500,
      height: 700,
      minHeight: 500,
      minWidth: 700,
      webPreferences: {
        nodeIntegration: true,
        nodeIntegrationInSubFrames: true,
        enableRemoteModule: true,
        nodeIntegrationInWorker: true,
        contextIsolation: false,
        sandbox: false
      }
    });
  
    // and load the index.html of the app.
    addWindow.loadFile(path.join(__dirname, '/public/addTransport.html'));
  }
  if(message == 'viewProduct') {
    viewProducts = new BrowserWindow({
      width: 1280,
      height: 720,
      minHeight: 700,
      minWidth: 1200,
      webPreferences: {
        nodeIntegration: true,
        nodeIntegrationInSubFrames: true,
        enableRemoteModule: true,
        nodeIntegrationInWorker: true,
        contextIsolation: false,
        sandbox: false
      }
    });
  
    // and load the index.html of the app.
    viewProducts.loadFile(path.join(__dirname, '/public/viewProduct.html'));
  }
  if(message == 'addNewProduct') {
    addNewProduct = new BrowserWindow({
      width: 500,
      height: 700,
      minHeight: 500,
      minWidth: 700,
      webPreferences: {
        nodeIntegration: true,
        nodeIntegrationInSubFrames: true,
        enableRemoteModule: true,
        nodeIntegrationInWorker: true,
        contextIsolation: false,
        sandbox: false
      }
    });
  
    // and load the index.html of the app.
    addNewProduct.loadFile(path.join(__dirname, '/public/addNewProduct.html'));
  }

  if(message.type == 'selectConsigner') {
    viewConsigner.close();
    addReceiptWindow.webContents.send('oldConsignerDetails', message);
  }
  if(message.type == 'selectconsignee') {
    viewconsignee.close();
    addReceiptWindow.webContents.send('oldConsigneeDetails', message);
  }
  if(message.type == 'selectProduct') {
    viewProducts.close();
    addReceiptWindow.webContents.send('oldProductDetails', message);
  }

});

// ====================================
// Send Stuff to add receipt page
// ====================================

ipcMain.on('companyDetails', (event, payload) => {
  addReceiptWindow.webContents.send('companyDetails', payload);
});
ipcMain.on('consignerDetails', (event, consignerPayload) => {
  viewConsigner.close();
  addReceiptWindow.webContents.send('consignerDetails', consignerPayload);
});
ipcMain.on('consigneeDetails', (event, consigneePayload) => {
  viewconsignee.close();
  addReceiptWindow.webContents.send('consigneeDetails', consigneePayload);
});
ipcMain.on('productDetails', (event, productPayload) => {
  viewProducts.close();
  addReceiptWindow.webContents.send('productDetails', productPayload);
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    minHeight: 711,
    minWidth: 608,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInSubFrames: true,
      nodeIntegrationInWorker: true,
      contextIsolation: false,
      sandbox: false
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, '/public/index.html'));

};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
