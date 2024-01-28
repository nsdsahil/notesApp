const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const app = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/register");
const RegisterModel = require("../models/register");
const auth = require("../middlewares/auth.middleware");
const BlacklistTokenModel = require("../models/blacklistToken");

/**
 * @swagger
 * /auth/login:
 * post:
 *   description: login page
 *   tag: login
 *   responses:
 *   200:
 *       description: login successful
 *
 *
 */

app.post("/login", async (req, res) => {
	const { email, password } = req.body;
	console.log(req.body);
	try {
		const user = await UserModel.findOne({ email });
		console.log(user);
		if (user) {
			const result = await bcrypt.compare(password, user.password)
				console.log(result);
				if (result) {
					console.log(result);
					const token = jwt.sign(
						{ course: "backend", id: user._id },
						process.env.secret_key,
						{
							expiresIn: "1h",
						}
					);

					const refreshToken = jwt.sign(
						{ course: "backend", id: user._id },
						process.env.secret_key,
						{ expiresIn: "7h" }
					);

					
					res.cookie("refreshToken", refreshToken, {
						httpOnly: true,
						secure: true,
						sameSite: "none",
					});
	
					res.cookie("token", token, {
						httpOnly: true,
						sameSite: "none",
						secure: true,
					});

					res.send({ msg: "login succesful", token: token });
				}
			
		} else {
			res.send({ msg: "invalid user" });
		}
	} catch (error) {
		res.status(200).send({ msg: "invalid input", message: error.message });
	}
});
app.post("/register", async (req, res) => {
	const { name, email, password, gender } = req.body;
	console.log(name, email, password, gender);
	try {
		const hashpassword = await bcrypt.hash(password, 5)
			console.log("hashing started");
			if (!hashpassword) {
				res.send("err while hashing the password");
			} else {
				const user = new UserModel({ name, email, password: hashpassword, gender });
				console.log(user);
				await user.save();
				res.status(200).send({ msg: "user registered plz login" });
			}
	
		
	} catch (err) {
		res.status(400).send({ err: err });
	}
});
app.get("/logout", auth, async (req, res) => {
	const token = req.cookies.token;
	const refreshToken = req.cookies.refreshToken;
	try {
		const blacklist = new BlacklistTokenModel({
			token,
			refreshToken,
		});
		await blacklist.save();
		res.send({ msg: "logout successful" });
	} catch (err) {
		res.send({ err: err, message: err.message });
	}
});

module.exports = app;
