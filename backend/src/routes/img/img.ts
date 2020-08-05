import express from "express"
import fs from "fs"
import multer from "multer"
import path from "path"
import { BadRequestResponse, NotFoundResponse, SuccessResponse } from "../../core/ApiResponse"
import asyncHandler from "../../helpers/asyncHandler"

const router = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage: storage })

router.post(
    "/", upload.single("img"),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    asyncHandler(async (req, res, next) => {
        const file = req.file
        if (!file) {
            return new BadRequestResponse("No file provided").send(res)
        }
        return new SuccessResponse("Successful", file).send(res)
    }),
)

router.get(
    "/",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    asyncHandler(async (req, res, next) => {
        const files = fs.readdirSync("./uploads").sort()
        const newest = files[files.length-1]
        if (!newest){
            return new NotFoundResponse("No files exist").send(res)
        }
        console.log(newest)
        res.sendFile(path.join(__dirname + newest))
        return new SuccessResponse("Successful", null).send(res)
    }),
)

export default router
