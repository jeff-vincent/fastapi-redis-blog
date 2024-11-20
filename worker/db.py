import os
import pymongo


MONGO_PASSWORD = os.environ.get('MONGO_PASSWORD')

def init_db():
    client = pymongo.MongoClient(f"mongodb+srv://jeffdvincent:{MONGO_PASSWORD}@cluster0.8xe9o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    db = client.admin_database
    metrics_collection = db.metrics
    
    return metrics_collection

metrics_collection = init_db()