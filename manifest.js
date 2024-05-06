import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
export function gen(packName, nameTags = []) {
    // Construct the description based on the presence of nameTags
    let description = "Structura block overlay pack, created by  \u00a7o\u00a75DrAv0011\u00a7r, \u00a7o\u00a79 FondUnicycle\u00a7r and\u00a7o\u00a75 RavinMaddHatter\u00a7r";
    if (nameTags.length > 0) {
        description = `Nametags: ${nameTags.join(', ')}. ${description}`;
    }
    const tempName = packName.split("/").pop(); // Get the last part of packName
    // Generate UUID once to reuse
    const packUuid = uuidv4();
    const manifest = {
        "format_version": 2,
        "header": {
            "name": tempName,
            "description": description,
            "uuid": packUuid,
            "version": [0, 0, 1],
            "min_engine_version": [1, 16, 0]
        },
        "modules": [
            {
                "type": "resources",
                "uuid": packUuid, // Reuse the generated UUID
                "version": [0, 0, 1]
            }
        ]
    };
    const pathToManifest = path.join(packName, "manifest.json");
    // Ensure the directory structure exists
    fs.mkdirSync(path.dirname(pathToManifest), { recursive: true });
    // Write the manifest to a JSON file
    fs.writeFileSync(pathToManifest, JSON.stringify(manifest, null, 2));
}
