import Joi from '@hapi/joi';
import { AUDIO_NAME_REG_EX } from '../../helpers/validator';

export default {
    getSingle: Joi.object().keys({
        audioId: Joi.string().regex(AUDIO_NAME_REG_EX).required(),

    })
};
