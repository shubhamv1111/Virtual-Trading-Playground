const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const errorMessage = (res, error) => {
  return res.status(400).json({ status: "fail", message: error.message });
};
// created registerUser api route
exports.registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)  {
      return res.status(200).json({ status: "fail", message: "Not all fields have been entered", });
    }

    if (password.length < 6 || password.length > 40) {
      return res.status(200).json({ status: "fail",message: "Password must be between 6-40 characters",type: "password",});
    }

    const existingUser = await User.findOne({ username }); // check if username already exists

    if (existingUser) {
      return res.status(200).json({ status: "fail", message: "An account with this username already exists.",type: "username",});
    }
    // created salt and hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, password: hashedPassword });
    const savedUser = await newUser.save(); // it will return object id of saved user
    res.status(201).json(savedUser);
    
  } catch (error) {
    return errorMessage(res, error);
  }
};
// created loginUser api route
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(200).json({status: "fail",message: "Not all fields have been entered.",});
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(200).json({ status: "fail",message: "Invalid credentials. Please try again.",});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(200).json({ status: "fail", message: "Invalid credentials. Please try again.",});
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); // create jwt token
    return res.status(200).json({ token,user: {username,id: user._id, balance: user.balance,},});

  } catch (error) {
    return errorMessage(res, error);
  }
};

exports.logingoogle = async (req, res) => {
  // console.log("logingoogle",);
  try {
    const { username, password } = req.body;
    // console.log("logingoogle",username,password);

    if (!username || !password) {
      return res.status(200).json({status: "fail",message: "Not all fields have been entered.",});
    }

    const user = await User.findOne({ username });

    if (user) {

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); // create jwt token
      
      return res.status(200).json({ token,user: {username,id: user._id, balance: user.balance,},});
  }

  // all correct till here
  console.log("oh yes");
  const newUser = new User({ username, password });
  const savedUser = await newUser.save(); // it will return object id of saved user
 
  
    
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET); // create jwt token
    return res.status(200).json({ token,user: {username,id: savedUser._id, balance: 100000,},});

  } catch (error) {
    return errorMessage(res, error);
  }
};

exports.validate = async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) {
      return res.json(false);
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!verified) {
      return res.json(false);
    }

    const user = await User.findById(verified.id);
    if (!user) {
      return res.json(false);
    }

    return res.json(true);
  } catch (error) {
    return res.json(false);
  }
};
