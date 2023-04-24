const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../config/generateToken');
const AuthenticationContext = require('adal-node').AuthenticationContext;
const axios = require('axios');
const jwt = require('jsonwebtoken')
const qs = require('qs');
const request = require('request');
const util = require('util');

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please Enter all the Feilds');
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('User not found');
  }
});

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } },
        ],
      }
    : {};
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send({
    _id: users._id,
    name: users.name,
    email: users.email,
    isAdmin: users.isAdmin,
    pic: users.pic
  });
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid Email or Password');
  }
});


const loginAzure = asyncHandler(async (req, res) => {
  const authorityHostUrl = 'https://login.microsoftonline.com';
  const tenant = process.env.TENANT_ID;
  const applicationId = process.env.CLIENT_ID;
  const authorityUrl = authorityHostUrl + '/' + tenant + '/oauth2/v2.0/token';
  const clientSecret = process.env.CLIENT_SECRET;
  const resource = 'https://graph.microsoft.com/.default';
  const redirectUri = process.env.REDIRECT_URI;
  const templateAuthzUrl = 'https://login.microsoftonline.com/common/oauth2/authorize?response_type=code&client_id=%s&redirect_uri=%s&state=%s&resource=%s';

  const authzUrl = util.format(templateAuthzUrl, applicationId, redirectUri, '12345', resource);
  res.redirect(authzUrl);

  const authenticationContext = new AuthenticationContext(authorityUrl);
  const tokenResponse = await authenticationContext.acquireTokenWithAuthorizationCode(
    req.query.code,
    redirectUri,
    resource, 
    applicationId,
    clientSecret
  );

  const accessToken = tokenResponse.accessToken;
  console.log(tokenResponse)
  // res.json(accessToken)
});


const getAllDataAzure = asyncHandler(async (req, res) => {
  // const token = req.cookies.token;
  const token = process.env.TOKEN_AZURE;

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
  
  const apiUrl = 'https://graph.microsoft.com/v1.0/me';
  
  try {
    const response = await axios.get(apiUrl, { headers });
    res.json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      res.status(401).json({ message: 'Unauthorized' });
    } else if (error.response && error.response.status === 400) {
      console.log(error.response.data);
      res.status(400).json({ message: 'Bad Request', error: error.response.data });
    } else {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' , error});
    }
  }
});


module.exports = { allUsers, registerUser, authUser, loginAzure, getAllDataAzure };
