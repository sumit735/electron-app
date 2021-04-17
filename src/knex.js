let level = require('level');
const path = require('path');
const dbPath = path.join(__dirname, 'db');
var db = level(dbPath, {valueEncoding: 'json'});

// db open close func
const dbOpen = () => {
  db.open(() => {
    console.log('opened');
  });
}
const dbClose = () => {
  db.close(() => {
    console.log('closed');
  });
  
}

// company
const getCompanyDetails = () => {
  return new Promise((resolve, reject) => {
    db.get('company', function (err, value) {
      if (err) {
        if(err.notFound) {
          dbClose()
          reject(
            {message: 'No Data Available. Add one to Continue', errType: 'nodb', errCode: 0001, error: err}
          );
        } else {
          dbClose();
          return reject({message: 'Sorry! Something went wrong', errType: 'dbRelated', errCode: 0002, error: err});
        }
      } 
    
      dbClose();
      resolve(value);
    });
  });
}




const editCompanyDetails = (company) => {
  // edit companyDetails
  console.log(company);
  return new Promise((resolve, reject) => {
    dbOpen();
    db.put('company', company, function (err) {
      if (err) {
        dbClose();
        reject(
          {message: 'Failed To Perform Operation. Please Contact Developer', errType: 'insertionError', errCode: 5000, error: err}
        ); 
      }
      dbClose();
      resolve({message: 'Updated Successfully', errType: '', errCode: 2000, company});
    });
  });
}

// consigner

const getAllConsigners = () => {
  // fetch all consigners
  return new Promise((resolve, reject) => {
    dbOpen();
    db.get('consigners', function (err, value) {
      if (err) {
        dbClose();
        if(err.notFound) {
          reject(
            {message: 'No Data Available. Add one to Continue', errType: 'nodb', errCode: 0001, error: err}
          );
        } else {
          return reject({message: 'Sorry! Something went wrong', errType: 'dbRelated', errCode: 0002, error: err});
        }
      } 
      
      dbClose();
      resolve(value);
    });
  });
}

const getConsginerById = (id) => {
  // get single consigner
  return new Promise((resolve, reject) => {
    dbOpen();
    db.get('consigners', function (err, value) {
      if (err) {
        dbClose();
        if(err.notFound) {
          reject(
            {message: 'No Data Available. Add one to Continue', errType: 'nodb', errCode: 0001, error: err}
          );
        } else {
          return reject({message: 'Sorry! Something went wrong', errType: 'dbRelated', errCode: 0002, error: err});
        }
      } 
      
      dbClose();
      let consignerDetails = value.filter((consigner) => {
        // console.log(consigner);
        if(consigner.id === id.toString()) {
          return consigner;
        }
      });
      if(consignerDetails) {
        resolve(consignerDetails);
      } else {
        reject({message: 'Sorry! No Data Exist', errType: 'noData', errCode: 4040})
      }
    });
  });
}

const addConsignerDb = (consigner) => {
  // add a consigner
  console.log(consigner);
  return new Promise((resolve, reject) => {
    dbOpen();
    db.put('consigners', consigner, function (err) {
      if (err) {
        dbClose();
        reject(
          {message: 'Failed To Perform Operation. Please Contact Developer', errType: 'insertionError', errCode: 5000, error: err}
        ); 
      }
      dbClose();
      resolve({message: 'Added Successfully', errType: '', errCode: 2000, consigner});
    });
  });
}

const editConsigner = (id, consigner) => {
  // edit consigner
}

const deleteConsigner =  (id) => {
  // delete consigner
  console.log('delete id is ', id);
  return new Promise( (resolve, reject) => {
    dbOpen();
    db.get('consigners', function (err, value) {
      if (err) {
        dbClose();
        reject(
          {message: 'Failed To Perform Operation. Please Contact Developer', errType: 'insertionError', errCode: 5000, error: err}
        ); 
      }
      console.log('filter', id);
      let updatedDb = value.filter((consigner) => {
        return consigner.id !== id.toString();
      });
      console.log('updated db is ', updatedDb);
      db.put('consigners', updatedDb, function (err) {
        if (err) {
          dbClose();
          reject(
            {message: 'Failed To Perform Operation. Please Contact Developer', errType: 'insertionError', errCode: 5000, error: err}
          ); 
        }
        dbClose();
        resolve({message: 'Deleted Successfully', errType: '', errCode: 2000, updatedDb});
      });
    });
  });

}

// =================================
// consignee========================
// =================================

const getAllconsignees = () => {
  // fetch all consignees
  return new Promise((resolve, reject) => {
    dbOpen();
    db.get('consignees', function (err, value) {
      if (err) {
        dbClose();
        if(err.notFound) {
          reject(
            {message: 'No Data Available. Add one to Continue', errType: 'nodb', errCode: 0001, error: err}
          );
        } else {
          return reject({message: 'Sorry! Something went wrong', errType: 'dbRelated', errCode: 0002, error: err});
        }
      } 
      
      dbClose();
      resolve(value);
    });
  });
}

const getConsgineeById = (id) => {
  // get single consignee
  return new Promise((resolve, reject) => {
    dbOpen();
    db.get('consignees', function (err, value) {
      if (err) {
        dbClose();
        if(err.notFound) {
          reject(
            {message: 'No Data Available. Add one to Continue', errType: 'nodb', errCode: 0001, error: err}
          );
        } else {
          return reject({message: 'Sorry! Something went wrong', errType: 'dbRelated', errCode: 0002, error: err});
        }
      } 
      
      dbClose();
      let consigneeDetails = value.filter((consignee) => {
        console.log(consignee);
        // console.log(consignee);
        if(consignee.id === id.toString()) {
          return consignee;
        }
      });
      if(consigneeDetails) {
        resolve(consigneeDetails);
      } else {
        reject({message: 'Sorry! No Data Exist', errType: 'noData', errCode: 4040})
      }
    });
  });
}

const addConsigneeDb = (consignee) => {
  // add a consignee
  console.log(consignee);
  return new Promise((resolve, reject) => {
    dbOpen();
    db.put('consignees', consignee, function (err) {
      if (err) {
        dbClose();
        reject(
          {message: 'Failed To Perform Operation. Please Contact Developer', errType: 'insertionError', errCode: 5000, error: err}
        ); 
      }
      dbClose();
      resolve({message: 'Added Successfully', errType: '', errCode: 2000, consignee});
    });
  });
}


const editconsignee = (id, consignee) => {
  // edit consignee
}

const deleteconsignee = (id) => {
  // delete consignee
}



module.exports = {
  getCompanyDetails,
  editCompanyDetails,
  getAllConsigners,
  getConsginerById,
  addConsignerDb,
  editConsigner,
  deleteConsigner,
  getAllconsignees,
  getConsgineeById,
  addConsigneeDb,
  editconsignee,
  deleteconsignee
}

