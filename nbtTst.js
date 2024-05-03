import * as NBT from "nbtify";
import { readFile } from "node:fs/promises";

const buffer = await readFile("./test_structures/SnowFarm.mcstructure");
const data = await NBT.read(buffer);


console.log(data.data.structure.palette.default.block_position_data[91])

const _____default = {
    block_palette: [
      [Object],  // =>{ name: 'minecraft:air', states: {}, version: 17879555 }
      [Object], [Object], [Object], 
    // => {
    //     name: 'minecraft:lever',
    //     states: { lever_direction: 'west', open_bit: 1b },
    //     version: 17879555
    //   }
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      
    ],
    block_position_data: {
      '91': [Object], 
// => {
//   block_entity_data: {
//     Findable: 0b,
//     Items: [
//       [Object], [Object], [Object],
//       [Object], [Object], [Object],
//       [Object], [Object], [Object],
//       [Object], [Object], [Object],
//       [Object], [Object], [Object],
//       [Object], [Object], [Object],
//       [Object], [Object], [Object],
//       [Object], [Object], [Object],
//       [Object], [Object], [Object]
//     ],
//     id: 'Chest',
//     isMovable: 1b,
//     pairlead: 0b,
//     pairx: 111,
//     pairz: 38,
//     x: 111,
//     y: 5,
//     z: 37
//   }
// }
      '109': [Object],
// => {
//     block_entity_data: {
//       AttachedBlocks: [],
//       BreakBlocks: [],
//       LastProgress: 1f,
//       NewState: 2b,
//       Progress: 1f,
//       State: 2b,
//       Sticky: 1b,
//       id: 'PistonArm',
//       isMovable: 0b,
//       x: 110,
//       y: 8,
//       z: 37
//     }
//   }
      '110': [Object],
      '111': [Object],
      '112': [Object],
      '115': [Object],
    }
}




// 我也不知道为什么，但是block_indices会给俩长度一样的数组，一个正常，另外一个全是-1
console.log(data.data.structure.block_indices[0])

const NBTData = {
    data: {
      format_version: 1,
      size: [ 1, 2, 4 ],
      structure: { block_indices: [Array], entities: [], palette: [Object] },
    },
    rootName: '',
    endian: 'little' // 小端序
  }

  console.log((data))
  // {
  //   data: {
  //     format_version: 1,
  //     size: [ 14, 6, 6 ],
  //     structure: { block_indices: [Array], entities: [Array], palette: [Object] },
  //     structure_world_origin: [ 108, 5, 36 ]
  //   },
  //   rootName: '',
  //   endian: 'little'
  // }