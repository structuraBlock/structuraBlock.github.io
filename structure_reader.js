import * as fs from 'fs';
function embed(smallArray, bigArray, loc) {
    const xStart = loc[0];
    const yStart = loc[1];
    const zStart = loc[2];
    const xStop = xStart + smallArray.length;
    const yStop = yStart + smallArray[0].length;
    const zStop = zStart + smallArray[0][0].length;
    for (let i = xStart; i < xStop; i++) {
        for (let j = yStart; j < yStop; j++) {
            for (let k = zStart; k < zStop; k++) {
                bigArray[i][j][k] = smallArray[i - xStart][j - yStart][k - zStart];
            }
        }
    }
}
class ProcessStructure {
    nbtDefs;
    blockNames;
    NBTfile;
    blocks;
    size;
    palette;
    mins;
    maxs;
    origin;
    cube;
    constructor(file) {
        this.nbtDefs = JSON.parse(fs.readFileSync("lookups/nbt_defs.json", 'utf8'));
        this.blockNames = JSON.parse(fs.readFileSync("lookups/material_list_names.json", 'utf8'));
        this.NBTfile = (typeof file === 'object') ? file : NBT.read(file);
        if ("" in this.NBTfile) {
            this.NBTfile = this.NBTfile[""];
        }
        this.blocks = this.NBTfile["structure"]["block_indices"][0].map((x) => parseInt(x));
        this.size = this.NBTfile["size"].map((x) => parseInt(x));
        this.palette = this.NBTfile["structure"]["palette"]["default"]["block_palette"];
        this.mins = this.NBTfile["structure_world_origin"].map((x) => parseInt(x));
        this.maxs = this.mins.map((x, i) => x + this.size[i] - 1);
        this.origin = this.NBTfile["structure_world_origin"].map((x) => parseInt(x));
        this.getBlockMap();
    }
    getLayerBlocks(y) {
        const lb = this.cube.map(row => row[y]);
        return lb.map((row, i) => row.map((val, j) => val > 0 ? [i, j] : []).filter(coords => coords.length > 0)).flat();
    }
    getBlockMap() {
        let indexOfAir = 0;
        for (let i = 0; i < this.palette.length; i++) {
            if (this.palette[i]["name"] === "minecraft:air") {
                indexOfAir = i;
                break;
            }
        }
        this.cube = this.blocks.map(x => x + 1);
        this.palette = [{ "name": "minecraft:air", "states": [] }].concat(this.palette);
        this.cube = this.cube.map(x => x === indexOfAir + 1 ? 0 : x);
        this.cube = this.cube.reduce((acc, val, i) => {
            acc[Math.floor(i / (this.size[1] * this.size[2]))][(i / this.size[2]) % this.size[1]][i % this.size[2]] = val;
            return acc;
        }, Array.from({ length: this.size[0] }, () => Array.from({ length: this.size[1] }, () => Array(this.size[2]).fill(0))));
    }
    getBlock(x, y, z) {
        const index = this.cube[x][y][z];
        return this.palette[index];
    }
    getSize() {
        return this.size;
    }
    getBlockList(ignoredBlocks = ["minecraft:air", "minecraft:structure_block"]) {
        const blockCounter = {};
        let i = -2;
        const blockArray = this.blocks;
        this.palette.forEach((block) => {
            i++;
            let name = block["name"];
            if (!ignoredBlocks.includes(name)) {
                if (name in this.blockNames) {
                    let variant = "default";
                    for (const state in block["states"]) {
                        if (state in this.nbtDefs && this.nbtDefs[state] === "variant" && block["states"][state] in this.blockNames[name]) {
                            variant = block["states"][state];
                        }
                    }
                    try {
                        name = this.blockNames[name][variant];
                    }
                    catch (error) {
                        console.log(name, variant);
                    }
                }
                if (!(name in blockCounter)) {
                    blockCounter[name] = 0;
                }
                blockCounter[name] += blockArray.filter(x => x === i).length;
            }
        });
        return blockCounter;
    }
}
class CombinedStructures {
    nbtDefs;
    blockNames;
    structs;
    maxs;
    mins;
    palette;
    size;
    blocks;
    constructor(fileList, excludeList = []) {
        this.nbtDefs = JSON.parse(fs.readFileSync("lookups/nbt_defs.json", 'utf8'));
        this.blockNames = JSON.parse(fs.readFileSync("lookups/material_list_names.json", 'utf8'));
        this.structs = {};
        this.maxs = [-2147483647, -2147483647, -2147483647];
        this.mins = [2147483647, 2147483647, 2147483647];
        this.palette = [{ "name": "minecraft:air", "states": [], "version": "17959425" }];
        fileList.forEach((file) => {
            this.structs[file] = {};
            this.structs[file]["nbt"] = NBT.read(file);
            if ("" in this.structs[file]["nbt"]) {
                this.structs[file]["nbt"] = this.NBTfile[""];
            }
            this.structs[file]["blocks"] = this.structs[file]["nbt"]["structure"]["block_indices"][0].map((x) => parseInt(x));
            this.structs[file]["size"] = this.structs[file]["nbt"]["size"].map((x) => parseInt(x));
            this.structs[file]["palette"] = this.structs[file]["nbt"]["structure"]["palette"]["default"]["block_palette"];
            let indexOfAir = 0;
            for (let i = 0; i < this.structs[file]["palette"].length; i++) {
                if (this.structs[file]["palette"][i]["name"] === "minecraft:air") {
                    indexOfAir = i;
                }
            }
            this.structs[file]["mins"] = this.structs[file]["nbt"]["structure_world_origin"].map((x) => parseInt(x));
            this.structs[file]["maxs"] = this.structs[file]["mins"].map((x, i) => x + this.structs[file]["size"][i]);
            this.maxs = this.maxs.map((x, i) => Math.max(x, this.structs[file]["maxs"][i]));
            this.mins = this.mins.map((x, i) => Math.min(x, this.structs[file]["mins"][i]));
            this.structs[file]["blocks"] = this.structs[file]["blocks"].map(x => x + this.palette.length);
            this.structs[file]["blocks"] = this.structs[file]["blocks"].map(x => x === indexOfAir + this.palette.length ? 0 : x);
            this.palette = this.palette.concat(this.structs[file]["palette"]);
        });
        this.size = this.maxs.map((x, i) => x - this.mins[i]);
        this.blocks = Array.from({ length: this.size[0] }, () => Array.from({ length: this.size[1] }, () => Array(this.size[2]).fill(0)));
        fileList.forEach((file) => {
            embed(this.structs[file]["blocks"], this.blocks, this.structs[file]["mins"].map((x, i) => x - this.mins[i]));
        });
        this.blocks = this.blocks.map(row => row.reverse()).reverse();
    }
    getLayerBlocks(y) {
        const lb = this.blocks.map(row => row[y]);
        return lb.map((row, i) => row.map((val, j) => val > 0 ? [i, j] : []).filter(coords => coords.length > 0)).flat();
    }
    getBlock(x, y, z) {
        const index = this.blocks[x][y][z];
        return this.palette[index];
    }
    getSize() {
        return this.size;
    }
    getBlockList(ignoredBlocks = ["minecraft:air"]) {
        const blockCounter = {};
        let i = -2;
        const blockArray = this.blocks.flat();
        this.palette.forEach((block) => {
            i++;
            let name = block["name"];
            if (!ignoredBlocks.includes(name)) {
                if (name in this.blockNames) {
                    let variant = "default";
                    for (const state in block["states"]) {
                        if (state in this.nbtDefs && this.nbtDefs[state] === "variant" && block["states"][state] in this.blockNames[name]) {
                            variant = block["states"][state];
                        }
                    }
                    try {
                        name = this.blockNames[name][variant];
                    }
                    catch (error) {
                        console.log(name, variant);
                    }
                }
                if (!(name in blockCounter)) {
                    blockCounter[name] = 0;
                }
                blockCounter[name] += blockArray.filter(x => x === i).length;
            }
        });
        return blockCounter;
    }
}
const testFileNameArray = [];
const excludedBlocks = ["minecraft:structure_block", "minecraft:air"];
const blocksDef = JSON.parse(fs.readFileSync("lookups/material_list_names.json", 'utf8'));
const batchTest = [
    "test_structures\\All Blocks World\\gems and redstone.mcstructure",
    "test_structures\\All Blocks World\\decorative.mcstructure",
    "test_structures\\All Blocks World\\wood.mcstructure",
    "test_structures\\All Blocks World\\Stones.mcstructure"
];
const test = new ProcessStructure(batchTest[0]);
const blockList = test.getBlockList(excludedBlocks);
for (const [key, value] of Object.entries(blockList)) {
    console.log(`${key}: ${value}`);
}
for (let x = 0; x < test.size[0]; x++) {
    for (let z = 0; z < test.size[2]; z++) {
        const block = test.getBlock(x, 0, z);
        if (!excludedBlocks.includes(block["name"])) {
            let variant = "default";
            for (const state in block["states"]) {
                if (state in test.nbtDefs && test.nbtDefs[state] === "variant") {
                    variant = block["states"][state];
                }
            }
            if (!(block["name"] in blocksDef)) {
                blocksDef[block["name"]] = {};
            }
            if (!(variant in blocksDef[block["name"]])) {
                const actualName = prompt(`loc: ${x + test.origin[0]}, ${z + test.origin[2]} ${block['name']} - ${variant}:`);
                blocksDef[block["name"]][variant] = actualName;
            }
        }
    }
}
fs.writeFileSync("lookups/material_list_names.json", JSON.stringify(blocksDef));
