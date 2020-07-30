import express from "express";
import { SuccessResponse } from "../../core/ApiResponse";
import Database from "../../core/Database";
import asyncHandler from "../../helpers/asyncHandler";

const router = express.Router()

router.get(
    "/",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    asyncHandler(async (req, res, next) => {
        return new SuccessResponse("Successful", Database.findLatestPulsoxyObject(1)).send(res)
    }),
)

export default router
