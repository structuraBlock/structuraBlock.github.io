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
structura_core.debug=True
files_to_conver={
        
        "":{"file":"test_structures/BigHatter/1.mcstructure",
                "offset":[-32,0,-32]}
                
    }


if os.path.exists("tmp/speed.mcpack"):
    os.remove("tmp/speed.mcpack")
if os.path.exists("tmp/speed Nametags.txt"):
    os.remove("tmp/speed Nametags.txt")

structura_base=structura_core.structura("tmp/speed")
structura_base.set_opacity(20)
for name_tag, info in files_to_conver.items():
    print(f'{name_tag}, {info}')
    
    structura_base.add_model(name_tag,info["file"])
    structura_base.set_model_offset(name_tag,info["offset"])


structura_base.generate_nametag_file()
structura_base.generate_with_nametags()

structura_base.compile_pack()
print(structura_base.timers["total"])
for key, value in structura_base.timers.items():
    print(f"{key}-{value}")
