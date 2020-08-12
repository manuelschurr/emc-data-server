import Joi from '@hapi/joi';
import { TIMESTAMP_REG_EX } from '../../helpers/validator';

export default {
   ambulanceId: Joi.object().keys({
      ambulanceId: Joi.string().required(),
   }),
   create: Joi.object().keys({
      ambulanceId: Joi.number().required(),
      patientId: Joi.number().required(),
      identifier: Joi.string().required()
   }),
   createGnss: Joi.object().keys({
      ambulanceId: Joi.number().required(),
      timestamp: Joi.string().regex(TIMESTAMP_REG_EX).required(),
      longitude: Joi.number().required(),
      latitude: Joi.number().required()
   })
};
