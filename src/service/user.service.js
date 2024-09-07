// Gettign the Newly created Mongoose Model we just created 
var LdapClient = require('ldapjs-client');
var client = new LdapClient({ url: 'ldap://10.8.0.1:389' });

const diccionarioMensajes = require('../utils/diccionarioMensajes');

// Saving the context of this module inside the _the variable
_this = this

exports.getUserById = async function (idUser) {

    try {
        const options = {
          filter: `(&(cn=${idUser}))`,
          scope: 'sub',
          attributes: ['sn', 'cn']
        };
      
        const entries = await client.search('dc=eventify,dc=local', options);

        console.log(entries)
        return entries;

      } catch (e) {
        console.log(e);
      }

}

exports.login = async function (cn, pass) {

    try {
              
        var userDn = `cn=${cn}` + ",ou=eventify_sa,dc=eventify,dc=local"
        const login = await client.bind( userDn , pass);

        console.log(login)
        return login;

      } catch (e) {
        console.log(e);
      }
      
}







