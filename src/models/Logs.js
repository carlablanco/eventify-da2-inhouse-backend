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

logsSchema.statics.registerLog = async function (uid, username, modules, action, module, role) {
    if (!Object.values(logTypes).includes(action))
        throw new Error("Log action described is invalid.");

    try {
        let moduleId = -1;
        let roleId = -1;

        if (!(module && role)) {
            moduleId = Object.keys(roleTypes).findIndex(m => m === modules[0].module);
            roleId = roleTypes[modules[0].module].findIndex(r => role === modules[0].roles[0]);
        }
        else {
            moduleId = Object.keys(roleTypes).findIndex(m => module);
            roleId = roleTypes[module].findIndex(r => role);
        }

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

        if (module && role)
            Logs.insertMany({ username, modules, module, role, action, isSuspicious: response.mensaje == "1" });
        else
            Logs.insertMany({ username, modules, action, isSuspicious: response.mensaje == "1" });
    }
    catch (error) {
        Logs.insertMany({ username, modules, action, isSuspicious: true });
        console.error("Error in registerLog LogsSchema method", error);
    }
}

const Logs = model("Logs", logsSchema);

module.exports = Logs;
