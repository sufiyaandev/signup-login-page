// const express = require("express");
// const bodyParser = require("body-parser");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

// const app = express();

// app.use(bodyParser.json());
// app.use(cors());

// mongoose
//   .connect("mongodb://127.0.0.1:27017/test", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("mongodb connected...");
//   })
//   .catch((e) => {
//     console.log("connection error");
//   });

// const signSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   password: String,
// });

// const RegData = mongoose.model(" RegData", signSchema);

// const secretKey = "mysecretkey";
// function authenticateToken(req, res, next) {
//   const token = req.header("Authorization");
//   if (!token) return res.status(401).send("Access Denied");
//   jwt.verify(token, secretKey, (err, regdata) => {
//     if (err) return res.status(403).send("Invalid Token");
//     req.regdata = regdata;
//     next();
//   });
// }

// app.post("/api/signin", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     const hashedPassword=await bcrypt.hash(password,10);
//     const regdata = new RegData({ name, email, password:hashedPassword });
//     await regdata.save();
//     res.status(201).send("User registered successfully");
//   } catch (error) {
//     res.status(500).send("Error registering user");
//   }


  
  //   console.log("Registration successful:", regdata);
  //   res.json(regdata);
  // } catch (error) {
  //   console.error("Registration failed:", error);
  //   res.status(500).json({ error: "internal server error" });
  // }
//});
// app.post("/api/login", async (req, res) => {
//   const { email, password } = req.body;
//   const regdata = await RegData.findOne({ email });
//   if (!regdata) return res.status(401).send("Invalid email.... ");
//   const validpassword = await bcrypt.compare(password, regdata.password);
//   if (!validpassword) return res.status(401).send("Invalid password...");
//   const token = jwt.sign({ email: regdata.email }, secretKey);
//   res.header("Authorization", token).send("Login successful");
// });
// app.get("/api/protected", authenticateToken, (req, res) => {
//   res.send("This is protected route");
// });
// app.post("/api/login", async (req, res) => {
//   const { email, password } = req.body;
//   const regdata = await RegData.findOne({ email });
//   if (!regdata) return res.status(401).send("Invalid email.... ");
//   const validpassword = await bcrypt.compare(password, regdata.password);
//   if (!validpassword) return res.status(401).send("Incorrect password. Please try again."); // Updated message
//   const token = jwt.sign({ email: regdata.email }, secretKey);
//   res.header("Authorization", token).send("Login successful");
// });



  
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");
const bodyParser = require("body-parser")

const app = express();
const port = process.env.PORT || 6002;

app.use(express.json());
app.use(cors());
app.use (bodyParser.json());
const dbURI = "mongodb://127.0.0.1:27017/authentication";

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

const User = mongoose.model("User", {
  username: String,
  email:String,
  password: String,
});
const regSchema = new mongoose.Schema({
  name: String,
  department:String,
  address: String,
  email: String,
  age:Number,
  qualification:String,
  bloodgroup:String,
  phone: Number,
  DOB: Date,
});
const Data = mongoose.model("Data", regSchema);

// JWT secret (should be kept secret and not hard-coded)
const secretKey = "mysecretkey";

// Middleware to protect routes
function authenticateToken(req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).send("Access Denied");

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).send("Invalid Token");
    req.user = user;
    next();
  });
}

// Register a new user
app.post("/api/signin", async (req, res) => {
  try {
    const { username,email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).send("User registered successfully");
  } catch (error) {
    res.status(500).send("Error registering user");
  }
});

// Login and generate a JWT token
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).send("Invalid username ");

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword)
    return res.status(401).send("Invalid password");

  const token = jwt.sign({ email: user.email }, secretKey);
  res.header("Authorization", token).send("Login successful");
});

// Protected route
app.get("/protected", authenticateToken, (req, res) => {
  res.send("This is a protected route");
});

//register datas


app.post("/api/registers", async (req, res) => {
  try {
    const { name,department, address, email,age,qualification,bloodgroup, phone, DOB} = req.body;
    const data = new Data({ name,department, address, email,age,qualification,bloodgroup, phone, DOB});
    await data.save();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
});
app.get("/api/registers", async (req, res) => {
  try {
    const datas = await Data.find();
    res.json(datas);
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
});
app.put("/api/registers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name,department, address, email,age,qualification,bloodgroup, phone, DOB} = req.body;
    const datas = await Data.findByIdAndUpdate(
      id,
      { name,department, address, email,age,qualification,bloodgroup, phone, DOB },
      { new: true }
    );

    res.json(datas);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/registers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Data.findByIdAndRemove(id);
    res.json({ message: "Data deleted.." });
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
