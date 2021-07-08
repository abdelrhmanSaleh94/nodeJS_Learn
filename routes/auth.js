const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const router = express.Router();

router.post('/', async(req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).json({ massage: error.details[0].message });

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ massage: 'User Invalid Email' });

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(400).json({ massage: 'User Invalid Password' });
    const token = user.generateWebToken();
    res.json({
        message: "success",
        status: 200,
        token: token
    });
});

function validate(body) {
    const schema = {
        email: Joi.string().min(6).max(255).required().email(),
        password: Joi.string().min(6).max(255).required()
    };
    return Joi.validate(body, schema);
}

module.exports = router;