import json
import os


class animations:
    def __init__(self, path_to_default="Vanilla_Resource_Pack"):
        self.default_size = {"format_version": "1.8.0",
                             "animations": {
                                 "animation.armor_stand.ghost_blocks.scale": {
                                     "loop": True,
                                     "bones": {
                                         "ghost_blocks": {"scale": 16.0}}}}}
        pathtofile = "{}/animations/armor_stand.animation.json".format(
            path_to_default)
        with open(pathtofile) as f:
            self.sizing = json.load(f)
        self.poses = {}
        self.poses[0] = "animation.armor_stand.default_pose"
        self.poses[1] = "animation.armor_stand.no_pose"
        self.poses[2] = "animation.armor_stand.solemn_pose"
        self.poses[3] = "animation.armor_stand.athena_pose"
        self.poses[4] = "animation.armor_stand.brandish_pose"
        self.poses[5] = "animation.armor_stand.honor_pose"
        self.poses[6] = "animation.armor_stand.entertain_pose"
        self.poses[7] = "animation.armor_stand.salute_pose"
        self.poses[8] = "animation.armor_stand.riposte_pose"
        self.poses[9] = "animation.armor_stand.zombie_pose"
        self.poses[10] = "animation.armor_stand.cancan_a_pose"
        self.poses[11] = "animation.armor_stand.cancan_b_pose"
        self.poses[12] = "animation.armor_stand.hero_pose"

    def insert_layer(self, y):
        name = "layer_{}".format(y)
        for i in range(12):
            if y % (12) != i:
                self.sizing["animations"][self.poses[i+1]]["bones"][name] = {"scale": 0.08}

    def export(self, pack_name):
        path_to_ani = "{}/animations/armor_stand.animation.json".format(
            pack_name)
        try:

            os.makedirs(os.path.dirname(path_to_ani), exist_ok=True)
        except:
            pass
        with open(path_to_ani, "w+") as json_file:
            json.dump(self.sizing, json_file, indent=2)
        path_to_rc = "{}/animations/armor_stand.ghost_blocks.scale.animation.json".format(
            pack_name)
        try:
            os.makedirs(os.path.dirname(path_to_rc), exist_ok=True)
        except:
            pass
        with open(path_to_rc, "w+") as json_file:
            json.dump(self.default_size, json_file, indent=2)
    def export_big(self,pack_name,offset):
        self.default_size["animations"]["animation.armor_stand.ghost_blocks.scale"]["bones"]["ghost_blocks"]["rotation"]=[0,"-query.body_y_rotation", 0]
        self.default_size["animations"]["animation.armor_stand.ghost_blocks.scale"]["bones"]["ghost_blocks"]["position"]=[
            f"(-(query.position(0)-{int(offset[0])})*math.cos(query.body_y_rotation)-(query.position(2)-{int(offset[2])})*math.sin(query.body_y_rotation))*16",
            f"({int(offset[1])}-query.position(1))*16",
            f"((query.position(2)-{int(offset[2])})*math.cos(query.body_y_rotation)-(query.position(0)-{int(offset[0])})*math.sin(query.body_y_rotation))*16"]
        
        
##        for i in range(12):
##            name = "layer_{}".format(i)
##            self.sizing["animations"][self.poses[i+1]]["bones"][name]={"position":[f"{offset[0]}-query.position(0)",
##                                                                                   f"{offset[1]}-query.position(1)",
##                                                                                   f"{offset[2]}-query.position(2)"]}
##            self.sizing["animations"][self.poses[i+1]]["bones"][name]["rotation"]=["0", f"-query.body_y_rotation", "0"]
##            self.sizing["animations"][self.poses[i+1]]["bones"][name]["scale"]   = 16.0
        path_to_ani = f"{pack_name}/animations/armor_stand.animation.json"
        try:

            os.makedirs(os.path.dirname(path_to_ani), exist_ok=True)
        except:
            pass
        with open(path_to_ani, "w+") as json_file:
            json.dump(self.sizing, json_file, indent=2)
        path_to_rc = f"{pack_name}/animations/armor_stand.ghost_blocks.scale.animation.json"
        try:
            os.makedirs(os.path.dirname(path_to_rc), exist_ok=True)
        except:
            pass
        with open(path_to_rc, "w+") as json_file:
            json.dump(self.default_size, json_file, indent=2)
