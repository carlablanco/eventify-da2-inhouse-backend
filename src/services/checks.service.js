class CheckService {

    async getHealthyStatus(module) {
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

module.exports = new RoleService();
