// const sql_brokers_select = require("../db/qry_brokers").sql_brokers_select;
const sql_brokers = require("../db/qry_brokers").sql_brokers;
const sql_add_broker = require("../db/qry_brokers").sql_add_broker;

const router = require("express").Router();
const db = require("../db");

// /api/brokers
// router.get("/", async (req, res, next) => {
//   try {
//     const brokersSelect = await db.query(`${sql_brokers_select}`);

//     res.status(200).json({
//       status: "success",
//       results: brokersSelect.rows.length,
//       data: {
//         brokersSelect: brokersSelect.rows,
//       },
//     });
//   } catch (err) {
//     console.log(err);
//   }
// });

// /api/brokers/user/1
router.get("/user/:user_id", async (req, res, next) => {
  const user_id = req.params.user_id;

  try {
    const brokers = await db.query(`${sql_brokers}`, [user_id]);
    // console.log("get api/brokers/user/:user_id ", brokers.rows);

    res.status(200).json({
      status: "success",
      results: brokers.rows.length,
      data: {
        brokers: brokers.rows,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/", async (req, res) => {
  // console.log("brokers: post: req.body: ", req.body);
  const broker_name = req.body.broker_name;
  const user_id = req.body.user_id;

  try {
    if (broker_name === "") throw Error("Broker name is required!");
    const qryResult = await db.query(
      "SELECT broker_name FROM broker WHERE broker_name = $1 and user_id = $2",
      [broker_name, user_id]
    );

    if (qryResult.rows.length !== 0) {
      const error = "Broker name already exists!";
      res.status(400).send(error);
    } else {
      try {
        const newBroker = await db.query(`${sql_add_broker}`, [
          broker_name,
          user_id,
        ]);

        res.status(201).json({
          broker: newBroker.rows[0],
        });
      } catch (err) {
        res.status(400).send("Request could not process.");
      }
    }
  } catch (err) {
    res.status(400).send("Request could not process.");
  }
});

router.post("/public", async (req, res) => {
  const sql_public_brokers = constructQuery(req.body);
  // console.log("broker: post public: req.body: ", sql_public_brokers);
  try {
    const publicBrokers = await db.query(`${sql_public_brokers}`);
    // console.log("broker: post public: req.body: ", publicBrokers);
    res.status(201).json({
      publicBrokers: publicBrokers.rows,
    });
  } catch (err) {
    res.status(400).send("Request could not process.");
  }
});

router.put("/:id", async (req, res) => {
  const broker_id = req.params.id;
  const broker_name = req.body.broker_name;
  const user_id = req.body.user_id;

  // console.log("brokers: put: broker_id: ", broker_id, " broker_name: ", broker_name);

  try {
    if (broker_name === "") throw Error("Broker name is required!");
    const qryResult = await db.query(
      "SELECT broker_name FROM broker WHERE broker_name = $1 AND user_id = $2",
      [broker_name, user_id]
    );

    if (qryResult.rows.length !== 0) {
      const error = "Broker name already exists!";
      res.status(400).send(error);
    } else {
      try {
        const updatedBroker = await db.query(
          "UPDATE broker SET broker_name = $1 where broker_id = $2 returning *",
          [broker_name, broker_id]
        );
        res.status(200).json({
          broker: updatedBroker.rows[0],
        });
      } catch (err) {
        res.status(400).send("Request could not process.");
      }
    }
  } catch (err) {
    res.status(400).send("Request could not process.");
  }
});

router.delete("/:id", async (req, res) => {
  // console.log("brokers: delete: req.params: ", req.params);
  const broker_id = req.params.id;

  try {
    const deletedBroker = await db.query(
      "delete from broker where broker_id = $1",
      [broker_id]
    );

    res.status(204).json({
      status: "success",
    });
  } catch (err) {
    console.log(err);
  }
});

const constructQuery = (brokers) => {
  return `insert into broker(broker_name, user_id) values
    ${brokers
      .map((broker) => `('${broker.broker_name}',${broker.user_id})`)
      .join(",")} returning *`;
};

module.exports = router;
