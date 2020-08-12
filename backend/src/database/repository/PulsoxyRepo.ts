import Pulsoxy, { PulsoxyModel } from '../model/Pulsoxy';

export default class PulsoxyRepo {
    public static findLatestByPatientId(id: number, ts: string): Promise<Pulsoxy[]> {
        return PulsoxyModel.find({ patientId: id, timestamp: {$gte: ts }}).sort({ $natural: -1 }).lean<Pulsoxy>().exec();
    }

    public static async create(pulsoxy: Pulsoxy): Promise<{ pulsoxy: Pulsoxy }> {
        const createdPulsoxy = await PulsoxyModel.create(pulsoxy);
        return { pulsoxy: createdPulsoxy.toObject() };
    }
}