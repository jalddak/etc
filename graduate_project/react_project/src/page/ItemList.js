/* eslint-disable */
 
import { useEffect, useState } from "react";
import { Container, Col, Row, PageItem } from "react-bootstrap";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from "react-router-dom";
import { plusProduct, resetProducts } from "../store/products";
import { createBrowserHistory } from 'history'
import PagiNat from '../ui/Pagenation.js'

const history = createBrowserHistory();

const ItemList = ({page, setPage, fade, setFade, change}) => {
  let [items, setItems] = useState([]);
  let [loading, setLoading] = useState(true);

  let products = useSelector((state)=>state.products);
  let dispatch = useDispatch();

  const {id} = useParams();

  useEffect(()=>{
    const timeOutId = setTimeout(()=>{
      setFade('end')
    },100)
    setPage(Number(id));
    let cancel
    axios.get(`/api/item/${page}`,{
      cancelToken: new axios.CancelToken((c) => cancel = c)
    })
    .then((result)=>{ 
      // dispatch(resetProducts())
      // result.data.forEach(element => {
      //   dispatch(plusProduct(element))
      // });
      // console.log(products)
      // console.log(result.data, page)
      let updateItems = [...result.data]
      setItems(updateItems)
      setLoading(false);
    })
    .catch(()=>{
      console.log('요청취소');
    })

    return () => {
      clearTimeout(timeOutId);
      cancel?.();
    }
  },[page, fade])
  
  return(
    <div className={`start ${fade}`}>
      <Container>
        {
          loading 
          ? <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          : <Row style={{alignItems: 'center', marginTop: '20px', marginBottom: '20px'}}>
              {
                items.map((item, index)=>{
                  return(
                    <ItemsCard item = {item} index = {index} key = {index}/>
                  )
                })
                // products.map((item, index)=>{
                //   console.log(products,index)
                //   return(
                //     <ItemsCard item = {item} index = {index} key = {index}/>
                //   )
                // })
              }
          </Row>
        }
        <PagiNat page={page} setPage={setPage} setFade={setFade}/>
      </Container>
    </div>
  )
}

function ItemsCard({item}){
  let navigate = useNavigate();
  return(
    <Col md={3} onClick={()=>{navigate(`/detail/${item._id}`)}} >
      <div className="card mt-2 mb-2" style={{cursor : 'pointer'}} >
        <img src={item.imageURLHighRes[0]} className="card-img-top" width='80%'/>
        <div className="card-body">
          <h6 className="card-title target">{item.title}</h6>
        </div>
      </div>
    </Col>
  )
}

export default ItemList;