import express from "express";
import _ from "lodash";
import { BadRequestError } from "../../core/ApiError";
import { SuccessResponse } from "../../core/ApiResponse";
import Ambulance from "../../database/model/Ambulance";
import Gnss from "../../database/model/Gnss";
import AmbulanceRepo from "../../database/repository/AmbulanceRepo";
import GnssRepo from "../../database/repository/GnssRepo";
import asyncHandler from "../../helpers/asyncHandler";
import validator, { ValidationSource } from "../../helpers/validator";
import schema from "./schema";

const router = express.Router()

router.get(
    "/findAll",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    asyncHandler(async (req, res, next) => {
        const ambulances = await AmbulanceRepo.findAll();
        if (!ambulances) {
            throw new BadRequestError('Ambulance data could not be found.');
        }

        return new SuccessResponse("Successful", ambulances).send(res);
    }),
);

router.get(
    "/findByAmbulanceId/:ambulanceId",
    validator(schema.ambulanceId, ValidationSource.PARAM),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    asyncHandler(async (req, res, next) => {
        const { ambulanceId } = req.params;
        const ambulance = await AmbulanceRepo.findByAmbulanceId(parseInt(ambulanceId));
        if (!ambulance) {
            throw new BadRequestError('Ambulance data could not be found.');
        }

        return new SuccessResponse("Successful", ambulance).send(res);
    }),
);

router.get(
    "/findGnssByAmbulanceId/:ambulanceId",
    validator(schema.ambulanceId, ValidationSource.PARAM),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    asyncHandler(async (req, res, next) => {
        const { ambulanceId } = req.params;
        const gnss = await GnssRepo.findLatestByAmbulanceId(parseInt(ambulanceId));
        if (!gnss) {
            throw new BadRequestError('GNSS data could not be found.');
        }

        return new SuccessResponse("Successful", gnss).send(res);
    }),
);

router.post(
    "/create",
    validator(schema.create),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    asyncHandler(async (req, res, next) => {

        const { ambulance: createdAmbulance } = await AmbulanceRepo.create(
            {
                ambulanceId: req.body.ambulanceId,
                patientId: req.body.patientId,
                identifier: req.body.identifier
            } as Ambulance
        );

        new SuccessResponse("Ambulance successfully created", {
            ambulance: _.pick(createdAmbulance, ['ambulanceId', 'identifier'])
        }).send(res);
    }),
);

router.post(
    "/createGnss",
    validator(schema.createGnss),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    asyncHandler(async (req, res, next) => {

        const { gnss: createdGnss } = await GnssRepo.create(
            {
                ambulanceId: req.body.ambulanceId,
                timestamp: req.body.timestamp,
                latitude: req.body.latitude,
                longitude: req.body.longitude
            } as Gnss
        );

        new SuccessResponse("GNSS successfully created", {
            gnss: _.pick(createdGnss, ['ambulanceId', 'timestamp'])
        }).send(res);
    }),
);

export default router