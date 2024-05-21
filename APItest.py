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


import structura_core
import os
import shutil
structura_core.debug=True

files_to_conver={
        
        # "gems":{"file":"test_structures/All Blocks World/gems and redstone.mcstructure",
        #         "offset":[-32,0,-32]},
        # "stone":{"file":"test_structures/All Blocks World/Stones.mcstructure",
        #          "offset":[-30,0,-32]},
        # "wood":{"file":"test_structures/All Blocks World/wood.mcstructure",
                # "offset":[-31,0,-31]},
        # "decor":{"file":"test_structures/All Blocks World/decorative.mcstructure",
        #          "offset":[-32,0,-31]},
        "wood2":{"file":"test_structures/All Blocks World/wood2.mcstructure",
                 "offset":[-32,0,-31]}}
try:
    shutil.rmtree("tmp/")
except:
    pass
if os.path.exists("tmp/all_blocks.mcpack"):
    os.remove("tmp/all_blocks.mcpack")
if os.path.exists("tmp/all_blocks Nametags.txt"):
    os.remove("tmp/all_blocks Nametags.txt")
structura_base=structura_core.structura("tmp/all_blocks")
structura_base.set_opacity(20)

for name_tag, info in files_to_conver.items():
    print(f'##{name_tag}, {info}')
    
    structura_base.add_model(name_tag,info["file"])
    structura_base.set_model_offset(name_tag,info["offset"])
structura_base.generate_nametag_file()
structura_base.generate_with_nametags()
Completedinfo = structura_base.compile_pack()
Fileinfo = structura_base.make_nametag_block_lists()
# print(Completedinfo)
# print(Fileinfo)

print(">> Done!!")
print(">> 完成啦！！")