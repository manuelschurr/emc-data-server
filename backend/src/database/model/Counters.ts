import { Document, model, Schema } from 'mongoose';

// This collection will be used to simulate auto-increment functionality
export const DOCUMENT_NAME = 'Counters';
export const COLLECTION_NAME = 'counters';


export default interface Counters extends Document {
   _id: string;
   sequence_value: number;
}

const schema = new Schema(
   {
      _id: {
         type: Schema.Types.String,
         required: true
      },
      sequence_value: {
         type: Schema.Types.Number,
         required: true
      }
   },
   {
      versionKey: false
   }
);

export const CountersModel = model<Counters>(DOCUMENT_NAME, schema, COLLECTION_NAME);
