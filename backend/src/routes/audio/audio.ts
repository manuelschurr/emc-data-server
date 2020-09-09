import express from "express"
import fs from "fs"
import multer from "multer"
import path from "path"
import { BadRequestError } from "../../core/ApiError"
import { SuccessResponse } from "../../core/ApiResponse"
import asyncHandler from "../../helpers/asyncHandler"
import validator, { ValidationSource } from "../../helpers/validator"
import schema from "./schema"

const router = express.Router()

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "./audio/")
    },
    filename(req, file, cb) {
        cb(null, file.originalname)
    },
})
const upload = multer({ storage })

router.post(
    "/",
    upload.single("audio"),
    asyncHandler(async (req, res, next) => {
        const { file } = req
        if (!file) throw new BadRequestError("No file provided")
        return new SuccessResponse("Success", file).send(res)
    }),
)

router.get(
    "/all",
    asyncHandler(async (req, res, next) => {
        // Ignores .gitignore file (which is required to track the (initially) empty directory)
        const all_audio = fs.readdirSync("./audio/").sort().slice(1)
        return new SuccessResponse("Success", all_audio).send(res)
    }),
)

const AUDIO_DIR = path.join(`${process.cwd()}/audio/`)

router.get(
    "/single/:audioId",
    validator(schema.getSingle, ValidationSource.PARAM),
    asyncHandler(async (req, res, next) => {
        const { audioId } = req.params
        const audioPath = path.join(AUDIO_DIR + audioId)
        if (!fs.existsSync(audioPath)) throw new BadRequestError("Audio file does not exist")
        res.contentType("audio/")
        res.sendFile(audioPath)
        // return new SuccessResponse("Success", null).send(res)
    }),
)

export default router
