const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const neo4j = require('neo4j-driver')

const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic("neo4j", "pass"))


app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/vratiTermineZubara", function (req, res) {
  const session = driver.session()
  let imeZubara = 'Zub2'
  const cypher = 'MATCH (z:Zubar)-[:IMA]->(t:Termin)<-[:ZAKAZAO]-(k:Korisnik) WHERE z.ime=\''+imeZubara+'\' RETURN t';
  session.run(cypher)
    .then(result => {

        result.records.map(terminResult=>{
          console.log( terminResult.get("t").properties );
        })
        
        res.sendStatus(200);
    })
    .catch(e => {
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
  const session = driver.session()
  let imeZubara = 'Zub2'
  const cypher = 'MATCH (s:Student)-[:ZAINTERESOVAN]->(z:Zubar) WHERE z.ime=\''+imeZubara+'\'  RETURN s';
  session.run(cypher)
    .then(result => {

        result.records.map(studentResult=>{
          console.log( studentResult.get("s").properties );
        })
        
        res.sendStatus(200);
    })
    .catch(e => {
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
  const session = driver.session()
  let imeZubara = 'Zub2'
  const cypher = 'MATCH (z:Zubar)-[:IMA]->(t:Termin)<-[:ZAKAZAO]-(k:Korisnik) WHERE z.ime=\''+imeZubara+'\' AND t.potvrdjeno=\'NE\' RETURN t';
  session.run(cypher)
    .then(result => {

        result.records.map(terminResult=>{
          console.log( terminResult.get("t").properties );
        })
        
        res.sendStatus(200);
    })
    .catch(e => {
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
  const session = driver.session()
  let imeZubara = req.body.imeZubara
  let imeKorisnika = req.body.imeKorisnika
  let ocena = req.body.ocena
  let komentar = req.body.komentar
  // let imeZubara = 'Zub2'
  // let imeKorisnika = 'Kor1'
  // let ocena = '5'
  // let komentar = 'super usluga'
  const cypher ='MATCH (z:Zubar),(k:Korisnik) WHERE z.ime=\''+imeZubara+'\'AND k.ime=\''+imeKorisnika+'\''+
   'CREATE (k)-[:OSTAVIO]->(kom:Komentar {ocena:\''+ocena+'\',komentar:\''+komentar+'\'})-[:NA]->(z)';

  session.run(cypher)
  .then(result => {

      // result.records.map(terminResult=>{
      //   console.log( terminResult.get("t").properties );
      // })
      
      res.sendStatus(200);
  })
  .catch(e => {
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
