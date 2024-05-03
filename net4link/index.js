import express from 'express';
import multer, { diskStorage } from 'multer';
import path from 'path';
import * as NBT from "nbtify";
// import { readFile } from "node:fs/promises";


// 配置multer以处理二进制数据
const storage = diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
});

const upload = multer(); // multer({ storage });

// 初始化Express应用
const app = express();

// 处理二进制POST请求
app.post('/api/upload', upload.single('nbt'), async (req, res) => {
  const file = req.file; 
// const buffer = await readFile("./test_structures/SnowFarm.mcstructure");
    const data = await NBT.read(file.buffer);
    const sr = deepSerializeWithBigInt(data.data)
console.log(sr)
    // console.log(Object.prototype.toString.call(data.data.structure.palette.default.block_position_data[5658].block_entity_data.isMovable  ))
// console.log(data.data.structure.palette.default.block_position_data[2054].block_entity_data.VibrationListener.selector)

  res.status(200).json({
    message: `File uploaded successfully.. Name: ${file.originalname}, Size: ${file.size}`,
    filename: file.filename,
    data:sr
  });
});

// 启动服务器
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});





function deepSerializeWithBigInt(obj, references = [], seenBigInts = new WeakSet()) {
    // // 检查是否存在循环引用
    // const referenceIndex = references.indexOf(obj);
    // if (referenceIndex !== -1) {
    //     return `[Circular Reference Detected at index ${referenceIndex}]`;
    // }
    // references.push(obj);

    
    // 处理数组
    if (Array.isArray(obj)) {
        return deepSerializeNestedArrays(obj);
    }
    
    if (Object.prototype.toString.call(obj).startsWith( '[object Int')) {
            
        // console.log(Object.prototype.toString.call(obj)) 
        // console.log("Int",  obj)
        return Number(obj);
    } 
    // 处理基本类型和其他特殊情况
    if (obj === null || typeof obj !== 'object') {
        if (typeof obj === 'bigint') {
            return Number(obj); // 将BigInt转换为字符串
        }
        return obj;
    }


    // 处理对象
    const serializedObject = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            if (typeof value === 'bigint') {
                serializedObject[key] = Number(value); // 将BigInt转换为字符串
            } else {
                serializedObject[key] = deepSerializeWithBigInt(value, references, seenBigInts);
            }
        }
    }
    return serializedObject;
}

function deepSerializeNestedArrays(arr, references = [], seenBigInts = new WeakSet()) {
    // 检查是否存在循环引用
    // const arrayReferenceIndex = references.findIndex(ref => ref === arr);
    // if (arrayReferenceIndex !== -1) {
    //     return `[Circular Array Reference Detected at index ${arrayReferenceIndex}]`;
    // }
    // references.push(arr);

    // 处理数组
    return arr.map(item => { 
        if (Array.isArray(item)) {
            // 如果是数组，则递归处理
            return deepSerializeNestedArrays(item, references.slice(), seenBigInts);
        } else if (typeof item === 'bigint') {
            // 处理BigInt 
            return Number(item);
        } else if (Object.prototype.toString.call(item).startsWith( '[object Int')) { 
            return Number(item);
        } else if (typeof item === 'object' && item !== null) {
            // 处理对象 
            return deepSerializeWithBigInt(item, references, seenBigInts);
        } else {
            // 基本类型直接返回
            return item;
        }
    });
}