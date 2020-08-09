import { Document, model, Schema } from 'mongoose';

export const DOCUMENT_NAME = 'Patient';
export const COLLECTION_NAME = 'patients';

export const enum Gender {
   M = 'M',
   F = 'F',
   D = 'D'
};

export default interface Patient extends Document {
   patientId: number;
   ambulanceId: number;
   name: string;
   gender: string;
   age: number;
   preExistingIllness: string;
   miscellaneous: string;
   AIsSelected: boolean;
   AText: string;
   BIsSelected: boolean;
   BText: string;
   CIsSelected: boolean;
   CText: string;
   DIsSelected: boolean;
   DText: string;
   EIsSelected: boolean;
   EText: string;
   createdAt: Date;
   updatedAt: Date;
}

const schema = new Schema(
   {
      patientId: {
         type: Schema.Types.Number,
         required: true
      },
      ambulanceId: {
         type: Schema.Types.Number,
         required: true
      },
      name: {
         type: Schema.Types.String,
         required: true,
         trim: true,
         maxlength: 150
      },
      gender: {
         type: Schema.Types.String,
         required: true,
         enum: [Gender.M, Gender.F, Gender.D]
      },
      age: {
         type: Schema.Types.Number,
         required: true
      },
      preExistingIllness: {
         type: Schema.Types.String,
         required: true
      },
      miscellaneous: {
         type: Schema.Types.String,
         required: true
      },
      AIsSelected: {
         type: Schema.Types.Boolean,
         required: true
      },
      AText: {
         type: Schema.Types.String,
         required: true
      },
      BIsSelected: {
         type: Schema.Types.Boolean,
         required: true
      },
      BText: {
         type: Schema.Types.String,
         required: true
      },
      CIsSelected: {
         type: Schema.Types.Boolean,
         required: true
      },
      CText: {
         type: Schema.Types.String,
         required: true
      },
      DIsSelected: {
         type: Schema.Types.Boolean,
         required: true
      },
      DText: {
         type: Schema.Types.String,
         required: true
      },
      EIsSelected: {
         type: Schema.Types.Boolean,
         required: true
      },
      EText: {
         type: Schema.Types.String,
         required: true
      },
      createdAt: {
         type: Schema.Types.Date,
         required: true
      },
      updatedAt: {
         type: Schema.Types.Date,
         required: true
      }
   },
   {
      versionKey: false
   }
);

export const PatientModel = model<Patient>(DOCUMENT_NAME, schema, COLLECTION_NAME);
