import express from "express";
import _ from "lodash";
import { BadRequestError } from "../../core/ApiError";
import { SuccessResponse } from "../../core/ApiResponse";
import Patient from "../../database/model/Patient";
import Pulsoxy from "../../database/model/Pulsoxy";
import PatientRepo from "../../database/repository/PatientRepo";
import PulsoxyRepo from "../../database/repository/PulsoxyRepo";
import asyncHandler from "../../helpers/asyncHandler";
import validator, { ValidationSource } from "../../helpers/validator";
import schema from "./schema";

const router = express.Router()

router.get(
    "/findByPatientId/:patientId",
    validator(schema.patientId, ValidationSource.PARAM),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    asyncHandler(async (req, res, next) => {
        const { patientId } = req.params;
        const patient = await PatientRepo.findByPatientId(parseInt(patientId));
        if (!patient) {
            throw new BadRequestError('Patient could not be found.');
        }

        return new SuccessResponse("Successful", patient).send(res);
    }),
);

router.get(
    "/findByAmbulanceId/:ambulanceId",
    validator(schema.ambulanceId, ValidationSource.PARAM),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    asyncHandler(async (req, res, next) => {
        const { ambulanceId } = req.params;
        const patient = await PatientRepo.findByAmbulanceId(parseInt(ambulanceId));
        if (!patient) {
            throw new BadRequestError('Patient could not be found.');
        }

        return new SuccessResponse("Successful", patient).send(res);
    }),
);

router.get(
    "/findNextPatientId",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    asyncHandler(async (req, res, next) => {
        const patient = await PatientRepo.findMaxAmbulanceId();
        if (!patient) {
            throw new BadRequestError('AmbulanceId could not be found.');
        }

        return new SuccessResponse("Successful", patient.patientId + 1).send(res);
    }),
);

router.get(
    "/findPulsoxyByPatientId/:patientId",
    validator(schema.patientId, ValidationSource.PARAM),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    asyncHandler(async (req, res, next) => {
        const { patientId } = req.params;
        const pulsoxy = await PulsoxyRepo.findLatestByPatientId(parseInt(patientId));
        if (!pulsoxy) {
            throw new BadRequestError('Pulsoxy data could not be found.');
        }

        return new SuccessResponse("Successful", pulsoxy).send(res);
    }),
);

router.get(
    "/findPulsoxyByPatientIdAndTimestamp",
    validator(schema.pulsoxy, ValidationSource.QUERY),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    asyncHandler(async (req, res, next) => {
        const patientId = req.query.patientId.toString();
        const timestamp = new Date(req.query.timestamp.toString());
        const pulsoxy = await PulsoxyRepo.findLatestByPatientIdAndTimestamp(parseInt(patientId), timestamp);
        if (!pulsoxy) {
            throw new BadRequestError('Pulsoxy data could not be found.');
        }

        return new SuccessResponse("Successful", pulsoxy).send(res);

    }),
);

router.post(
    "/create",
    validator(schema.createPatient),
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

router.put(
    '/update/:patientId',
    validator(schema.patientId, ValidationSource.PARAM),
    validator(schema.createPatient),
    asyncHandler(async (req, res, next) => {
        const { patientId } = req.params;
        const patient = await PatientRepo.findByPatientId(parseInt(patientId));
        if (patient == null) {
            throw new BadRequestError('Patient does not exist');
        }

        if (req.body.ambulanceId) patient.ambulanceId = req.body.ambulanceId;
        if (req.body.name) patient.name = req.body.name;
        if (req.body.gender) patient.gender = req.body.gender;
        if (req.body.age) patient.age = req.body.age;
        if (req.body.preExistingIllness) patient.preExistingIllness = req.body.preExistingIllness;
        if (req.body.miscellaneous) patient.miscellaneous = req.body.miscellaneous;
        if (req.body.AIsSelected) patient.AIsSelected = req.body.AIsSelected;
        if (req.body.AText) patient.AText = req.body.AText;
        if (req.body.BIsSelected) patient.BIsSelected = req.body.BIsSelected;
        if (req.body.BText) patient.BText = req.body.BText;
        if (req.body.CIsSelected) patient.CIsSelected = req.body.CIsSelected;
        if (req.body.CText) patient.CText = req.body.CText;
        if (req.body.DIsSelected) patient.DIsSelected = req.body.DIsSelected;
        if (req.body.DText) patient.DText = req.body.DText;
        if (req.body.EIsSelected) patient.EIsSelected = req.body.EIsSelected;
        if (req.body.EText) patient.EText = req.body.EText;

        await PatientRepo.update(patient);
        new SuccessResponse('Patient updated successfully', patient).send(res);
    }),
  );


export default router
