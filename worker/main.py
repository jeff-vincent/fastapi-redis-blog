import json
import time
from redis import Redis
from db import metrics_collection, posts_collection
from bson import json_util

redis = Redis()

def get_post_info(id):
    post = posts_collection.find_one({"id": int(id)})
    data = json.loads(json_util.dumps(post))
    return data

while True:
    key, data = redis.blpop("metrics", timeout=0)
    if data:
        print(f"Processing data from {key}")
        data = data.decode("utf8")
        data = json.loads(data)
        data['time'] = time.time()
        post_data = get_post_info(data['path_params']['id'])
        data['author'] = post_data['author']
        data['title'] = post_data['title']
        metrics_collection.insert_one(data)
