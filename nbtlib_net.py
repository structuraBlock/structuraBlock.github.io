import requests

# 服务器地址，请替换为你自己的地址
url = 'http://127.0.0.1:3000/api/upload'

def load(file,byteorder=None):
    # 准备文件路径
    # file = 'path/to/your/local/image.jpg'

    # 使用open函数以二进制模式打开文件
    with open(file, 'rb') as _file:
        # 使用requests的post方法上传文件
        # files参数是一个字典，键是服务器端用来接收文件的字段名，值是文件对象
        response = requests.post(url, files={'nbt': _file})

    # 检查响应状态码
    if response.status_code == 200:
        print("File uploaded successfully.")
        # print(response.json())  # 打印服务器返回的JSON响应
        # for i in response.json().keys():
        #     print("key: ",i)
        return response.json()['data']
    else:
        print(f"Failed to upload file. Status code: {response.status_code}")


load('./test_structures/1-19 blocks.mcstructure')