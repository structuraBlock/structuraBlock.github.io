function deepSerializeWithBigInt(obj, references = [], seenBigInts = new WeakSet()) {
    // 检查是否存在循环引用
    const referenceIndex = references.indexOf(obj);
    if (referenceIndex !== -1) {
        return `[Circular Reference Detected at index ${referenceIndex}]`;
    }
    references.push(obj);

    // 处理基本类型和其他特殊情况
    if (obj === null || typeof obj !== 'object') {
        if (typeof obj === 'bigint') {
            return String(obj); // 将BigInt转换为字符串
        }
        return obj;
    }

    // 处理数组
    if (Array.isArray(obj)) {
        return deepSerializeNestedArrays(obj);
    }

    // 处理对象
    const serializedObject = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            if (typeof value === 'bigint') {
                serializedObject[key] = String(value); // 将BigInt转换为字符串
            } else {
                serializedObject[key] = deepSerializeWithBigInt(value, references, seenBigInts);
            }
        }
    }
    return serializedObject;
}

// 使用示例
const objWithBigInt = {
    name: "Alice",
    age: 25n,
    num:[[1,1,1,1],[0,4,0,0,0,]]
};

console.log(JSON.stringify(deepSerializeWithBigInt(objWithBigInt)));
function deepSerializeNestedArrays(arr, references = [], seenBigInts = new WeakSet()) {
    // 检查是否存在循环引用
    const arrayReferenceIndex = references.findIndex(ref => ref === arr);
    if (arrayReferenceIndex !== -1) {
        return `[Circular Array Reference Detected at index ${arrayReferenceIndex}]`;
    }
    references.push(arr);

    // 处理数组
    return arr.map(item => {
        if (Array.isArray(item)) {
            // 如果是数组，则递归处理
            return deepSerializeNestedArrays(item, references.slice(), seenBigInts);
        } else if (typeof item === 'bigint') {
            // 处理BigInt
            return String(item);
        } else if (typeof item === 'object' && item !== null) {
            // 处理对象
            return deepSerializeWithBigInt(item, references, seenBigInts);
        } else {
            // 基本类型直接返回
            return item;
        }
    });
}

// // 示例
// const nestedArray = [[1, 1, 1, 0, 1, 3], [0, 0, 0, 0], [true, { nested: 'value', bigInt: 123n }]];
// console.log(JSON.stringify(deepSerializeNestedArrays(nestedArray)));