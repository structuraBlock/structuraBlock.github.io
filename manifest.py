# MIT License

# Copyright (c) 2021 camerin & DrAv0011

# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:

# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.

# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.


import json
import os
import uuid


def export(pack_name,nameTags=[]):

    
    description="Structura block overlay pack, created by  \u00a7o\u00a75DrAv0011\u00a7r, \u00a7o\u00a79 FondUnicycle\u00a7r and\u00a7o\u00a75 RavinMaddHatter\u00a7r"
    if len(nameTags)>0:
        description=f"Nametags: {', '.join(nameTags)}. {description}"
    tempname=pack_name.split("/")[-1]
    manifest = {
        "format_version": 2,
        "header": {
            "name": tempname,
            "description": description,
            "uuid": str(uuid.uuid4()),
            "version": [
                0,
                0,
                1
            ],
            "min_engine_version": [
                1,
                16,
                0
            ]
        },
        "modules": [
            {
                "type": "resources",
                "uuid": str(uuid.uuid4()),
                        "version": [
                    0, 0, 1]}]}


    path_to_ani = "{}/manifest.json".format(pack_name)
    os.makedirs(os.path.dirname(path_to_ani), exist_ok=True)

    with open(path_to_ani, "w+") as json_file:
        json.dump(manifest, json_file, indent=2)
