import { Document, model, Schema } from 'mongoose';

export const DOCUMENT_NAME = 'Ambulance';
export const COLLECTION_NAME = 'ambulance';


export default interface Ambulance extends Document {
   ambulanceId: number;
   patientId: number;
   identifier: string;
}

const schema = new Schema(
   {
      ambulanceId: {
         type: Schema.Types.Number,
         required: true
      },
      patientId: {
         type: Schema.Types.Number,
         required: true
      },
      identifier: {
         type: Schema.Types.String,
         required: true
      }
   },
   {
      versionKey: false
   }
);

export const AmbulanceModel = model<Ambulance>(DOCUMENT_NAME, schema, COLLECTION_NAME);
