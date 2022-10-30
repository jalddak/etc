/* eslint-disable */

const { useLocation, useSearchParams } = require("react-router-dom")
import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Search = ({fade, setFade}) => {
  // const location = useLocation();
  const [serachParams, setSearchParams] = useSearchParams();
  const value = serachParams.get('value');

  let [loading, setLoading] = useState(true);
  let [searchResult, setSearchResult] = useState([]);

  useEffect(()=>{
    const timeOutId = setTimeout(()=>{
      setFade('end')
    },100)

    let cancel
    axios.get(`/api/item/search?value=${value}`,{
      cancelToken: new axios.CancelToken((c) => cancel = c)
    })
    .then((result)=>{ 
      // console.log(result.data);
      let resultItems = [...result.data]
      setSearchResult(resultItems)
      setLoading(false)
    })
    .catch(()=>{
      console.log('실패');
    })

    return () => {
      clearTimeout(timeOutId);
      cancel?.();
    }
  },[fade, value])

  return(
    <div className={`start ${fade}`}>
      <Container>
        {
          loading 
          ? <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          : 
          searchResult.length === 0
          ? <div className="m-5">검색 결과가 없습니다.</div>
          : <Row style={{alignItems: 'center', marginTop: '20px', marginBottom: '20px'}}>
              {
                searchResult.map((item, index)=>{
                  return(
                    <ItemsCard item = {item} index = {index} key = {index}/>
                  )
                })
              }
          </Row>
        }
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

export default Search;