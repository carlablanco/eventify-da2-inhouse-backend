const { client, LDAP_MODULES_ROUTE_OBJECT } = require('../utils/ldapConnect');

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
}

module.exports = new ModuleService();
