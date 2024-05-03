
import { read } from "nbtify";
import { readFileSync } from "fs";

import {argwhere, array, countNonZero, flip, int32, maximum, minimum, zeros} from "numpy";


let loaded = {};

function embed(smallArray, bigArray, loc) {
    const [xstart, ystart, zstart] = loc;
    const [xstop, ystop, zstop] = [
        xstart + smallArray.shape[0],
        ystart + smallArray.shape[1],
        zstart + smallArray.shape[2],
    ];

    bigArray.set(smallArray, [xstart, ystart, zstart], [xstop, ystop, zstop]);
}

class ProcessStructure {
    constructor(file) {
        global.loaded = this.NBTfile;

        const nbtDefs = JSON.parse(readFileSync('lookups/nbt_defs.json', 'utf8'));
        const blockNames = JSON.parse(readFileSync('lookups/material_list_names.json', 'utf8'));

        if (typeof file === 'object') { // buffer
            this.NBTfile = file;
        } else {
            this.NBTfile = read(readFileSync(file));
        }

        if (this.NBTfile.keys().includes('')) {
            this.NBTfile = this.NBTfile[''];
        }

        this.blocks = this.NBTfile['structure']['block_indices'][0].map(Number);
        this.size = this.NBTfile['size'].map(Number);
        this.palette = this.NBTfile['structure']['palette']['default']['block_palette'];
        this.mins = array(this.NBTfile['structure_world_origin']).map(Number);
        this.maxs = this.mins.add(array(this.size).subtract(1));
        this.origin = this.mins;
        this.getBlockmap();
    }

    getLayerBlocks(y) {
        const lb = this.cube.slice(null, null, y);
        return argwhere(lb.greater(0));
    }

    getBlockmap() {
        let indexOfAir = 0;

        for (let i = 0; i < this.palette.length; i++) {
            if (this.palette[i]['name'] === 'minecraft:air') {
                indexOfAir = i;
                break;
            }
        }

        this.cube = array(this.blocks);
        this.cube = this.cube.add(1);
        this.palette.unshift({ name: 'minecraft:air', states: [] });
        this.cube = this.cube.where(this.cube.eq(indexOfAir + 1), 0);
        this.cube = this.cube.reshape(this.size);
    }

    getBlock(x, y, z) {
        const index = this.cube.get([x, y, z]);
        return this.palette[index];
    }

    getSize() {
        return this.size;
    }

    getBlockList(ignoredBlocks = ['minecraft:air', 'minecraft:structure_block']) {
        const blockCounter = {};
        let i = -2;
        const blockArray = array(this.blocks);

        for (const block of this.palette) {
            i++;
            const name = block['name'];

            if (!ignoredBlocks.includes(name)) {
                let variant = 'default';

                for (const [state, value] of Object.entries(block['states'])) {
                    if (state in this.nbtDefs && this.nbtDefs[state] === 'variant') {
                        if (value in this.blockNames[name]) {
                            variant = value;
                        }
                    }
                }

                try {
                    name = this.blockNames[name][variant];
                } catch (e) {
                    console.log(name, variant);
                }

                if (!(name in blockCounter)) {
                    blockCounter[name] = 0;
                }

                blockCounter[name] += countNonZero(blockArray.eq(i));
            }
        }

        return blockCounter;
    }
}

