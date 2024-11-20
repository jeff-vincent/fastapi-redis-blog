import json
from redis import Redis
from db import metrics_collection


redis = Redis(host='redis', port=6379, db=0)

def update_post_metrics():
    while True:
        data = redis.blpop("metrics", timeout=0)
        if data:
            data = data[1].decode('utf-8')
            data = json.loads(data)
            metrics_data = {}
            for key, value in data.items():
                if key not in ["name"]:
                    metrics_data[key] = metrics_data.get(key, 0) + value
            print(data)
            try:
                metrics_collection.update_one(
                    {"name": data["name"]}, {"$set": metrics_data}, upsert=True)
            except Exception as e:
                print(f"Post record not found, attempting to create")
                try:
                    metrics_collection.insert_one(data)
                except Exception as e:
                    print(f"Error inserting post metrics: {e}")

update_post_metrics()