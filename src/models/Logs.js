const { Schema, model } = require("mongoose");
const { logTypes } = require("../config/logs");

const logsSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
        },
        modules: Schema.Types.Mixed,
        module: {
            type: String,
            required: false,
        },
        role: {
            type: String,
            required: false,
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

const registerLog = async (username, modules, action, module, role) => {
    if (!Object.values(logTypes).includes(action))
        throw new Error("Log action described is invalid.");

    console.log(username, module, role, action);
    if (module)
        Logs.insertMany({ username: username, modules, module: module, role: role, action: action });
    else
        Logs.insertMany({ username: username, modules, action: action });
}

const Logs = model("Logs", logsSchema);

module.exports = {
    Logs,
    registerLog,
};
