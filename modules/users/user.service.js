const jwt = require("jsonwebtoken");
const userModel = require("../../models/user");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const {
  sendConfirmationEmail,
  sendCodeEmail,
} = require("../../services/sendEmail");

module.exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        error: "name, email, and password are required",
      });
    }
    // Sequelize create
    const saveUser = await userModel.create({
      name,
      email,
      password,
      status: req.body.status || "online",
    });

    // generate token
    const token = jwt.sign({ id: saveUser.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    const url = `${process.env.CLIENT_URL}/confirm/${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "reemsina2@gmail.com",
        pass: "yhin zubj ecgs evez",
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: saveUser.email,
      subject: "Confirm your email",
      html: `<h3>Hello ${saveUser.name}</h3>
           <p>Please confirm your email by clicking the link below:</p>
           <a href="${url}">Confirm Email</a>`,
    };

    await transporter.sendMail(mailOptions);
    res.status(201).json({
      message: "done signup check email",
      saveUser,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "error request inputs",
      error: error,
    });
  }
};

module.exports.confirm = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) return res.status(400).json({ message: "Token required" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return res.status(400).json({ message: "Invalid token" });

    const user = await userModel.findByPk(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.confirmed = true; // ✅ update the column
    await user.save();

    res.status(200).json({ message: "User confirmed" });
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
};

module.exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find user by email
    const user = await userModel.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    // Check if email is confirmed
    if (!user.confirmed) {
      return res
        .status(400)
        .json({ message: "Please confirm your email first" });
    }

    // Compare passwords
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Create JWT token
    const token = jwt.sign({ id: user.dataValues.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    user.status = "online";
    await user.save();
    res.status(200).json({ message: "Signin successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports.profile = async (req, res) => {
  try {
    const user = await userModel.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports.editProfile = async (req, res) => {
  try {
    const user = await userModel.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { name, email, role } = req.body;

    if (name) user.name = name;

    if (role) user.role = role;

    if (email && email !== user.email) {
      user.email = email;
      user.confirmed = false; // Mark as unconfirmed
      await sendConfirmationEmail(user, email);
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports.sendcode = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ where: { email } });
    if (!user) {
      res.status(400).json({ message: "in-valid user" });
    } else {
      const code = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000); //4589
      user.code = code;
      await user.save();
      await sendCodeEmail(email, `you need code to reset password:${code}`);
      res.status(200).json({ message: "send email user", code });
    }
  } catch (error) {
    res.status(500).json({ message: " user error", error });
  }
};

module.exports.Checkcode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await userModel.findOne({ where: { email } });
    if (!user) {
      res.status(400).json({ message: "in-valid user" });
    } else {
      if (user.code !== code) {
        return res.status(400).json({ message: "Invalid code" });
      }
      user.codecheck = true;
      await user.save();
      res.status(200).json({ message: "Code verified successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: " user error", error });
  }
};

module.exports.newPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ where: { email } });
    if (!user) {
      res.status(400).json({ message: "in-valid user" });
    } else {
      if (user.codecheck) {
        const isSame = await bcrypt.compare(password, user.password);
        if (isSame) {
          return res
            .status(400)
            .json({ message: "New password cannot be same as old password" });
        }
        const hashedPassword = await bcrypt.hash(
          password,
          Number(process.env.saltsofround)
        );
        user.password = hashedPassword;
        user.code = null;
        user.codecheck = false;
        await user.save();
        res.status(200).json({ message: "Password updated successfully" });
      } else {
        return res.status(400).json({ message: "check your code" });
      }
    }
  } catch (error) {
    res.status(500).json({ message: " user error", error });
  }
};

module.exports.changeStatus = async (req, res) => {
  try {
    
  } catch (error) {
    res.status(500).json({ message: " user error", error });
  }
};
