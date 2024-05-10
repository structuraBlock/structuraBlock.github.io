const fs = require('fs')
const path = require('path')

const pathList = new Set()

// clear
fs.writeFileSync('./list.txt','', { flag: 'w' })



const walkDir = (dir)=> fs.readdirSync(dir).forEach(f => {
        const fullPath = path.join(dir, f)
        const relativePath = path.relative(process.cwd(), fullPath).replaceAll('\\','/')
        
            // 如果是目录，则跑路
        if (!fs.statSync(fullPath).isDirectory()) 
            pathList.add(relativePath)
            // console.log(relativePath)

})


const walkDirPro = (dir)=> {
    fs.readdirSync(dir).forEach(f => {
        const fullPath = path.join(dir, f)
        const relativePath = path.relative(process.cwd(), fullPath).replaceAll('\\','/')
        
        if (fs.statSync(fullPath).isDirectory()) {
            // 如果是目录，则递归调用自身
            walkDirPro(fullPath)
        } else {
            // 如果是文件，则按要求格式打印路径
            pathList.add(relativePath)
            
            // console.log(relativePath)
        }
    })
}

// no no includes file
const igoreFile = [
    ".gitattributes",
    ".gitignore",
    "list.txt",
    "list.js",
    "package-lock.json",
    "package.json",
    "pyscript.toml",
    "README.md",
    "requirements.txt",
    "updater.py",
    "index.js",
    "index.html",
    "upTest.html",
    "speedTest.html",
    "APItest.html",
]
// 从当前目录开始遍历
walkDir('./')
igoreFile.forEach(_=>pathList.delete(_))
walkDirPro('./lookups')
walkDirPro('./test_structures')
walkDirPro('./Vanilla_Resource_Pack')

pathList.forEach(relativePath=>
    fs.writeFileSync('./list.txt', `"${relativePath}" = "./${relativePath}"\n`, { flag: 'a' })
)
console.log(pathList.size)