export function getProp<T>(obj: object, propPath: string | Array<string>, defaultValue: any): T {
    if (typeof propPath === 'string') {
        propPath = propPath.split('.');
    } else if (!(propPath instanceof Array)) {
        throw new TypeError('Invalid type for key: ' + typeof propPath);
    }
    let temp: any = obj;
    for (let i = 0; i < propPath.length; i += 1) {
        if (temp === undefined || typeof temp !== 'object' || temp === null) {
            return defaultValue;
        }
        temp = temp[propPath[i]];
    }
    if (temp === undefined) {
        return defaultValue;
    }
    return temp;
}

export function hasProp(obj: object, propPath: string | Array<string>): boolean {
    if (typeof propPath === 'string') {
        propPath = propPath.split('.');
    } else if (!(propPath instanceof Array)) {
        throw new TypeError('Invalid type for key: ' + typeof propPath);
    }
    let temp: any = obj;
    for (let i = 0; i < propPath.length; i += 1) {
        if (temp === undefined || typeof temp !== 'object' || temp === null) {
            return false;
        }
        temp = temp[propPath[i]];
    }
    if (temp === undefined) {
        return false;
    }
    return true;
}

export function setProp(obj: object, propPath: string | Array<string>, value: any) {
    if (typeof propPath === 'string') {
        propPath = propPath.split('.');
    } else if (!(propPath instanceof Array)) {
        throw new TypeError('Invalid type for key: ' + typeof propPath);
    }
    if (propPath.length === 0) {
        return;
    }
    // pop off the last property for setting at the end.
    const propKey = propPath[propPath.length - 1];
    let key;
    // Walk the path, creating empty objects if need be.
    let temp: any = obj;
    for (let i = 0; i < propPath.length - 1; i += 1) {
        key = propPath[i];
        if (temp[key] === undefined) {
            temp[key] = {};
        }
        obj = temp[key];
    }
    // Finally set the property.
    temp[propKey] = value;
    return value;
}

export function incrProp(obj: object, propPath: string | Array<string>, increment: number): number | undefined {
    if (typeof propPath === 'string') {
        propPath = propPath.split('.');
    } else if (!(propPath instanceof Array)) {
        throw new TypeError('Invalid type for key: ' + typeof propPath);
    }
    if (propPath.length === 0) {
        return;
    }
    increment = increment === undefined ? 1 : increment;
    const propKey = propPath[propPath.length - 1];
    let temp: any = obj;
    for (let i = 0; i < propPath.length - 1; i += 1) {
        const key = propPath[i];
        if (temp[key] === undefined) {
            temp[key] = {};
        }
        temp = temp[key];
    }
    if (temp[propKey] === undefined) {
        temp[propKey] = increment;
    } else {
        if (typeof temp[propKey] === 'number') {
            temp[propKey] += increment;
        } else {
            throw new Error('Can only increment a number');
        }
    }
    return temp[propKey];
}

export function deleteProp(obj: object, propPath: string | Array<string>) {
    if (typeof propPath === 'string') {
        propPath = propPath.split('.');
    } else if (!(propPath instanceof Array)) {
        throw new TypeError('Invalid type for key: ' + typeof propPath);
    }
    if (propPath.length === 0) {
        return false;
    }
    const propKey = propPath[propPath.length - 1];
    let temp: any = obj;
    for (let i = 0; i < propPath.length - 1; i += 1) {
        const key = propPath[i];
        if (temp[key] === undefined) {
            // for idempotency, and utility, do not throw error if
            // the key doesn't exist.
            return false;
        }
        obj = temp[key];
    }
    if (temp[propKey] === undefined) {
        return false;
    }
    delete temp[propKey];
    return true;
}

// class Props {
//     constructor(config = {}) {
//         this.obj = config.data || {};
//     }

//     getItem(props, defaultValue) {
//         return getProp(this.obj, props, defaultValue);
//     }

//     hasItem(propPath) {
//         return hasProp(this.obj, propPath);

//     }

//     setItem(path, value) {
//         return setProp(this.obj, path, value);
//     }

//     incrItem(path, increment) {
//         return incrProp(this.obj, path, increment);
//     }

//     deleteItem(path) {
//         return deleteProp(this.obj, path);
//     }

//     getRaw() {
//         return this.obj;
//     }
// }

// return Object.freeze({ Props, getProp, hasProp, setProp, incrProp, deleteProp });
