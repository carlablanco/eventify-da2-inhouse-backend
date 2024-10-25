const UserModel = require("../models/Users");
const bcrypt = require("bcrypt");
const { client, LDAP_MODULES_ROUTE_OBJECT, LDAP_GLOBAL_ROUTE_OBJECT } = require('../utils/ldapConnect');

const PAGE_SIZE = 10;
class UserService {
  async getUsers(page) {
    try {
      const options = {
        scope: "sub",
        attributes: ["cn", "member"]
      };

      let result = await client.search(LDAP_MODULES_ROUTE_OBJECT, options);

      if (page === undefined)
        page = 0;

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

      let pageData = {
        totalPages: Math.ceil(users.length / PAGE_SIZE),
        totalRegisters: users.length,
        pageSize: PAGE_SIZE,
        pageNumber: parseInt(page),
      };

      if (pageData.pageNumber > pageData.totalPages)
        return ({
          ...pageData,
          users: []
        })

      let pagedUsers = users.slice(pageData.pageNumber * pageData.pageSize, (pageData.pageNumber * pageData.pageSize) + pageData.pageSize);

      for (let i = 0; i < pagedUsers.length; i++) {
        let userInfo = await this.getUserByEmail(pagedUsers[i].mail);

        delete userInfo.objectClass;
        delete userInfo.cn;
        userInfo.isActive = true;

        pagedUsers[i] = { ...pagedUsers[i], ...userInfo }
      }

      return ({
        ...pageData,
        pagedUsers
      })
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

  async getRolesByUserDn(userDn) {
    try {
      //Estructura actual DN Usuario, cuidado con DC=RD, modificar si se usa en arbol produccion: cn=tsultais,ou=usuarios,dc=rd,dc=eventify,dc=local
      const options = {
        filter: `(&(member=${userDn}))`,
        scope: "sub",
        attributes: ["cn"]
      };

      let result = await client.search(LDAP_MODULES_ROUTE_OBJECT, options)

      const dictionary = {};

      for (let i = 0; i < result.length; i++) {
        let parsedModule = result[i].dn.split(",")[1].split("=")[1]

        if (Object.keys(dictionary).includes(parsedModule))
          dictionary[parsedModule].push(result[i].cn);
        else
          dictionary[parsedModule] = [result[i].cn];
      }
      return dictionary;
    }
    catch (err) {
      console.log(err);
      throw new Error("Error in getRolesByUserDn Service", err);
    }
  }

  async getUserByEmail(email) {
    try {
      const options = {
        filter: `(&(cn=${email}))`,
        scope: 'sub',
        /* attributes: ['sn', 'cn', 'ou', 'telephoneNumber'] */
      };
      const entries = await client.search(LDAP_GLOBAL_ROUTE_OBJECT, options);

      let roles = await this.getRolesByUserDn(entries[0].dn);

      return { ...entries[0], modules: roles };
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
