const sql_create_user = require("../db/qry_users.js").sql_create_user;
const sql_find_user = require("../db/qry_users.js").sql_find_user;
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const db = require("../db");

function createToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET || "123abc", {
    expiresIn: "1h",
  });
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET, (err, decode) =>
    decode !== undefined ? decode : err
  );
}

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const user_name = email.slice(0, email.indexOf("@"));

  try {
    const existingEmail = await db.query(
      "SELECT email FROM appuser WHERE email = $1",
      [email]
    );

    if (existingEmail.rows.length !== 0) {
      const error = "This email already exists!";
      res.status(400).send(error);
    } else {
      try {
        const user = await db.query(`${sql_create_user}`, [
          email,
          password,
          user_name,
        ]);
        const token = createToken({ email, password });
        const user_id = user.rows[0].user_id;

        res.status(200).json({ user_id, user_name, token });
      } catch (err) {
        res.status(400).send("Saving new user request could not process.");
      }
    }
  } catch (err) {
    res.status(400).send("Register request could not process.");
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userObj = await db.query(`${sql_find_user}`, [email, password]);
    // console.log("/signin post: userObj: ", userObj);
    if (userObj.rowCount == 0) {
      const error = "Incorrect email or password";
      // status 401 - not valid authentication credentials
      res.status(401).send(error);
      return;
    }
    const user = userObj.rows[0];
    const token = createToken({ email, password });

    res
      .status(200)
      .json({ user_id: user.user_id, user_name: user.user_name, token });
  } catch (err) {
    // status 400 - server cannot or will not process the request due to client error
    res.status(400).send("Request could not process.");
  }
});

module.exports = router;
