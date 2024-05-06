export class RenderController {
    rc;
    rcname;
    geometry;
    textures;
    constructor() {
        this.rc = { "format_version": "1.8.0", "render_controllers": {} };
        this.rcname = "controller.render.armor_stand.ghost_blocks";
        this.rc["render_controllers"][this.rcname] = {};
        const materials = [{ "*": "Material.ghost_blocks" }];
        this.rc["render_controllers"][this.rcname]["materials"] = materials;
        this.rc["render_controllers"][this.rcname]["arrays"] = { "geometries": {} };
        this.rc["render_controllers"][this.rcname]["arrays"]["geometries"]["array.ghost_geo"] = ["geometry.default"];
        this.geometry = "array.ghost_geo[ variable.armor_stand.pose_index ]";
        this.textures = ["variable.armor_stand.pose_index != 0 ? Texture.ghost_blocks_1 : (Texture.default)"];
    }
    addGeometry(name) {
        name = `geometry.ghost_blocks_${name}`;
        this.rc["render_controllers"][this.rcname]["arrays"]["geometries"]["array.ghost_geo"].push(name);
    }
    export(packName) {
        this.rc["render_controllers"][this.rcname]["geometry"] = this.geometry;
        this.rc["render_controllers"][this.rcname]["textures"] = this.textures;
        const rc = "armor_stand.ghost_blocks.render_controllers.json";
        const rcpath = `${packName}/render_controllers/${rc}`;
        const fs = require('fs');
        const path = require('path');
        fs.mkdirSync(path.dirname(rcpath), { recursive: true });
        fs.writeFileSync(rcpath, JSON.stringify(this.rc, null, 2));
    }
}
const renderController = new RenderController();
renderController.addGeometry("example");
renderController.export("my_pack");
