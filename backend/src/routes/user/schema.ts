import Joi from '@hapi/joi';

export default {
    getUser: Joi.object().keys({
        username: Joi.string().required(),
        password: Joi.string().required(),
    })
};
