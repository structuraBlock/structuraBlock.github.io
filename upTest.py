import python_modules.nbtlib as nbtlib

import structura_core
import shutil
structura_core.debug=True

def conver(name_tag,file,offset=[-32,0,-31]):
    print("do i")
    nbt = nbtlib.File.from_fileobj(file, byteorder='little')

    try:
        shutil.rmtree("tmp/")
    except:
        pass
    structura_base = structura_core.structura("tmp/"+name_tag)
    structura_base.set_opacity(20)


    print("Run!!!!!!!",f'{name_tag}, {offset}')
        
    structura_base.add_model(name_tag,nbt)
    structura_base.set_model_offset(name_tag,offset)

    # structura_base.generate_nametag_file()
    structura_base.generate_with_nametags()
    info = structura_base.compile_pack()
    print(info)
    # print(structura_base.make_nametag_block_lists())

    print("Done!!")
    print("Done!!")
    print("完成啦！！")