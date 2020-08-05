import express from "express";
import { SuccessResponse } from "../../core/ApiResponse";
import Database from "../../core/Database";
import asyncHandler from "../../helpers/asyncHandler";

const router = express.Router()

router.get(
    "/",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    asyncHandler(async (req, res, next) => {
        try {
            return new SuccessResponse("Successful", await Database.findLatestGnssObject(1)).send(res);
        } catch (e) {
            next(e);
        }
    })
)

router.post(
    "/gnss",
    asyncHandler(async (req, res, next) => {
        console.log(req);
        return new SuccessResponse("Successful", null).send(res);
    })
)

export default router