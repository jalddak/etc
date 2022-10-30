/* eslint-disable */
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  let [email, setEmail] = useState('');
  let [username, setUsername] = useState('');
  let [password, setPassword] = useState('');
  let [passwordCheck, setPasswordCheck] = useState('');
  let [btnColor, setBtnColor] = useState('secondary');
  let [btnDisabled, setBtnDisabled] = useState(true);
  let [fade, setFade] = useState('');
  let [success, setSuccess] = useState(false);
  let [emailDuplicate, setEmailDuplicate] = useState(false);

  let navigate = useNavigate();

  useEffect(()=>{
    const timeOutId = setTimeout(()=>{
      setFade('end');
    }, 100)

    return () => {
      clearTimeout(timeOutId)
    }
  }, [success])

  useEffect(()=>{
    if(email.length > 0 
      && password.length > 0
      && username.length > 0
      && passwordCheck.length > 0
      && password === passwordCheck
      && password.length >= 5
      && username.length <= 20){
       setBtnColor('primary');
       setBtnDisabled(false);
      }
    else {
      setBtnColor('secondary');
      setBtnDisabled(true);
    }
  }, [email, password, username, passwordCheck])

  return(
    <div className={`Auth-form-container start ${fade}`}>
    {
      success 
      ?
      <div className="Auth-form-container">
        <div className="Auth-form">
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">{username}님</h3>
            <div className="mt-3 text-center">
              <label>가입을 축하드립니다.</label>
            </div>
            <div className="mt-3 text-center">
              <button className='btn btn-success' onClick={()=>{
                navigate('/')
              }}>확인</button>
            </div>
          </div>
        </div>
      </div>
      : 
      <div className="Auth-form-container">
        <form className="Auth-form" onSubmit={(e)=>{
          e.preventDefault();
          const signUpData = {
            email: email,
            username: username,
            password: password,
          }
          axios.post('/api/user/register', signUpData)
          .then((result) => {
            // console.log(result)
            if(result.data.success) {
              setSuccess(true);
              setFade('');
            }
            else setEmailDuplicate(true);
          })
          .catch(()=>{alert('서버에 문제가 생겼습니다.')})
        }}>
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Sign Up</h3>
            <div className="form-group mt-3">
              <label>Email</label>
              <input
                type="email"
                className="form-control mt-1"
                placeholder="Enter email"
                onChange={(e) => {setEmail(e.target.value); setEmailDuplicate(false);}}
              />
            </div>
            {
              emailDuplicate ? <div className="alert alert-warning p-2 mt-3">중복된 이메일 입니다.</div> : null
            }
            <div className="form-group mt-3">
              <label>Username</label>
              <input
                type="username"
                className="form-control mt-1"
                placeholder="Enter username"
                onChange={(e) => {setUsername(e.target.value)}}
              />
            </div>
            {
              username.length > 20
              ? <label style={{color:'red'}}>20자 이내로 입력해주세요.</label> : null
            }
            <div className="form-group mt-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control mt-1"
                placeholder="Enter password"
                onChange={(e) => {setPassword(e.target.value)}}
              />
            </div>
            {
              password.length < 5
              ? password.length > 0 
              ? <label style={{color:'red'}}>5자 이상 입력해주세요.</label> 
              : null 
              : null
            }
            <div className="form-group mt-3">
              <label>Password Check</label>
              <input
                type="password"
                className="form-control mt-1"
                placeholder="Enter password"
                onChange={(e) => {setPasswordCheck(e.target.value)}}
              />
            </div>
            {
              password !== passwordCheck
              ? <label style={{color:'red'}}>비밀번호를 다시 확인해주세요.</label> : null
            }
            <div className="d-grid gap-2 mt-3 mb-2">
              <button className={`btn btn-${btnColor}`} type="submit" disabled={btnDisabled}>
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    }
    </div>
  )
}

export default Register;