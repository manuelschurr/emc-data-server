import express from "express"
import fs from "fs"
import multer from "multer"
import path from "path"
import { BadRequestResponse, NotFoundResponse, SuccessResponse } from "../../core/ApiResponse"
import asyncHandler from "../../helpers/asyncHandler"
const router = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./images/")
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
        if (!file) return new BadRequestResponse("No file provided").send(res)
        return new SuccessResponse("Successful", file).send(res)
    }),
)


const IMAGES_DIR = path.join(process.cwd() + "/images/")

router.get(
    "/newest",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    asyncHandler(async (req, res, next) => {
        const files = fs.readdirSync("./images/").sort()
        const newest = files[files.length - 1]
        if (!newest) {
            return new NotFoundResponse("No files exist").send(res)
        }

        // TODO: Return image via SuccessResponse. How?!
        const imgPath = path.join(IMAGES_DIR + newest)
        res.contentType("jpeg")
        res.sendFile(imgPath)
        // return new SuccessResponse("Successful", null).send(res)
    }),
)

router.get("/all", asyncHandler(async (req, res, next) => {
    // Ignores .gitignore file (which is required to track the empty directory)
    const all_img = fs.readdirSync("./images/").sort().slice(1)
    return new SuccessResponse("Success", all_img).send(res)
}),
)


router.get("/single/:imgId", asyncHandler(async (req, res, next) => {
    const { imgId } = req.params
    const imgPath = path.join(IMAGES_DIR + "/" + imgId)
    if (!fs.existsSync(imgPath)) return new BadRequestResponse("Image does not exist").send(res)
    res.contentType("jpeg")
    res.sendFile(imgPath)
    // return new SuccessResponse("Success", null).send(res)
}),
)

export default router
