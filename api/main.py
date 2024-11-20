import json
from fastapi import FastAPI, Request, BackgroundTasks
from redis import Redis
from db import posts_collection, metrics_collection

app = FastAPI()
redis = Redis(host='redis', port=6379, db=0)

@app.post('/api/v1/post')
async def create_post(request: Request):
    data = await request.json()
    await posts_collection.insert_one(data)
    return {"message": "Post created successfully"}

@app.get('/api/v1/posts')
async def get_all_posts():
    posts = await posts_collection.find({})
    return list(posts)

@app.get('/api/v1/post/{name}')
async def get_post_by_name(request: Request, name: str, backgroundtasks: BackgroundTasks):
    post = await posts_collection.find_one({"title": name})
    if post:
        backgroundtasks.add_task(_update_post_metrics, request, name)
        return post
    else:
        return {"error": "Post not found"}

async def _update_post_metrics(request: Request, name: str):
    data = request.__dict__
    data['name'] = name
    data = await json.dumps(data)
    redis.rpush("metrics", data)
    return None

@app.get('/api/v1/metrics/{name}')
async def get_post_metrics(name: str):
    data = metrics_collection.find_one({"name": name})
    if data:
        return data
    else:
        return {"error": "No metrics found"}
