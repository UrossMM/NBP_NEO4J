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

app.post("/createStudent", function (req, res) {
  const session = driver.session();
  const body = req.body;
  const cypher =
    "create ( s:Student {ime:'" +
    body.ime +
    "' , prezime:'" +
    body.prezime +
    "' , grad:'" +
    body.grad +
    "' , telefon:'" +
    body.telefon +
    "' , godina:" +
    body.godina +
    ", prosek:" +
    body.prosek +
    "}) return s";

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

app.post("/createKorisnik", function (req, res) {
  const session = driver.session();
  const body = req.body;
  const cypher =
    "create ( k:Korisnik {ime:'" +
    body.ime +
    "' , prezime:'" +
    body.prezime +
    "' , telefon:'" +
    body.telefon +
    "'}) return k";

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

app.post("/createOrdinacija", function (req, res) {
  const session = driver.session();
  const body = req.body;
  const cypher =
    "create ( o:Ordinacija {ime:'" +
    body.ime +
    "' , grad:'" +
    body.grad +
    "' , adresa:'" +
    body.adresa +
    "'}) return o";

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
    // zubari.push(r._fields[0].identity.low);
  });
  res.json(zubari);
});

app.get("/sviZubari", async (req, res) => {
  const session = driver.session();
  let cypher = "match (z:Zubar) return z";
  let result = await session.run(cypher);
  session.close();
  if (result.records.length == 0) res.json("Nije pronadjen nijedan zubar.");
  let sviZubari = [];
  result.records.forEach((r) => {
    sviZubari.push(r._fields[0].properties);
  });
  res.json(sviZubari);
});

app.put("/preporuciZubara", async (req, res) => {
  const idZubara = req.body.id;
  const oznaceni = req.body.oznaceni; // niz idjeva
  oznaceni.forEach(async (o) => {
    console.log(o);
    const session = driver.session();
    let cypher =
      "match (z:Zubar) where id(z)=" +
      idZubara +
      " match(preporucen:Zubar) where id(preporucen)=" +
      o +
      " create (z)-[r:PREPORUCUJE]->(preporucen)";
    await session.run(cypher);
    session.close();
  });
  res.json(true);
});

app.put("/postaniZainteresovan", async (req, res) => {
  const idZubara = req.body.idZ;
  const idStudenta = req.body.idS;
  const session = driver.session();
  let cypher =
    "match(z:Zubar) where id(z)=" +
    idZubara +
    " match(s:Student) where id(s)=" +
    idStudenta +
    " create (s)-[r:ZAINTERESOVAN_ZA]->(z)";
  await session.run(cypher);
  session.close();
  res.json(true);
});

app.put("/prihvatiStaziranje", async (req, res) => {
  const idStudenta = req.body.idS;
  const idZubara = req.body.idZ;
  let session = driver.session();
  let cypher1 =
    "match(z:Zubar) where id(z)=" +
    idZubara +
    " match(s:Student) where id(s)=" +
    idStudenta +
    " create (s)-[r:STAZIRA_KOD]->(z)";
  await session.run(cypher1);
  session.close();
  session = driver.session();
  let cypher2 =
    "match(z:Zubar) where id(z)=" +
    idZubara +
    " match(s:Student) where id(s)=" +
    idStudenta +
    " match(s)-[r:ZAINTERESOVAN_ZA]->(z) delete r";
  await session.run(cypher2);
  session.close();
  res.json("Staziranje prihvaceno");
});

app.post("/posaljiPrivatnuPoruku", async (req, res) => {
  //logovani student salje svoj ids a kad klikne na zubara kome se obraca uzima se id od tog zubara
  const idStudenta = req.body.idS;
  const idZubara = req.body.idZ;
  const tekst = req.body.tekst;
  let today = new Date();
  console.log(today);
  const vremeSlanja = today;
  let session = driver.session();
  //let cypher1 = "create (p:Poruka{tekst:$tekst, vreme:$vreme})";
  //let params1 = { tekst: req.body.tekst, vreme: vremeSlanja };
  //await session.run(cypher1, params1);
  //session.close();
  let cypher2 =
    "match (s:Student) where id(s)=" +
    idStudenta +
    " match (z:Zubar) where id(z)=" +
    idZubara +
    " create (p:Poruka {tekst:'" +
    tekst +
    "' , vreme:'" +
    vremeSlanja +
    "'}) create (s)-[r:SALJE]->(p) create(z)-[zr:PRIMA]->(p)";
  console.log(cypher2);
  await session.run(cypher2);
  session.close();
  res.json("Poruka poslata");
});

app.get("/vratiPrivatnePoruke", async (req, res) => {
  const idZubara = req.body.telefon;
  const session = driver.session();
  let cypher =
    "match(s:Student)-[r:SALJE]->(p:Poruka)<-[rz:PRIMA]-(z:Zubar{telefon:'" +
    idZubara +
    "'}) return p,s";
  let result = await session.run(cypher);
  session.close();
  if (result.records == 0) res.json("Nema poruka.");
  let toSend = []; //niz objekata obj
  result.records.forEach((rec) => {
    let obj = {}; // objekat koji objedinjuje onog ko je poslao poruku i njegovu poruku
    rec._fields.forEach((f) => {
      if (f.labels[0] == "Poruka") obj.poruka = f.properties;
      else obj.student = f.properties;
    });
    toSend.push(obj);
  });
  res.json(toSend);
});

app.get("/vratiPraktikante", async (req, res) => {
  const telefonZubara = req.body.telefon;
  const session = driver.session();
  let cypher =
    "match(s:Student)-[r:STAZIRA_KOD]->(z:Zubar{telefon:'" +
    telefonZubara +
    "'}) return s";
  let result = await session.run(cypher);
  session.close();
  if (result.records.length == 0) res.json("Nema praktikanata");
  let praktikanti = [];
  result.records.forEach((p) => {
    praktikanti.push(p._fields[0].properties);
  });
  res.json(praktikanti);
});

app.post("/zakaziTermin", async (req, res) => {
  const idKorisnika = req.body.telefonK;
  const idZubara = req.body.telefonZ;
  const datum = req.body.datum;
  const imeUsluge = req.body.imeUsluge;
  /*let cypher =
    "match(k:Korisnik{telefon:'" +
    idKorisnika +
    "'}) match(z:Zubar{telefon:'" +
    idZubara +
    "'}) create (k)-[r:ZAKAZI_TERMIN]->(z)";*/
  let cypher =
    "match (k:Korisnik{telefon:'" +
    idKorisnika +
    "'}) match(z:Zubar{telefon:'" +
    idZubara +
    "'}) create (t:Termin {datum:'" +
    datum +
    "' , imeUsluge:'" +
    imeUsluge +
    "' , potvrdjeno: 'NE'" +
    "}) create (k)-[r:ZAKAZAO]->(t) create(z)-[zr:IMA]->(t)";

  let session = driver.session();
  await session.run(cypher);
  session.close();
  res.json("Termin rezervisan");
});

app.put("/zaposliZubara", async (req, res) => {
  const idZubara = req.body.telefon;
  const idOrdinacije = req.body.adresa;
  const session = driver.session();
  let cypher =
    "match (z:Zubar{telefon:'" +
    idZubara +
    "'}) match (o:Ordinacija{adresa:'" +
    idOrdinacije +
    "'}) create (z)-[r:RADI]->(o)";
  await session.run(cypher);
  session.close();
  res.json("Zubar zaposljen");
});

app.put("/odrediVlasnika", async (req, res) => {
  const idZubara = req.body.telefon;
  const idOrdinacije = req.body.adresa;
  const session = driver.session();
  let cypher =
    "match (z:Zubar{telefon:'" +
    idZubara +
    "'}) match (o:Ordinacija{adresa:'" +
    idOrdinacije +
    "'}) create (z)-[r:JE_VLASNIK]->(o)";
  await session.run(cypher);
  session.close();
  res.json("Zubar postavljen za vlasnika ordinacije");
});

app.get("/vratiVlasnika", async (req, res) => {
  const idOrdinacije = req.body.adresa;
  const session = driver.session();
  let cypher =
    "match (z:Zubar)-[r:JE_VLASNIK]->(o:Ordinacija{adresa:'" +
    idOrdinacije +
    "'}) return z";
  let result = await session.run(cypher);
  session.close();
  if (result.records.length == 0) res.json("Nema vlasnika");
  res.json(result.records[0]._fields[0].properties);
});

app.get("/vratiZaposlene", async (req, res) => {
  const idOrdinacije = req.body.adresa;
  const session = driver.session();
  let cypher =
    "match(z:Zubar)-[r:RADI]->(o:Ordinacija{adresa:'" +
    idOrdinacije +
    "'}) return z";
  let result = await session.run(cypher);
  session.close();
  if (result.records == 0) res.json("Nema zaposlenih");
  let zaposleni = [];
  result.records.forEach((r) => {
    zaposleni.push(r._fields[0].properties);
  });
  res.json(zaposleni);
});

app.get("/pretraziUslugu", async (req, res) => {
  const nazivUsluge = req.body.nazivUsluge;
  const session = driver.session();
  let cypher =
    "match(z:Zubar)-[r:NUDI_USLUGU]->(u:Usluga{naziv:'" +
    nazivUsluge +
    "'}) return z";
  let result = await session.run(cypher);
  if (result.records.length == 0) res.json("Nema takvih usluga");
  let zubari = [];
  result.records.forEach((p) => {
    zubari.push(p._fields[0].properties);
  });
  res.json(zubari);
});

app.get("/prtraziUsluguPoCeni", async (req, res) => {
  const nazivUsluge = req.body.nazivUsluge;
  const session = driver.session();
  let cypher =
    "match(z:Zubar)-[r:NUDI_USLUGU]->(u:Usluga{naziv:'" +
    nazivUsluge +
    "'}) return u,z order by u.cena";
  /*let result = await session.run(cypher);
  if (result.records.length == 0) res.json("Nema takvih usluga");
  let zubari = [];
  result.records.forEach((p) => {
    zubari.push(p._fields[0].properties);
  });
  res.json(zubari);*/
  let result = await session.run(cypher);
  session.close();
  if (result.records == 0) res.json("Nema poruka.");
  let toSend = []; //niz objekata obj
  result.records.forEach((rec) => {
    let obj = {}; // objekat koji objedinjuje onog ko je poslao poruku i njegovu poruku
    rec._fields.forEach((f) => {
      if (f.labels[0] == "Usluga") obj.usluga = f.properties;
      else obj.zubar = f.properties;
    });
    toSend.push(obj);
  });
  res.json(toSend);
});

app.put("/potvrdiTermin", async (req, res) => {
  const datumTermina = req.body.datum;
  const idZubara = req.body.telefon;
  let cypher =
    "match(z:Zubar{telefon:'" +
    idZubara +
    "'})-[r:IMA]->(t:Termin{datum:'" +
    datumTermina +
    "'}) set t.potvrdjeno='DA' return t";
  const session = driver.session();
  await session.run(cypher);
  session.close();
  //let cypher2= "match(t:Termin{datum:"+ datumTermina + "'})"
  res.json("Termin prihvaen");
});
app.get("/vratiZainteresovane", async (req, res) => {
  const session = driver.session();
  const idZubara = req.body.id;
  let cypher = //"match (z:Zubar{id:$id})<-[r:ZAINTERESOVAN_ZA]-(s) return s"; ovako ne moze da se ocita njihpv id
    "match (z:Zubar)<-[r:ZAINTERESOVAN_ZA]-(s) where id(z)=" +
    idZubara +
    " return s";
  let result = await session.run(cypher);
  session.close();
  if (result.records.length == 0) res.json("Nema zainteresovanih.");
  let zainteresovani = [];
  result.records.forEach((r) => {
    zainteresovani.push(r._fields[0].properties);
  });
  res.json(zainteresovani);
  //let cypher= "match (s:Student)-[r:ZAINTERESOVAN_ZA]->(z) return "
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
  //let imeZubara = "Zub2";
  const idZubara = req.body.id;
  const cypher =
    "MATCH (s:Student)-[:ZAINTERESOVAN_ZA]->(z:Zubar) WHERE id(z)=" +
    idZubara +
    "  RETURN s";
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
  let imeZubara = "Zub2"; //promeni u id ili telefon zubara
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
