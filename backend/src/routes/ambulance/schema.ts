import Joi from '@hapi/joi';
import { TIMESTAMP_REG_EX } from '../../helpers/validator';

export default {
   ambulanceId: Joi.object().keys({
      ambulanceId: Joi.string().required(),
   }),
   gnss: Joi.object().keys({
      ambulanceId: Joi.string().required(),
      timestamp: Joi.string().regex(TIMESTAMP_REG_EX).required()
   }),
   createAmbulance: Joi.object().keys({
      ambulanceId: Joi.number().required(),
      patientId: Joi.number().required(),
      identifier: Joi.string().required()
   }),
   createGnss: Joi.object().keys({
      ambulanceId: Joi.number().required(),
      timestamp: Joi.date().required(),
      longitude: Joi.number().required(),
      latitude: Joi.number().required()
   }),
   updateAmbulance: Joi.object().keys({
      patientId: Joi.number().required(),
      identifier: Joi.string().required()
   }),
};
