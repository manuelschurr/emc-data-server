import Ambulance, { AmbulanceModel } from '../model/Ambulance';

export default class AmbulanceRepo {
   public static findAll(): Promise<Ambulance[]> {
      return AmbulanceModel.find({}).lean<Ambulance>().exec();
   }

   public static findByAmbulanceId(id: number): Promise<Ambulance> {
      return AmbulanceModel.findOne({ ambulanceId: id }).lean<Ambulance>().exec();
   }

   public static findMaxAmbulanceId(): Promise<Ambulance> {
      return AmbulanceModel.findOne({}, {ambulanceId: 1, _id: 0} ).sort({ambulanceId: -1}).lean<Ambulance>().exec();
   }

   public static async create(ambulance: Ambulance): Promise<{ ambulance: Ambulance }> {
      const createdAmbulance = await AmbulanceModel.create(ambulance);
      return { ambulance: createdAmbulance.toObject() };
   }

   public static async update(ambulance: Ambulance): Promise<{ ambulance: Ambulance }> {
      await AmbulanceModel.updateOne({ ambulanceId: ambulance.ambulanceId }, { $set: { ...ambulance } }).lean().exec();
      return { ambulance: ambulance };
   }
}