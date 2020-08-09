import express from "express";
import _ from "lodash";
import { BadRequestError } from "../../core/ApiError";
import { SuccessResponse } from "../../core/ApiResponse";
import Patient from "../../database/model/Patient";
import Pulsoxy from "../../database/model/Pulsoxy";
import PatientRepo from "../../database/repository/PatientRepo";
import PulsoxyRepo from "../../database/repository/PulsoxyRepo";
import asyncHandler from "../../helpers/asyncHandler";
import validator from "../../helpers/validator";
import schema from "./schema";

const router = express.Router()

router.get(
    "/findByPatientId",
    validator(schema.patientId),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    asyncHandler(async (req, res, next) => {
        const patient = await PatientRepo.findByPatientId(req.body.patientId);
        if (!patient) {
            throw new BadRequestError('Patient could not be found.');
        }

        return new SuccessResponse("Successful", patient).send(res);
    }),
);

router.get(
    "/findByAmbulanceId",
    validator(schema.ambulanceId),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    asyncHandler(async (req, res, next) => {
        const patient = await PatientRepo.findByAmbulanceId(req.body.ambulanceId);
        if (!patient) {
            throw new BadRequestError('Patient could not be found.');
        }

        return new SuccessResponse("Successful", patient).send(res);
    }),
);

router.get(
    "/findPulsoxyByPatientId",
    validator(schema.patientId),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    asyncHandler(async (req, res, next) => {
        const pulsoxy = await PulsoxyRepo.findLatestByPatientId(req.body.patientId);
        if (!pulsoxy) {
            throw new BadRequestError('Pulsoxy data could not be found.');
        }

        return new SuccessResponse("Successful", pulsoxy).send(res);
    }),
);

router.post(
    "/create",
    validator(schema.create),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    asyncHandler(async (req, res, next) => {
        const patient = await PatientRepo.findByPatientId(req.body.patientId);
        if (patient) {
            throw new BadRequestError('Patient already exists');
        }

        const { patient: createdPatient } = await PatientRepo.create(
            {
                patientId: req.body.patientId,
                ambulanceId: req.body.ambulanceId,
                name: req.body.name,
                gender: req.body.gender,
                age: req.body.age,
                preExistingIllness: req.body.preExistingIllness,
                miscellaneous: req.body.miscellaneous,
                AIsSelected: req.body.AIsSelected,
                AText: req.body.AText,
                BIsSelected: req.body.BIsSelected,
                BText: req.body.BText,
                CIsSelected: req.body.CIsSelected,
                CText: req.body.CText,
                DIsSelected: req.body.DIsSelected,
                DText: req.body.DText,
                EIsSelected: req.body.EIsSelected,
                EText: req.body.EText
            } as Patient
        );

        new SuccessResponse("Patient successfully created", {
            patient: _.pick(createdPatient, ['patientId', 'name'])
        }).send(res);
    }),
);

router.post(
    "/createPulsoxy",
    validator(schema.createPulsoxy),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    asyncHandler(async (req, res, next) => {
        
        const { pulsoxy: createdPulsoxy } = await PulsoxyRepo.create(
            {
                patientId: req.body.patientId,
                timestamp: req.body.timestamp,
                pulsrate: req.body.pulsrate,
                spo2: req.body.spo2
            } as Pulsoxy
        );

        new SuccessResponse("Pulsoxy successfully created", {
            pulsoxy: _.pick(createdPulsoxy, ['patientId', 'timestamp'])
        }).send(res);
    }),
);


export default router
