from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from common import write_to_file, get_file_count, read_file


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins = ['*'],
    allow_credentials = True,
    allow_methods = ['*'],
    allow_headers=['*'],
)


@app.get("/")
async def root():
    print('root reached!')
    return {"True": True}


@app.post("/save_user_details")
async def save_user_details(data: dict):
    print('Reached save user details')
    file_name = get_file_count() + 1
    data["cpt_start_time"] = -1
    data["cpt_data"] = []
    write_to_file(f'{file_name}.json', data)
    return {"fileId": file_name}


@app.post("/save_cpt_details/{file_name}")
async def save_cpt_details(file_name: int, data: dict):
    print('Reached cpt details')
    data_dict = read_file(f'{file_name}.json')
    data_dict["cpt_data"].append(data)
    write_to_file(f'{file_name}.json', data_dict)
    return {"fileId": file_name}


@app.post("/save_cpt_start_time/{file_name}")
async def save_cpt_start_time(file_name: int, data: dict):
    print('Reached cpt start time')
    data_dict = read_file(f'{file_name}.json')
    data_dict["cpt_start_time"] = data["start_time"]
    write_to_file(f'{file_name}.json', data_dict)
    return {"fileId": file_name}