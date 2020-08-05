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
            return new SuccessResponse("Successful", await Database.findLatestPulsoxyObject(1)).send(res);
        } catch (e) {
            next(e);
        }
    }),
)

router.post(
    "/",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    asyncHandler(async (req, res, next) => {
        Database.insertPulsoxyData(req.body)
        console.log(req.body);
        return new SuccessResponse("Successful", null).send(res)
    }),
)

export default router
