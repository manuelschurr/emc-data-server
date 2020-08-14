import Joi from '@hapi/joi';
import { IMG_NAME_REG_EX } from '../../helpers/validator';

export default {
    getSingle: Joi.object().keys({
        imgId: Joi.string().regex(IMG_NAME_REG_EX).required(),
    })
};
