import json
import time
from redis import Redis
from db import metrics_collection

redis = Redis()

while True:
    key, data = redis.blpop("metrics", timeout=0)
    if data:
        print(f"Processing data from {key}")
        data = data.decode("utf8")
        data = json.loads(data)
        data['time'] = time.time()
        metrics_collection.insert_one(data)
