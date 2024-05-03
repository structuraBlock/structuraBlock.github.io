import { existsSync, rm } from 'fs';

const files_to_conver = {
  gems: {
    file: 'test_structures/All Blocks World/gems and redstone.mcstructure',
    offset: [-32, 0, -32],
  },
  stone: {
    file: 'test_structures/All Blocks World/Stones.mcstructure',
    offset: [-30, 0, -32],
  },
  wood: {
    file: 'test_structures/All Blocks World/wood.mcstructure',
    offset: [-31, 0, -31],
  },
  decor: {
    file: 'test_structures/All Blocks World/decorative.mcstructure',
    offset: [-32, 0, -31],
  },
  wood2: {
    file: 'test_structures/All Blocks World/wood2.mcstructure',
    offset: [-32, 0, -31],
  },
};

// 强制删除不为空的temp目录

if (existsSync('./tmp')) {
    rm('./tmp', { recursive: true },()=>0);
    console.log('删除存在的temp目录');
  }



for(const name_tag in files_to_conver){
    const info = files_to_conver[name_tag];
    console.log('> '+name_tag, JSON.stringify(info));

}

