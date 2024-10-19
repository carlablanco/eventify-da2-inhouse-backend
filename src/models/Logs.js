const { Schema, model } = require("mongoose");
const { logTypes } = require("../config/logs");

const logsSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
        },
        module: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
        },
        action: {
            type: String,
            enum: [logTypes.LOGIN, logTypes.REFRESH, logTypes.RESET_PASSWORD, logTypes.LOGOUT],
            required: true,
        },
    },
    {
        strict: false,
        timestamps: {
            createdAt: 'timestamp',
            updatedAt: false,
        },
        versionKey: false,
    },
);

const registerLog = async (username, module, role, action) => {
    if (!Object.values(logTypes).includes(action))
        throw new Error("Log action described is invalid.");

    console.log(username, module, role, action);
    Logs.insertMany({ username: username, module: module, role: role, action: action });
    console.log(await Logs.find());
}

const Logs = model("Logs", logsSchema);

module.exports = {
    Logs,
    registerLog,
};
