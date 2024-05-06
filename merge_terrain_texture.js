import * as fs from 'fs';
const oldblocksFile = "Vanilla_Resource_Pack\\blocks.json";
const newblocksFile = "Vanilla_Resource_Pack\\blocks17.json";
const oldTerrainTexture = "Vanilla_Resource_Pack\\textures\\terrain_texture.json";
const newTerrainTexture = "Vanilla_Resource_Pack\\textures\\terrain_texture17.json";
const oldDefsFile = "lookups\\block_definition.json";
// Read data from files
const oldData = JSON.parse(fs.readFileSync(oldTerrainTexture, 'utf8'));
const newData = JSON.parse(fs.readFileSync(newTerrainTexture, 'utf8'));
const blockDef = JSON.parse(fs.readFileSync(oldDefsFile, 'utf8'));
const oldBlocks = JSON.parse(fs.readFileSync(oldblocksFile, 'utf8'));
const newBlocks = JSON.parse(fs.readFileSync(newblocksFile, 'utf8'));
// Find new keys, textures, and definitions using set operations
const oldKeys = new Set(Object.keys(oldData["texture_data"]));
const newKeys = new Set(Object.keys(newData["texture_data"]));
const oldDefs = new Set(Object.keys(blockDef));
const newBlockskeys = Object.keys(newBlocks).filter(key => !oldBlocks[key]);
const newTextures = [...newKeys].filter(key => !oldKeys.has(key));
const newDefinitions = [...newKeys].filter(key => !oldDefs.has(key));
// Update data based on new elements
for (const key of newTextures) {
    oldData["texture_data"][key] = newData["texture_data"][key];
}
for (const key of newBlockskeys) {
    blockDef[key] = "cube";
    oldBlocks[key] = newBlocks[key];
    console.log(key);
}
// Write updated data back to files
fs.writeFileSync(oldTerrainTexture, JSON.stringify(oldData, null, 4));
fs.writeFileSync(oldDefsFile, JSON.stringify(blockDef, null, 4));
fs.writeFileSync(oldblocksFile, JSON.stringify(oldBlocks, null, 4));
