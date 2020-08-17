import Gnss, { GnssModel } from '../model/Gnss';

export default class GnssRepo {
   public static findLatestByAmbulanceId(id: number): Promise<Gnss> {
      return GnssModel.findOne({ ambulanceId: id }).sort({ $natural: -1 }).lean<Gnss>().exec();
   }

   public static findLatestByAmbulanceIdAndTimestamp(id: number, date: Date): Promise<Gnss[]> {
      return GnssModel.find({ ambulanceId: id, timestamp: { $gte: date } }).lean<Gnss>().exec();
   }

   public static async create(gnss: Gnss): Promise<{ gnss: Gnss }> {
      const createdGnss = await GnssModel.create(gnss);
      return { gnss: createdGnss.toObject() };
   }
}