class CombinedStructures {
    constructor(fileList, excludeList = []) {
        const nbtDefs = JSON.parse(fs.readFileSync('lookups/nbt_defs.json', 'utf8'));
        const blockNames = JSON.parse(fs.readFileSync('lookups/material_list_names.json', 'utf8'));

        this.structs = {};
        this.maxs = array([-2147483647, -2147483647, -2147483647], int32);
        this.mins = array([2147483647, 2147483647, 2147483647], int32);
        this.palette = [{ name: 'minecraft:air', states: [], version: '17959425' }];

        for (const file of fileList) {
            this.structs[file] = {
                nbt: load(file, { byteorder: 'little' }),
                blocks: array(this.structs[file]['nbt']['structure']['block_indices'][0]).map(Number),
                size: array(this.structs[file]['nbt']['size']).map(Number),
                palette: this.structs[file]['nbt']['structure']['palette']['default']['block_palette'],
                mins: array(this.structs[file]['nbt']['structure_world_origin']).map(Number),
                maxs: this.structs[file]['mins'].add(this.structs[file]['size']),
            };

            let indexOfAir = 0;

            for (let i = 0; i < this.structs[file]['palette'].length; i++) {
                if (this.structs[file]['palette'][i]['name'] === 'minecraft:air') {
                    indexOfAir = i;
                }
            }

            this.maxs = maximum(this.maxs, this.structs[file]['maxs']);
            this.mins = minimum(this.mins, this.structs[file]['mins']);

            this.structs[file]['blocks'] = this.structs[file]['blocks'].reshape(this.structs[file]['size']);
            this.structs[file]['blocks'] = this.structs[file]['blocks'].add(this.palette.length);
            this.structs[file]['blocks'] = this.structs[file]['blocks'].where(this.structs[file]['blocks'].eq(indexOfAir + this.palette.length), 0);

            this.palette.push(...this.structs[file]['palette']);
        }

        this.size = this.maxs.subtract(this.mins);
        this.blocks = zeros(this.size, int32);

        for (const file of fileList) {
            embed(this.structs[file]['blocks'], this.blocks, this.structs[file]['mins'].subtract(this.mins));
        }

        this.blocks = flip(this.blocks, 0);
        this.blocks = flip(this.blocks, 2);

        this.getBlock = (x, y, z) => {
            const index = this.blocks.get([x, y, z]);
            return this.palette[index];
        };

        this.getSize = () => this.size;

        this.getBlockList = (ignoredBlocks = ['minecraft:air']) => {
            const blockCounter = {};
            let i = -2;
            const blockArray = array(this.blocks);

            for (const block of this.palette) {
                i++;
                const name = block['name'];

                if (!ignoredBlocks.includes(name)) {
                    let variant = 'default';

                    for (const [state, value] of Object.entries(block['states'])) {
                        if (state in this.nbtDefs && this.nbtDefs[state] === 'variant') {
                            if (value in this.blockNames[name]) {
                                variant = value;
                            }
                        }
                    }

                    try {
                        name = this.blockNames[name][variant];
                    } catch (e) {
                        console.log(name, variant);
                    }

                    if (!(name in blockCounter)) {
                        blockCounter[name] = 0;
                    }

                    blockCounter[name] += countNonZero(blockArray.eq(i));
                }
            }

            return blockCounter;
        };
    }
}

// (async () => {
    const testFileNameArray = [];
    const excludedBlocks = ['minecraft:structure_block', 'minecraft:air'];

    const blocksDef = JSON.parse(await fs.readFile('lookups/material_list_names.json', 'utf8'));

    const batchTest = [];
    const testFileName = 'test_structures\\All Blocks World\\gems and redstone.mcstructure';
    batchTest.push(testFileName);

    // ... (remaining file names)

    // const test = new CombinedStructures(batchTest, excludedBlocks);

    const test = new ProcessStructure(testFileName);
    const bllist = test.getBlockList(ignoredBlocks = excludedBlocks);

    for (let x = 0; x < test.size[0]; x++) {
        for (let z = 0; z < test.size[2]; z++) {
            const block = test.getBlock(x, 0, z);

            if (!excludedBlocks.includes(block['name'])) {
                let variant = 'default';

                for (const [state, value] of Object.entries(block['states'])) {
                    if (state in test.nbtDefs && test.nbtDefs[state] === 'variant') {
                        variant = value;
                    }
                }

                if (!(block['name'] in blocksDef)) {
                    blocksDef[block['name']] = {};
                }

                if (!(variant in blocksDef[block['name']])) {
                    const actualName = prompt(`loc: ${x + test.origin[0]},${z + test.origin[2]} ${block['name']} - ${variant}:`);
                    blocksDef[block['name 
                     //   console.log(`${key}:${value}`);
                    // }
                  
                    for (let x = 0; x < test.size[0]; x++) {
                      for (let z = 0; z < test.size[2]; z++) {
                        const block = test.get_block(x, 0, z);
                  
                        if (!excludedBlocks.includes(block['name'])) {
                          let variant = 'default';
                          for (const state in block['states'].keys()) {
                            if (state in test.nbt_defs.keys()) {
                              if (test.nbt_defs[state] === 'variant') {
                                variant = block['states'][state];
                              }
                            }
                          }
                  
                          if (!blocks_def.hasOwnProperty(block['name'])) {
                            blocks_def[block['name']] = {};
                          }
                  
                          if (!blocks_def[block['name']].hasOwnProperty(variant)) {
                            const actual_name = await prompt(`loc: ${x + test.origin[0]},${z + test.origin[2]} ${block['name']} - ${variant}:`);
                            blocks_def[block['name']][variant] = actual_name;
                          }
                        }
                      }
                    }
                  
                    await fs.writeFile('lookups/material_list_names.json', JSON.stringify(blocks_def), 'utf-8');
                  
                    // console.log(test.size);
                    // await prompt('');
                    // console.log(test.size);
                    // console.log(test.get_block_list(ignored_blocks = excludedBlocks));
                  })();