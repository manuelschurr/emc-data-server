import Patient, { PatientModel } from '../model/Patient';

export default class PatientRepo {
   public static findByPatientId(id: number): Promise<Patient> {
      return PatientModel.findOne({ patientId: id }).lean<Patient>().exec();
   }

   public static findByAmbulanceId(id: number): Promise<Patient> {
      return PatientModel.findOne({ ambulanceId: id }).lean<Patient>().exec();
   }

   public static findMaxAmbulanceId(): Promise<Patient> {
      return PatientModel.findOne({}, {patientId: 1, _id: 0} ).sort({patientId: -1}).lean<Patient>().exec();
   }

   public static async create(patient: Patient): Promise<{ patient: Patient }> {
      const now = new Date();
      patient.createdAt = patient.updatedAt = now;
      const createdPatient = await PatientModel.create(patient);
      return { patient: createdPatient.toObject() };
   }

   public static async update(patient: Patient): Promise<{ patient: Patient }> {
      patient.updatedAt = new Date();
      await PatientModel.updateOne({ patientId: patient.patientId }, { $set: { ...patient } }).lean().exec();
      return { patient: patient };
   }
}