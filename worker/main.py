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
                filter_query = {"name": data["name"]}
                update_query = {"$push": {"views": metrics_data}}
                metrics_collection.update_one(filter_query, update_query)
            except Exception as e:
                print(f"Post record not found, attempting to create")
                try:
                    metrics_collection.insert_one({"name": data["name"], "views": metrics_data})
                except Exception as e:
                    print(f"Error inserting post metrics: {e}")

update_post_metrics()
