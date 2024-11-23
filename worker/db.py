import os
import pymongo


MONGO_PASSWORD = os.environ.get('MONGODB_PASSWORD')

def init_db():
    client = pymongo.MongoClient(f"mongodb+srv://jeffdvincent:{MONGO_PASSWORD}@cluster0.8xe9o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    db = client.admin_database
    metrics_collection = db.metrics
    posts_collection = db.posts
    
    return metrics_collection, posts_collection

metrics_collection, posts_collection = init_db()