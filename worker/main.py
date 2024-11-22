import json
from redis import Redis
from db import metrics_collection

redis = Redis()

print(redis.__dict__.keys())


while True:
    key, data = redis.blpop("metrics", timeout=0)
    if data:
        print(f"Processing data from {key}")
        data = data.decode("utf8")
        print(type(data))
        metrics_collection.insert_one(json.loads(data))
        print(data)
        # data = json.loads(data)

        
        # print(f"Updating post metrics for {name}")



        # metrics_data = {}
        # for key, value in data.items():
        #     if key not in ["name"]:
        #         metrics_data[key] = metrics_data.get(key, 0) + value
        # try:
        #     filter_query = {"name": data["name"]}
        #     update_query = {"$push": {"views": metrics_data}}
        #     metrics_collection.update_one(filter_query, update_query)
        # except:
        #     print(f"Post record not found, attempting to create")
        #     try:
        #         metrics_collection.insert_one({"name": data["name"], "views": metrics_data})
        #     except Exception as e:
        #         print(f"Error inserting post metrics: {e}")
