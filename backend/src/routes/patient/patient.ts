import express from "express";
import _ from "lodash";
import { NotFoundResponse, SuccessResponse } from "../../core/ApiResponse";
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
            throw new NotFoundResponse('Patient could not be found.');
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
            throw new NotFoundResponse('Patient could not be found.');
        }

        return new SuccessResponse("Successful", patient).send(res);
    }),
);

router.get(
    "/findNextPatientId",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    asyncHandler(async (req, res, next) => {
        const patient = await PatientRepo.findMaxAmbulanceId();
        var patientId = 1;
        if (patient) {
            patientId = patient.patientId + 1;
        }

        return new SuccessResponse("Successful", patientId).send(res);
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
            throw new NotFoundResponse('Pulsoxy data could not be found.');
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
            throw new NotFoundResponse('Pulsoxy data could not be found.');
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
            throw new NotFoundResponse('Patient already exists');
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
    validator(schema.updatePatient),
    asyncHandler(async (req, res, next) => {
        const { patientId } = req.params;
        const patient = await PatientRepo.findByPatientId(parseInt(patientId));
        if (patient == null) {
            throw new NotFoundResponse('Patient does not exist');
        }

        if (req.body.hasOwnProperty('ambulanceId')) patient.ambulanceId = req.body.ambulanceId;
        if (req.body.hasOwnProperty('name')) patient.name = req.body.name;
        if (req.body.hasOwnProperty('gender')) patient.gender = req.body.gender;
        if (req.body.hasOwnProperty('age')) patient.age = req.body.age;
        if (req.body.hasOwnProperty('preExistingIllness')) patient.preExistingIllness = req.body.preExistingIllness;
        if (req.body.hasOwnProperty('miscellaneous')) patient.miscellaneous = req.body.miscellaneous;
        if (req.body.hasOwnProperty('AIsSelected')) patient.AIsSelected = req.body.AIsSelected;
        if (req.body.hasOwnProperty('AText')) patient.AText = req.body.AText;
        if (req.body.hasOwnProperty('BIsSelected')) patient.BIsSelected = req.body.BIsSelected;
        if (req.body.hasOwnProperty('BText')) patient.BText = req.body.BText;
        if (req.body.hasOwnProperty('CIsSelected')) patient.CIsSelected = req.body.CIsSelected;
        if (req.body.hasOwnProperty('CText')) patient.CText = req.body.CText;
        if (req.body.hasOwnProperty('DIsSelected')) patient.DIsSelected = req.body.DIsSelected;
        if (req.body.hasOwnProperty('DText')) patient.DText = req.body.DText;
        if (req.body.hasOwnProperty('EIsSelected')) patient.EIsSelected = req.body.EIsSelected;
        if (req.body.hasOwnProperty('EText')) patient.EText = req.body.EText;

        await PatientRepo.update(patient);
        new SuccessResponse('Patient updated successfully', patient).send(res);
    }),
  );


export default router
