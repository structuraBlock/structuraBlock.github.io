from bottle import Bottle, run, request, response, json_dumps

app = Bottle()

@app.post('/api/data')
def post_data():
    # print(request.body.read().decode('utf-8').replace("'", '"'))
    try:
        # 获取JSON数据
        data = request.json
        if not data:
            response.status = 400            
            return {'error': f"Failed to parse JSON: {str(e)}"}

        
        # 假设我们期望接收到一个具有"name"字段的JSON对象
        name = data.get('name')
        if not name:
            response.status = 400
            return {'error': 'Missing "name" in the JSON data'}
        
        # 处理数据（这里仅作为示例打印问候语）
        message = "Hello, !"
        
        # 返回响应
        return {
            "message": message
        }
    except Exception as e:
        response.status = 500
        return {'error': str(e)}

if __name__ == '__main__':
    app.run(host='localhost', port=8080, debug=True)