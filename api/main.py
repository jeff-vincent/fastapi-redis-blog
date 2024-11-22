import json
from fastapi import FastAPI, Request, BackgroundTasks
from redis import Redis
from db import posts_collection, metrics_collection
from bson import json_util

from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder

origins = [

    "http://localhost",
    "http://localhost:3000",
    "http://localhost:3000/create",
    "http://localhost:8080",
]

app = FastAPI()

# Add CORS middleware to the application
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

redis = Redis()

@app.post('/api/v1/post')
async def create_post(request: Request):
    data = await request.json()
    posts_collection.insert_one(data)
    return {"message": "Post created successfully"}

@app.get('/api/v1/posts')
def get_all_posts():
    posts = posts_collection.find({})
    result = json.loads(json_util.dumps(list(posts)))
    return result

@app.get('/api/v1/post/{id}')
def get_post_by_id(request: Request, id: int, backgroundtasks: BackgroundTasks):
    post = posts_collection.find_one({"id": id})
    if post:
        backgroundtasks.add_task(_update_post_metrics, request)
        result = json_util.dumps(post)
        r = json.loads(result)
        response = {}
        response['title'] = r.get('title')
        response['body'] = r.get('body')
        response['author'] = r.get('author')
        print(response)
        return response
    else:
        return {"error": "Post not found"}

async def _update_post_metrics(request: Request):
    data = {
        "headers": request.headers,
        "path_params": request.path_params,
    }
    json_data = jsonable_encoder(data)
    redis.rpush("metrics", json.dumps(json_data))
    return None

@app.get('/api/v1/metrics/{id}')
async def get_post_metrics(id: str):
    data = metrics_collection.find({"path_params.id": id})
    result = json.loads(json_util.dumps(list(data)))
    print(result)
    if data:
        return result
    else:
        return {"error": "No metrics found"}

@app.post('/api/v1/text-search')
async def text_search(request: Request):
    data = await request.json()
    search_text = data["search_text"]
    data = posts_collection.find({"$text": {"$search": search_text}}).limit(10)
    result = json.loads(json_util.dumps(list(data)))
    return result
