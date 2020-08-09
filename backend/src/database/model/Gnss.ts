import { Document, model, Schema } from 'mongoose';

export const DOCUMENT_NAME = 'Gnss';
export const COLLECTION_NAME = 'gnss';


export default interface Gnss extends Document {
   ambulanceId: number;
   timestamp: string;
   latitude: number;
   longitude: number;
}

const schema = new Schema(
   {
      ambulanceId: {
         type: Schema.Types.Number,
         required: true
      },
      timestamp: {
         type: Schema.Types.String,
         required: true
      },
      latitude: {
         type: Schema.Types.Number,
         required: true
      },
      longitude: {
         type: Schema.Types.Number,
         required: true
      }
   },
   {
      versionKey: false
   }
);

export const GnssModel = model<Gnss>(DOCUMENT_NAME, schema, COLLECTION_NAME);
