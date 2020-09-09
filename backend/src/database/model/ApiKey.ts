import { Document, model, Schema } from "mongoose"

export const DOCUMENT_NAME = "ApiKey"
export const COLLECTION_NAME = "apiKey"

export default interface ApiKey extends Document {
    apiKeyId: number
    value: number
}

const schema = new Schema(
    {
        apiKeyId: {
            type: Schema.Types.String,
            required: true,
        },
        value: {
            type: Schema.Types.String,
            required: true,
        },
    },
    {
        versionKey: false,
    },
)

export const ApiKeyModel = model<ApiKey>(DOCUMENT_NAME, schema, COLLECTION_NAME)
