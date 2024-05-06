import * as fs from 'fs';
import * as path from 'path';
import { Image } from 'image-js';
import { array, ones, uint8, zeros } from 'numpy';
import * as copy from 'copy';
import * as time from 'time';
const debug = false;
class ArmorStandGeo {
    refResourcePack;
    blocksDef;
    terrainTexture;
    blockRotations;
    blockVariants;
    defs;
    blockShapes;
    blockUV;
    name;
    stand;
    offsets;
    alpha;
    textureList;
    geometry;
    uvMap;
    blocks;
    size;
    bones;
    errors;
    layers;
    uvArray;
    preGenBlocks;
    excluded;
    constructor(name, alpha = 0.8, offsets = [0, 0, 0], size = [64, 64, 64], refPack = "Vanilla_Resource_Pack") {
        this.refResourcePack = refPack;
        this.blocksDef = JSON.parse(fs.readFileSync(path.join(this.refResourcePack, 'blocks.json'), 'utf8'));
        this.terrainTexture = JSON.parse(fs.readFileSync(path.join(this.refResourcePack, 'textures/terrain_texture.json'), 'utf8'));
        this.blockRotations = JSON.parse(fs.readFileSync('lookups/block_rotation.json', 'utf8'));
        this.blockVariants = JSON.parse(fs.readFileSync('lookups/variants.json', 'utf8'));
        this.defs = JSON.parse(fs.readFileSync('lookups/block_definition.json', 'utf8'));
        this.blockShapes = JSON.parse(fs.readFileSync('lookups/block_shapes.json', 'utf8'));
        this.blockUV = JSON.parse(fs.readFileSync('lookups/block_uv.json', 'utf8'));
        this.name = name.replace(" ", "_").toLowerCase();
        this.stand = {};
        this.offsets = offsets;
        this.offsets[0] += 8;
        this.offsets[2] += 7;
        this.alpha = alpha;
        this.textureList = [];
        this.geometry = {};
        this.uvMap = {};
        this.blocks = {};
        this.size = size;
        this.bones = [];
        this.errors = {};
        this.layers = [];
        this.uvArray = null;
        this.preGenBlocks = {};
        this.excluded = ["air", "structure_block"];
    }
    export(packFolder) {
        let start = time.time();
        this.addBlocksToBones();
        this.geometry.description.texture_height = Object.keys(this.uvMap).length;
        this.stand['minecraft:geometry'] = [this.geometry];
        let pathToGeo = `${packFolder}/models/entity/armor_stand.ghost_blocks_${this.name}.geo.json`;
        fs.mkdirSync(path.dirname(pathToGeo), { recursive: true });
        let i = 0;
        for (let index = 0; index < this.stand['minecraft:geometry'][0]['bones'].length; index++) {
            if (!this.stand['minecraft:geometry'][0]['bones'][index].hasOwnProperty('name')) {
                this.stand['minecraft:geometry'][0]['bones'][index]['name'] = `empty_row+${i}`;
                this.stand['minecraft:geometry'][0]['bones'][index]['parent'] = 'ghost_blocks';
                this.stand['minecraft:geometry'][0]['bones'][index]['pivot'] = [0.5, 0.5, 0.5];
                i++;
            }
        }
        start = time.time();
        fs.writeFileSync(pathToGeo, JSON.stringify(this.stand));
        let textureName = `${packFolder}/textures/entity/ghost_blocks_${this.name}.png`;
        fs.mkdirSync(path.dirname(textureName), { recursive: true });
        this.saveUV(textureName);
    }
    exportBig(packFolder) {
        this.stand['minecraft:geometry'] = [];
        let size = this.size.map(Number);
        let geometries = {};
        geometries['default'] = {};
        geometries['default']['description'] = {
            identifier: 'geometry.armor_stand.default',
            texture_width: 1,
            texture_height: 1,
            visible_bounds_width: 5120,
            visible_bounds_height: 5120,
            visible_bounds_offset: [0, 1.5, 0]
        };
        geometries['default']['bones'] = [{
                name: 'ghost_blocks',
                pivot: [-8, 0, 8],
                origin: [0, 0, 0]
            }];
        let defaultGeo = [{
                size: size,
                uv: {
                    north: { uv: [0, 0], uv_size: [1, 1] },
                    east: { uv: [0, 0], uv_size: [1, 1] },
                    south: { uv: [0, 0], uv_size: [1, 1] },
                    west: { uv: [0, 0], uv_size: [1, 1] },
                    up: { uv: [1, 1], uv_size: [-1, -1] },
                    down: { uv: [1, 1], uv_size: [-1, -1] }
                }
            }, {
                size: size,
                uv: {
                    north: { uv: [0, 3], uv_size: [1, -1] },
                    east: { uv: [0, 3], uv_size: [1, -1] },
                    south: { uv: [0, 3], uv_size: [1, -1] },
                    west: { uv: [0, 3], uv_size: [1, -1] },
                    up: { uv: [0, 1], uv_size: [1, -1] },
                    down: { uv: [0, 3], uv_size: [1, -1] }
                }
            }];
        geometries['default']['bones'][0]['cubes'] = defaultGeo;
        for (let i = 0; i < this.layers.length; i++) {
            let layerName = this.layers[i];
            geometries[layerName] = {};
            geometries[layerName]['description'] = {
                identifier: `geometry.armor_stand.ghost_blocks_${i}`,
                texture_width: 1,
                texture_height: Object.keys(this.uvMap).length,
                visible_bounds_width: 5120,
                visible_bounds_height: 5120,
                visible_bounds_offset: [0, 1.5, 0]
            };
            geometries[layerName]['bones'] = [{
                    name: 'ghost_blocks',
                    pivot: [0, 0, 0]
                }, {
                    name: `layer_${i}`,
                    parent: 'ghost_blocks',
                    pivot: [0, 0, 0]
                }];
        }
        for (let key in this.blocks) {
            let layerName = this.blocks[key]['parent'];
            geometries[layerName]['bones'].push(this.blocks[key]);
        }
        this.stand['minecraft:geometry'].push(geometries['default']);
        for (let layerName of this.layers) {
            this.stand['minecraft:geometry'].push(geometries[layerName]);
        }
        let pathToGeo = `${packFolder}/models/entity/armor_stand.ghost_blocks_${this.name}.geo.json`;
        fs.mkdirSync(path.dirname(pathToGeo), { recursive: true });
        fs.writeFileSync(pathToGeo, JSON.stringify(this.stand, null, 2));
        for (let i = 0; i < this.layers.length; i++) {
            let textureName = `${packFolder}/textures/entity/ghost_blocks_${i}.png`;
            fs.mkdirSync(path.dirname(textureName), { recursive: true });
            this.saveUV(textureName);
        }
    }
    makeLayer(y) {
        let layerName = `layer_${y}`;
        this.geometry['bones'].push({
            name: layerName,
            parent: 'ghost_blocks'
        });
    }
    makeBlock(x, y, z, blockName, rot = null, top = false, data = 0, trapOpen = false, parent = null, variant = 'default', big = false) {
        let blockType = this.defs[blockName];
        if (blockType !== 'ignore') {
            let ghostBlockName = `block_${x}_${y}_${z}`;
            this.blocks[ghostBlockName] = {};
            this.blocks[ghostBlockName]['name'] = ghostBlockName;
            let layerName = `layer_${y % 12}`;
            if (!this.layers.includes(layerName)) {
                this.layers.push(layerName);
            }
            this.blocks[ghostBlockName]['parent'] = layerName;
            blockType = this.defs[blockName];
            let shapeVariant = 'default';
            if (blockType === 'hopper' && rot !== 0) {
                shapeVariant = 'side';
            }
            else if (blockType === 'trapdoor' && trapOpen) {
                shapeVariant = 'open';
            }
            else if (blockType === 'lever' && trapOpen) {
                shapeVariant = 'on';
            }
            else if (top) {
                shapeVariant = 'top';
            }
            if (data !== 0 && debug) {
                console.log(data);
            }
            let blockShapes = this.blockShapes[blockType][shapeVariant];
            this.blocks[ghostBlockName]['pivot'] = [
                blockShapes['center'][0] - (x + this.offsets[0]),
                y + blockShapes['center'][1] + this.offsets[1],
                z + blockShapes['center'][2] + this.offsets[2]
            ];
            this.blocks[ghostBlockName]['inflate'] = -0.03;
            let blockUV = this.blockUV[blockType]['default'];
            if (shapeVariant in this.blockUV[blockType]) {
                blockUV = this.blockUV[blockType][shapeVariant];
            }
            if (data.toString() in this.blockUV[blockType]) {
                shapeVariant = data.toString();
            }
            if (data.toString() in this.blockShapes[blockType]) {
                blockShapes = this.blockShapes[blockType][data.toString()];
            }
            if (blockType in this.blockRotations && rot !== null) {
                this.blocks[ghostBlockName]['rotation'] = copy.deepcopy(this.blockRotations[blockType][rot.toString()]);
                if (big) {
                    this.blocks[ghostBlockName]['rotation'][1] += 180;
                }
            }
            else {
                if (debug) {
                    console.log(`no rotation for block type ${blockType} found`);
                }
            }
            this.blocks[ghostBlockName]['cubes'] = [];
            let uvIdx = 0;
            for (let i = 0; i < blockShapes['size'].length; i++) {
                let uv = this.blockNameToUV(blockName, variant, shapeVariant, i);
                let block = {};
                if (blockUV['uv_sizes']['up'].length > i) {
                    uvIdx = i;
                }
                let xOff = 0;
                let yOff = 0;
                let zOff = 0;
                if ('offsets' in blockShapes) {
                    xOff = blockShapes['offsets'][i][0];
                    yOff = blockShapes['offsets'][i][1];
                    zOff = blockShapes['offsets'][i][2];
                }
                block['origin'] = [
                    -1 * (x + this.offsets[0]) + xOff,
                    y + yOff + this.offsets[1],
                    z + zOff + this.offsets[2]
                ];
                block['size'] = blockShapes['size'][i];
                if ('rotation' in blockShapes) {
                    block['rotation'] = blockShapes['rotation'][i];
                }
                let blockUV = copy.deepcopy(uv);
                for (let dir of ['up', 'down', 'east', 'west', 'north', 'south']) {
                    blockUV[dir]['uv'][0] += blockUV['offset'][dir][uvIdx][0];
                    blockUV[dir]['uv'][1] += blockUV['offset'][dir][uvIdx][1];
                    blockUV[dir]['uv_size'] = blockUV['uv_sizes'][dir][uvIdx];
                }
                block['uv'] = blockUV;
                this.blocks[ghostBlockName]['cubes'].push(block);
            }
        }
    }
    saveUV(name) {
        if (this.uvArray === null) {
            console.log('No Blocks Were found');
        }
        else {
            let im = new Image({ data: this.uvArray });
            im.save(name);
        }
    }
    standInit() {
        this.stand['format_version'] = '1.16.0';
        this.geometry['description'] = {
            identifier: `geometry.armor_stand.ghost_blocks_${this.name}`,
            texture_width: 1,
            visible_bounds_offset: [0.0, 1.5, 0.0],
            visible_bounds_width: 5120,
            visible_bounds_height: 5120
        };
        this.geometry['bones'] = [
            { name: 'ghost_blocks', pivot: [-8, 0, 8] }
        ];
        this.stand['minecraft:geometry'] = [this.geometry];
    }
    extendUVImage(newImageFilename) {
        let image = Image.load(newImageFilename);
        let impt = array(image);
        let shape = impt.shape;
        if (shape[0] > 16) {
            shape[0] = 16;
            impt = impt.slice(0, 16, null);
        }
        if (shape[1] > 16) {
            shape[1] = 16;
            impt = impt.slice(null, 16, null);
        }
        let imageArray = ones([16, 16, 4], uint8).multiply(255);
        imageArray.slice([0, shape[0]], [0, shape[1]], [0, impt.shape[2]]).assign(impt);
        imageArray.pick(null, null, 3).multiply(this.alpha);
        if (this.uvArray === null) {
            this.uvArray = imageArray;
        }
        else {
            let startShape = this.uvArray.shape;
            let endShape = startShape.slice();
            endShape[0] += imageArray.shape[0];
            let tempNew = zeros(endShape, uint8);
            tempNew.slice([0, startShape[0]], null, null).assign(this.uvArray);
            tempNew.slice([startShape[0], null], null, null).assign(imageArray);
            this.uvArray = tempNew;
        }
    }
    blockNameToUV(blockName, variant = '', shapeVariant = 'default', index = 0, data = 0) {
        let tempUV = {};
        if (!this.excluded.includes(blockName)) {
            let blockType = this.defs[blockName];
            let textureFiles = this.getBlockTexturePaths(blockName, variant);
            let correctedTextures = {};
            if (shapeVariant in this.blockUV[blockType]) {
                if ('overwrite' in this.blockUV[blockType][shapeVariant]) {
                    correctedTextures = this.blockUV[blockType][shapeVariant]['overwrite'];
                }
            }
            else {
                if ('overwrite' in this.blockUV[blockType]['default']) {
                    correctedTextures = this.blockUV[blockType]['default']['overwrite'];
                }
            }
            for (let side in correctedTextures) {
                if (correctedTextures[side].length > index) {
                    if (correctedTextures[side][index] !== 'default') {
                        textureFiles[side] = correctedTextures[side][index];
                        if (debug) {
                            console.log(`${side}: ${textureFiles[side]}`);
                        }
                    }
                }
            }
            for (let key in textureFiles) {
                if (!(textureFiles[key] in this.uvMap)) {
                    this.extendUVImage(path.join(this.refResourcePack, `${textureFiles[key]}.png`));
                    this.uvMap[textureFiles[key]] = Object.keys(this.uvMap).length;
                }
                tempUV[key] = {
                    uv: [0, this.uvMap[textureFiles[key]]],
                    uv_size: [1, 1]
                };
            }
        }
        return tempUV;
    }
    addBlocksToBones() {
        for (let key in this.blocks) {
            this.geometry['bones'].push(this.blocks[key]);
        }
    }
    getBlockTexturePaths(blockName, variant = '') {
        let textureLayout = this.blocksDef[blockName]['textures'];
        let textureData = this.terrainTexture['texture_data'];
        let textures = {};
        if (typeof textureLayout === 'object') {
            if ('side' in textureLayout) {
                textures['east'] = textureLayout['side'];
                textures['west'] = textureLayout['side'];
                textures['north'] = textureLayout['side'];
                textures['south'] = textureLayout['side'];
            }
            if ('east' in textureLayout) {
                textures['east'] = textureLayout['east'];
            }
            if ('west' in textureLayout) {
                textures['west'] = textureLayout['west'];
            }
            if ('north' in textureLayout) {
                textures['north'] = textureLayout['north'];
            }
            if ('south' in textureLayout) {
                textures['south'] = textureLayout['south'];
            }
            if ('down' in textureLayout) {
                textures['down'] = textureLayout['down'];
            }
            if ('up' in textureLayout) {
                textures['up'] = textureLayout['up'];
            }
        }
        else if (typeof textureLayout === 'string') {
            textures['east'] = textureLayout;
            textures['west'] = textureLayout;
            textures['north'] = textureLayout;
            textures['south'] = textureLayout;
            textures['up'] = textureLayout;
            textures['down'] = textureLayout;
        }
        for (let key in textures) {
            if (typeof textureData[textures[key]]['textures'] === 'string') {
                textures[key] = textureData[textures[key]]['textures'];
            }
            else if (Array.isArray(textureData[textures[key]]['textures'])) {
                let index = 0;
                if (variant[0] in this.blockVariants) {
                    index = this.blockVariants[variant[0]][variant[1]];
                }
                if (debug) {
                    console.log(index);
                    console.log(key);
                    console.log(textureData[textures[key]]['textures']);
                    console.log(textureData[textures[key]]['textures'][index]);
                }
                // textures[key] = textureData[textures[key]]['
                textures[key] = textureData[textures[key]]["textures"][index];
            }
        }
        return textures;
    }
}
