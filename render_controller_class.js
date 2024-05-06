import * as fs from 'fs';
import * as path from 'path';
export class RenderController {
    rc;
    geometry;
    textures;
    rcname;
    constructor() {
        this.rc = {
            "format_version": "1.8.0",
            "render_controllers": {}
        };
        this.rcname = "controller.render.armor_stand.ghost_blocks";
        this.rc["render_controllers"][this.rcname] = {};
        const materials = [{ "*": "Material.ghost_blocks" }];
        this.rc["render_controllers"][this.rcname]["materials"] = materials;
        this.geometry = {};
        this.textures = {};
    }
    addModel(nameRaw) {
        const name = nameRaw.replace(" ", "_").toLowerCase();
        const newGeo = `query.get_name == '${nameRaw}' ? Geometry.ghost_blocks_${name} : ({})`;
        this.geometry[name] = newGeo;
        const newTexture = `query.get_name == '${nameRaw}' ? Texture.ghost_blocks_${name} : ({})`;
        this.textures[name] = newTexture;
    }
    export(packName) {
        this.geometry["default"] = "Geometry.default";
        this.textures["default"] = "Texture.default";
        this.rc["render_controllers"][this.rcname]["geometry"] = this.geometry;
        this.rc["render_controllers"][this.rcname]["textures"] = [this.textures];
        const rc = "armor_stand.ghost_blocks.render_controllers.json";
        const rcPath = path.join(packName, "render_controllers", rc);
        fs.mkdirSync(path.dirname(rcPath), { recursive: true });
        fs.writeFileSync(rcPath, JSON.stringify(this.rc, null, 2));
    }
}
// Example usage:
const controller = new RenderController();
controller.addModel("Example Model");
controller.export("example_pack");
