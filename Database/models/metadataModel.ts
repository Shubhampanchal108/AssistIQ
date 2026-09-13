import mongoose from "mongoose";

const metadataSchema = new mongoose.Schema({
    user_email:{
        type: String,
        required: true
    },
    business_name: {
        type: String,
        required: true
    },
    website_url: {
        type: String,
        required: true
    },
    external_links:{
        type: String,
    },
    support_email:{
        type: String,
        default: ""
    },
    timezone:{
        type: String,
        default: "UTC"
    },
    allowed_domains:{
        type: String,
        default: "*"
    },
    api_key:{
        type: String,
        default: ""
    }
}, {timestamps: true})

export const metadata = mongoose.models.metadata || mongoose.model("metadata", metadataSchema);