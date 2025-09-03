
const pool=require('../db');
const bcrypt= require('bcrypt');
const jwt=require('jsonwebtoken');


exports.signup = async (req,res)=>{
    const {username,password}=req.body;
    
    try {
        // Check if username already exists
        const [existingUsers] = await pool.query('SELECT * FROM users WHERE username = ?',[username]);
        if (existingUsers.length > 0) {
            return res.status(400).json({error : 'Username already exists'});
        }
        
        // Hash password and create user
        const hashed = await bcrypt.hash(password,10);
        await pool.query('INSERT INTO users (username,password) VALUES (?,?)',[username,hashed]);
        res.status(201).json({message: 'User created successfully'});

    }catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({error : 'Internal server error'});
    }
};

exports.login = async (req,res) =>{
    const {username , password}=req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?',[username]);
        const user = rows[0];

        if(!user || !(await bcrypt.compare(password,user.password))){
            return res.status(401).json({error: 'Invalid credentials'});
        }
        
        const token = jwt.sign({userId: user.id},process.env.JWT_SECRET,{expiresIn:'1h'});
        res.json({token});
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};
