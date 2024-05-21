# MIT License

# Copyright (c) 2021 camerin & 火魄

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

import requests
from zipfile import ZipFile
import os


def update(url,structura_version, lookup_verison):
    initial_check = requests.get(url,headers={"structuraVersion": structura_version,"lookupVersion":lookup_verison}).json()
    print(initial_check)
    updated=False
    print(initial_check)
    if initial_check["info"] == 'Update Availible':
        print('Update Availible')
        print(initial_check["url"])
        response = requests.get(initial_check["url"], allow_redirects=True,stream=True)
        if response.headers.get('content-type') == "application/xml":
            print(response.content)
        else:
            with open("lookup_temp.zip","wb") as file:
                file.write(response.content)
            print("download completed")
            with ZipFile("lookup_temp.zip", 'r') as zObject:
                zObject.extractall(path="")
            os.remove("lookup_temp.zip")
            print("update complete")
            updated=True
    else:
        print("up to date")
    return updated
if __name__ =="__main__":
    update("https://update.structuralab.com/structuraUpdate",
           "Structura1-6",
           "none")
    
