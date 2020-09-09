import ApiKey, { ApiKeyModel } from "../model/ApiKey"

export default class ApiKeyRepo {
    public static findAll(): Promise<ApiKey[]> {
        return ApiKeyModel.find({}).lean<ApiKey>().exec()
    }

    public static async create(apiKey: ApiKey): Promise<{ apiKey: ApiKey }> {
        const createdAmbulance = await ApiKeyModel.create(apiKey)
        return { apiKey: createdAmbulance.toObject() }
    }

    public static async update(apiKey: ApiKey): Promise<{ apiKey: ApiKey }> {
        await ApiKeyModel.updateOne({ apiKeyId: apiKey.apiKeyId }, { $set: { ...apiKey } })
            .lean()
            .exec()
        return { apiKey }
    }

    public static findByApiKeyId(id: number): Promise<ApiKey> {
        return ApiKeyModel.findOne({ apiKeyId: id }).lean<ApiKey>().exec()
    }
}
