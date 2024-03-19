
export default function CHECK_PRIVILEGE(privilege = [], empcode = '', module = '', component = '', ref = '', action = '', val = '') {
    console.log(val)
    return privilege.filter(o => o.privModule == module && o.privComponent == component && o.privRef == ref && o.privAction == action && o.privVal == val);
}