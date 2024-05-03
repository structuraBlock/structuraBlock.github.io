import requests
import json

url = 'http://localhost:8080/api/data'
data = {'name': 'Alice'}

# 发送POST请求
response = requests.post(url, headers={'Content-Type': 'application/json'}, data=json.dumps(data))

# 检查响应状态码
if response.status_code == 200:
    print("Success:", response.json())
else:
    print("Error:", response.text)