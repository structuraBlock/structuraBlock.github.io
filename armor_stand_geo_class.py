import json
import os
import copy
import time


# from PIL import Image
import png
# from numpy import array, ones, uint8, zeros
import python_modules.tinynumpy as tnp

debug=False
def image_to_list(img):
        width, height = img.size
        image_list = []
        for row in range(height):
            row_list = []
            for col in range(width):
                pixel = img.getpixel((col, row))
                if img.mode == 'RGB':
                    row_list.append(list(pixel[:3]))  # 将元组转换为列表  # 如果是RGB模式，只取前三个值
                else:
                    row_list.append(list(pixel))
            image_list.append(row_list)
        return image_list

class armorstandgeo:
    def __init__(self, name, alpha = 0.8,offsets=[0,0,0], size=[64, 64, 64], ref_pack="Vanilla_Resource_Pack"):
        self.ref_resource_pack = ref_pack
        ## we load all of these items containing the mapping of blocks to the some property that is either hidden, implied or just not clear
        with open("{}/blocks.json".format(self.ref_resource_pack)) as f:
            ## defines the blocks from the NBT name tells us sides vs textures
            self.blocks_def = json.load(f)
        with open("{}/textures/terrain_texture.json".format(self.ref_resource_pack)) as f:
            ##maps textures names to texture files.
            self.terrain_texture = json.load(f)
        with open("lookups/block_rotation.json") as f:
            ## custom look up table i wrote to help with rotations, error messages dump if somehting has undefined rotations 
            self.block_rotations = json.load(f)
        with open("lookups/variants.json") as f:
            ## custom lookup table mapping the assume array location in the terrian texture to the relevant blocks IE log2 index 2 implies a specific wood type not captured anywhere
            self.block_variants = json.load(f)
        with open("lookups/block_definition.json") as f:
            self.defs = json.load(f)
        with open("lookups/block_shapes.json") as f:
            self.block_shapes = json.load(f)
        with open("lookups/block_uv.json") as f:
            self.block_uv = json.load(f)
        self.name = name.replace(" ","_").lower()
        self.stand = {}
        self.offsets = offsets
        self.offsets[0]+=8
        self.offsets[2]+=7
        self.alpha=alpha
        self.texture_list = []
        self.geometry = {}
        self.stand_init()
        self.uv_map = {}
        self.blocks = {}
        self.size = size
        self.bones = []
        self.errors={}
        self.layers=[]
        self.uv_array = None
        self.pre_gen_blocks={}
        ## The stuff below is a horrible cludge that should get cleaned up. +1 karma to whomever has a better plan for this.
        # this is how i determine if something should be thin. it is ugly, but kinda works

        
        ## these blocks are either not needed, or cause issue. Grass is banned because the terrian_texture.json has a biome map in it. If someone wants to fix we can un-bann it
        self.excluded = ["air", "structure_block"]

    def export(self, pack_folder):
        start = time.time()
        ## This exporter just packs up the armorstand json files and dumps them where it should go. as well as exports the UV file
        self.add_blocks_to_bones()
        self.geometry["description"]["texture_height"] = len(
            self.uv_map.keys())
        self.stand["minecraft:geometry"] = [self.geometry] ## this is insuring the geometries are imported, there is an implied refference other places.
        path_to_geo = "{}/models/entity/armor_stand.ghost_blocks_{}.geo.json".format(
            pack_folder,self.name)
        os.makedirs(os.path.dirname(path_to_geo), exist_ok=True)
        i=0
        
        for index in range(len(self.stand["minecraft:geometry"][0]["bones"])):
            if "name" not in self.stand["minecraft:geometry"][0]["bones"][index].keys():
                self.stand["minecraft:geometry"][0]["bones"][index]["name"]="empty_row+{}".format(i)
                self.stand["minecraft:geometry"][0]["bones"][index]["parent"]="ghost_blocks"
                self.stand["minecraft:geometry"][0]["bones"][index]["pivot"]=[0.5,0.5,0.5]
                i+=1
        start=time.time()
        with open(path_to_geo, "w+") as json_file:
            json.dump(self.stand, json_file)
        texture_name = "{}/textures/entity/ghost_blocks_{}.png".format(
            pack_folder,self.name)
        os.makedirs(os.path.dirname(texture_name), exist_ok=True)
        self.save_uv(texture_name)
        
    def export_big(self, pack_folder):
        ## This exporter just packs up the armorstand json files and dumps them where it should go. as well as exports the UV file
        self.stand["minecraft:geometry"] = []
        size=list(map(int,self.size))
        #offset=[-size[0]//2,0,-size[2]//2]
        geometries={}
        geometries["default"]={}
        geometries["default"]["description"]={}
        geometries["default"]["description"]["identifier"] = "geometry.armor_stand.default"
        geometries["default"]["description"]["texture_width"] = 1
        geometries["default"]["description"]["texture_height"] = 1
        geometries["default"]["description"]["visible_bounds_width"] = 5120
        geometries["default"]["description"]["visible_bounds_height"] = 5120
        geometries["default"]["description"]["visible_bounds_offset"] = [0, 1.5, 0]     
        geometries["default"]["bones"]=[{"name":"ghost_blocks","pivot": [-8, 0, 8],"origin":[0,0,0]}]
        default_geo=[{"size": size,
                        "uv": {
                                "north": {"uv": [0, 0], "uv_size": [1, 1]},
                                "east": {"uv": [0, 0], "uv_size": [1, 1]},
                                "south": {"uv": [0, 0], "uv_size": [1, 1]},
                                "west": {"uv": [0, 0], "uv_size": [1, 1]},
                                "up": {"uv": [1, 1], "uv_size": [-1, -1]},
                                "down": {"uv": [1, 1], "uv_size": [-1, -1]}
                        }},
                     {
                        "size": size,
                        "uv": {
                                "north": {"uv": [0, 3], "uv_size": [1, -1]},
                                "east": {"uv": [0, 3], "uv_size": [1, -1]},
                                "south": {"uv": [0, 3], "uv_size": [1, -1]},
                                "west": {"uv": [0, 3], "uv_size": [1, -1]},
                                "up": {"uv": [0, 1], "uv_size": [1, -1]},
                                "down": {"uv": [0, 3], "uv_size": [1, -1]}
                        }}]
        geometries["default"]["bones"][0]["cubes"]=default_geo
        for i in range(len(self.layers)):
            layer_name=self.layers[i]
            geometries[layer_name] = {}
            geometries[layer_name]["description"] = {}
            geometries[layer_name]["description"]["identifier"] = "geometry.armor_stand.ghost_blocks_{}".format(i)
            geometries[layer_name]["description"]["texture_width"] = 1
            geometries[layer_name]["description"]["texture_height"] = len(self.uv_map.keys())
            geometries[layer_name]["description"]["visible_bounds_width"] = 5120
            geometries[layer_name]["description"]["visible_bounds_height"] = 5120
            geometries[layer_name]["description"]["visible_bounds_offset"] = [0, 1.5, 0]
            geometries[layer_name]["bones"]=[{"name": "ghost_blocks","pivot": [0, 0, 0]},## i am not sure this should be this value for pivot
                                             {"name": "layer_"+str(i),"parent": "ghost_blocks","pivot": [0, 0, 0]}]## i am not sure this should be this value for pivot
        
        
        for key in self.blocks.keys():
            layer_name = self.blocks[key]["parent"]
            geometries[layer_name]["bones"].append(self.blocks[key])
        self.stand["minecraft:geometry"].append(geometries["default"])
        for layer_name in self.layers:
            self.stand["minecraft:geometry"].append(geometries[layer_name])
            
        path_to_geo = "{}/models/entity/armor_stand.ghost_blocks_{}.geo.json".format(pack_folder,self.name)
        os.makedirs(os.path.dirname(path_to_geo), exist_ok=True)            
        with open(path_to_geo, "w+") as json_file:
            json.dump(self.stand, json_file, indent=2)
        
        
        for i in range(len(self.layers)):
            texture_name = "{}/textures/entity/ghost_blocks_{}.png".format(pack_folder,i)
            os.makedirs(os.path.dirname(texture_name), exist_ok=True)
            self.save_uv(texture_name)

    
    def make_layer(self, y):
        # sets up a layer for us to refference in the animation controller later. Layers are moved during the poses 
        layer_name = "layer_{}".format(y)
        self.geometry["bones"].append(
            {"name": layer_name, "parent": "ghost_blocks"})#, "pivot": [-8, 0, 8]})

    def make_block(self, x, y, z, block_name, rot=None, top=False,data=0, trap_open=False, parent=None,variant="default", big = False):
        # make_block handles all the block processing, This function does need cleanup and probably should be broken into other helperfunctions for ledgiblity.
        block_type = self.defs[block_name]
        if block_type!="ignore":
            ghost_block_name = "block_{}_{}_{}".format(x, y, z)
            self.blocks[ghost_block_name] = {}
            self.blocks[ghost_block_name]["name"] = ghost_block_name
            layer_name = "layer_{}".format(y % (12))
            if layer_name not in self.layers:
                self.layers.append(layer_name)
            self.blocks[ghost_block_name]["parent"] = layer_name
            block_type = self.defs[block_name]
            ## hardcoded to true for now, but this is when the variants will be called
            shape_variant="default"
            if block_type == "hopper" and rot!=0:
                shape_variant="side"
            elif block_type == "trapdoor" and trap_open:
                shape_variant = "open"
            elif block_type == "lever" and trap_open:
                shape_variant = "on"
            elif top:
                shape_variant = "top"

            if data!=0 and debug:
                print(data)
            

            block_shapes = self.block_shapes[block_type][shape_variant]
            self.blocks[ghost_block_name]["pivot"] = [block_shapes["center"][0] - (x + self.offsets[0]),
                                                      y + block_shapes["center"][1] + self.offsets[1],
                                                      z + block_shapes["center"][2] + self.offsets[2]]
            self.blocks[ghost_block_name]["inflate"] = -0.03

            block_uv = self.block_uv[block_type]["default"]
            if shape_variant in self.block_uv[block_type].keys():
                block_uv = self.block_uv[block_type][shape_variant]
            if str(data) in self.block_uv[block_type].keys():
                shape_variant=str(data)
            if str(data) in self.block_shapes[block_type].keys():
                block_shapes = self.block_shapes[block_type][str(data)]
            if block_type in self.block_rotations.keys() and rot is not None:
                self.blocks[ghost_block_name]["rotation"] = copy.deepcopy(self.block_rotations[block_type][str(rot)])
                if big:
                    self.blocks[ghost_block_name]["rotation"][1]+=180
            else:
                if debug:
                    print("no rotation for block type {} found".format(block_type))
            self.blocks[ghost_block_name]["cubes"] = []
            uv_idx=0

            for i in range(len(block_shapes["size"])):
                uv = self.block_name_to_uv(block_name,variant=variant,shape_variant=shape_variant,index=i)
                block={}
                if len(block_uv["uv_sizes"]["up"])>i:
                    uv_idx=i
                xoff = 0
                yoff = 0
                zoff = 0
                if "offsets" in block_shapes.keys():
                    xoff = block_shapes["offsets"][i][0]
                    yoff = block_shapes["offsets"][i][1]
                    zoff = block_shapes["offsets"][i][2]
                block["origin"] = [-1*(x + self.offsets[0]) + xoff, y + yoff + self.offsets[1], z + zoff + self.offsets[2]]
                block["size"] = block_shapes["size"][i]

                if "rotation" in block_shapes.keys():
                    block["rotation"] = block_shapes["rotation"][i]
                    

                blockUV=dict(uv)
                for dir in ["up", "down", "east", "west", "north", "south"]:
                    blockUV[dir]["uv"][0] += block_uv["offset"][dir][uv_idx][0]
                    blockUV[dir]["uv"][1] += block_uv["offset"][dir][uv_idx][1]
                    blockUV[dir]["uv_size"] = block_uv["uv_sizes"][dir][uv_idx]

                block["uv"] = blockUV
                self.blocks[ghost_block_name]["cubes"].append(block)

    def save_uv(self, name):
        # saves the texture file where you tell it to
        if self.uv_array is None:
            print("No Blocks Were found")
        else:
            # for i in range(1616):
                # print(self.uv_array[i])
            python_list = []
            # 遍历三维数组的前两维
            for layer in self.uv_array:
                # 对每一层，将后两维展平
                flattened_row = [element for row in layer for element in row]
                python_list.append(flattened_row)


            print("self.uv_array" , len(python_list[0]))
            im = png.from_array(python_list,"RGBA",)
            im.save(name)

    def stand_init(self):
        # helper function to initialize the dictionary that will be exported as the json object
        self.stand["format_version"] = "1.16.0"
        self.geometry["description"] = {
            "identifier": "geometry.armor_stand.ghost_blocks_{}".format(self.name)}
        self.geometry["description"]["texture_width"] = 1
        self.geometry["description"]["visible_bounds_offset"] = [
            0.0, 1.5, 0.0]
        # Changed render distance of the block geometry
        self.geometry["description"]["visible_bounds_width"] = 5120
        # Changed render distance of the block geometry
        self.geometry["description"]["visible_bounds_height"] = 5120
        self.geometry["bones"] = []
        self.stand["minecraft:geometry"] = [self.geometry]
        self.geometry["bones"] = [
                                    {"name": "ghost_blocks",
                                     "pivot": [-8, 0, 8]}]

    def extend_uv_image(self, new_image_filename):
        # helper function that just appends to the uv array to make things
        with open(new_image_filename, 'rb') as file:
            reader = png.Reader(file)
            f = reader.read_flat()
            image_flat_rgba = tnp.array(f[2],'uint8').transpose()
            # print(new_image_filename,'f[3]["planes"]',f[3]["planes"],len(image_flat_rgba)//16//f[3]["planes"])
            impt = image_flat_rgba.reshape([len(image_flat_rgba)//16//f[3]["planes"],16,f[3]["planes"]])
            # print(image_flat_rgba.reshape([16,16*f[3]["planes"]]))
            # python_2d_list = []
            # for row in image_flat_rgba.reshape([16,16*f[3]["planes"]]):
            #     python_2d_list.append(list(row))
            # print(python_2d_list,"\n\n\n\n\n")
            # print("num_pixels",num_pixels,new_image_filename,f[3]["planes"])
            # num_pixels = len(image_flat_rgba) // f[3]["planes"]
            # impt =  image_rgba_array # tnp.array(image_rgba_array,'uint8')
        # print("#",impt[8],"a")
        shape=list(impt.shape)
        # print("shape",shape)
        if shape[0]>16:
            shape[0]=16
            impt=impt[0:16,:,:]
        if shape[1]>16:
            shape[1]=16
            impt=impt[:,0:16,:]
        image_array = tnp.zeros((16, 16, 4) ,'uint8')
        image_array[0:shape[0], 0:shape[1], 0:impt.shape[2]] = impt
        image_array[:, :, 3] = image_array[:, :, 3] # * self.alpha
        if type(self.uv_array) is type(None):
            self.uv_array = image_array
        else:
            startshape = list(self.uv_array.shape)
            startshape = list(self.uv_array.shape)
            endshape = startshape.copy()
            endshape[0] += image_array.shape[0]
            temp_new = tnp.zeros(tuple(endshape),'uint8')
            # print("temp_new[0:startshape[0], :, :] = self.uv_array",self.uv_array[0])
            temp_new[0:startshape[0], :, :] = self.uv_array
            temp_new[startshape[0]:, :, :] = image_array
            self.uv_array = temp_new

    def block_name_to_uv(self, block_name, variant = "",shape_variant="default",index=0,data=0):
        
        # helper function maps the the section of the uv file to the side of the block
        temp_uv = {}
        if block_name not in self.excluded:  # if you dont want a block to be rendered, exclude the UV

            block_type = self.defs[block_name]
            
            texture_files = self.get_block_texture_paths(block_name, variant = variant)

            corrected_textures={}
            if shape_variant in self.block_uv[block_type].keys():
                if "overwrite" in self.block_uv[block_type][shape_variant].keys():
                    corrected_textures = self.block_uv[block_type][shape_variant]["overwrite"]
            else:
                if "overwrite" in self.block_uv[block_type]["default"].keys():
                    corrected_textures = self.block_uv[block_type]["default"]["overwrite"]
            
            for side in corrected_textures.keys():
                if len(corrected_textures[side])>index:
                    if corrected_textures[side][index] != "default":
                        texture_files[side]=corrected_textures[side][index]
                        if debug:
                            print("{}: {}".format(side,texture_files[side]))
            for key in texture_files.keys():
                if texture_files[key] not in self.uv_map.keys():
                    self.extend_uv_image(
                        "{}/{}.png".format(self.ref_resource_pack, texture_files[key]))
                    self.uv_map[texture_files[key]] = len(self.uv_map.keys())
                temp_uv[key] = {
                    "uv": [0, self.uv_map[texture_files[key]]], "uv_size": [1, 1]}

        return temp_uv

    def add_blocks_to_bones(self):
        # helper function for adding all of the bars, this is called during the writing step
        for key in self.blocks.keys():
            self.geometry["bones"].append(self.blocks[key])

    def get_block_texture_paths(self, blockName, variant = ""):
        # helper function for getting the texture locations from the vanilla files.
        textureLayout = self.blocks_def[blockName]["textures"]
        texturedata = self.terrain_texture["texture_data"]
        textures = {}

        if type(textureLayout) is dict:
            if "side" in textureLayout.keys():
                textures["east"] = textureLayout["side"]
                textures["west"] = textureLayout["side"]
                textures["north"] = textureLayout["side"]
                textures["south"] = textureLayout["side"]
            if "east" in textureLayout.keys():
                textures["east"] = textureLayout["east"]
            if "west" in textureLayout.keys():
                textures["west"] = textureLayout["west"]
            if "north" in textureLayout.keys():
                textures["north"] = textureLayout["north"]
            if "south" in textureLayout.keys():
                textures["south"] = textureLayout["south"]
            if "down" in textureLayout.keys():
                textures["down"] = textureLayout["down"]
            if "up" in textureLayout.keys():
                textures["up"] = textureLayout["up"]
        elif type(textureLayout) is str:
            textures["east"] = textureLayout
            textures["west"] = textureLayout
            textures["north"] = textureLayout
            textures["south"] = textureLayout
            textures["up"] = textureLayout
            textures["down"] = textureLayout
        for key in textures.keys():
            
            if type(texturedata[textures[key]]["textures"]) is str:
                textures[key] = texturedata[textures[key]]["textures"]
            elif type(texturedata[textures[key]]["textures"]) is list:
                index=0
                if variant[0] in self.block_variants.keys():
                    index=self.block_variants[variant[0]][variant[1] ]
                if debug:
                    print(index)
                    print(key)
                    print(texturedata[textures[key]]["textures"])
                    print(texturedata[textures[key]]["textures"][index])
                textures[key] = texturedata[textures[key]]["textures"][index]

            
        return textures


            # im = png.from_array([[40,40,40,255,31,31,31,255,17,17,17,255,144,144,144,255,146,146,146,255,144,144,144,255,146,146,146,255,156,156,156,255,149,149,149,255,144,144,144,255,146,146,146,255,149,149,149,255,146,146,146,255,48,48,48,255,38,38,38,255,41,41,41,255],[34,34,34,255,19,19,19,255,21,21,21,255,107,107,107,255,108,108,108,255,110,110,110,255,108,108,108,255,112,112,112,255,122,122,122,255,119,119,119,255,119,119,119,255,118,118,118,255,117,117,117,255,44,44,44,255,44,44,44,255,42,42,42,255],[18,18,18,255,16,16,16,255,147,147,147,255,137,137,137,255,128,128,128,255,137,137,137,255,137,137,137,255,128,128,128,255,147,147,147,255,128,128,128,255,128,128,128,255,147,147,147,255,128,128,128,255,109,109,109,255,44,44,44,255,36,36,36,255],[152,152,152,255,117,117,117,255,137,137,137,255,106,106,106,255,106,106,106,255,113,113,113,255,106,106,106,255,106,106,106,255,113,113,113,255,113,113,113,255,106,106,106,255,113,113,113,255,113,113,113,255,73,73,73,255,170,170,170,255,154,154,154,255],[156,156,156,255,118,118,118,255,128,128,128,255,122,122,122,255,113,113,113,255,106,106,106,255,122,122,122,255,113,113,113,255,106,106,106,255,106,106,106,255,106,106,106,255,106,106,106,255,106,106,106,255,84,84,84,255,164,164,164,255,144,144,144,255],[146,146,146,255,122,122,122,255,147,147,147,255,106,106,106,255,113,113,113,255,106,106,106,255,113,113,113,255,106,106,106,255,122,122,122,255,113,113,113,255,113,113,113,255,106,106,106,255,122,122,122,255,78,78,78,255,164,164,164,255,152,152,152,255],[149,149,149,255,120,120,120,255,137,137,137,255,106,106,106,255,106,106,106,255,122,122,122,255,106,106,106,255,122,122,122,255,106,106,106,255,113,113,113,255,113,113,113,255,113,113,113,255,106,106,106,255,73,73,73,255,158,158,158,255,149,149,149,255],[149,149,149,255,120,120,120,255,128,128,128,255,122,122,122,255,122,122,122,255,113,113,113,255,106,106,106,255,113,113,113,255,113,113,113,255,106,106,106,255,106,106,106,255,106,106,106,255,122,122,122,255,77,77,77,255,154,154,154,255,149,149,149,255],[149,149,149,255,110,110,110,255,128,128,128,255,113,113,113,255,113,113,113,255,106,106,106,255,122,122,122,255,113,113,113,255,113,113,113,255,113,113,113,255,106,106,106,255,122,122,122,255,113,113,113,255,73,73,73,255,154,154,154,255,149,149,149,255],[149,149,149,255,108,108,108,255,137,137,137,255,106,106,106,255,106,106,106,255,122,122,122,255,106,106,106,255,106,106,106,255,113,113,113,255,106,106,106,255,122,122,122,255,106,106,106,255,113,113,113,255,73,73,73,255,155,155,155,255,149,149,149,255],[159,159,159,255,107,107,107,255,137,137,137,255,113,113,113,255,106,106,106,255,113,113,113,255,113,113,113,255,113,113,113,255,106,106,106,255,122,122,122,255,113,113,113,255,106,106,106,255,113,113,113,255,73,73,73,255,170,170,170,255,149,149,149,255],[146,146,146,255,107,107,107,255,128,128,128,255,113,113,113,255,106,106,106,255,113,113,113,255,113,113,113,255,106,106,106,255,106,106,106,255,113,113,113,255,106,106,106,255,122,122,122,255,106,106,106,255,77,77,77,255,170,170,170,255,142,142,142,255],[151,151,151,255,107,107,107,255,137,137,137,255,106,106,106,255,122,122,122,255,106,106,106,255,106,106,106,255,122,122,122,255,113,113,113,255,106,106,106,255,106,106,106,255,113,113,113,255,113,113,113,255,73,73,73,255,170,170,170,255,141,141,141,255],[54,54,54,255,48,48,48,255,109,109,109,255,73,73,73,255,77,77,77,255,77,77,77,255,77,77,77,255,73,73,73,255,77,77,77,255,73,73,73,255,77,77,77,255,73,73,73,255,77,77,77,255,73,73,73,255,74,74,74,255,77,77,77,255],[40,40,40,255,44,44,44,255,44,44,44,255,170,170,170,255,170,170,170,255,171,171,171,255,167,167,167,255,175,175,175,255,167,167,167,255,162,162,162,255,170,170,170,255,170,170,170,255,170,170,170,255,62,62,62,255,62,62,62,255,55,55,55,255],[38,38,38,255,40,40,40,255,31,31,31,255,149,149,149,255,152,152,152,255,152,152,152,255,152,152,152,255,152,152,152,255,156,156,156,255,142,142,142,255,142,142,142,255,142,142,142,255,142,142,142,255,58,58,58,255,48,48,48,255,41,41,41,255]],"RGBA",)