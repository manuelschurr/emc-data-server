import Joi from '@hapi/joi';
import { IMG_NAME_REG_EX } from '../../helpers/validator';

// Validator that ensures only corrently formatted data is accepted by the central server backend
export default {
    getSingle: Joi.object().keys({
        imgId: Joi.string().regex(IMG_NAME_REG_EX).required(),
    })
};
