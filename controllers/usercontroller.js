import bcrypt from "bcrypt";
import users from "../model/user.js";
import jwt from "jsonwebtoken";

class usercontroller {
  static userRegistration = async (req, res) => {
    const { name, email, password, password_confirmation, tc } = req.body;

    if (!name || !email || !password || !password_confirmation || !tc) {
      return res
        .status(400)
        .send({ status: "failed", message: "All fields are required" });
    }

    if (password !== password_confirmation) {
      return res
        .status(400)
        .send({ status: "failed", message: "Passwords do not match" });
    }

    try {
      const user = await users.findOne({ email: email });
      if (user) {
        return res
          .status(400)
          .send({ status: "failed", message: "Email already exists" });
      }

      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = new users({
        name,
        email,
        password: hashedPassword,
        tc,
      });

      await newUser.save();

      const token = jwt.sign({ userID: newUser._id }, process.env.SCRATE, {
        expiresIn: "5d",
      });

      res.status(201).send({
        status: "success",
        message: "User registered successfully",
        token,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ status: "failed", message: "Unable to register user" });
    }
  };

  static userloginregister = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await users.findOne({ email: email });
      if (user != null) {
        const ismatch = await bcrypt.compare(password, user.password);
        if (user.email === email && ismatch) {
          const token = jwt.sign({ userIS: user._id }, process.env.scratekey, {
            expiresIn: "5d",
          });
          res.status(201).send({
            status: "success",
            message: `User registered successfully ${token} `,
          });
        } else {
          res
            .status(500)
            .send({ status: "failed", message: "Unable to register user" });
        }
      } else {
        res
          .status(400)
          .send({ status: "failed", message: "All fields are required" });
      }
    } catch (error) {
      console.log(error);
    }
  };
  static userlogin = async (req, res) => {
    const { password, password_confirmation } = req.body;
    if (password && password_confirmation) {
      if (!password && !password_confirmation) {
        res.send({
          status: "failed",
          message: "New Password and Confirm New Password doesn't match",
        });
      } else {
        const salt = await bcrypt.genSalt(12);
        const hasing = await bcrypt.hash(password, salt);
        await users.findOneAndUpdate(req.user._id, {
          $set: { password: hasing },
        });
        res.send({
          status: "success",
          message: "Password changed succesfully1",
        });
      }
    } else {
      res.send({ status: "failed", message: "All Fields are Required" });
    }
  };

  static loginuserprofile = async (req, res) => {
    res.send({ users: req.user });
  };

  static sendUserPasswordResetEmail = (req, res) => {
    const { email } = req.body;

    if (email) {
      const user = users.findOne({ email: email });
      if (user) {
        const secret = user._id + process.env.SCRATE;
        const token = jwt.sign(
          { userIS: user._id },
          secret,
          process.env.scratekey,
          {
            expiresIn: "15m",
          }
        );
        const link = `http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`;
        console.log(link);
        res.send({
          status: "success",
          message: "Password Reset Email Sent... Please Check Your Email",
        });
      } else {
        res.send({ status: "failed", message: "Email doesn't exists" });
      }
    } else {
      res.send({ status: "failed", message: "Email Field is Required" });
    }
  };
  static userPasswordReset = async (req, res) => {
    const { password, password_confirmation } = req.body;
    const { id, token } = req.params;
    const user = await UserModel.findById(id);
    const new_secret = user._id + process.env.SCRATE;
    try {
      jwt.verify(token, new_secret);
      if (password && password_confirmation) {
        if (password !== password_confirmation) {
          res.send({
            status: "failed",
            message: "New Password and Confirm New Password doesn't match",
          });
        } else {
          const salt = await bcrypt.genSalt(10);
          const newHashPassword = await bcrypt.hash(password, salt);
          await UserModel.findByIdAndUpdate(user._id, {
            $set: { password: newHashPassword },
          });
          res.send({
            status: "success",
            message: "Password Reset Successfully",
          });
        }
      } else {
        res.send({ status: "failed", message: "All Fields are Required" });
      }
    } catch (error) {
      console.log(error);
      res.send({ status: "failed", message: "Invalid Token" });
    }
  };
}

export default usercontroller;
