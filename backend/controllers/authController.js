// import User from "../model/User.js"
// import bcrypt from "bcrypt"
// import jwt from "jsonwebtoken"


// export const register = async (req, res)=>{
//     const { name, email, password } = req.body;

//     const exist = await User.findOne({ email });
//     if (exist) return res.json({
//         message: "Email already exists"
//     });

//     const hashed = await bcrypt.hash(password, 10);

//     const user = await User.create({
//         name,
//         email,
//         password: hashed
//     });

//     return res.json({ message: "User registered", user});
// };

// export const login = async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email });
//   if (!user) return res.json({ message: "User not found" });

//   const match = await bcrypt.compare(password, user.password);
//   if (!match) return res.json({ message: "Invalid credentials" });

//   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

//   return res.json({
//     message: "Login success",
//     token,
//     user
//   });
// };



import User from "../model/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { name, email, password, avatar } = req.body;

  const exist = await User.findOne({ email });
  if (exist) return res.json({ message: "Email already exists" });

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed,
    avatar: avatar || "",   // avatar added
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  return res.json({
    message: "User registered",
    user,
    token,
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  return res.json({
    message: "Login success",
    token,
    user,
  });
};
