import pandas as pd
import numpy as np
import json
import pymongo
import certifi

DB_URL='mongodb+srv://admin:jangtong@free.y30gnah.mongodb.net/graduate?retryWrites=true&w=majority'
connection = pymongo.MongoClient(DB_URL, tlsCAFile=certifi.where())
db = connection['graduate']

def popular_calc():
    meta = db['items'].find()
    meta_list = list(meta)
    meta_data = pd.DataFrame(meta_list)
    rating = db['ratings'].find()
    rating_list = list(rating)
    rating_data = pd.DataFrame(rating_list)
    
    meta_data = meta_data[['item_id', 'title', 'imageURLHighRes', '_id']].set_index(keys=['item_id'], inplace=False, drop=True)
    data_ratings = rating_data.groupby('item_id').agg({"rating": ['count', 'mean']})
    data_ratings['title'] = meta_data.title
    data_ratings['image'] = meta_data.imageURLHighRes
    data_ratings['item_db_id'] = meta_data._id
    data_ratings = data_ratings[data_ratings[('rating', 'count')] >= 50]\
        .sort_values([('rating','count'), ('rating', 'mean')]\
        , ascending=[False, False]).head(20)
    rank = []
    for i in range(len(data_ratings)):
        rank.append(i)
    data_ratings['rank'] = rank
    # print(data_ratings.index)
    data_ratings = data_ratings[['item_db_id', 'title', 'image', 'rank']]
    data_ratings = data_ratings.to_numpy()
    # print(data_ratings)

    result_list = []
    for data in data_ratings:
        result_dict = {}
        result_dict['item_db_id'] = str(data[0])
        result_dict['title'] = str(data[1])
        result_dict['image'] = str(data[2][0])
        result_dict['rank'] = data[3]
        result_list.append(result_dict)
    # print(result_list)

    result_dict = {}
    result_dict['name'] = 'popular'
    result_dict['datalist'] = result_list

    delete = db['recommenders'].delete_many({'name' : 'popular'})
    insert = db['recommenders'].insert_one(result_dict);
    print('popular : ' + str(insert.inserted_id))

if __name__ == "__main__":
    popular_calc()