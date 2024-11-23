import json
from bson import json_util

from metrics import accept_language_to_country
from db import posts_collection

def process_metrics(data):
    data = json.loads(json_util.dumps(list(data)))
    result = []
    for item in data:
        page_view = {}
        for k, v in item.items():
            if k == 'headers':
                accept_language = v['accept-language']
                accept_language = accept_language.split(',')[0]
                country = accept_language_to_country.get(accept_language)
                page_view['country'] = country
            if k == 'time':
                timestamp = v
                page_view['timestamp'] = timestamp
            if k == 'path_params':
                id = v['id']
                post_info = _get_post_info(id)
                page_view['author'] = post_info['author']
                page_view['title'] = post_info['title']
        result.append(page_view)

    return result

def _get_post_info(id):
    post = posts_collection.find_one({"id": int(id)})
    data = json.loads(json_util.dumps(post))
    return data
