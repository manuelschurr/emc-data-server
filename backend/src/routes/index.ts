import express from "express"
import ambulance from "./ambulance/ambulance"
import audio from "./audio/audio"
import img from "./img/img"
import patient from "./patient/patient"

const router = express.Router()

router.use("/patient", patient)
router.use("/ambulance", ambulance)
router.use("/img", img)
router.use("/audio", audio)

export default router
