const UserModel = require("../models/Users");
const bcrypt = require("bcrypt");
const { LDAP_IP, LDAP_DC, LDAP_OU } = process.env;
var LdapClient = require('ldapjs-client');
var client = new LdapClient({ url: LDAP_IP });

const LDAP_MODULES_ROUTE_OBJECT = `ou=modulos,${LDAP_OU},dc=${LDAP_DC}`;

class UserService {
  async getUsers() {
    try {
      const options = {
        scope: "sub",
        attributes: ["cn", "member"]
      };

      let result = await client.search(LDAP_MODULES_ROUTE_OBJECT, options);

      const users = [];

      for (let i = 0; i < result.length; i++) {
        if (Object.keys(result[i]).includes("cn")) {
          let role = result[i].cn;
          let module = result[i].dn.split(',')[1].split('=')[1];
          let members = result[i].member;

          members.forEach(member => {
            let parsedMail = member.split(',')[0].split('=')[1];
            let user = users.find(x => x.mail == parsedMail);
            if (user) {
              if (!user.modules[module])
                user.modules[module] = [];
              user.modules[module].push(role);
            }
            else
              users.push({ mail: parsedMail, modules: { [module]: [role] } });
          });
        }
      };

      return users;
    }
    catch (err) {
      console.log(err);
      throw new Error("Error in getUsers Service", err);
    }
  }

  async getUsersByRole(role, module) {
    try {
      const options = {
        scope: "sub",
        attributes: ["cn", "member"]
      };

      let result = await client.search(`cn=${role},ou=${module},${LDAP_MODULES_ROUTE_OBJECT}`, options);

      const usersByRole = {
        role: role,
        module: module,
        mails: [],
      };

      let members = result[0].member;

      for (let i = 0; i < members.length; i++) {
        let parsedUser = members[i].split(",")[0].split("=")[1];
        usersByRole.mails.push(parsedUser);
      }

      return usersByRole;
    }
    catch (err) {
      console.log(err);
      throw new Error("Error in getUsersByRole Service", err);
    }
  }

  async getUsersByModule(module) {
    try {
      const options = {
        scope: "sub",
        attributes: ["cn", "member"]
      };

      let result = await client.search(`ou=${module},${LDAP_MODULES_ROUTE_OBJECT}`, options);

      const usersByModule = {
        module: module,
        users: [],
      };

      for (let i = 0; i < result.length; i++) {
        if (Object.keys(result[i]).includes("cn")) {
          let role = result[i].cn;
          let members = result[i].member;

          members.forEach(member => {
            let parsedMail = member.split(",")[0].split("=")[1];
            let user = usersByModule.users.find(x => x.mail == parsedMail);
            if (user)
              user.roles.push(role);
            else
              usersByModule.users.push({ mail: parsedMail, roles: [role] });
          });
        }
      };

      return usersByModule;
    }
    catch (err) {
      console.log(err);
      throw new Error("Error in getUsersByModule Service", err);
    }
  }




  async ldapGetRoles(conexionLdap, dnUsuario) {
    try {
      //Estructura actual DN Usuario, cuidado con DC=RD, modificar si se usa en arbol produccion: cn=tsultais,ou=usuarios,dc=rd,dc=eventify,dc=local
      let opciones = {
        filter: `(&(member=${dnUsuario}))`,
        scope: "sub",
        attributes: ["cn"]

      }

      let resultado = await conexionLdap.search(LDAP_MODULES_ROUTE_OBJECT, opciones)

      var diccionario = {}

      for (var i = 0; i < resultado.length; i++) {

        var moduloParseado = resultado[i].dn.split(",")[1].split("=")[1]

        if (Object.keys(diccionario).includes(moduloParseado)) {
          diccionario[moduloParseado].push(resultado[i].cn)
        } else {
          diccionario[moduloParseado] = [resultado[i].cn]
        }
      }
      return diccionario;
    }
    catch (err) {
      console.log(err);
      throw new Error("Error in getUsers Service", err);
    }
  }

  async getUserByEmail(email) {
    /*  console.log("USUARIOS POR ROL", await this.getUsersByRole("admin", "analitica"));
 
     //Todos los usuarios y roles de un módulo.
     console.log("USUARIOS POR MODULO", await this.getUsersByModule("analitica"));
 
     //All users
     console.log("USUARIOS", await this.getUsers()); */
    //All modules
    //console.log("MODULOS", await this.getModules());

    /* console.log("ROLS POR MODULO", await this.getRolesByModule("eda"));
    console.log("ROLS POR MODULO", await this.getRolesByModule("analitica"));

    return; */

    try {
      const options = {
        filter: `(&(cn=${email}))`,
        scope: 'sub',
        attributes: ['sn', 'cn', 'ou', 'telephoneNumber']
      };

      const entries = await client.search(`dc=${LDAP_DC}`, options);


      let response = await this.ldapGetRoles(client, entries[0].dn);
      console.log("🚀 ~ file: auth.service.js:65 ~ AuthService ~ ldapValidCredentials ~ response:", response);


      return { ...entries[0], modules: response };

    }
    catch (err) {
      console.log(err);
      throw new Error("Error in getUserByMail Service");
    }

  }

  async createUser(user) {
    try {
      const isUserRegistered = await UserModel.findOne({ email: user.email });
      if (isUserRegistered) {
        throw new Error("User already registered");
      } else {
        user.password = await bcrypt.hash(user.password, 10);
        await UserModel.create(user);
        return user;
      }
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  }
}

module.exports = new UserService();
