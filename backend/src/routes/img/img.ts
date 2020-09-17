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

// Defines the multer storage parameters
// Saves files in backend/img with the originalname from the request
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./img/")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
// Multer object
const upload = multer({ storage: storage })

// POST endpoint to upload image files
router.post(
    "/", upload.single("img"), verifyToken, asyncHandler(async (req, res, next) => {
        const file = req.file
        if (!file) throw new BadRequestError("No file provided")
        return new SuccessResponse("Successful", file).send(res)
    }),
)

// GET endpoint to receive all image files currently saved in the local file system
// Allows to GET single image files by their file name via /single/:id
router.get("/all", asyncHandler(async (req, res, next) => {
    // Ignores .gitignore file (which is required to track the (initially) empty directory)
    const all_img = fs.readdirSync("./img/").sort().slice(1)
    return new SuccessResponse("Success", all_img).send(res)
}),
)

const IMG_DIR = path.join(process.cwd() + "/img/")

// GET endpoint to receive the newest available image from the local file system
router.get(
    "/newest", verifyToken,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    asyncHandler(async (req, res, next) => {
        try {
            // Sorts all files to get the newest one
            const files = fs.readdirSync("./img/").sort()
            const newest = files[files.length - 1]
            // Ignores .gitignore file (required to keep empty directory synched in git repo)
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


// GET endpoint to receive a single image file by file name
// File name can be obtained via /img/all endpoint
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
