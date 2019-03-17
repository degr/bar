function browserCompatible(element, properties) {
    for(var i = 0; i < properties.length; i++) {
        if(element[properties[i]] !== undefined) {
            return element[properties[i]];
        }
    }
    return null;
}

function getPointerLock() {
    return browserCompatible(
        document,
        ['pointerLockElement', 'mozPointerLockElement', 'webkitPointerLockElement']
    )
}

function hasPointerLock() {
    return getPointerLock() !== undefined;
}