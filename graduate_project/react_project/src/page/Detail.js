/* eslint-disable */

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logIn } from "../store/store";

const Detail = () => {
  let [fade, setFade] = useState(``);
  let [loading, setLoading] = useState(true);
  let [item, setItem] = useState({});
  const {id} = useParams();
  let [score, setScore] = useState(0);

  let access = useSelector((state)=>state.access);
  let dispatch = useDispatch();

  useEffect(()=>{
    const timeOutId = setTimeout(()=>{
      setFade(`end`);
    },100)

    let cancel
    axios.get(`/api/item/detail/${id}`,{
      cancelToken: new axios.CancelToken((c) => cancel = c)
    })
    .then((result)=>{
      if(result.data !== null) {
        // console.log(result.data)
        let updateItem = {...result.data}
        setItem(updateItem)
        setLoading(false);
        axios.get('/api/user/auth')
        .then((authResult)=>{
          // console.log(auth)
          if(authResult.data.isAuth){
            dispatch(logIn(authResult.data))
            axios.get(`/api/rating/detail`, {
              params: {
                user_id: authResult.data._id,
                item_id: result.data.item_id,
              }
            })
            .then((ratingResult)=>{
              // console.log(result)
              if(ratingResult.data !== null){
                setScore(ratingResult.data.rating);
              }
            })
            .catch(()=>console.log('오류'))
          }
        })
        .catch(()=>console.log('에러'))
      }
      else setLoading(false);
    })
    .catch(()=>{
      console.log('실패');
    })

    return () => {
      clearTimeout(timeOutId);
      cancel?.();
    }
  }, [])
  // let shoe = props.shoes.find(element => element.id === Number(id))
  
  // if (!shoe) return <div>없는페이지입니다.</div>
  return(
    <div className={`container mt-3 start ${fade}`}>
    {
      loading 
      ? <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      :
      Object.keys(item).length !== 0
      ?
        <div className="row">
          <div className="col-md-12">
            <img src={item.imageURLHighRes[0]} width="50%"/>
          </div>
          <div className="col-md-12">
            <h3 className="mt-3">{item.title}</h3>
            <h6>{item.brand}</h6>
            {
              item.category.map((category, index)=>{
                return(
                  <button className="btn-sm m-1 btn btn-outline-dark" onClick={(e)=>{e.preventDefault()}} key={index}>{category}</button>
                )
              })
            }
          </div>
        </div> 
      :
        <div>없는 페이지 입니다.</div>
    }
    {
      access.isAuth
      ? 
      <>
        <StarIcon score={score} setScore={setScore} item={item}/>
        <button className="btn btn-outline-danger mt-3" onClick={()=>{
          axios.delete('/api/rating/delete',{
            data: {
              user_id: access._id,
              item_id: item.item_id,
          }})
          .then((result)=>{
            if(result.data.success) {
              console.log('삭제완료');
              setScore(0);
            }
            else console.log('삭제안됨');
          })
          .catch(()=>console.log('서버오류'))
        }}>Rating Delete</button>
      </>
      : null
    }
    </div>
  )
}

const StarIcon = ({score, setScore, item}) => {
  let access = useSelector((state)=>state.access)

  const iter = new Array(5).fill(0);

  return(
    <div className="mt-3">
    {
    iter.map((value, i) => {
      if (i < score){
        return(
          <svg key={i} style={{cursor : 'pointer', marginLeft : '3px'}} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#FDD400" className="bi bi-star-fill" viewBox="0 0 16 16"
          onClick={()=>{
            // console.log('크작체크', access._id, item.item_id, score)
            const updateRatingData = {
              user_id: access._id,
              item_id: item.item_id,
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
            setScore(i+1)
          }}>
            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
          </svg>
        )
      }
      else{
        return(
          <svg key={i} style={{cursor : 'pointer', marginLeft : '3px'}} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="grey" className="bi bi-star" viewBox="0 0 16 16"
            onClick={()=>{
              // console.log('작크체크', access._id, item.item_id, score)
              const updateRatingData = {
                user_id: access._id,
                item_id: item.item_id,
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
              setScore(i+1)
            }}
          >
            <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
          </svg>
        )
      }
    })
  }
  </div>
  )
}

export default Detail