/* eslint-disable */

import { useEffect, useState } from 'react';
import { Navbar, Container, Nav, NavDropdown, Form, Button} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { logOut, logIn } from '../store/store';

const NavigationBar = ({change, setChange, setPage, setFade}) => {
  let access = useSelector((state)=>state.access);
  let dispatch = useDispatch();

  let navigate = useNavigate();
  
  let [searchValue, setSearchValue] = useState('');

  useEffect(()=>{
    axios.get('/api/user/auth')
    .then((result)=>{
      // console.log(result)
      if(result.data.isAuth){
        dispatch(logIn(result.data))
        console.log('인증완료')
      }
    })
    .catch(()=>console.log('에러'))
  }, [])

  return(
    <Navbar collapseOnSelect expand="md" bg="light" variant="light">
      <Container>
        <Navbar.Brand onClick={()=>{
            navigate('/')
            setFade('');
            change ? setChange(false) : setChange(true)
          }}>
          <Nav.Link>Recommender</Nav.Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav.Link onClick={()=>{
            navigate('/pages/1')
            setPage(1)
            setFade('');
          }}>List</Nav.Link>
          <Nav className="ms-auto">
            <Form className='d-flex' style={{ margin:'10px'}} 
              onSubmit={(e)=>{
                e.preventDefault();
                if (searchValue.length >= 2){
                  navigate(`/search?value=${searchValue}`);
                }
                else alert('두글자 이상만 검색 가능합니다.')
              }}
              onChange={(e)=>{
                // console.log(e.target.value);
                setSearchValue(e.target.value);
            }}>
              <Form.Control
                type='search'
                placeholder='search'
                className='me-2'
                aria-label='Search' />
              <Button variant="outline-success" type='submit' >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
              </Button>
            </Form>
            {
              access.isAuth ?
              null :
              <Nav.Link style={{marginTop:'8px'}} 
                onClick={()=>{navigate('/signIn')}}>Sign In</Nav.Link>
            }
            {
              access.isAuth ?
              null :
              <button className='btn btn-outline-primary' style={{ margin:'10px'}} 
                onClick={()=>{navigate('/signUp')}}>Sign Up</button>
            }
            {
              access.isAuth ?
              <NavDropdown className='mt-2' title={`${access.username} 님`} id='basic-nav-dropdown'>
                <NavDropdown.Item onClick={()=>{navigate('/rating')}}>Rating</NavDropdown.Item>
                <NavDropdown.Item onClick={()=>{
                  axios.get('/api/user/logout')
                  .then((result)=>{
                    if(result.data.success){
                      dispatch(logOut())
                      setFade('');
                      change ? setChange(false) : setChange(true)
                      navigate('/');
                    }
                  })
                  .catch(()=>console.log('에러'))
                }}>Sign Out</NavDropdown.Item>
              </NavDropdown>
              : null
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavigationBar; 