import mongoose from 'mongoose';
import { db } from '../config';
import Logger from '../core/Logger';

const dbURI = `mongodb://${db.host}:${db.port}/${
  db.name
}`;

const options = {
   useNewUrlParser: true,
   useCreateIndex: true,
   useUnifiedTopology: true,
   useFindAndModify: false,
   autoIndex: true,
   poolSize: 10, // maintain up to 10 socket connections
   bufferMaxEntries: 0, // if not connected, return errors immediately , rather than waiting for reconnect
   connectTimeoutMS: 10000, // give up initial connection after 10 seconds
   socketTimeoutMS: 45000 // close sockets after 45 seconds of inactivity
};

Logger.debug(dbURI);

// create the database connection
mongoose
   .connect(dbURI, options)
   .then(() => {
      Logger.info('Mongoose connection done');
   })
   .catch((e) => {
      Logger.info('Mongoose connection error');
      Logger.error(e);
   });

// connection events
// when successfully connected
mongoose.connection.on('connected', () => {
   Logger.info('Mongoose default connection open to ' + dbURI);
});

// if the connection throws an error
mongoose.connection.on('error', (err) => {
   Logger.error('Mongoose default connection error: ' + err);
});

// when the connection is disconnected
mongoose.connection.on('disconnected', () => {
   Logger.info('Mongoose default connection disconnected');
});

// if the Node process ends, close the mongoose connection
process.on('SIGINT', () => {
   mongoose.connection.close(() => {
      Logger.info('Mongoose default connection disconnected through app termination');
      process.exit(0);
   })
});