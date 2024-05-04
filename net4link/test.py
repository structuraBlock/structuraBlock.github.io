# from PIL import Image
# from numpy import array

def image_to_list(img):
        width, height = img.size
        image_list = []
        for row in range(height):
            row_list = []
            for col in range(width):
                pixel = img.getpixel((col, row))
                if img.mode == 'RGB':
                    row_list.append(pixel[:3])  # 如果是RGB模式，只取前三个值
                else:
                    row_list.append(pixel)
            image_list.append(row_list)
        return image_list

# print(image_to_list(Image.open('./beacon.png')))
# print(array(Image.open('./beacon.png')))

def ones1(shape):
    shape.reverse()
    # 假设shape是一个列表，以每位数字为创建的多维列表的长度
    # 逆序遍历shape
    Olist = 1
    for l in shape:
        print(l)
        Olist = [Olist]*l
    return Olist  
def zeros(shape):
    shape.reverse()
    # 假设shape是一个列表，以每位数字为创建的多维列表的长度
    # 逆序遍历shape
    Olist = 0
    for l in shape:
        print(l)
        Olist = [Olist]*l
    return Olist  

def 多维列表生成器(shape,nomo=0):
    shape.reverse()
    # 假设shape是一个列表，以每位数字为创建的多维列表的长度
    # 逆序遍历shape
    Olist = nomo
    for l in shape:
        print(l)
        Olist = [Olist]*l
    return Olist


def ones(shape):
    return 多维列表生成器(shape,1)


# print(ones1([2,3,4])   )

# print("/n")


# from numpy import array, ones, uint8, zeros


# print([[[1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1]],
#        [[1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1]]])


# def list_shape(lst):
#     if isinstance(lst, list):
#         if not lst:  # 空列表
#             return ()
#         shapes = [list_shape(item) for item in lst]
#         if all(len(shape) == len(shapes[0]) for shape in shapes):  # 所有子列表的维度相同
#             return (len(lst),) + shapes[0]
#         else:  # 不规则的多维列表
#             return [len(lst)] + shapes
#     else:
#         return (1,)

# # 示例
# lst = [[[1, 2, 3], [4, 5, 6]], [[7, 8, 9], [10, 11, 12]]]
# print(list_shape(lst))  # 预期输出: (2, 2, 3) 实际上 (2, 2, 3, 1) 



def assign_to_multidim_list(target, source, start_indices, shapes):
    """
    将source的数据按start_indices和shapes指定的范围赋值到target多维列表中。
    target: 目标多维列表
    source: 源数据，多维列表
    start_indices: 一个包含各维度起始索引的列表
    shapes: 一个包含各维度长度的列表，对应source的形状
    """
    # 基础情况：如果到达最后一维，则直接赋值
    if len(start_indices) == 1:
        for i in range(shapes[0]):
            target[start_indices[0] + i] = source[i]
    else:
        # 递归情况：处理更高维度
        for i in range(shapes[0]):
            assign_to_multidim_list(
                target[start_indices[0] + i], 
                source[i], 
                start_indices[1:], 
                shapes[1:]
            )

# 示例使用
target_3d = [[[0 for _ in range(3)] for _ in range(4)] for _ in range(2)]
source_3d = [[[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12]],
             [[13, 14, 15], [16, 17, 18], [19, 20, 21], [22, 23, 24]]]

assign_to_multidim_list(target_3d, source_3d, [0, 0, 0], [2, 4, 3])

# 打印结果验证
for layer in target_3d:
    for row in layer:
        print(row)