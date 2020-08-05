import mongo from "mongodb";
import { Gnss } from "../models/Gnss";
import { Pulsoxy } from "../models/Pulsoxy";

var MongoClient = mongo.MongoClient;
var url = "mongodb://localhost:27017/";

const connection = MongoClient.connect(url, { useUnifiedTopology: true });

async function createCollections() {
   try {
      const client = await connection;
      var db = client.db("emc-data");
      // Create different collections: patient, pulsoxy etc.
      db.createCollection("patients", function (err, res) {
         if (err) {
            console.log(err);
         }
         console.log("+++ Created collection 'patients' successfully.")
      });

      db.createCollection("gnss", function (err, res) {
         if (err) {
            console.log(err);
         }
         console.log("+++ Created collection 'gnss' successfully.")
      });
   
      db.createCollection("pulsoxy", function (err, res) {
         if (err) {
            console.log(err);
         }
         console.log("+++ Created collection 'pulsoxy' successfully.")
      });
   } catch (e) {
      throw e;
   }
}

createCollections();


module Database {
   export function insertPatientData(pat: Patient) {
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
         });
      });
   }

   export function insertGnssData(gnss: Gnss) {
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
         });
      });
   }

   export function insertMultiplePulsoxyData(pulsoxy: Pulsoxy[]) {
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
         });
      });
   }

   export function insertPulsoxyData(pulsoxy: Pulsoxy) {
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
         });
      });
   }

   export async function findPatientObject(lookUpRtwId: number) {
      let result;
      try {
         const client = await connection;
         var collection = client.db("emc-data").collection("patients");
         result = await collection.findOne({ rtwId: lookUpRtwId }, { sort: { $natural: -1 }, projection: { _id: 0, rtwId: 0 } })
      } catch (e) {
         throw e;
      }
      return result;
   }

   export async function findLatestGnssObject(lookUpRtwId: number) {
      let result;
      try {
         const client = await connection;
         var collection = client.db("emc-data").collection("gnss");
         result = await collection.findOne({ rtwId: lookUpRtwId }, { sort: { $natural: -1 }, projection: { _id: 0, rtwId: 0 } })
      } catch (e) {
         throw e;
      }
      return result;
   }

   export async function findLatestPulsoxyObject(lookUpPatientId: number) {
      let result;
      try {
         const client = await connection;
         var collection = client.db("emc-data").collection("pulsoxy");
         result = await collection.findOne({ patientID: lookUpPatientId }, { sort: { $natural: -1 }, projection: { _id: 0, patientID: 0 } })
      } catch (e) {
         throw e;
      }
      return result;
   }
}

export default Database
