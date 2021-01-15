const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
var neo4j = require("neo4j-driver");
var driver = neo4j.driver(
  "neo4j://localhost:7687",
  neo4j.auth.basic("neo4j", "noapas123") // ne brisi
);
//const neo4j = require('neo4j-driver')

//const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic("neo4j", "pass"))

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/createZubar", function (req, res) {
  const session = driver.session();
  const body = req.body;
  const cypher =
    //"create (z:Zubar {id: {id}, ime: {ime}, prezime: {prezime}}) RETURN  z";
    //var params = { id: body.id, ime: body.ime, prezime: body.prezime };
    "create ( z:Zubar {ime:'" +
    body.ime +
    "' , prezime:'" +
    body.prezime +
    "' , grad:'" +
    body.grad +
    "' , telefon:'" +
    body.telefon +
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

app.put("/novaUsluga", async (req, res) => {
  const idZubara = req.body.id;
  const session = driver.session();
  const cypher1 =
    "create (u:Usluga {naziv:$naziv, cena:$cena, opis:$opis, idZubara:$idZubara})";
  let params1 = {
    naziv: req.body.naziv,
    cena: req.body.cena,
    opis: req.body.opis,
    idZubara: idZubara,
  };
  await session.run(cypher1, params1);
  session.close();
  const session2 = driver.session();
  const cypher2 =
    "match (z:Zubar) where id(z)=" +
    idZubara +
    " match(u:Usluga{idZubara:$idZubara}) create (z)-[r:NUDI_USLUGU]->(u)";
  //"match (z:Zubar{id:$idZubara}), (u:Usluga{idZubara:$idZubara}) create (z)-[r:NUDI_USLUGU]->(u)";
  //console.log(cypher2);
  //console.log(idZubara);
  await session2.run(cypher2, { idZubara: idZubara });
  session2.close();
  res.json("Usluga je dodata");
});

app.get("/pretraziPoGradu", async (req, res) => {
  const session = driver.session();
  const zadatiGrad = req.body.grad;
  let cypher = "match (z:Zubar{grad:$grad}) return z";
  let result = await session.run(cypher, { grad: zadatiGrad });
  session.close();
  console.log(result.records);
  if (result.records.length == 0)
    res.json("Nije pronadjen nijedan zubar u tom gradu.");
  let zubari = [];
  result.records.forEach((r) => {
    zubari.push(r._fields[0].properties);
  });
  res.json(zubari);
});

app.get("/vratiTermineZubara", function (req, res) {
  const session = driver.session();
  let imeZubara = "Zub2";
  const cypher =
    "MATCH (z:Zubar)-[:IMA]->(t:Termin)<-[:ZAKAZAO]-(k:Korisnik) WHERE z.ime='" +
    imeZubara +
    "' RETURN t";
  session
    .run(cypher)
    .then((result) => {
      result.records.map((terminResult) => {
        console.log(terminResult.get("t").properties);
      });

      res.sendStatus(200);
    })
    .catch((e) => {
      // Output the error
      console.log(e);
    })
    .then(() => {
      // Close the Session
      return session.close();
    })
    .then(() => {
      // Close the Driver
      //return driver.close();
    });
});
app.get("/vratiZainteresovaneStudente", function (req, res) {
  const session = driver.session();
  let imeZubara = "Zub2";
  const cypher =
    "MATCH (s:Student)-[:ZAINTERESOVAN]->(z:Zubar) WHERE z.ime='" +
    imeZubara +
    "'  RETURN s";
  session
    .run(cypher)
    .then((result) => {
      result.records.map((studentResult) => {
        console.log(studentResult.get("s").properties);
      });

      res.sendStatus(200);
    })
    .catch((e) => {
      // Output the error
      console.log(e);
    })
    .then(() => {
      // Close the Session
      return session.close();
    })
    .then(() => {
      // Close the Driver
      //return driver.close();
    });
});
app.get("/vratiTermineZubaraNeOdobrene", function (req, res) {
  const session = driver.session();
  let imeZubara = "Zub2";
  const cypher =
    "MATCH (z:Zubar)-[:IMA]->(t:Termin)<-[:ZAKAZAO]-(k:Korisnik) WHERE z.ime='" +
    imeZubara +
    "' AND t.potvrdjeno='NE' RETURN t";
  session
    .run(cypher)
    .then((result) => {
      result.records.map((terminResult) => {
        console.log(terminResult.get("t").properties);
      });

      res.sendStatus(200);
    })
    .catch((e) => {
      // Output the error
      console.log(e);
    })
    .then(() => {
      // Close the Session
      return session.close();
    })
    .then(() => {
      // Close the Driver
      //return driver.close();
    });
});
app.post("/ostaviKomentar", function (req, res) {
  const session = driver.session();
  let imeZubara = req.body.imeZubara;
  let imeKorisnika = req.body.imeKorisnika;
  let ocena = req.body.ocena;
  let komentar = req.body.komentar;
  // let imeZubara = 'Zub2'
  // let imeKorisnika = 'Kor1'
  // let ocena = '5'
  // let komentar = 'super usluga'
  const cypher =
    "MATCH (z:Zubar),(k:Korisnik) WHERE z.ime='" +
    imeZubara +
    "'AND k.ime='" +
    imeKorisnika +
    "'" +
    "CREATE (k)-[:OSTAVIO]->(kom:Komentar {ocena:'" +
    ocena +
    "',komentar:'" +
    komentar +
    "'})-[:NA]->(z)";

  session
    .run(cypher)
    .then((result) => {
      // result.records.map(terminResult=>{
      //   console.log( terminResult.get("t").properties );
      // })

      res.sendStatus(200);
    })
    .catch((e) => {
      // Output the error
      console.log(e);
    })
    .then(() => {
      // Close the Session
      return session.close();
    })
    .then(() => {
      // Close the Driver
      //return driver.close();
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
