import Pulsoxy, { PulsoxyModel } from '../model/Pulsoxy';

export default class PulsoxyRepo {
    public static findLatestByPatientId(id: number): Promise<Pulsoxy> {
        return PulsoxyModel.findOne({ patientId: id }).sort({ $natural: -1 }).lean<Pulsoxy>().exec();
    }

    public static findLatestByPatientIdAndTimestamp(id: number, ts: Date): Promise<Pulsoxy[]> {
        return PulsoxyModel.find({ patientId: id, timestamp: { $gte: ts } }).lean<Pulsoxy>().exec();
    }

    public static async create(pulsoxy: Pulsoxy): Promise<{ pulsoxy: Pulsoxy }> {
        const createdPulsoxy = await PulsoxyModel.create(pulsoxy);
        return { pulsoxy: createdPulsoxy.toObject() };
    }
}