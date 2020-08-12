import Joi from '@hapi/joi';
import { TIMESTAMP_REG_EX } from '../../helpers/validator';

export default {
   patientId: Joi.object().keys({
      patientId: Joi.number().required(),
      timestamp: Joi.string().regex(TIMESTAMP_REG_EX).required()
   }),
   ambulanceId: Joi.object().keys({
      ambulanceId: Joi.number().required(),
   }),
   create: Joi.object().keys({
      patientId: Joi.number().required(),
      ambulanceId: Joi.number().required(),
      name: Joi.string().required().max(150),
      gender: Joi.string().required().max(1),
      age: Joi.number().required(),
      preExistingIllness: Joi.string().required(),
      miscellaneous: Joi.string().required(),
      AIsSelected: Joi.boolean().required(),
      AText: Joi.string().required(),
      BIsSelected: Joi.boolean().required(),
      BText: Joi.string().required(),
      CIsSelected: Joi.boolean().required(),
      CText: Joi.string().required(),
      DIsSelected: Joi.boolean().required(),
      DText: Joi.string().required(),
      EIsSelected: Joi.boolean().required(),
      EText: Joi.string().required(),
   }),
   createPulsoxy: Joi.object().keys({
      patientId: Joi.number().required(),
      timestamp: Joi.string().regex(TIMESTAMP_REG_EX).required(),
      pulsrate: Joi.number().required(),
      spo2: Joi.number().required()
   })
};