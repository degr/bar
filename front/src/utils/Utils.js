export default class Utils {
    static browserCompatible(element, properties) {
        for(let i = 0; i < properties.length; i++) {
            if(element[properties[i]] !== undefined) {
                return element[properties[i]];
            }
        }
        return null;
    }

    static getPointerLock() {
        return Utils.browserCompatible(
            document,
            ['pointerLockElement', 'mozPointerLockElement', 'webkitPointerLockElement']
        )
    }

    static hasPointerLock() {
        return Utils.getPointerLock() !== undefined;
    }
}