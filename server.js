const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
var neo4j = require("neo4j-driver");
var driver = neo4j.driver(
  "neo4j://localhost:7687",
  neo4j.auth.basic("neo4j", "noapas123")
);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/create", function (req, res) {
  const session = driver.session();
  const body = req.body;
  const cypher =
    //"create (z:Zubar {id: {id}, ime: {ime}, prezime: {prezime}}) RETURN  z";
    //var params = { id: body.id, ime: body.ime, prezime: body.prezime };
    "create ( z:Zubar {id:'" +
    body.id +
    "' , ime:'" +
    body.ime +
    "' , prezime:'" +
    body.prezime +
    "' , grad:'" +
    body.grad +
    "'}) return z";

  //console.log(cypher);
  //console.log(params);

  session
    .run(cypher)
    .then((result) => {
      console.log(result);
    })

    .then(() => {
      session.close();
      res.json(true);
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
