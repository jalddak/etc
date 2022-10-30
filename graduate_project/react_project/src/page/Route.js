/* eslint-disable */

import { Routes, Route } from 'react-router-dom';
import Navbar from '../ui/Navbar.js'
import Auth from './Auth.js';
import Register from './Register.js';
import ItemList from './ItemList.js';
import { Rating } from './Rating.js';
import { useEffect, useState } from 'react';
import { createBrowserHistory } from 'history'
import Detail from './Detail.js';
import Search from './Search.js';
import Main from './Main.js';

const history = createBrowserHistory();

const RoutePage = () => {
  let [page, setPage] = useState(1);
  let [fade, setFade] = useState('');
  let [change,setChange] = useState(false);

  useEffect(() => {
    const listenBackEvent = () => {
        // 뒤로가기 할 때 수행할 동작을 적는다
        setFade('');
      };

      const unlistenHistoryEvent = history.listen(({ action }) => {
        if (action === "POP") {
          listenBackEvent();
        }
      });

      return unlistenHistoryEvent;
    }, [
    // effect에서 사용하는 state를 추가
  ]);

  return(
    <Routes>
      <Route path="/" element={
        <>
          <Navbar change={change} setChange={setChange} setPage={setPage} setFade={setFade}/>
          <div className="main-title">Recommender System</div>
          <Main change={change} fade={fade} setFade={setFade}/>
        </>
      } />
      <Route path="pages/:id" element={
        <>
          <Navbar change={change} setChange={setChange} setPage={setPage} setFade={setFade}/>
          <ItemList page={page} setPage={setPage} fade={fade} setFade={setFade}/>
        </>
      } />
      <Route path="/signIn" element={
        <Auth />
      } />
      <Route path="/signUp" element={
        <Register />
      } />
      <Route path="/rating" element={
        <>
          <Navbar change={change} setChange={setChange} setPage={setPage} setFade={setFade}/>
          <Rating />
        </>
      } />
      <Route path="/detail/:id" element={
        <>
          <Navbar change={change} setChange={setChange} setPage={setPage} setFade={setFade}/>
          <Detail />
        </>
      }/>
      <Route path="/search" element={
        <>
          <Navbar change={change} setChange={setChange} setPage={setPage} setFade={setFade}/>
          <Search fade={fade} setFade={setFade} />
        </>
      }/>
      <Route path='*' element={
        <div>잘못된 주소 입력입니다.</div>
      }/>
    </Routes>
  )
}

export default RoutePage;