import * as fs from 'fs';

export class Animations {
    private defaultSize: any;
    private sizing: any;
    private poses: any;

    constructor(pathToDefault: string = "Vanilla_Resource_Pack") {
        this.defaultSize = {
            format_version: "1.8.0",
            animations: {
                "animation.armor_stand.ghost_blocks.scale": {
                    loop: true,
                    bones: {
                        ghost_blocks: { scale: 16.0 }
                    }
                }
            }
        };
        const pathToFile = `${pathToDefault}/animations/armor_stand.animation.json`;
        this.sizing = JSON.parse(fs.readFileSync(pathToFile, 'utf8'));
        this.poses = {
            0: "animation.armor_stand.default_pose",
            1: "animation.armor_stand.no_pose",
            2: "animation.armor_stand.solemn_pose",
            3: "animation.armor_stand.athena_pose",
            4: "animation.armor_stand.brandish_pose",
            5: "animation.armor_stand.honor_pose",
            6: "animation.armor_stand.entertain_pose",
            7: "animation.armor_stand.salute_pose",
            8: "animation.armor_stand.riposte_pose",
            9: "animation.armor_stand.zombie_pose",
            10: "animation.armor_stand.cancan_a_pose",
            11: "animation.armor_stand.cancan_b_pose",
            12: "animation.armor_stand.hero_pose"
        };
    }

    insertLayer(y: number): void {
        const name = `layer_${y}`;
        for (let i = 0; i < 12; i++) {
            if (y % 12 !== i) {
                this.sizing.animations[this.poses[i + 1]].bones[name] = { scale: 0.08 };
            }
        }
    }

    export(packName: string): void {
        const pathToAni = `${packName}/animations/armor_stand.animation.json`;
        try {
            fs.mkdirSync(pathToAni, { recursive: true });
        } catch (err) {
            // handle error
        }
        fs.writeFileSync(pathToAni, JSON.stringify(this.sizing, null, 2));

        const pathToRc = `${packName}/animations/armor_stand.ghost_blocks.scale.animation.json`;
        try {
            fs.mkdirSync(pathToRc, { recursive: true });
        } catch (err) {
            // handle error
        }
        fs.writeFileSync(pathToRc, JSON.stringify(this.defaultSize, null, 2));
    }

    exportBig(packName: string, offset: number[]): void {
        this.defaultSize.animations["animation.armor_stand.ghost_blocks.scale"].bones.ghost_blocks.rotation = [0, "-query.body_y_rotation", 0];
        this.defaultSize.animations["animation.armor_stand.ghost_blocks.scale"].bones.ghost_blocks.position = [
            `(-(query.position(0)-${parseInt(offset[0])})*Math.cos(query.body_y_rotation)-(query.position(2)-${parseInt(offset[2])})*Math.sin(query.body_y_rotation))*16`,
            `(${parseInt(offset[1])}-query.position(1))*16`,
            `((query.position(2)-${parseInt(offset[2])})*Math.cos(query.body_y_rotation)-(query.position(0)-${parseInt(offset[0])})*Math.sin(query.body_y_rotation))*16`
        ];

        const pathToAni = `${packName}/animations/armor_stand.animation.json`;
        try {
            fs.mkdirSync(pathToAni, { recursive: true });
        } catch (err) {
            // handle error
        }
        fs.writeFileSync(pathToAni, JSON.stringify(this.sizing, null, 2));

        const pathToRc = `${packName}/animations/armor_stand.ghost_blocks.scale.animation.json`;
        try {
            fs.mkdirSync(pathToRc, { recursive: true });
        } catch (err) {
            // handle error
        }
        fs.writeFileSync(pathToRc, JSON.stringify(this.defaultSize, null, 2));
    }
}