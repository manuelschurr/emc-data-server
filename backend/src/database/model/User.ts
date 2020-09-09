import { Document, model, Schema } from 'mongoose';

export const DOCUMENT_NAME = 'User';
export const COLLECTION_NAME = 'user';


export default interface User extends Document {
   username: string;
   password: string;
}

const schema = new Schema(
   {
      username: {
         type: Schema.Types.String,
         required: true
      },
      password: {
         type: Schema.Types.String,
         required: true
      },
   },
   {
      versionKey: false
   }
);

export const UserModel = model<User>(DOCUMENT_NAME, schema, COLLECTION_NAME);