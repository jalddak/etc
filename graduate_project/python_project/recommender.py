import pandas as pd
import sys
import numpy as np
import json
import pymongo
import certifi
from sklearn.feature_extraction.text import CountVectorizer
from numpy import dot
from numpy.linalg import norm
import scipy.sparse.linalg

DB_URL='mongodb+srv://admin:jangtong@free.y30gnah.mongodb.net/graduate?retryWrites=true&w=majority'
connection = pymongo.MongoClient(DB_URL, tlsCAFile=certifi.where())
db = connection['graduate']

def cos_sim(A, B):
    return dot(A, B)/(norm(A) * norm(B))

def content_based():
    meta = db['items'].find()
    meta_list = list(meta)
    meta_data = pd.DataFrame(meta_list)

    meta_data = meta_data[['item_id', 'category']].set_index(keys=['item_id'], inplace=False, drop=True)
    category_array = []
    for category in meta_data['category']:
        category_array.append(' '.join(c for c in category))
    meta_data['category'] = category_array

    cv = CountVectorizer()
    category = cv.fit_transform(meta_data.category)
    cv.vocabulary_
    category = pd.DataFrame(
        category.toarray(),
        columns=list(sorted(cv.vocabulary_.keys(), key=lambda x: cv.vocabulary_[x]))
    )
    category = category.set_index(keys=meta_data.index, inplace=False, drop=True)
    return category

def recommend_movies(df_svd_preds, user_id, already_rated_item_id, num_recomendations=100):

    # 최종 예측 df_svd_preds에서 해당 사용자 index에 따라 영화
    sorted_user_predictions = df_svd_preds.loc[user_id].sort_values(ascending=False)
    sorted_user_predictions = sorted_user_predictions.drop(already_rated_item_id)
    top = sorted_user_predictions.head(num_recomendations)

    return top

def matrix_factorization(user_id, already_rated_item_id):
    rating = db['ratings'].find()
    rating_list = list(rating)
    rating_data = pd.DataFrame(rating_list)

    rating_table = rating_data.pivot_table('rating', index='user_id', columns='item_id').fillna(0)

    matrix = rating_table.to_numpy()
    user_ratings_mean = np.mean(matrix, axis=1)
    matrix_user_mean = matrix - user_ratings_mean.reshape(-1, 1)

    U, sigma, Vt = scipy.sparse.linalg.svds(matrix_user_mean, k=3)
    sigma = np.diag(sigma)
    # U, sigma, Vt 의 내적을 통해 다시 원본 행렬로 복원함, 이후 사용자 평균 rating을 적용
    svd_user_predicted_ratings = np.dot(np.dot(U, sigma), Vt) + user_ratings_mean.reshape(-1, 1)

    df_svd_preds = pd.DataFrame(svd_user_predicted_ratings, columns=rating_table.columns)
    df_svd_preds = df_svd_preds.set_index(keys=rating_table.index, inplace=False, drop=True)

    top = recommend_movies(df_svd_preds, user_id, already_rated_item_id, 50)
    return top

def recommender(user_id):
    rating = db['ratings'].find({'user_id' : user_id})
    rating_list = list(rating)
    rating_data = pd.DataFrame(rating_list)
    user_rating_dict = { 
        item_id:rating 
        for item_id,rating 
        in zip(list(rating_data['item_id']), list(rating_data['rating']))
    }

    category = content_based()
    # print(category)
    top = matrix_factorization(user_id, list(user_rating_dict.keys()))
    # print()
    # print(top)
    top_rating_dict = top.to_dict()

    weight_dict = {}
    for user_item_id, user_rating in user_rating_dict.items():
        for top_item_id, top_rating in top_rating_dict.items():
            weight = cos_sim(category.loc[user_item_id]\
                , category.loc[top_item_id]) * user_rating
            if top_item_id not in weight_dict:
                weight_dict[top_item_id] = weight
            else:
                weight_dict[top_item_id] += weight
    
    for top_item_id, top_rating in top_rating_dict.items():
        weight_dict[top_item_id] *= top_rating
    
    result_list = []
    rank = 0
    top_20 = list(dict(sorted(weight_dict.items(), key=lambda x: x[1], reverse=True)[:20]).keys())
    for item_id in top_20:
        data = db['items'].find_one({'item_id' : item_id})
        data = list(data.values())
        result_dict = {}
        result_dict['item_db_id'] = str(data[0])
        result_dict['title'] = str(data[2])
        result_dict['image'] = str(data[6][0])
        result_dict['rank'] = rank
        rank += 1
        result_list.append(result_dict)
        # print(result_dict)
    
    result_dict = {}
    result_dict['name'] = user_id
    result_dict['datalist'] = result_list

    delete = db['recommenders'].delete_many({'name' : user_id})
    insert = db['recommenders'].insert_one(result_dict);
    print(user_id + ' recommend : ' + str(insert.inserted_id))


if __name__ == "__main__":
    recommender(sys.argv[1])