const { User, validate } = require('../models/user');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');
const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const router = express.Router();

router.post('/', async(req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).json({ massage: error.details[0].message });

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).json({ massage: 'User already reistered' });

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();
    const token = user.generateWebToken();

    res.header('x-auth-token', token);
    res.json(_.pick(user, ['name', 'email']));

});

module.exports = router;