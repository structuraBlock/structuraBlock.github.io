import * as structura_core from './structura_core';
import * as fs from 'fs';

// structura_core.debug = true;

const files_to_convert = {
    "gems": { "file": "test_structures/All Blocks World/gems and redstone.mcstructure", "offset": [-32, 0, -32] },
    "stone": { "file": "test_structures/All Blocks World/Stones.mcstructure", "offset": [-30, 0, -32] },
    "wood": { "file": "test_structures/All Blocks World/wood.mcstructure", "offset": [-31, 0, -31] },
    "decor": { "file": "test_structures/All Blocks World/decorative.mcstructure", "offset": [-32, 0, -31] },
    "wood2": { "file": "test_structures/All Blocks World/wood2.mcstructure", "offset": [-32, 0, -31] }
};

try {
    fs.rmdirSync("tmp", { recursive: true });
} catch (err) {
    // Directory does not exist
}

if (fs.existsSync("tmp/all_blocks.mcpack")) {
    fs.unlinkSync("tmp/all_blocks.mcpack");
}

if (fs.existsSync("tmp/all_blocks Nametags.txt")) {
    fs.unlinkSync("tmp/all_blocks Nametags.txt");
}

const structura_base = new structura_core.structura("tmp/all_blocks");
structura_base.set_opacity(20);

for (const [nameTag, info] of Object.entries(files_to_convert)) {
    console.log(`${nameTag}, ${info}`);
    
    structura_base.add_model(nameTag, info["file"]);
    structura_base.set_model_offset(nameTag, info["offset"]);
}

structura_base.generate_nametag_file();
structura_base.generate_with_nametags();
console.log(structura_base.compile_pack());
// console.log(structura_base.make_nametag_block_lists());