const bcrypt = require("bcrypt");
const { LDAP_IP, LDAP_DC, LDAP_OU } = process.env;
var LdapClient = require('ldapjs-client');
var client = new LdapClient({ url: LDAP_IP });

const LDAP_MODULES_ROUTE_OBJECT = `ou=modulos,${LDAP_OU},dc=${LDAP_DC}`;

class ModuleService {

    async getModules() {
        try {
            const options = {
                scope: "sub",
                attributes: ["cn"]
            };

            let result = await client.search(LDAP_MODULES_ROUTE_OBJECT, options);

            const modules = [];

            for (let i = 0; i < result.length; i++) {
                if (Object.keys(result[i]).includes("cn")) {
                    let role = result[i].cn;
                    let newModule = result[i].dn.split(',')[1].split('=')[1];

                    let module = modules.find(x => x.module == newModule);
                    if (module)
                        module.roles.push(role);
                    else
                        module.roles = [role];
                }
                else {
                    let newModule = result[i].dn.split(',')[0].split('=')[1];
                    if (newModule !== "modulos")
                        modules.push({ module: newModule, roles: [] });
                }
            };
            return modules;
        }
        catch (err) {
            console.log(err);
            throw new Error("Error in getUsers Service", err);
        }
    }

    async getRolesByModule(module) {
        try {
            const options = {
                scope: "sub",
                attributes: ["cn"]
            };

            let result = await client.search(`ou=${module},${LDAP_MODULES_ROUTE_OBJECT}`, options);

            const response = { module, roles: [] };

            for (let i = 0; i < result.length; i++) {
                if (Object.keys(result[i]).includes("cn")) {
                    let role = result[i].cn;
                    response.roles.push(role);
                }
            };
            return response;
        }
        catch (err) {
            console.log(err);
            throw new Error("Error in getUsers Service", err);
        }
    }
}

module.exports = new ModuleService();
