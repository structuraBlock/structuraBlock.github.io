import nbtlib

import structura_core
import shutil
structura_core.debug=True

try:
    shutil.rmtree("tmp/")
except:
    pass
structura_base = structura_core.structura("tmp/love")
structura_base.set_opacity(20)

def add(name_tag,file,offset=[-32,0,-31],opacity=20):
    print(">> so do i")
    nbt = nbtlib.File.from_fileobj(file, byteorder='little')



    print(f'>> 名称标签-->{name_tag}, 坐标偏移--> {offset}')
        
    structura_base.add_model(name_tag,nbt)
    structura_base.set_model_offset(name_tag,offset)




def conver():
    # structura_base.generate_nametag_file()
    structura_base.generate_with_nametags()
    info = structura_base.compile_pack()
    # print('>>',info)
    # print(structura_base.make_nametag_block_lists())

    print(">> Done!!")
    print(">> 完成啦！！")