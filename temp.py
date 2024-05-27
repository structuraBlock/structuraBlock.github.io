import json
json_string_a = '{"key1": "value1", "key2": "value2"}'
json_string_b = '{"key2": "new_value2", "key3": "value3"}'

# 同样的json字符串转换为字典
dict_a = json.loads(json_string_a)
dict_b = json.loads(json_string_b)

# 使用update方法合并字典，注意这个操作会直接修改dict_a
dict_a.update(dict_b)

print(json.dumps(dict_a, indent=2))