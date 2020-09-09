import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { BadRequestError } from "../../core/ApiError";
import { SuccessResponse } from "../../core/ApiResponse";
import asyncHandler from "../../helpers/asyncHandler";
import validator, { ValidationSource } from "../../helpers/validator";
import schema from "./schema";

const router = express.Router()

// Defines the multer storage parameters
// Saves files in backend/audio with the originalname from the request
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./audio/")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
// Multer object
const upload = multer({ storage: storage })

// POST endpoint to upload audio files
router.post("/", upload.single("audio"), asyncHandler(async (req, res, next) => {
    const file = req.file
    if (!file) throw new BadRequestError("No file provided")
    return new SuccessResponse("Success", file).send(res)
    }),
)

// GET endpoint to receive all audio files currently saved in the local file system
// Allows to GET single audio files by their file name via /single/:id
router.get("/all", asyncHandler(async (req, res, next) => {
    // Ignores .gitignore file (which is required to track the (initially) empty directory)
    const all_audio = fs.readdirSync("./audio/").sort().slice(1)
    return new SuccessResponse("Success", all_audio).send(res)
}),
)

const AUDIO_DIR = path.join(process.cwd() + "/audio/")

// GET endpoint to receive a single audio file by file name
// File name can be obtained via /audio/all endpoint
router.get("/single/:audioId", validator(schema.getSingle, ValidationSource.PARAM), asyncHandler(async (req, res, next) => {
    const { audioId } = req.params
    const audioPath = path.join(AUDIO_DIR + audioId)
    if (!fs.existsSync(audioPath)) throw new BadRequestError("Audio file does not exist")
    res.contentType("audio/mp3")
    res.sendFile(audioPath)
    // return new SuccessResponse("Success", null).send(res)
}),
)







export default router