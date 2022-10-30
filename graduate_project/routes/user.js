const { response, application } = require('express');
const { User } = require('./../models/User.js')
const { auth } = require('./../middleware/auth.js')

let router = require('express').Router();
let ObjectId = require('mongodb').ObjectId;

router.post('/register', (req, res)=>{
    // console.log(req.body)
    const user = new User(req.body);
    // console.log(user)

    user.save((err, userInfo) => {
        if(err) {
            // console.log(err);
            return res.json({ success: false, err})
        };
        return res.status(200).json({ success : true, })
    })
})

router.post("/login", (req, res) => {
    //1. 요청된 이메일이 데이터베이스에 있는 지 찾는다.
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                reason: 'email',
                message: "이메일에 해당하는 유저가 없습니다.",
            });
        }
        //2. 1조건 충족 시, 비번 맞는 지 확인
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({
                    loginSuccess: false,
                    reason: 'password',
                    message: "비밀번호가 틀렸습니다.",
                });
            //3. 2조건 충족 시, 토큰 생성
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                //토큰을 저장한다. where? 쿠키 OR 로컬 스토리지 OR 세션스토리지
                //쿠키 name : value
                res
                    .cookie("x_auth", user.token)
                    .status(200)
                    .json({ loginSuccess: true, userId: user._id });
            });
        });
    });
});

//Authentication 자격 (관리자화면, 비회원화면)
//auth는 미들웨어
router.get("/auth", auth, (req, res) => {
    // console.log(req.user)
    //여기까지 오면 미들웨어를 통과했다는 거임
    //그렇다면 Auth가 True라는 뜻
    res.status(200).json({
        _id: req.user._id,
        isAuth: true,
        email: req.user.email,
        username: req.user.username,
    });
});
  
//LogOut
router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({ success: true });
    });
});

module.exports = router;