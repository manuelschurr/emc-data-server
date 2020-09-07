import Joi from "@hapi/joi"

export default {
    apiKeyId: Joi.object().keys({
        apiKeyId: Joi.number().required(),
    }),
    createApiKey: Joi.object().keys({
        apiKeyId: Joi.number().required(),
        value: Joi.string().required(),
        timestap: Joi.date().required(),
    }),
}
