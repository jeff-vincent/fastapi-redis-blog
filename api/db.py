import os
import pymongo


MONGO_PASSWORD = os.environ.get('MONGO_PASSWORD')

def init_db():
    client = pymongo.MongoClient(f"mongodb+srv://jeffdvincent:{MONGO_PASSWORD}@cluster0.8xe9o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    db = client.admin_database
    posts_collection = db.posts
    metrics_collection = db.metrics

    try:
        posts_collection.create_index("title", unique=True)
    except Exception as e:
        print(f"Error creating indexes: {e}")

    
    return posts_collection, metrics_collection

posts_collection, metrics_collection = init_db()
