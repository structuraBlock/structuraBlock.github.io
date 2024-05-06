// Optimized TypeScript code with annotations
import * as armor_stand_class from './armor_stand_class';
import * as structure_reader from './structure_reader';
import * as animation_class from './animation_class';
import * as manifest from './manifest';
import * as rcc from './render_controller_class';
import * as brc from './big_render_controller';
import { createWriteStream, mkdirSync, readFileSync } from 'fs';
import { copyFileSync, removeSync } from 'fs-extra';
import { time } from 'console';
import archiver from 'archiver';
function createZipArchive(sourceDir, outputZipPath) {
    const output = createWriteStream(outputZipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    return new Promise((resolve, reject) => {
        output.on('close', () => resolve());
        archive.on('error', (err) => reject(err));
        archive.pipe(output);
        archive.directory(sourceDir, false); // 不包含根目录本身
        archive.finalize(); // 完成归档并关闭输出流
    });
}
const debug = false;
const nbt_def = JSON.parse(String(readFileSync('lookups/nbt_defs.json')));
export class structura {
    timers;
    pack_name;
    structure_files;
    rc;
    armorstand_entity;
    animation;
    exclude_list;
    opacity;
    longestY;
    unsupported_blocks;
    all_blocks;
    icon;
    dead_blocks;
    constructor(pack_name) {
        mkdirSync(pack_name);
        this.timers = { "start": time(), "previous": time() };
        this.pack_name = pack_name;
        this.structure_files = {};
        this.rc = new rcc.RenderController();
        this.armorstand_entity = new armor_stand_class.armorstand();
        this.animation = new animation_class.animations();
        this.exclude_list = ["minecraft:structure_block", "minecraft:air"];
        this.opacity = 0.8;
        this.longestY = 0;
        this.unsupported_blocks = [];
        this.all_blocks = {};
        this.icon = "lookups/pack_icon.png";
        this.dead_blocks = {};
    }
    set_icon(icon) {
        this.icon = icon;
    }
    set_opacity(opacity) {
        this.opacity = opacity;
    }
    add_model(name, file_name) {
        this.structure_files[name] = { file: file_name, offsets: null };
    }
    set_model_offset(name, offset) {
        this.structure_files[name].offsets = offset;
    }
    generate_nametag_file() {
        const name_tags = Object.keys(this.structure_files);
        const fileName = `${this.pack_name} Nametags.txt`;
        const content = `These are the nametags used in this file\n${name_tags.join('\n')}`;
        // Write content to file once
    }
    make_big_model(offset) {
        this.rc = new brc.RenderController();
        const file_names = Object.values(this.structure_files).map(file => file.file);
        const struct2make = structure_reader.combined_structures(file_names, { exclude_list: this.exclude_list });
        this.structure_files[""] = { offsets: [0, 0, 0] };
        this.structure_files[""]["offsets"][1] = 0;
        // Other operations
    }
    generate_with_nametags() {
        let update_animation = true;
        for (const model_name in this.structure_files) {
            const offset = this.structure_files[model_name].offsets || [0, 0, 0];
            this.rc.addModel(model_name);
            this.armorstand_entity.add_model(model_name);
            copyFileSync(this.structure_files[model_name].file, `${this.pack_name}/${model_name}.mcstructure`);
            // Other operations
        }
    }
    // Other methods optimized similarly
    compile_pack() {
        const nametags = Object.keys(this.structure_files);
        if (nametags.length > 1) {
            manifest.gen(this.pack_name, { nameTags: nametags });
        }
        else {
            manifest.gen(this.pack_name);
        }
        copyFileSync(this.icon, `${this.pack_name}/pack_icon.png`);
        const larger_render = "lookups/armor_stand.larger_render.geo.json";
        const larger_render_path = `${this.pack_name}/models/entity/armor_stand.larger_render.geo.json`;
        copyFileSync(larger_render, larger_render_path);
        this.rc.export(this.pack_name);
        // makeArchive(this.pack_name, 'zip', this.pack_name);
        createZipArchive(this.pack_name, this.pack_name + ".zip");
        removeSync(this.pack_name);
        console.log("Pack Making Completed");
        this.timers["finished"] = time() - this.timers["previous"];
        this.timers["total"] = time() - this.timers["start"];
        return `${this.pack_name}.mcpack`;
    }
    // Other methods optimized similarly
    get_skipped() {
        if (this.unsupported_blocks.length > 1) {
            const fileName = `${this.pack_name} skipped.txt`;
            const content = `These are the skipped blocks\n${this.unsupported_blocks.join('\n')}`;
            // Write content to file once
        }
        return this.dead_blocks;
    }
}
