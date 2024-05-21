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
oldblocksFile = "Vanilla_Resource_Pack\\blocks.json"
newblocksFile = "Vanilla_Resource_Pack\\blocks17.json"
oldTerrainTexture="Vanilla_Resource_Pack\\textures\\terrain_texture.json"
newTerrainTexture="Vanilla_Resource_Pack\\textures\\terrain_texture17.json"
oldDefsFile="lookups\\block_definition.json"
with open(oldTerrainTexture) as file:
    oldData=json.load(file)
with open(newTerrainTexture) as file:
    newData=json.load(file)
with open(oldDefsFile) as file:
    blockDef=json.load(file)

with open(oldblocksFile) as file:
    oldBlocks=json.load(file)
with open(newblocksFile) as file:
    newBlocks=json.load(file)

oldKeys=list(oldData["texture_data"].keys())
newKeys=list(newData["texture_data"].keys())
oldDefs=list(blockDef.keys())

newBlockskeys = list(filter(lambda i: i not in oldBlocks, newBlocks))
newTextures = list(filter(lambda i: i not in oldKeys, newKeys))
newDefinitions = list(filter(lambda i: i not in oldDefs, newKeys))
for key in newTextures:
    oldData["texture_data"][key]=newData["texture_data"][key]
for key in newBlockskeys:
    blockDef[key]="cube"
    oldBlocks[key]=newBlocks[key]
    print(key)


with open(oldTerrainTexture,"w+") as file:
    json.dump(oldData,file, indent=4)
with open(oldDefsFile, "w+") as file:
    json.dump(blockDef,file, indent=4)
with open(oldblocksFile, "w+") as file:
    json.dump(oldBlocks,file, indent=4)
