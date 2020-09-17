import { CountersModel } from '../model/Counters';

export default class CountersRepo {
   public static async findAndModify(sequenceName : string) : Promise<Number> {
      // using the upsert option -> findOneAndUpdate() acts normally if it finds a document which is matching the filter
      // if no document matches the filter, a new document will be created
      let sequence = await CountersModel.findOneAndUpdate({_id: sequenceName}, {$inc:{sequence_value:1}}, {new: true, upsert: true});
      return sequence.sequence_value;
   }
}