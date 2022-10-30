import { Container } from 'react-bootstrap';
import Pagination from 'react-bootstrap/Pagination';
import axios from 'axios';
import {useEffect} from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PagiNat({page, setPage, setFade}) {
  let navigate = useNavigate();
  let [last, setLast] = useState(1);


  useEffect(()=>{
    axios.get(`/api/item_cnt`)
    .then((result)=>{
      if (result.data.cnt % 20 === 0){
        setLast(parseInt(result.data.cnt/20));
      }
      else setLast(parseInt(result.data.cnt/20+1));
    })
    .catch(()=>{
      console.log('실패');
    })
  },[page])
  return (
    <Container>
    <Pagination className='justify-content-center pagination-sm'>
      {
        page === 1 ? null : <Pagination.First onClick={()=>{
          navigate('/');
          setPage(1);
          setFade('');
        }}/>
      }
      {
        page > 2 ? 
        <>
        <Pagination.Item onClick={()=>{
          navigate(`/pages/${page-2}`);
          setPage(page-2);
          setFade('');
        }}>{page-2}</Pagination.Item>
        <Pagination.Item onClick={()=>{
          navigate(`/pages/${page-1}`);
          setPage(page-1);
          setFade('');
        }}>{page-1}</Pagination.Item>
        </>
        : page === 2 ? 
        <Pagination.Item onClick={()=>{
          navigate(`/pages/${page-1}`);
          setPage(page-1);
          setFade('');
        }}>{page-1}</Pagination.Item>
        : null
      }
      <Pagination.Item active>{page}</Pagination.Item>
      {
        page < last-1 ? 
        <>
        <Pagination.Item onClick={()=>{
          navigate(`/pages/${page+1}`);
          setPage(page+1);
          setFade('');
        }}>{page+1}</Pagination.Item>
        <Pagination.Item onClick={()=>{
          navigate(`/pages/${page+2}`);
          setPage(page+2);
          setFade('');
        }}>{page+2}</Pagination.Item>
        </>
        : page === last-1 ? 
        <Pagination.Item onClick={()=>{
          navigate(`/pages/${page+1}`);
          setPage(page+1);
          setFade('');
        }}>{page+1}</Pagination.Item>
        : null
      }
      {
        page === last ? null : <Pagination.Last onClick={()=>{
          navigate(`/pages/${last}`);
          setPage(last);
          setFade('');
        }}/>
      }
    </Pagination>
    </Container>
  );
}

export default PagiNat;