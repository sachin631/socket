const  { user_register, user_login, user_logout, user_list, user_details } =require("../controller/user.auth.controller");
const express = require("express");
const { login_middleware } = require("../middleware/loginMiddleware");
const user_auth_router = express.Router();

user_auth_router.post("/user/register", user_register) ;
user_auth_router.post('/user/login',user_login);
user_auth_router.get('/user/logout',user_logout); 
user_auth_router.get('/user/user_list',user_list);
user_auth_router.get('/user/details',login_middleware,user_details)

module.exports= user_auth_router;
