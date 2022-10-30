/* eslint-disable */

import { useEffect, useState } from "react"
import axios from "axios"
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logIn } from "../store/store";

const Main = ({change, fade, setFade}) => {
  let [items, setItems] = useState([]);
  let [loading, setLoading] = useState(true);
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let access = useSelector((state)=>state.access);
  useEffect(()=>{
    const timeOutId = setTimeout(()=>{
      setFade('end')
    },100)

    return () => {
      clearTimeout(timeOutId);
    }
  },[fade])

  useEffect(()=>{
    const timeOutId = setTimeout(()=>{
      setFade('end')
    },100)

    let cancel;

    axios.get('/api/user/auth')
    .then((authResult)=>{
      // console.log(result)
      if(authResult.data.isAuth){
        dispatch(logIn(authResult.data))
        axios.get(`/api/recommender/${authResult.data._id}`,{
          params: {refresh : false},
          cancelToken: new axios.CancelToken((c) => cancel = c)
        })
        .then((result)=>{ 
          // console.log(result.data.datalist)
          let updateItems = [...result.data.datalist]
          setItems(updateItems)
          setLoading(false);
          // console.log('완료')
        })
        .catch(()=>{
          console.log('요청취소');
        })
      }
      else if(!authResult.data.isAuth){
        axios.get(`/api/recommender`,{
          cancelToken: new axios.CancelToken((c) => cancel = c)
        })
        .then((result)=>{ 
          // console.log(result.data.datalist)
          let updateItems = [...result.data.datalist]
          setItems(updateItems)
          setLoading(false);
          // console.log('완료')
        })
        .catch(()=>{
          console.log('요청취소');
        })
      }
    })
    .catch(()=>console.log('에러'))

    return () => {
      clearTimeout(timeOutId);
      cancel?.();
    }
  },[change])
  
  return(
    <div className={`start ${fade}`}>
      <Container>
        {
          loading 
          ? <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          : 
          <>
          <div className="mt-3 btn btn-outline-dark" onClick={()=>{
            setFade('')
            if(access.isAuth){
              axios.get(`/api/recommender/${access._id}`,{
                params: {refresh : true},
              })
              .then((result)=>{ 
                // console.log(result.data.datalist)
                let updateItems = [...result.data.datalist]
                setItems(updateItems)
                setLoading(false);
                // console.log('완료')
              })
              .catch(()=>{
                console.log('요청취소');
              })
            }

            else if(!access.isAuth){
              axios.get(`/api/recommender`)
              .then((result)=>{ 
                // console.log(result.data.datalist)
                let updateItems = [...result.data.datalist]
                setItems(updateItems)
                setLoading(false);
                // console.log('완료')
              })
              .catch(()=>{
                console.log('요청취소');
              })
            }
          }}>List Of Recommended Items</div>
          <Row style={{alignItems: 'center', marginTop: '20px', marginBottom: '20px'}}>
            {
              items.map((item, index)=>{
                return(
                  <ItemsCard item = {item} index = {index} key = {index}/>
                )
              })
            }
          </Row>
          </>
        }
      </Container>
    </div>
  )
}

function ItemsCard({item}){
  let navigate = useNavigate();
  return(
    <Col md={3} onClick={()=>{navigate(`/detail/${item.item_db_id}`)}} >
      <div className="card mt-2 mb-2" style={{cursor : 'pointer'}} >
        <img src={item.image} className="card-img-top" width='80%'/>
        <div className="card-body">
          <h6 className="card-title target">{item.title}</h6>
        </div>
      </div>
    </Col>
  )
}

export default Main;