const { LDAP_IP, LDAP_DC, LDAP_OU } = process.env;
const LdapClient = require('ldapjs-client');
const client = new LdapClient({ url: LDAP_IP });

const LDAP_GLOBAL_ROUTE_OBJECT = `dc=${LDAP_DC}`;

const LDAP_MODULES_ROUTE_OBJECT = `ou=modulos,${LDAP_OU},dc=${LDAP_DC}`;

const LDAP_USERS_ROUTE_OBJECT = `ou=usuarios,${LDAP_OU},dc=${LDAP_DC}`;

module.exports = {
    client,
    LDAP_GLOBAL_ROUTE_OBJECT,
    LDAP_MODULES_ROUTE_OBJECT,
    LDAP_USERS_ROUTE_OBJECT
};