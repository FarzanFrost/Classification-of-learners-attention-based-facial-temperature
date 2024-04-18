import os
import json

FOLDER_PATH = './data'


def write_to_file(file_name, data):
    file_path = f'{FOLDER_PATH}/{file_name}'
    with open(file_path, 'w') as file:
        file.write(json.dumps(data, indent=4))


def read_file(file_name):
    file_path = f'{FOLDER_PATH}/{file_name}'
    data = ''
    with open(file_path, 'r') as file:
        data = file.read()
    return json.loads(data)


def get_file_count():
    return len(os.listdir(FOLDER_PATH))
