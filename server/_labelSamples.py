# Run from home folder of project, pass in folder containg samples as argument
import sys
import os
from uuid import uuid4
import glob
import json

# Play sample
from playsound import playsound

# Types from JS
# export interface SampleList {
#   uuid: {
#     samplePackTitle: string;
#     samples: Sample[];
#   };
# }

# export interface Sample {
#   uuid: string;
#   sampleTitle: string;
#   samplePath: string;
# }

# Local destination folder
sampleDestinationParentFolder = "static/samples/packs"

def main():
  samplesPath = sys.argv[1]
  currentPath = os.getcwd()

  samplePackUUID = str(uuid4())
  samplePackName = input("Name of sample pack: ")

  sampleDict = {
    "samplePackTitle": samplePackName,
    "samples": []
  }

  # Path of destination folder
  sampleDestinationFolderPath = os.path.join(currentPath, sampleDestinationParentFolder, samplePackUUID)

  if not os.path.exists(sampleDestinationFolderPath):
    os.makedirs(sampleDestinationFolderPath)

  # Adds title and uuid to each file, then renames and moves it into unique packs folder
  for file in glob.glob(os.path.join(samplesPath, "*.wav")):
    print(f"\n{file}")
    playsound(file)
  
    sampleName = input(f"Name of sample: ")

    if sampleName == "no": 
      continue

    sampleUUID = str(uuid4())

    sampleDestination = os.path.join(sampleDestinationParentFolder, samplePackUUID, f"{sampleUUID}.wav")
    sampleDestinationPath = os.path.join(currentPath, sampleDestination)
    
    sample = {
      "uuid": sampleUUID,
      "sampleTitle": sampleName,
      "samplePath": sampleDestination
    }

    os.replace(file, sampleDestinationPath)

    sampleDict["samples"].append(sample)
  
  # Appends to packs.json
  packsJsonPath = os.path.join(currentPath, sampleDestinationParentFolder, "packs.json")
  with open(packsJsonPath, "r+") as f:
    packsDict = json.load(f)

    packsDict[samplePackUUID] = sampleDict
    
    f.seek(0)

    json.dump(packsDict, f, indent=2)





if __name__ == "__main__":
  main()