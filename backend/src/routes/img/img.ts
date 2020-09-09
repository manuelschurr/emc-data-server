import express from "express"
import fs from "fs"
import multer from "multer"
import path from "path"
import verifyToken from "../../auth/VerifyToken"
import { BadRequestError } from "../../core/ApiError"
import { NotFoundMsgResponse, SuccessResponse } from "../../core/ApiResponse"
import asyncHandler from "../../helpers/asyncHandler"
import validator, { ValidationSource } from "../../helpers/validator"
import schema from "./schema"

const router = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./img/")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage: storage })

router.post(
    "/", upload.single("img"), verifyToken, asyncHandler(async (req, res, next) => {
        const file = req.file
        if (!file) throw new BadRequestError("No file provided")
        return new SuccessResponse("Successful", file).send(res)
    }),
)

router.get("/all", verifyToken, asyncHandler(async (req, res, next) => {
    // Ignores .gitignore file (which is required to track the (initially) empty directory)
    const all_img = fs.readdirSync("./img/").sort().slice(1)
    return new SuccessResponse("Success", all_img).send(res)
}),
)

const IMG_DIR = path.join(process.cwd() + "/img/")

router.get(
    "/newest", verifyToken,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    asyncHandler(async (req, res, next) => {
        try {
            const files = fs.readdirSync("./img/").sort()
            const newest = files[files.length - 1]
            // TODO: Return image via SuccessResponse. How?!
            if (!newest || newest == ".gitignore") {
                return new NotFoundMsgResponse("No files exist").send(res)
            }
            const imgPath = path.join(IMG_DIR + newest)
            res.contentType("jpeg")
            res.sendFile(imgPath)
        } catch (e) {
            return new NotFoundMsgResponse("No files exist").send(res)
        }
    }),
)


router.get("/single/:imgId", validator(schema.getSingle, ValidationSource.PARAM), verifyToken, asyncHandler(async (req, res, next) => {
    const { imgId } = req.params
    const imgPath = path.join(IMG_DIR + "/" + imgId)
    if (!fs.existsSync(imgPath)) throw new BadRequestError("Image does not exist")
    res.contentType("jpeg")
    res.sendFile(imgPath)
    // return new SuccessResponse("Success", null).send(res)
}),
)

export default router
