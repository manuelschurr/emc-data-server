import express from "express"
import _ from "lodash"
import { NotFoundMsgResponse, SuccessResponse } from "../../core/ApiResponse"
import ApiKey from "../../database/model/ApiKey"
import ApiKeyRepo from "../../database/repository/ApiKeyRepo"
import asyncHandler from "../../helpers/asyncHandler"
import validator from "../../helpers/validator"
import schema from "./schema"

const router = express.Router()

router.get(
    "/findAll",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    asyncHandler(async (req, res, next) => {
        const apiKeys = await ApiKeyRepo.findAll()
        if (!apiKeys) {
            throw new NotFoundMsgResponse("ApiKey data could not be found.")
        }

        return new SuccessResponse("Successful", apiKeys).send(res)
    }),
)

router.post(
    "/create",
    validator(schema.createApiKey),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    asyncHandler(async (req, res, next) => {
        const { apiKey: createdApiKey } = await ApiKeyRepo.create({
            apiKeyId: req.body.apiKeyId,
            value: req.body.value,
        } as ApiKey)

        new SuccessResponse("ApiKey successfully created", {
            apiKey: _.pick(createdApiKey, ["apiKeyId", "value"]),
        }).send(res)
    }),
)

router.put(
    "/update/:apiKeyId",
    validator(schema.createApiKey),
    asyncHandler(async (req, res, next) => {
        const { apiKeyId } = req.params
        const apiKey = await ApiKeyRepo.findByApiKeyId(parseInt(apiKeyId))
        if (apiKey == null) {
            throw new NotFoundMsgResponse("ApiKey does not exist")
        }

        if (req.body.hasOwnProperty("value")) apiKey.value = req.body.value

        await ApiKeyRepo.update(apiKey)
        new SuccessResponse("API Key updated successfully", apiKey).send(res)
    }),
)

export default router
