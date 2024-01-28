const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const connectDB= require("./db");
const auth = require("./controllers/auth");
const notes = require("./controllers/notes");
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: ["https://notesapp-rosy.vercel.app","http://127.0.0.1:5173"],
		credentials: true,
	})
);

//swagger docs
const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Notes Blog API",
			version: "1.0.0",
		},
	},
	server: { url: "http://localhost:8080" },
	apis: ["./controllers/*.js"], // files containing annotations as above
};
const openapiSpecification = swaggerJsdoc(options);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));
app.get("/", (req, res) => {
	res.send("home page");
});
app.use("/auth", auth);
app.use("/notes", notes);

app.listen(process.env.port, async () => {
	try {
		console.log("server start at 8080");
		await connectDB();
		console.log("connected to db");
	} catch (error) {
		console.log(error);
	}
});
