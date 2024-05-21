# MIT License

# Copyright (c) 2021 camerin

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

class render_controller:
    def __init__(self):
        self.rc={"format_version": "1.8.0"}
        self.rc["render_controllers"]={}
        self.rcname = "controller.render.armor_stand.ghost_blocks" 
        self.rc["render_controllers"][self.rcname] = {}
        materials = [{"*": "Material.ghost_blocks"}]
        self.rc["render_controllers"][self.rcname]["materials"]=materials
        
        self.geometry= "{}"
        self.textures = "{}"
        self
    def add_model(self,name_raw):
        name=name_raw.replace(" ","_").lower()
        new_geo = "query.get_name == '{}' ? Geometry.ghost_blocks_{} : ({})".format(name_raw,name,"{}")
        self.geometry=self.geometry.format(new_geo)
        new_texture = "query.get_name == '{}' ? Texture.ghost_blocks_{} : ({})".format(name_raw,name,"{}")
        self.textures = self.textures.format(new_texture)
    def export(self, pack_name):
        
        self.geometry = self.geometry.format("Geometry.default")
        self.textures = self.textures.format("Texture.default")
        self.rc["render_controllers"][self.rcname]["geometry"] = self.geometry
        self.rc["render_controllers"][self.rcname]["textures"] = [self.textures]
        
        rc = "armor_stand.ghost_blocks.render_controllers.json"
        rcpath = "{}/render_controllers/{}".format(pack_name, rc)
        os.makedirs(os.path.dirname(rcpath), exist_ok = True)
        
        with open(rcpath, "w+") as json_file:
            json.dump(self.rc, json_file, indent=2)
        
