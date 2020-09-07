import Joi from '@hapi/joi';
import { TIMESTAMP_REG_EX } from '../../helpers/validator';

export default {
   patientId: Joi.object().keys({
      patientId: Joi.string().required()
   }),
   ambulanceId: Joi.object().keys({
      ambulanceId: Joi.string().required(),
   }),
   pulsoxy: Joi.object().keys({
      patientId: Joi.number().required(),
      timestamp: Joi.string().regex(TIMESTAMP_REG_EX).required()
   }),
   createPatient: Joi.object().keys({
      patientId: Joi.number().required(),
      ambulanceId: Joi.number().required(),
      name: Joi.string().allow('').max(150),
      gender: Joi.string().allow('').max(1),
      age: Joi.number(),
      preExistingIllness: Joi.string().allow(''),
      miscellaneous: Joi.string().allow(''),
      AIsSelected: Joi.boolean(),
      AText: Joi.string().allow(''),
      BIsSelected: Joi.boolean(),
      BText: Joi.string().allow(''),
      CIsSelected: Joi.boolean(),
      CText: Joi.string().allow(''),
      DIsSelected: Joi.boolean(),
      DText: Joi.string().allow(''),
      EIsSelected: Joi.boolean(),
      EText: Joi.string().allow('')
   }),
   createPulsoxy: Joi.object().keys({
      patientId: Joi.number().required(),
      timestamp: Joi.date().required(),
      pulsrate: Joi.number().required(),
      spo2: Joi.number().required()
   }),
   updatePatient: Joi.object().keys({
      patientId: Joi.number(),
      ambulanceId: Joi.number().required(),
      name: Joi.string().allow('').required().max(150),
      gender: Joi.string().allow('').required().max(1),
      age: Joi.number().required(),
      preExistingIllness: Joi.string().allow('').required(),
      miscellaneous: Joi.string().allow('').required(),
      AIsSelected: Joi.boolean().required(),
      AText: Joi.string().allow('').required(),
      BIsSelected: Joi.boolean().required(),
      BText: Joi.string().allow('').required(),
      CIsSelected: Joi.boolean().required(),
      CText: Joi.string().allow('').required(),
      DIsSelected: Joi.boolean().required(),
      DText: Joi.string().allow('').required(),
      EIsSelected: Joi.boolean().required(),
      EText: Joi.string().allow('').required()
   }),
};
