import Joi from "@hapi/joi"
import { NextFunction, Request, Response } from "express"
import { Types } from "mongoose"
import { BadRequestError } from "../core/ApiError"
import Logger from "../core/Logger"

// Regular expressions
// note to TIMESTAMP_REG_EX
// checking for different formats, some valid strings
// 2020-08-14T12:04:00+02:00 (locale format)
// 2020-08-14T12:04:00Z (UTC format)
// 2020-08-14T12:04:00.000+02:00 (locale format, milliseconds are optional)
// 2020-08-14T12:04:00.000Z (UTC format, milliseconds are optional)
// export const TIMESTAMP_REG_EX = new RegExp("^(0[1-9]|[1-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-[0-9]{4} (2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]$"); //DD-MM-YYYY HH:MM:SS
export const TIMESTAMP_REG_EX = new RegExp("^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])T(2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]?(.[0-9][0-9][0-9])?(Z|[+|-][0-5][0-9]:[0-5][0-9])$");
export const IMG_NAME_REG_EX = new RegExp("^([0-9]{1,9})-([0-9]{4})-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])_(2[0-3]|[01][0-9])-[0-5][0-9]-[0-5][0-9].(png|jpg)$") //YYYY-MM-DD_HH-MM-SS.(png|jpg)
export const AUDIO_NAME_REG_EX = new RegExp("^([0-9]{1,9})-([0-9]{4})-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])_(2[0-3]|[01][0-9])-[0-5][0-9]-[0-5][0-9].webm$") //YYYY-MM-DD_HH-MM-SS.webm


export enum ValidationSource {
    BODY = "body",
    HEADER = "headers",
    QUERY = "query",
    PARAM = "params",
}

export const JoiObjectId = () =>
    Joi.string().custom((value: string, helpers) => {
        if (!Types.ObjectId.isValid(value)) return helpers.error("any.invalid")
        return value
    }, "Object Id Validation")

export const JoiUrlEndpoint = () =>
    Joi.string().custom((value: string, helpers) => {
        if (value.includes("://")) return helpers.error("any.invalid")
        return value
    }, "Url Endpoint Validation")

export default (schema: Joi.ObjectSchema, source: ValidationSource = ValidationSource.BODY) => (
    req: Request,
    res: Response,
    next: NextFunction,
    // eslint-disable-next-line consistent-return
) => {
    try {
        const { error } = schema.validate(req[source])

        if (!error) return next()

        const { details } = error
        const message = details.map((i) => i.message.replace(/['"]+/g, "")).join(",")
        Logger.error(message)

        next(new BadRequestError(message))
    } catch (error) {
        next(error)
    }
}
