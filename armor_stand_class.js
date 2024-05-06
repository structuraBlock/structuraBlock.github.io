import * as fs from 'fs';
class ArmorStand {
    stand;
    geos;
    textures;
    constructor() {
        this.stand = { "format_version": "1.10.0", "minecraft:client_entity": {} };
        this.stand["minecraft:client_entity"]["description"] = {
            "identifier": "minecraft:armor_stand",
            "min_engine_version": "1.8.0",
            "materials": {
                "default": "armor_stand",
                "ghost_blocks": "entity_alphablend"
            },
            "animations": {
                "default_pose": "animation.armor_stand.default_pose",
                "no_pose": "animation.armor_stand.no_pose",
                "solemn_pose": "animation.armor_stand.solemn_pose",
                "athena_pose": "animation.armor_stand.athena_pose",
                "brandish_pose": "animation.armor_stand.brandish_pose",
                "honor_pose": "animation.armor_stand.honor_pose",
                "entertain_pose": "animation.armor_stand.entertain_pose",
                "salute_pose": "animation.armor_stand.salute_pose",
                "riposte_pose": "animation.armor_stand.riposte_pose",
                "zombie_pose": "animation.armor_stand.zombie_pose",
                "cancan_a_pose": "animation.armor_stand.cancan_a_pose",
                "cancan_b_pose": "animation.armor_stand.cancan_b_pose",
                "hero_pose": "animation.armor_stand.hero_pose",
                "wiggle": "animation.armor_stand.wiggle",
                "controller.pose": "controller.animation.armor_stand.pose",
                "controller.wiggling": "controller.animation.armor_stand.wiggle",
                "scale": "animation.armor_stand.ghost_blocks.scale"
            },
            "scripts": {
                "initialize": [
                    "variable.armor_stand.pose_index = 0;",
                    "variable.armor_stand.hurt_time = 0;"
                ],
                "animate": [
                    "controller.pose",
                    "controller.wiggling",
                    "scale"
                ]
            },
            "render_controllers": [
                "controller.render.armor_stand",
                "controller.render.armor_stand.ghost_blocks"
            ],
            "enable_attachables": true
        };
        this.geos = { "default": "geometry.armor_stand.larger_render" };
        this.textures = { "default": "textures/entity/armor_stand" };
    }
    addModel(name) {
        const progName = `ghost_blocks_${name.replace(" ", "_").toLowerCase()}`;
        this.geos[progName] = `geometry.armor_stand.${progName}`;
        this.textures[progName] = `textures/entity/${progName}`;
    }
    export(packName) {
        this.stand["minecraft:client_entity"]["description"]["textures"] = this.textures;
        this.stand["minecraft:client_entity"]["description"]["geometry"] = this.geos;
        const path = `${packName}/entity/armor_stand.entity.json`;
        fs.mkdirSync(path, { recursive: true });
        fs.writeFileSync(path, JSON.stringify(this.stand, null, 2));
    }
    exportBig(packName) {
        this.export(packName);
    }
}
const armorStand = new ArmorStand();
armorStand.addModel("ExampleModel");
armorStand.export("examplePack");
armorStand.exportBig("bigExamplePack");
