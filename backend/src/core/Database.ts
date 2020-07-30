import mongo from "mongodb";

var MongoClient = mongo.MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err: any, db) {
   if (err) {
      console.log(err);
   }
   var dbObj = db.db("emc-data");
   
   // Create different collections: patient, pulsoxy etc.
   dbObj.createCollection("patients", function (err, res) {
      if (err) {
         console.log(err);
      }
      console.log("Created collections 'patients' successfully.")
   });

   dbObj.createCollection("gnss", function (err, res) {
      if (err) {
         console.log(err);
      }
      console.log("Created collections 'gnss' successfully.")
   });

   dbObj.createCollection("pulsoxy", function (err, res) {
      if (err) {
         console.log(err);
      }
      console.log("Created collections 'pulsoxy' successfully.")
   });

   // db.close();
});


module Database {
   export function insertPatientData(pat: Patient) 
   {
      MongoClient.connect(url, function (err, db) {
         if (err) {
            console.log(err);
         }
         var dbObj = db.db("emc-data");
         dbObj.collection("patients").insertOne(pat, function (err, res) {
            if (err) {
               console.log(err);
            }
            console.log("Inserted 1 patient document successfully.");
            // db.close();
         });
      });
   }
   
   export function insertGnssData(gnss: Gnss) 
   {
      MongoClient.connect(url, function (err, db) {
         if (err) {
            console.log(err);
         }
         var dbObj = db.db("emc-data");
         dbObj.collection("gnss").insertOne(gnss, function (err, res) {
            if (err) {
               console.log(err);
            }
            console.log("Inserted 1 gnss document successfully.");
            // db.close();
         });
      });
   }

   export function insertMultiplePulsoxyData(pulsoxy: Pulsoxy[]) 
   {
      MongoClient.connect(url, function (err, db) {
         if (err) {
            console.log(err);
         }
         var dbObj = db.db("emc-data");
         dbObj.collection("pulsoxy").insertMany(pulsoxy, function (err, res) {
            if (err) {
               console.log(err);
            }
            console.log("Inserted ${res.insertedCount} pulsoxy document(s) successfully.");
            db.close();
         });
      });
   }
   
   export function insertPulsoxyData(pulsoxy: Pulsoxy) 
   {
      MongoClient.connect(url, function (err, db) {
         if (err) {
            console.log(err);
         }
         var dbObj = db.db("emc-data");
         dbObj.collection("pulsoxy").insertOne(pulsoxy, function (err, res) {
            if (err) {
               console.log(err);
            }
            console.log("Inserted 1 pulsoxy document successfully.");
            // db.close();
         });
      });
   }

   export function findPatientObject(lookUpRtwId: number) 
   {
      MongoClient.connect(url, function (err, db) {
         if (err) {
            console.log(err);
         }
         var dbObj = db.db("emc-data");
         var query = {rtwId: lookUpRtwId};
         dbObj.collection("patients").findOne(query, function (err, result) {
            if (err) {
               console.log(err);
            }
            console.log(result);
            // db.close();
         });
      });
   }
   
   export function findLatestGnssObject(lookUpRtwId: number)
   {
      MongoClient.connect(url, function (err, db) {
         if (err) {
            console.log(err);
         }
         var dbObj = db.db("emc-data");
         var query = {rtwId: lookUpRtwId};
         dbObj.collection("gnss").findOne(query, {sort: {$natural: -1}}, function (err, data) {
            if (err) {
               console.log(err);
            }
            console.log(data);
            // db.close();
         });
      });
   }

   export function findLatestPulsoxyObject(lookUpPatientId: number)
   {
      MongoClient.connect(url, function (err, db) {
         if (err) {
            console.log(err);
         }
         var dbObj = db.db("emc-data");
         var query = {patientId: lookUpPatientId};
         dbObj.collection("pulsoxy").findOne(query, {sort: {$natural: -1}}, function (err, data) {
            if (err) {
               console.log(err);
            }
            if (data == null) {
               console.log("No pulsoxy data found!");
            }
            else {
               // let pulsox = new Pulsoxy();
               // pulsox.patientId = data[0];
               // pulsox.timestamp = data[1];
               // pulsox.pulsrate = data [2];
               // pulsox.spo2 = data[3];
               // return pulsox;
               console.log(data);
            }
         });
      });
   }
}

export default Database
