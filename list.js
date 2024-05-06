const fs = require('fs');
const path = require('path');

function walkDir(dir) {
    fs.readdirSync(dir).forEach(f => {
        const fullPath = path.join(dir, f);
        const relativePath = path.relative(process.cwd(), fullPath);
        
        if (fs.statSync(fullPath).isDirectory()) {
            // 如果是目录，则递归调用自身
            walkDir(fullPath);
        } else {
            // 如果是文件，则按要求格式打印路径
            fs.writeFileSync('./list.txt', `"${relativePath.replace(/\\/g, '/')}" = "./${relativePath}"\n`, { flag: 'a' });
            console.log(`"${relativePath.replace(/\\/g, '/')}" = "./${relativePath}"`);
        }
    });
}

// 从当前目录开始遍历
walkDir('./');