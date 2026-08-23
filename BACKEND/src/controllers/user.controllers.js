 import httpStatus from "http-status";
 import { User } from "../models/user.models.js";
 import bcrypt, { hash } from "bcrypt";
 import crypto from "node:crypto";
 import jwt from "jsonwebtoken";


 const login = async (req, res) => {
    const { username , password } = req.body;

    if(!username || !password){
        return res.status(400).json({message: "Please provide"})
    }
    try{
        const user = await User.findOne({ username }).select("+password");
        if (!user) {
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
            message: "Invalid username or password"
            });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(httpStatus.OK).json({
            token: token
        });

    } catch (e) {
    console.error("Login error:", e);

    return res.status(500).json({
        message: "Something went wrong"
    });
}
 }


 const register = async (req, res)=> {
    const { name, username, password } = req.body;

    if (!name || !username || !password) {
        return res.status(400).json({
            message: "Name, username and password are required"
        });
    }

    if (password.length < 8) {
        return res.status(400).json({
            message: "Password must be at least 8 characters"
        });
    }

    try{
        const existingUser = await User.findOne({ username });
        if(existingUser){
            return res.status(httpStatus.FOUND).json({message: "User account already exists"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name: name,
            username: username,
            password: hashedPassword
        });

        await newUser.save();

        res.status(httpStatus.CREATED).json({message: "User Registered"});
    } catch (e) {
    console.log("ERROR:", e); 
    res.status(500).json({ message: "Something went wrong" });
}
 }

//  const forgotPassword = async (req, res) => {
//     const { email } = req.body;

//     if (!email) {
//         return res.status(400).json({
//             message: "Email is required"
//         });
//     }

//     try {
//         const user = await User.findOne({
//             email: email.toLowerCase().trim()
//         });

//         // Don't reveal whether an account exists
//         if (!user) {
//             return res.status(200).json({
//                 message: "If an account exists, a reset link has been sent."
//             });
//         }

//         const resetToken = crypto.randomBytes(32).toString("hex");

//         user.resetPasswordToken = crypto
//             .createHash("sha256")
//             .update(resetToken)
//             .digest("hex");

//         user.resetPasswordExpires =
//             Date.now() + 15 * 60 * 1000;

//         await user.save();

//         console.log("PASSWORD RESET TOKEN:", resetToken);

//         return res.status(200).json({
//             message: "If an account exists, a reset link has been sent."
//         });

//     } catch (error) {
//         console.error("Forgot password error:", error);

//         return res.status(500).json({
//             message: "Something went wrong"
//         });
//     }
//     };


export {
    login,
    register
    
};