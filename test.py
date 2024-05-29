import json
with open("lookups/mojang-blocks.json") as f:
        mojang_blocks = json.load(f)
        block_properties = {}
        block_properties_list = mojang_blocks["block_properties"]
        # print(len(block_properties_list))
        for key in block_properties_list:
                if  key["type"]  !="string":continue
        
                block_properties[key["name"]] = [v["value"] for v in key["values"]]
        # print([v["value"] for v in key["values"] for key in block_properties_list if key["type"]  == "string" ])


