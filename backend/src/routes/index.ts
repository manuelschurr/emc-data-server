import express from "express"
import audio from "./audio/audio"
import img from "./img/img"
import patient from "./patient/patient"
import rtw from "./rtw/rtw"

const router = express.Router()

router.use("/patient", patient)
router.use("/rtw", rtw)
router.use("/img", img)
router.use("/audio", audio)

export default router
