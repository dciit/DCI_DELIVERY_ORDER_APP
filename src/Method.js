
export default function CHECK_PRIVILEGE(privilege = [], empcode = '', module = '', component = '', ref = '', action = '', val = '') {
    return privilege.filter(o => o.privModule == module && o.privComponent == component && o.privRef == ref && o.privAction == action && o.privVal == val);
}
export function emptyCache() {
    if ('caches' in window) {
        caches.keys().then((names) => {
            // Delete all the cache files
            names.forEach(name => {
                caches.delete(name);
            })
        });

        // Makes sure the page reloads. Changes are only visible after you refresh.
    }
}