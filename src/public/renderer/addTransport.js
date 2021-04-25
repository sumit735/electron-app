const remote = require('@electron/remote');


document.addEventListener('DOMContentLoaded', async () => {

    let addTransportForm = document.getElementById('addTransportForm');
    addTransportForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        let formData = new FormData(e.target);
        let transportDetails = {};
        for (var key of formData.keys()) {
            transportDetails[key] = formData.get(key);
        }
        let window = remote.getCurrentWindow();
        ipcRenderer.send('transportDetails', transportDetails);
        window.close();
    });

    
});
