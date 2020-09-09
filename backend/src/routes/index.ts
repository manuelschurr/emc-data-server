import express from "express"
import ambulance from "./ambulance/ambulance"
import apiKey from "./apiKey/apiKey"
import audio from "./audio/audio"
import img from "./img/img"
import patient from "./patient/patient"
import user from "./user/user"

const router = express.Router()

router.use("/patient", patient)
router.use("/ambulance", ambulance)
router.use("/img", img)
router.use("/audio", audio)
router.use("/user", user)
router.use("/apiKey", apiKey)

export default router
