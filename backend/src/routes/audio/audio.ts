import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { BadRequestResponse, SuccessResponse } from "../../core/ApiResponse";
import asyncHandler from "../../helpers/asyncHandler";


const router = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./audio/")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage: storage })



router.post("/", upload.single("audio"), asyncHandler(async (req, res, next) => {
    const file = req.file
    if (!file) return new BadRequestResponse("No file provided").send(res)
    return new SuccessResponse("Success", file).send(res)
}),
)

router.get("/all", asyncHandler(async (req, res, next) => {
    // Ignores .gitignore file (which is required to track the (initially) empty directory)
    const all_audio = fs.readdirSync("./audio/").sort().slice(1)
    return new SuccessResponse("Success", all_audio).send(res)
}),
)

const AUDIO_DIR = path.join(process.cwd() + "/audio/")

router.get("/single/:audioId", asyncHandler(async (req, res, next) => {
    const { audioId } = req.params
    const audioPath = path.join(AUDIO_DIR + "/" + audioId)
    if (!fs.existsSync(audioPath)) return new BadRequestResponse("Audio file does not exist").send(res)
    res.contentType("audio/mp3")
    res.sendFile(audioPath)
    // return new SuccessResponse("Success", null).send(res)
}),
)







export default router