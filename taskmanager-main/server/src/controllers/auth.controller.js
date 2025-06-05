import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/EmailVerfication.js";
import Notice from '../models/notification.model.js'

export const register = async (req, res) => {
  try {
    const { name, email, password, isAdmin, role } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "user already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      isAdmin,
      role,
      password: hashPassword,
    });


    await newUser.save();
    console.log(newUser);


    const mailOption = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Welcome to Task Management System - 2025',
      text: 'You have successfully logged in to Task Management System - 2025',
    }

   await transporter.sendMail(mailOption); 
   
   if (user) {
    isAdmin ? createJWT(res, user._id) : null;

    user.password = undefined;

    res.status(201).json(user);
  } else {
    return res
      .status(400)
      .json({ status: false, message: "Invalid user data" });
  }

    return res.status(200).json({
      success: true,
      message: "user created",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Generate token with userId
    const token = jwt.sign(
      {
        userId: existingUser._id,
        email: existingUser.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Set token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Response payload
    res.status(200).json({
      success: true,
      _id: existingUser._id,
      name: existingUser.name,
      email: existingUser.email,
      isAccountVerified: existingUser.isAccountVerified,
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("access_token", {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        secure: process.env.NODE_ENV === " production" ? true : false,
        path: "/",
    });
    return res.status(200).json({
      success: true,
      message: "logout success",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const sendVerifyOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.isAccountVerified) {
      return res.status(400).json({
        success: false,
        message: "User already verified"
      });
    }

    // Generate a 6-digit OTP
    const OTP = Math.floor(100000 + Math.random() * 900000);

    user.verifyOTP = OTP;
    user.verifyExpiryOTP = new Date(Date.now() + 15 * 60 * 1000); // expires in 15 minutes

    await user.save();

    // Setup mail options
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: user.email,
      subject: 'Your Account Verification OTP',
      text: `Your OTP for verifying your account is: ${OTP}`,
      html: `<p style="font-size:16px;">Hello ${user.name || ''},</p>
             <p>Your OTP for verifying your account is:</p>
             <h2>${OTP}</h2>
             <p>This OTP is valid for 15 minutes.</p>`
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Verification OTP sent to your email"
    });

  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: " + error.message
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const {userId, OTP} = req.body

    if (!userId || !OTP) {
      return res.json({
        success: false,
        message: 'User ID and OTP are required.'
      });
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.json({
        success: false,
        message: "User is not valid"
      })
    }

    if (!user.verifyOTP === '' || user.verifyOTP !== OTP) {
      return res.json({
        success: false,
        message: 'Invalid OTP.'
      })
    }

    if (user.verifyExpiryOTP < Date.now()) {
      return  res.json({
        success: false,
        message: 'OTP is expired'
      })
    }

    user.isAccountVerified = true
    user.verifyOTP = ''
    user.verifyExpiryOTP = 0

    await user.save()
    return res.json({
      success: true,
      message: 'User verified successfully',
      isActive: true,
    })

  } catch (error) {
    res.json({
      success: false,
      message: error.message
  })
  }
}

export const isAuthanticated = async (req, res) => {
  try {
    return res.json({
      success:true,
      message: 'Account is verified'
    })
  } catch (error) {
    res.json({
      success: false,
      message: error.message
  })
  }
}

export const resendOtp = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.json({ success: false, message: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const newOTP = Math.floor(100000 + Math.random() * 900000).toString();

    user.verifyOTP = newOTP;
    user.verifyExpiryOTP = Date.now() + 10 * 60 * 1000; // 10 min expiry

    await user.save();

    // Here you can use nodemailer to send the OTP
    // await sendEmail(user.email, "Your OTP Code", `Your OTP is ${newOTP}`);

    return res.json({ success: true, message: "OTP resent successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


export const sendResetPassword  = async (req, res) => {
  try {
    const {email} = req.body
    const user = await User.findOne({email})

    if (!user) {
      return res.json({
        success: false,
        message: 'Email is not registered'
      })
    }

    const OTP = Math.floor(100000 + Math.random() * 900000)

    user.resetOTP = OTP
    user.resetOtpExpiry = new Date(Date.now() + + 15 * 60 * 1000)

    await user.save()

    const mailOption = {
      from: process.env.SMTP_USER,
      to: user.email,
      text: 'Password Reset OTP',
      // html: Password_Reset_OTP.replace("{{OTP}}", OTP).replace("{{email}}", user.email)
    }

    await transporter.sendMail(mailOption)

    return res.json({
      success: true,
      message: 'Password reset otp send'
    })

  } catch (error) {
    res.json({
      success: false,
      message: error.message
  })
  }
}

export const resetPassword = async (req, res) => {
  try {
    const {email, OTP, newPassword} = req.body
    const user = await User.findOne({email})

    if (!user) {
      return res.json({
        succes: false,
        message: 'Email is not registered'
      })
    }

    if (!user.resetOTP === '' || user.resetOTP !== OTP) {
      return res.json({
        success: false,
        message: 'Invalid OTP'
      })
    }

    if (user.resetOtpExpiry < Date.now()) {
      return res.json({
        success: false,
        message: 'OTP expired'
      })
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10)

    user.password = hashedPassword
    user.verifyOTP = ''
    user.verifyExpiryOTP = 0

    await user.save()

    return res.json({
      success: true,
      message: 'Password reset successfull'
    })

  } catch (error) {
    return res.json({
      success:false,
      message: error.message
    })
  }
}

export const registerUserTask = async (req, res) => {
    try {
      const { name, email, password, isAdmin, role, title } = req.body;
  
      const userExist = await User.findOne({ email });
  
      if (userExist) {
        return res.status(400).json({
          status: false,
          message: "User already exists",
        });
      }
  
      const user = await User.create({
        name,
        email,
        password,
        isAdmin,
        role,
        title,
      });
  
      if (user) {
        isAdmin ? createJWT(res, user._id) : null;
  
        user.password = undefined;
  
        res.status(201).json(user);
      } else {
        return res
          .status(400)
          .json({ status: false, message: "Invalid user data" });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({ status: false, message: error.message });
    }
  };


export const getUserData = async (req, res) => {
  try {
      const {userId} = req.body
      const user = await User.findById(userId)

      if (!user) {
          return res.json({
              success: false,
              message: 'User not found'
          })
      }

      res.json({
          success: true,
          userData:{
              name: user.name,
              isAccountVerified: user.isAccountVerified
          }
      })
  } catch (error) {
      res.json({success: false, message: error.message})
  }
}

export const getTeamList = async (req, res) => {
  try {
    const users = await User.find().select("name title role email isActive");

    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};


export const getNotificationsList = async (req, res) => {
  try {
    const { userId } = req.user;

    const notice = await Notice.find({
      team: userId,
      isRead: { $nin: [userId] },
    }).populate("task", "title");

    res.status(201).json(notice);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};


export const updateUserProfile = async (req, res) => {
  try {
    const { userId, isAdmin } = req.user;
    const { _id } = req.body;

    const id =
      isAdmin && userId === _id
        ? userId
        : isAdmin && userId !== _id
        ? _id
        : userId;

    const user = await User.findById(id);

    if (user) {
      user.name = req.body.name || user.name;
      user.title = req.body.title || user.title;
      user.role = req.body.role || user.role;

      const updatedUser = await user.save();

      user.password = undefined;

      res.status(201).json({
        status: true,
        message: "Profile Updated Successfully.",
        user: updatedUser,
      });
    } else {
      res.status(404).json({ status: false, message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const { userId } = req.user;

    const { isReadType, id } = req.query;

    if (isReadType === "all") {
      await Notice.updateMany(
        { team: userId, isRead: { $nin: [userId] } },
        { $push: { isRead: userId } },
        { new: true }
      );
    } else {
      await Notice.findOneAndUpdate(
        { _id: id, isRead: { $nin: [userId] } },
        { $push: { isRead: userId } },
        { new: true }
      );
    }

    res.status(201).json({ status: true, message: "Done" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};


export const activateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (user) {
      user.isActive = req.body.isActive; //!user.isActive

      await user.save();

      res.status(201).json({
        status: true,
        message: `User account has been ${
          user?.isActive ? "activated" : "disabled"
        }`,
      });
    } else {
      res.status(404).json({ status: false, message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const deleteUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    await User.findByIdAndDelete(id);

    res
      .status(200)
      .json({ status: true, message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};
