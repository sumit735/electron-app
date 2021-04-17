const { getAllConsigners }  = require('./knex');

(async() => {
    try {
        let result = await getAllConsigners();
        console.log(result);
    } catch(err) {
        console.log('error is',err);
    }
    
})()
