/* eslint-disable */
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { logIn } from '../store/store';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  let access = useSelector((state) => state.access);
  let dispatch = useDispatch();

  let navigate = useNavigate();

  let [email, setEmail] = useState('');
  let [password, setPassword] = useState('');
  let [btnColor, setBtnColor] = useState('secondary');
  let [btnDisabled, setBtnDisabled] = useState(true);
  let [fade, setFade] = useState('');
  let [reason, setReason] = useState('');
  let [message, setMessage] = useState('');

  useEffect(()=>{
    const timeOutId = setTimeout(()=>{
      setFade('end');
    }, 100)

    return () => {
      clearTimeout(timeOutId)
    }
  }, [])

  useEffect(()=>{
    if(email.length > 0 && password.length > 0){
       setBtnColor('primary');
       setBtnDisabled(false);
      }
    else {
      setBtnColor('secondary');
      setBtnDisabled(true);
    }
  }, [email, password])

  return(
    <div className={`Auth-form-container start ${fade}`}>
      <div className="Auth-form-container">
        <form className="Auth-form" onSubmit={(e)=>{
          e.preventDefault();
          const logInData = {
            email: email,
            password: password,
          }
          axios.post('/api/user/login', logInData)
          .then((result) => {
            // console.log(result)
            if(result.data.loginSuccess) {
              axios.get('/api/user/auth')
              .then((result)=>{
                // console.log(result)
                dispatch(logIn(result.data))
                navigate('/');
              })
              .catch(()=>console.log('에러'))
            }
            else {
              setReason(result.data.reason);
              setMessage(result.data.message);
            }
          })
          .catch(()=>{alert('서버에 문제가 생겼습니다.')})
        }}>
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Sign In</h3>
            <div className="form-group mt-3">
              <label>Email</label>
              <input
                type="email"
                className="form-control mt-1"
                placeholder="Enter email"
                onChange={(e)=>{setEmail(e.target.value); setReason('');}}
              />
            </div>
            {
              reason === 'email' ? <div className="alert alert-warning p-2 mt-3">{message}</div> : null
            }
            <div className="form-group mt-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control mt-1"
                placeholder="Enter password"
                onChange={(e)=>{setPassword(e.target.value); setReason('');}}
              />
            </div>
            {
              reason === 'password' ? <div className="alert alert-warning p-2 mt-3">{message}</div> : null
            }
            <div className="d-grid gap-2 mt-3 mb-2">
              <button type="submit" className={`btn btn-${btnColor}`} disabled={btnDisabled}>
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Auth;