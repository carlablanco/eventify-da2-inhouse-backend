const { Schema, model } = require("mongoose");
const { logTypes } = require("../config/logs");
const { roleTypes } = require("../config/roles");
const { PYTHON_IP } = process.env;

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
        isSuspicious: {
            type: Boolean,
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

logsSchema.statics.registerLog = async function (uid, username, modules, action, module) {
    if (!Object.values(logTypes).includes(action))
        throw new Error("Log action described is invalid.");

    try {
        let moduleId = -1;
        let roleId = 0;

        if (!module)
            moduleId = Object.keys(roleTypes).findIndex(m => m === modules[0].module);
        else
            moduleId = Object.keys(roleTypes).findIndex(m => m === module);

        let inferenceQuery = {
            usuario: String(uid),
            modulo: String(moduleId),
            rol: String(roleId),
            hora: String(new Date().getHours()),
            dia: String(new Date().getDate()),
        };

        let response = await fetch(`${PYTHON_IP}/inferir`, {
            method: "POST",
            body: JSON.stringify(inferenceQuery),
        })

        response = await response.json();

        if (module)
            Logs.insertMany({ username, modules, module, action, isSuspicious: response.mensaje == "1", isInfered: true });
        else
            Logs.insertMany({ username, modules, action, isSuspicious: response.mensaje == "1", isInfered: true });
    }
    catch (error) {
        if (module)
            Logs.insertMany({ username, modules, module, action, isSuspicious: false, isInfered: false });
        else
            Logs.insertMany({ username, modules, action, isSuspicious: false, isInfered: false });
        console.error("Error in registerLog LogsSchema method", error);
    }
}

const Logs = model("Logs", logsSchema);

module.exports = Logs;
