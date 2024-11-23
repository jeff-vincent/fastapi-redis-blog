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
            if k == 'author':
                author = v
                page_view['author'] = author
            if k == 'title':
                title = v
                page_view['title'] = title
        result.append(page_view)

    return result


