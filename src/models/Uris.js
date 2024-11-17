const { Schema, model } = require("mongoose");

const urisSchema = new Schema(
    {
        module: {
            type: String,
            required: true,
            trim: true,
        },
        module: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        strict: false,
        timestamps: false,
        versionKey: false,
    },
);

const Uris = model("uris_redirects", urisSchema);

module.exports = Uris;
