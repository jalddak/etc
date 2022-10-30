/* eslint-disable */

import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { useSelector, useDispatch } from 'react-redux';
import { changeRate, deleteRate } from './../store/store.js'
import axios from 'axios';
import { logIn } from './../store/store.js';
import { useNavigate } from 'react-router-dom';
import { render } from 'react-dom';

function Rating(){
  let [fade, setFade] = useState('');
  let access = useSelector((state)=>state.access);
  let [ratings, setRatings] = useState([]);
  let dispatch = useDispatch();
  let navigate = useNavigate();

  useEffect(()=>{
    const timeOutId = setTimeout(()=>{
      setFade('end');
    }, 100)

    let cancel;

    axios.get('/api/user/auth')
        .then((authResult)=>{
          // console.log(authResult)
          if(authResult.data.isAuth){
            dispatch(logIn(authResult.data))
            axios.get(`/api/rating`, {
              params: {
                user_id: authResult.data._id,
              },
              cancelToken: new axios.CancelToken((c) => cancel = c)
            })
            .then((ratingResult)=>{
              // console.log(ratingResult)
              let updateRatings = [...ratingResult.data]
              // console.log(updateRatings)
              setRatings(updateRatings);
            })
            .catch(()=>console.log('오류'))
          }
        })
        .catch(()=>console.log('에러'))

    return () => {
      clearTimeout(timeOutId);
      cancel?.();
    }
  }, [])

  useEffect(()=>{
    const timeOutId = setTimeout(()=>{
      setFade('end');
    }, 100)
    return () => {
      clearTimeout(timeOutId);
    }
  }, [ratings])

  return(
    <div className={`start ${fade}`}>
      <Table>
        <thead>
          <tr>
            <th className='cell-hide'>Id</th>
            <th>Title</th>
            <th className='cell-hide'>Rating</th>
            <th className='cell-hide'>Delete</th>
          </tr>
        </thead>
        {
          ratings.map((rating, i)=>{
            return(
              <tbody key={i}>
                <tr className='rating-center'>
                  <th className='cell-hide' style={{fontWeight : 'normal'}}>{rating.item_id}</th>
                  <th style={{cursor : 'pointer', fontWeight : 'normal'}} onClick={()=>{
                    navigate(`/detail/${rating._id}`)
                  }}>{rating.title}</th>
                  <th className='cell-hide'>
                    <StarIcon index={i} ratings={ratings} setRatings={setRatings}/>
                  </th>
                  <th className='cell-hide'>
                    <svg style={{cursor : 'pointer'}} xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="red" className="bi bi-check-circle" viewBox="0 0 16 16"
                    onClick={()=>{
                      axios.delete('/api/rating/delete',{
                        data: {
                          user_id: access._id,
                          item_id: rating.item_id,
                      }})
                      .then((result)=>{
                        if(result.data.success) {
                          console.log('삭제완료');
                          let duplicate = [...ratings]
                          duplicate.splice(i, 1);
                          setRatings(duplicate);
                        }
                        else console.log('삭제안됨');
                      })
                      .catch(()=>console.log('서버오류'))
                    }}>
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                      <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                    </svg>
                  </th>
                </tr>
              </tbody>
            )
          })
        }
      </Table>
    </div>
  )
}

const StarIcon = ({index, ratings, setRatings}) => {
  let score = ratings[index].rating;
  let access = useSelector((state)=>state.access)
  // console.log(ratings[0].rating)

  const iter = new Array(5).fill(0);

  return(
    iter.map((value, i) => {
      if (i < score){
        return(
          <svg key={i} style={{cursor : 'pointer', marginLeft : '2px'}} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#FDD400" className="bi bi-star-fill" viewBox="0 0 16 16"
            onClick={()=>{
              // console.log('크작체크', access._id, item.item_id, score)
              const updateRatingData = {
                user_id: access._id,
                item_id: ratings[index].item_id,
                rating: i+1,
              }

              if(score === 0){
                axios.post('/api/rating/add', updateRatingData)
                .then((result) => {
                  // console.log(result)
                  if(result.data.success) {
                    console.log('저장완료')
                  }
                  else console.log('저장안됨');
                })
                .catch(()=>{alert('서버에 문제가 생겼습니다.')})
              }
              else{
                axios.put('/api/rating/put', updateRatingData)
                .then((result) => {
                  // console.log(result)
                  if(result.data.success) {
                    console.log('수정완료')
                  }
                  else console.log('수정안됨');
                })
                .catch(()=>{alert('서버에 문제가 생겼습니다.')})
              }
              let duplicate = [...ratings];
              duplicate[index].rating = i+1;
              setRatings(duplicate);
            }}
          >
            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
          </svg>
        )
      }
      else{
        return(
          <svg key={i} style={{cursor : 'pointer', marginLeft : '2px'}} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="grey" className="bi bi-star" viewBox="0 0 16 16"
          onClick={()=>{
            // console.log('크작체크', access._id, item.item_id, score)
            const updateRatingData = {
              user_id: access._id,
              item_id: ratings[index].item_id,
              rating: i+1,
            }

            if(score === 0){
              axios.post('/api/rating/add', updateRatingData)
              .then((result) => {
                // console.log(result)
                if(result.data.success) {
                  console.log('저장완료')
                }
                else console.log('저장안됨');
              })
              .catch(()=>{alert('서버에 문제가 생겼습니다.')})
            }
            else{
              axios.put('/api/rating/put', updateRatingData)
              .then((result) => {
                // console.log(result)
                if(result.data.success) {
                  console.log('수정완료')
                }
                else console.log('수정안됨');
              })
              .catch(()=>{alert('서버에 문제가 생겼습니다.')})
            }
            let duplicate = [...ratings];
            duplicate[index].rating = i+1;
            setRatings(duplicate);
          }}
          >
            <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
          </svg>
        )
      }
    })
  )
}

export {Rating};