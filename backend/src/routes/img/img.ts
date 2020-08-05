import express from "express"
import multer from "multer"
import { BadRequestResponse, SuccessResponse } from "../../core/ApiResponse"
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
    "/upload", upload.single("img"),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    asyncHandler(async (req, res, next) => {
        const file = req.file
        if (!file) {
            return new BadRequestResponse("No file provided").send(res)
        }
        return new SuccessResponse("Successful", file).send(res)
    }),
)

export default router
