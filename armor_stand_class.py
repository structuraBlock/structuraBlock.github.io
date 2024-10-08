# MIT License

# Copyright (c) 2021 camerin & DrAv0011

# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:

# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.

# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

import json
import os


class armorstand:
    def __init__(self):
        self.stand = {"format_version": "1.10.0"}
        self.stand["minecraft:client_entity"] = {}
        ##sorry about this dump... it is just copied over...
        desc={"identifier": "minecraft:armor_stand",
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
            "enable_attachables": True
            }
        self.stand["minecraft:client_entity"]["description"]=desc
        self.geos = {"default": "geometry.armor_stand.larger_render"}
        self.textures =  {"default": "textures/entity/armor_stand"}
    def add_model(self, name):
        prog_name = "ghost_blocks_{}".format(name.replace(" ","_").lower())
        self.geos[prog_name] = "geometry.armor_stand.{}".format(prog_name)
        self.textures[prog_name] = "textures/entity/{}".format(prog_name)

    def export(self, pack_name):
        self.stand["minecraft:client_entity"]["description"]["textures"] = self.textures
        self.stand["minecraft:client_entity"]["description"]["geometry"] = self.geos

        path = "{}/entity/armor_stand.entity.json".format(pack_name)
        os.makedirs(os.path.dirname(path), exist_ok = True)
        
        with open(path, "w+") as json_file:
            json.dump(self.stand, json_file, indent=2)
    def export_big(self, pack_name):
        self.stand["minecraft:client_entity"]["description"]["textures"] = self.textures
        self.stand["minecraft:client_entity"]["description"]["geometry"] = self.geos

        path = "{}/entity/armor_stand.entity.json".format(pack_name)
        os.makedirs(os.path.dirname(path), exist_ok = True)
        
        with open(path, "w+") as json_file:
            json.dump(self.stand, json_file, indent=2)
    
