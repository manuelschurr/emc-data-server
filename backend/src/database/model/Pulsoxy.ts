import { Document, model, Schema } from 'mongoose';

export const DOCUMENT_NAME = 'Pulsoxy';
export const COLLECTION_NAME = 'pulsoxy';


export default interface Pulsoxy extends Document {
   patientId: number;
   timestamp: Date;
   pulsrate: number;
   spo2: number;
}

const schema = new Schema(
   {
      patientId: {
         type: Schema.Types.Number,
         required: true
      },
      timestamp: {
         type: Schema.Types.Date,
         required: true
      },
      pulsrate: {
         type: Schema.Types.Number,
         required: true
      },
      spo2: {
         type: Schema.Types.Number,
         required: true
      }
   },
   {
      versionKey: false
   }
);

export const PulsoxyModel = model<Pulsoxy>(DOCUMENT_NAME, schema, COLLECTION_NAME);
