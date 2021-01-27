const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
var neo4j = require('neo4j-driver');

// var driver = neo4j.driver(
//   'neo4j://localhost:7687',
//   neo4j.auth.basic('neo4j', 'noapas123') // ne brisi
// );

 const driver = neo4j.driver(
   'bolt://localhost:7687',
   neo4j.auth.basic('neo4j', 'pass')
 );

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//-----CREATE-----
app.post('/createZubar', function (req, res) {
  const session = driver.session();
  const body = req.body;
  const cypher =
    //"create (z:Zubar {id: {id}, ime: {ime}, prezime: {prezime}}) RETURN  z";
    //var params = { id: body.id, ime: body.ime, prezime: body.prezime };
    "create ( z:Zubar {ime:'" +
    body.ime +
    "' , username:'" +
    body.username +
    "', sifra:'" +
    body.sifra +
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

app.post('/createStudent', function (req, res) {
  const session = driver.session();
  const body = req.body;
  const cypher =
    "create ( s:Student {ime:'" +
    body.ime +
    "' , prezime:'" +
    body.prezime +
    "' , username:'" +
    body.username +
    "', sifra:'" +
    body.sifra +
    "' , grad:'" +
    body.grad +
    "' , telefon:'" +
    body.telefon +
    "' , godina:" +
    body.godina +
    ', prosek:' +
    body.prosek +
    '}) return s';

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

app.post('/createKorisnik', function (req, res) {
  const session = driver.session();
  const body = req.body;
  const cypher =
    "create ( k:Korisnik {ime:'" +
    body.ime +
    "' , prezime:'" +
    body.prezime +
    "' , username:'" +
    body.username +
    "', sifra:'" +
    body.sifra +
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

app.post('/getLoginUser', async (req, res) => {
  let username = req.body.username;
  let sifra = req.body.sifra;
  const session = driver.session();
  const cypher = 'match(n{username:$username, sifra:$sifra}) return n';
  let params = { username: username, sifra: sifra };
  let result = await session.run(cypher, params);
  if (result.records.length == 0) res.json('Nije pronadjen nijedan korisnik.');
  res.json(result.records[0]._fields[0].properties);
});

app.post('/getOrdinacija', async (req, res) => {
  let username = req.body.username;
  const session = driver.session();
  const cypher =
    'match(n{username:$username})-[r:RADI]->(o:Ordinacija) return o';
  let result = await session.run(cypher, { username: username });
  if (result.records.length == 0) res.json('Zubar ne radi u ordinaciji.');
  res.json(result.records[0]._fields[0].properties);
});

app.post('/createOrdinacija', function (req, res) {
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

//Ovo nam mozda nece trebati?
app.get('/pretraziPoGradu/:imeGrada', async (req, res) => {
  const session = driver.session();
  const zadatiGrad = req.params.imeGrada;
  let cypher = 'match (z:Zubar{grad:$grad}) return z';
  let result = await session.run(cypher, { grad: zadatiGrad });
  session.close();
  console.log(result.records);
  if (result.records.length == 0)
    res.json('Nije pronadjen nijedan zubar u tom gradu.');
  let zubari = [];
  result.records.forEach((r) => {
    zubari.push(r._fields[0].properties);
    // zubari.push(r._fields[0].identity.low);
  });
  res.json(zubari);
});

//ZA STUDENTA
app.put('/postaniZainteresovan', async (req, res) => {
  const telefonZubara = req.body.telefonZubara;
  const telefonStudenta = req.body.telefonStudenta;
  const session = driver.session();
  let cypher =
    'match(z:Zubar) where z.telefon="' +
    telefonZubara +
    '" match(s:Student) where s.telefon="' +
    telefonStudenta +
    '" create (s)-[r:ZAINTERESOVAN_ZA]->(z)';
  await session.run(cypher);
  session.close();
  res.json(true);
});

//-------
app.post('/posaljiPrivatnuPoruku', async (req, res) => {
  //logovani student salje svoj ids a kad klikne na zubara kome se obraca uzima se id od tog zubara
  const idStudenta = req.body.telefonS;
  const idZubara = req.body.telefonZ;
  const tekst = req.body.tekst;
  let today = new Date();
  //let tmp = today.toString();
  //tmp.slice(0, 26);
  const vremeSlanja = today;
  let session = driver.session();
  //let cypher1 = "create (p:Poruka{tekst:$tekst, vreme:$vreme})";
  //let params1 = { tekst: req.body.tekst, vreme: vremeSlanja };
  //await session.run(cypher1, params1);
  //session.close();
  let cypher2 =
    "match (s:Student {telefon: $telefonS}) match (z:Zubar {telefon: $telefonZ}) create (p:Poruka {tekst:'" +
    tekst +
    "' , vreme:'" +
    vremeSlanja +
    "'}) create (s)-[r:SALJE]->(p) create(z)-[zr:PRIMA]->(p)";
  console.log(cypher2);
  await session.run(cypher2, { telefonS: idStudenta, telefonZ: idZubara });
  session.close();
  res.json('Poruka poslata');
});

app.get('/vratiPrivatnePoruke/:mojBrojTelefona', async (req, res) => {
  const idZubara = req.params.mojBrojTelefona;
  const session = driver.session();
  let cypher =
    "match(s:Student)-[r:SALJE]->(p:Poruka)<-[rz:PRIMA]-(z:Zubar{telefon:'" +
    idZubara +
    "'}) return p,s";
  let result = await session.run(cypher);
  session.close();
  if (result.records == 0) res.json('Nema poruka.');
  let toSend = []; //niz objekata obj
  result.records.forEach((rec) => {
    let obj = {}; // objekat koji objedinjuje onog ko je poslao poruku i njegovu poruku
    rec._fields.forEach((f) => {
      if (f.labels[0] == 'Poruka') obj.poruka = f.properties;
      else obj.student = f.properties;
    });
    toSend.push(obj);
  });
  res.json(toSend);
});

app.get('/vratiPraktikante/:telefonZubara', async (req, res) => {
  const telefonZubara = req.params.telefonZubara;
  const session = driver.session();
  let cypher =
    "match(s:Student)-[r:STAZIRA_KOD]->(z:Zubar{telefon:'" +
    telefonZubara +
    "'}) return s";
  let result = await session.run(cypher);
  session.close();
  if (result.records.length == 0) res.json('Nema praktikanata');
  let praktikanti = [];
  result.records.forEach((p) => {
    praktikanti.push(p._fields[0].properties);
  });
  res.json(praktikanti);
});
//--------

//---------
app.put('/zaposliZubara', async (req, res) => {
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
  res.json('Zubar zaposljen');
});

app.put('/odrediVlasnika', async (req, res) => {
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
  res.json('Zubar postavljen za vlasnika ordinacije');
});

app.get('/vratiVlasnika/:adresaOrdinacije', async (req, res) => {
  const idOrdinacije = req.params.adresaOrdinacije;
  const session = driver.session();
  let cypher =
    "match (z:Zubar)-[r:JE_VLASNIK]->(o:Ordinacija{adresa:'" +
    idOrdinacije +
    "'}) return z";
  let result = await session.run(cypher);
  session.close();
  if (result.records.length == 0) res.json('Nema vlasnika');
  res.json(result.records[0]._fields[0].properties);
});

app.get('/vratiZaposlene/:adresaOrdinacije', async (req, res) => {
  const idOrdinacije = req.params.adresaOrdinacije;
  const session = driver.session();
  let cypher =
    "match(z:Zubar)-[r:RADI]->(o:Ordinacija{adresa:'" +
    idOrdinacije +
    "'}) return z";
  let result = await session.run(cypher);
  session.close();
  if (result.records == 0) res.json('Nema zaposlenih');
  let zaposleni = [];
  result.records.forEach((r) => {
    zaposleni.push(r._fields[0].properties);
  });
  res.json(zaposleni);
});
//-----------

//-------FORUM--------
//#region
//Vraca sve komentare za odredjeno pitanje
app.get('/vratiSveKomentare', function (req, res) {
  const session = driver.session();
  const idPitanja = 6;
  const cypher =
    'MATCH (p:Pitanje)<-[:KOMENTAR_NA]-(kom:Komentar)<-[:OSTAVIO]-(k:Korisnik) WHERE ID(p)=' +
    idPitanja +
    ' RETURN kom,k';
  let pomocniNiz = [];
  session
    .run(cypher)
    .then((result) => {
      result.records.map((bundleKomentarKorisnik) => {
        console.log(bundleKomentarKorisnik.get('kom').properties);
        console.log(bundleKomentarKorisnik.get('k').properties);
        let komentarIkorisnik = {
          idKorisnika: bundleKomentarKorisnik.get('k').identity.low,
          imeKorisnika: bundleKomentarKorisnik.get('k').properties.ime,
          komentar: bundleKomentarKorisnik.get('kom').properties.komentar,
        };
        pomocniNiz.push(komentarIkorisnik);
      });
    })
    .catch((e) => {
      // Output the error
      console.log(e);
    })
    .then(() => {
      // Close the Session
      console.log(pomocniNiz);
      res.json(pomocniNiz);
      return session.close();
    })
    .then(() => {
      // Close the Driver
      //return driver.close();
    });
});

//vraca sve postojece tagove kako bi na forumu ljudi pretrazivali kad kliknu na tag
app.get('/vratiTagove', function (req, res) {
  const session = driver.session();

  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  const cypher = 'MATCH (p:Pitanje) RETURN p.tagoviZaFlitriranje';
  let pomocniNiz = [];
  session
    .run(cypher)
    .then((result) => {
      result.records.map((tagoviResult) => {
        //console.log(tagoviResult.get("p.tagoviZaFlitriranje"));

        tagoviResult.get('p.tagoviZaFlitriranje').map((tag) => {
          pomocniNiz.push(tag);
        });
      });
    })
    .catch((e) => {
      // Output the error
      console.log(e);
    })
    .then(() => {
      // Close the Session
      var jedinstveniTagovi = pomocniNiz.filter(onlyUnique);
      console.log(jedinstveniTagovi);
      res.json(jedinstveniTagovi);
      return session.close();
    })
    .then(() => {
      // Close the Driver
      //return driver.close();
    });
});
//vraca sve postojece teme
app.get('/vratiSveTeme', function (req, res) {
  const session = driver.session();

  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  const cypher = 'MATCH (p:Pitanje)<-[:POSTAVIO]-(k:Korisnik) WHERE RETURN p,k';
  let pomocniNiz = [];
  let jsonOdgovor = [];
  session
    .run(cypher)
    .then((result) => {
      result.records.map((bundleRezultat) => {
        console.log(bundleRezultat.get('p').properties);
        console.log(bundleRezultat.get('k').properties);
        let objekat = {
          pitanje: bundleRezultat.get('p').properties,
          korisnik: bundleRezultat.get('k').properties,
        };
        jsonOdgovor.push(objekat);
        console.log('-----');
      });

      //res.json(nizKomentaraRezultat);
      res.json(jsonOdgovor);
    })
    .catch((e) => {
      // Output the error
      console.log(e);
    })
    .then(() => {
      // Close the Session
      var jedinstveniTagovi = pomocniNiz.filter(onlyUnique);
      console.log(jedinstveniTagovi);
      res.json(jedinstveniTagovi);
      return session.close();
    })
    .then(() => {
      // Close the Driver
      //return driver.close();
    });
});
//prosledis izabrane tagove vrati sva pitanja koja imaju taj tag u sebi
app.post('/vratiPitanjaSaTagovima', function (req, res) {
  const session = driver.session();
  let tagoviZaFlitriranje = req.body.tagoviZaFlitriranje;
  let dodatiTagovi = '';
  //MATCH (p:Pitanje)<-[:POSTAVIO]-(k:Korisnik) WHERE 'd' IN p.tagoviZaFlitriranje OR 'a' IN p.tagoviZaFlitriranje RETURN p,k
  tagoviZaFlitriranje.map((tag) => {
    dodatiTagovi += "'" + tag + "' IN p.tagoviZaFlitriranje OR ";
  });
  dodatiTagovi = dodatiTagovi.slice(0, -3);
  const cypher =
    'MATCH (p:Pitanje)<-[:POSTAVIO]-(k:Korisnik) WHERE ' +
    dodatiTagovi +
    'RETURN p,k';
  let jsonOdgovor = [];
  session
    .run(cypher)
    .then((result) => {
      result.records.map((bundleRezultat) => {
        console.log(bundleRezultat.get('p').properties);
        console.log(bundleRezultat.get('k').properties);
        let objekat = {
          pitanje: bundleRezultat.get('p').properties,
          korisnik: bundleRezultat.get('k').properties,
        };
        jsonOdgovor.push(objekat);
        console.log('-----');
      });

      //res.json(nizKomentaraRezultat);
      res.json(jsonOdgovor);
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
//Korisnik/Zubar/Student prijavljuje pitanje/komenatr
app.post('/prijaviPost', function (req, res) {
  const session = driver.session();
  let idPitanja = req.body.idPitanja;
  let idKorisnika = req.body.idKorisnika;
  //MATCH (k:idPitanja)-[:POSTAVIO]->(p:Pitanje) WHERE p.id='5'AND k.id='asd' DETACH DELETE p

  const cypher =
    'MATCH (p:Pitanje),(k:Korisnik) WHERE ID(p)=' +
    idPitanja +
    ' AND ID(k)=' +
    idKorisnika +
    ' CREATE (k)-[:PRIJAVIO]->(p)';

  session
    .run(cypher)
    .then((result) => {
      // result.records.map(terminResult=>{
      //   console.log( terminResult.get("t").properties );
      // })
      console.log(cypher);
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

app.get('/pretraziUslugu/:nazivUsluge', async (req, res) => {
  const nazivUsluge = req.params.nazivUsluge;
  const session = driver.session();
  let cypher =
    "match(z:Zubar)-[r:NUDI_USLUGU]->(u:Usluga{naziv:'" +
    nazivUsluge +
    "'}) return z";
  let result = await session.run(cypher);
  if (result.records.length == 0) res.json('Nema takvih usluga');
  let zubari = [];
  result.records.forEach((p) => {
    zubari.push(p._fields[0].properties);
  });
  res.json(zubari);
});

app.get('/pretraziUsluguPoCeni/:nazivUsluge', async (req, res) => {
  const nazivUsluge = req.params.nazivUsluge;
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
  if (result.records == 0) res.json('Nema poruka.');
  let toSend = []; //niz objekata obj
  result.records.forEach((rec) => {
    let obj = {}; // objekat koji objedinjuje onog ko je poslao poruku i njegovu poruku
    rec._fields.forEach((f) => {
      if (f.labels[0] == 'Usluga') obj.usluga = f.properties;
      else obj.zubar = f.properties;
    });
    toSend.push(obj);
  });
  res.json(toSend);
});

app.get('/sviZubari', async (req, res) => {
  const session = driver.session();
  let cypher = 'match (z:Zubar) return z';
  let result = await session.run(cypher);
  session.close();
  if (result.records.length == 0) res.json('Nije pronadjen nijedan zubar.');
  let sviZubari = [];
  result.records.forEach((r) => {
    sviZubari.push(r._fields[0].properties);
  });
  res.json(sviZubari);
});

app.get('/sviKorisnici', async (req, res) => {
  const session = driver.session();
  let cypher = 'match (k:Korisnik) return k';
  let result = await session.run(cypher);
  session.close();
  if (result.records.length == 0) res.json('Nije pronadjen nijedan korisnik.');
  let sviKorisnici = [];
  result.records.forEach((r) => {
    sviKorisnici.push(r._fields[0].properties);
  });
  res.json(sviKorisnici);
});
app.get('/sviStudenti', async (req, res) => {
  const session = driver.session();
  let cypher = 'match (s:Student) return s';
  let result = await session.run(cypher);
  session.close();
  if (result.records.length == 0) res.json('Nije pronadjen nijedan student.');
  let sviStudenti = [];
  result.records.forEach((r) => {
    sviStudenti.push(r._fields[0].properties);
  });
  res.json(sviStudenti);
});
//pretraga na forumu
app.get('/pretraziPoImenu/:ime', async (req, res) => {
  const ime = req.params.ime;
  const session = driver.session();

  let cypher = 'MATCH (k) WHERE k.ime CONTAINS "' + ime + '" return k';
  let resultArr = [];
  session
    .run(cypher)
    .then((result) => {
      console.log(result);
      result.records.map((informationResult) => {
        console.log(informationResult.get('k').properties);
        resultArr.push(informationResult.get('k').properties);
      });
      // res.sendStatus(200);
      res.json(resultArr);
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

app.get('/vratiPitanjeSaKomentarima/:idPitanja', async (req, res) => {
  const idPitanja = req.params.idPitanja;
  const session = driver.session();
  //MATCH (k:Komentar)-[:KOMENTAR_NA]->(p:Pitanje)<-[:Odgovor_Na]-(o:Odgovor)  WHERE ID(p)=6 return k,p,o
  let cypher =
    'MATCH (k:Komentar)-[:KOMENTAR_NA]->(p:Pitanje)<-[:Odgovor_Na]-(o:Odgovor)  WHERE ID(p)=' +
    idPitanja +
    ' return k,p,o';
  let resultArr = [];
  session
    .run(cypher)
    .then((result) => {
      console.log(result);
      result.records.map((informationResult) => {
        let object = {};
        object.komentar = informationResult.get('k').properties;
        object.pitanje = informationResult.get('p').properties;
        object.odogovor = informationResult.get('o').properties;
        console.log(object);
        resultArr.push(object);
      });
      // res.sendStatus(200);
      res.json(object);
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

//#endregion

//-------KORISNIK----------

//#region
//Korisnik postavlja pitanje na forum
app.post('/postaviPitanje', function (req, res) {
  const session = driver.session();
  let tekstPitanja = req.body.tekstPitanja;
  let tagoviZaFlitriranje = req.body.tagoviZaFlitriranje;
  let naslov = req.body.naslov;
  let telefonKorisnika = req.body.telefonKorisnika;

  let transformisanNiz = '';
  tagoviZaFlitriranje.map((tag) => {
    transformisanNiz += '"' + tag + '",';
  });
  transformisanNiz = transformisanNiz.slice(0, -1);
  const cypher =
    'MATCH(k:Korisnik) WHERE k.telefon="' +
    telefonKorisnika +
    '" CREATE (p:Pitanje {tekstPitanja:"' +
    tekstPitanja +
    '",naslov:"' +
    naslov +
    '",tagoviZaFlitriranje:[' +
    transformisanNiz +
    ']})<-[:POSTAVIO]-(k)';

  session
    .run(cypher)
    .then((result) => {
      // result.records.map(terminResult=>{
      //   console.log( terminResult.get("t").properties );
      // })
      console.log(cypher);
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

//koisnik brise svoje pitanje
app.post('/obrisiSvojePitanje', function (req, res) {
  const session = driver.session();
  let idPitanja = req.body.idPitanja;
  let idUlogovanogKorisnika = req.body.idUlogovanog;

  const cypher =
    'MATCH (k:Korisnik)-[:POSTAVIO]->(p:Pitanje) WHERE ID(p)=' +
    idPitanja +
    ' AND ID(k)=' +
    idUlogovanogKorisnika +
    ' DETACH DELETE p' +
    session
      .run(cypher)
      .then((result) => {
        // result.records.map(terminResult=>{
        //   console.log( terminResult.get("t").properties );
        // })
        console.log(cypher);
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

//Korisnik ostavlja komentar o zubaru
app.post('/ostaviKomentar', function (req, res) {
  const session = driver.session();
  let telefonZubara = req.body.telefonZubara;
  let telefonKorisnika = req.body.telefonKorisnika;
  let ocena = req.body.ocena;
  let komentar = req.body.komentar;
  const cypher =
    'MATCH (z:Zubar),(k:Korisnik) WHERE z.telefon="' +
    telefonZubara +
    '"AND k.telefon="' +
    telefonKorisnika +
    '" CREATE (k)-[:OSTAVIO]->(kom:Komentar {ocena:"' +
    ocena +
    '",komentar:"' +
    komentar +
    '"})-[:NA]->(z)';

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

//Korsinik ostavlja komentar na pitanje
app.post('/ostaviKomentarNaPitanje', function (req, res) {
  const session = driver.session();
  let idPitanja = req.body.idPitanja;
  let idKorisnika = req.body.idKorisnika;
  let komentar = req.body.komentar;
  const cypher =
    'MATCH (p:Pitanje),(k:Korisnik) WHERE ID(p)=' +
    idPitanja +
    ' AND k.telefon=' +
    idKorisnika +
    "' CREATE (k)-[:OSTAVIO]->(kom:Komentar {komentar:'" +
    komentar +
    "'})-[:KOMENTAR_NA]->(p)";

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

app.post('/zakaziTermin', async (req, res) => {
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
    '}) create (k)-[r:ZAKAZAO]->(t) create(z)-[zr:IMA]->(t)';

  let session = driver.session();
  await session.run(cypher);
  session.close();
  res.json('Termin rezervisan');
});
//Poziva se da se popune polja kod korinika kad hoce da menja nesto o sebi
app.get('/vratiInformacijeKorinik/:id', async (req, res) => {
  const idKorisnika = req.params.id;
  const session = driver.session();

  let cypher = 'match(k:Korisnik) WHERE k.telefon' + idKorisnika + ' return k';

  session
    .run(cypher)
    .then((result) => {
      let resultObject;
      result.records.map((informationResult) => {
        console.log(informationResult.get('k').properties);
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
//TREBA DA SE ISTESTIRA-----------------
//Korisnik Promenio informacije o sebi
app.put('/updateInfoKorisnik', async (req, res) => {
  const idKorisnika = req.body.telefonK;
  const novIdKoriniska = req.body.noviTelefon;
  const prezimeKorisnika = req.body.prezimeKorisnika;
  const imeKorisnika = req.body.imeKorisnika;
  let cypher =
    'match (k:Korisnik) WHERE k.telefon="' +
    idKorisnika +
    '" set k.telefon="' +
    novIdKoriniska +
    ' k.ime="' +
    imeKorisnika +
    '" k.prezime="' +
    prezimeKorisnika +
    '"';
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

//pitanja koje je postavio korisnik
app.get('/pitanjaPostavioKorisnik/:id', async (req, res) => {
  const idKorisnika = req.params.id;
  const session = driver.session();
  let arrResult = [];
  let cypher =
    'match(k:Korisnik)-[:POSTAVIO]->(p:Pitanje) WHERE k.telefon' +
    idKorisnika +
    ' return p';

  session
    .run(cypher)
    .then((result) => {
      let resultObject;
      result.records.map((informationResult) => {
        console.log(informationResult.get('p').properties);
        arrResult.push(informationResult.get('p').properties);
      });
      res.json(arrResult);
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
//pitanja na koja je odgovorio student
app.get('/pitanjaOdgovorioStudent/:id', async (req, res) => {
  const idStudenta = req.params.id;

  const session = driver.session();
  let arrResult = [];
  let cypher =
    'match(s:Student)-[:ODGOVORIO]->(o:Odgovor)-[:Odgovor_Na]->(p:Pitanje) WHERE s.telefon="' +
    idStudenta +
    '" return p,o';

  session
    .run(cypher)
    .then((result) => {
      let resultObject;
      result.records.map((informationResult) => {
        let object = {};

        object.pitanje = informationResult.get('p').properties.tekstPitanja;
        object.odgovor = informationResult.get('o').properties.odgovor;
        console.log(object);
        arrResult.push(object);
      });
      res.json(arrResult);
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
//#endregion

//---------ZUBAR----------
//#region
//Zubar/Student ostavlja odgovor na pitanje
app.post('/odgovoriNaPitanje', function (req, res) {
  const session = driver.session();
  let idPitanja = req.body.idPitanja;
  let daLiJeZubar = req.body.daLiJeZubar;
  let idPosiljaoca = req.body.idPosiljaoca;
  let odgovor = req.body.odgovor;
  let cypher = '';
  if (daLiJeZubar) {
    cypher =
      'MATCH (p:Pitanje),(z:Zubar) WHERE ID(p)=' +
      idPitanja +
      'AND z.telefon="' +
      idPosiljaoca +
      '" CREATE (z)-[:ODGOVORIO]->(o:Odgovor {odgovor:"' +
      odgovor +
      '",tag:"zubar",odobreno:"DA"})-[:Odgovor_Na]->(p)';
  } else {
    cypher =
      'MATCH (p:Pitanje),(s:Student) WHERE ID(p)=' +
      idPitanja +
      ' AND s.telefon="' +
      idPosiljaoca +
      '" CREATE (s)-[:ODGOVORIO]->(o:Odgovor {odgovor:"' +
      odgovor +
      '",tag:"student",odobreno:"NE"})-[:Odgovor_Na]->(p)';
  }

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

//Vraca komentare o zubaru kako bi se prikazali na zubarevoj stranici
app.get('/vratiKomentareOZubaru/:telefon', function (req, res) {
  const session = driver.session();
  let nizKomentaraRezultat = new Array();
  let telefon = req.params.telefon;
  const cypher =
    'MATCH (k:Korisnik)-[:OSTAVIO]->(kom:Komentar)-[:NA]->(z:Zubar) WHERE z.telefon="' +
    telefon +
    '" RETURN kom';
  session
    .run(cypher)
    .then((result) => {
      result.records.map((komentariResult) => {
        let objekat = {
          id: komentariResult.get('kom').identity.low,
          ocena: komentariResult.get('kom').properties.ocena,
          komentar: komentariResult.get('kom').properties.komentar,
        };

        console.log(objekat);
        nizKomentaraRezultat.push(objekat);
      });

      res.json(nizKomentaraRezultat);
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

//Zubar brise svoj odgovor
app.post('/obrisiSvojOdgovor', function (req, res) {
  const session = driver.session();
  let idOdgovora = req.body.idOdgovora;
  let idUlogovanogZubara = req.body.idUlogovanogZubara;
  let cypher =
    'MATCH (z:Zubar)-[:ODGOVORIO]->(o:Odgovor)-[:ODGOVOR_NA]->(p:Pitanje) WHERE ID(o)=' +
    idOdgovora +
    ' AND ID(z)=' +
    idUlogovanogZubara +
    ' DETACH DELETE o';

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

app.put('/potvrdiTermin', async (req, res) => {
  const datumTermina = req.body.datum;
  const idZubara = req.body.telefon;
  let cypher =
    "match(z:Zubar{telefon:'" +
    idZubara +
    "'})-[r:IMA]->(t:Termin{datum:'" +
    datumTermina +
    "'})<-[:ZAKAZAO]-(k:Korisnik) set t.potvrdjeno='DA' return t,k";
  const session = driver.session();
  await session
    .run(cypher)
    .then((result) => {
      let object = {};
      result.records.map((terminKorisnikResult) => {
        console.log(terminKorisnikResult.get('t').properties);
        console.log(terminKorisnikResult.get('k').properties);
        object.infoKorisnika = terminKorisnikResult.get('t').properties;
        object.infoTermina = terminKorisnikResult.get('k').properties;
      });

      res.json(object);
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
  //let cypher2= "match(t:Termin{datum:"+ datumTermina + "'})"
  res.json('Termin prihvacen');
});

app.get('/vratiTermineZubara/:telefon', function (req, res) {
  const session = driver.session();
  let telefonZubara = req.params.telefon;
  let nizTerminaRezultat = new Array();
  const cypher =
    'MATCH (z:Zubar)-[:IMA]->(t:Termin)<-[:ZAKAZAO]-(k:Korisnik) WHERE z.telefon="' +
    telefonZubara +
    '" RETURN t';
  session
    .run(cypher)
    .then((result) => {
      result.records.map((terminResult) => {
        console.log(terminResult.get('t').properties);
        nizTerminaRezultat.push(terminResult.get('t').properties);
      });

      res.json(nizTerminaRezultat);
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

app.get('/vratiZainteresovaneStudente/:telefon', function (req, res) {
  const session = driver.session();
  //let imeZubara = "Zub2";
  let nizStudenataRezultat = new Array();
  const telefonZubara = req.params.telefon;
  const cypher =
    'MATCH (s:Student)-[:ZAINTERESOVAN_ZA]->(z:Zubar) WHERE z.telefon="' +
    telefonZubara +
    '"  RETURN s';
  session
    .run(cypher)
    .then((result) => {
      result.records.map((studentResult) => {
        console.log(studentResult.get('s').properties);
        nizStudenataRezultat.push(studentResult.get('s').properties);
      });

      res.json(nizStudenataRezultat);
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
app.get('/daLiPreporucujem/:usernamMoj/:usernameDrugog', function (req, res) {
  const session = driver.session();
  let usernameMoj = req.params.usernamMoj;
  let usernameDrugog = req.params.usernameDrugog;
  let nizTerminaRezultat = new Array();
  const cypher =
    'MATCH (z:Zubar)-[p:PREPORUCUJE]->(z2:Zubar) WHERE z.username="' +
    usernameMoj +
    "\" AND z2.username=\""+usernameDrugog+"\" RETURN p";

  session
    .run(cypher)
    .then((result) => {
      let daLiPreporucujem = false
      if(result.records[0]!=null)
      daLiPreporucujem = true;
     res.json(daLiPreporucujem)
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

app.get('/vratiTermineZubaraNeOdobrene/:telefon', function (req, res) {
  const session = driver.session();
  let telefonZubara = req.params.telefon;
  let nizTerminaRezultat = new Array();
  const cypher =
    'MATCH (z:Zubar)-[:IMA]->(t:Termin)<-[:ZAKAZAO]-(k:Korisnik) WHERE z.telefon="' +
    telefonZubara +
    "\" AND t.potvrdjeno='NE' RETURN t,k";
  session
    .run(cypher)
    .then((result) => {
      result.records.map((terminKorResult) => {
        let resultObject = {};
        resultObject.datum = terminKorResult.get('t').properties.datum;
        resultObject.imeUsluge = terminKorResult.get('t').properties.imeUsluge;
        resultObject.potvrdjeno = terminKorResult.get(
          't'
        ).properties.potvrdjeno;
        resultObject.ime = terminKorResult.get('k').properties.ime;
        resultObject.idTermina = terminKorResult.get('t').identity.low;
        console.log(terminKorResult.get('t').properties);
        nizTerminaRezultat.push(resultObject);
      });

      res.json(nizTerminaRezultat);
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

app.get('/vratiTermineZubaraOdobrene/:telefon', function (req, res) {
  const session = driver.session();
  let telefonZubara = req.params.telefon;
  let nizTerminaRezultat = new Array();
  const cypher =
    'MATCH (z:Zubar)-[:IMA]->(t:Termin)<-[:ZAKAZAO]-(k:Korisnik) WHERE z.telefon="' +
    telefonZubara +
    "\" AND t.potvrdjeno='DA' RETURN t,k";
  session
    .run(cypher)
    .then((result) => {
      result.records.map((terminKorResult) => {
        let resultObject = {};
        resultObject.datum = terminKorResult.get('t').properties.datum;
        resultObject.imeUsluge = terminKorResult.get('t').properties.imeUsluge;
        resultObject.potvrdjeno = terminKorResult.get(
          't'
        ).properties.potvrdjeno;
        resultObject.ime = terminKorResult.get('k').properties.ime;
        resultObject.idTermina = terminKorResult.get('t').identity.low;
        console.log(terminKorResult.get('t').properties);
        nizTerminaRezultat.push(resultObject);
      });

      res.json(nizTerminaRezultat);
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

app.put('/novaUsluga', async (req, res) => {
  const idZubara = req.body.username;
  const session = driver.session();
  let naziv = req.body.naziv;
  let cena = req.body.cena;
  let opis = req.body.opis;

  const cypher =
    'match (z:Zubar) where z.username="' +
    idZubara +
    '" create (u:Usluga {naziv:"' +
    naziv +
    '", cena:"' +
    cena +
    '", opis:"' +
    opis +
    '", idZubara:"' +
    idZubara +
    '"}) create (z)-[r:NUDI_USLUGU]->(u)';

  await session.run(cypher);
  session.close();
  res.json('Usluga je dodata');
});

app.put('/obrisiUslugu', async (req, res) => {
  const usernameZubara = req.body.usernameZubara;
  const session = driver.session();
  let nazivUsluge = req.body.nazivUsluge;

  const cypher =
    'match (z:Zubar)-[:NUDI_USLUGU]->(u:Usluga) where z.username="' +
    usernameZubara +
    '" AND u.naziv ="' +nazivUsluge +'" DETACH DELETE u' 

    session
    .run(cypher)
    .then((result) => {
      res.json("Usluga je obrisana");
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

app.get('/vratiUslugeZubara/:username', function (req, res) {
  const session = driver.session();
  let username = req.params.username;
  let nizUslugaRezultat = new Array();
  const cypher =
    'MATCH (z:Zubar)-[:NUDI_USLUGU]->(u:Usluga) WHERE z.username="' +
    username +
    '" RETURN u';
  session
    .run(cypher)
    .then((result) => {
      result.records.map((uslugeResult) => {
        console.log(uslugeResult.get('u').properties);
        nizUslugaRezultat.push(uslugeResult.get('u').properties);
      });

      res.json(nizUslugaRezultat);
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

app.put('/preporuciZubara', async (req, res) => {
  const idZubara = req.body.username;
  const oznaceni = req.body.oznaceni; // niz idjeva kao da imas listu svih zubara i tu kao cekiras kog da preporucujes i vadis im usernameove i ofarba se u crveno
  console.log(typeof oznaceni);
  oznaceni.forEach(async (o) => {
    console.log(o);
    const session = driver.session();
    let cypher =
      "match (z:Zubar{username:'" +
      idZubara +
      "'}) " +
      "match(preporucen:Zubar{username:'" +
      o +
      "' }) create (z)-[r:PREPORUCUJE]->(preporucen)";
    await session.run(cypher);
    session.close();
  });
  res.json(true);
});

app.put('/prihvatiStaziranje', async (req, res) => {
  const idStudenta = req.body.idS;
  const idZubara = req.body.idZ;
  let session = driver.session();
  let cypher1 =
    'match(z:Zubar) where id(z)=' +
    idZubara +
    ' match(s:Student) where id(s)=' +
    idStudenta +
    ' create (s)-[r:STAZIRA_KOD]->(z)';
  await session.run(cypher1);
  session.close();
  session = driver.session();
  let cypher2 =
    'match(z:Zubar) where id(z)=' +
    idZubara +
    ' match(s:Student) where id(s)=' +
    idStudenta +
    ' match(s)-[r:ZAINTERESOVAN_ZA]->(z) delete r';
  await session.run(cypher2);
  session.close();
  res.json('Staziranje prihvaceno');
});
//Poziva se da se popune polja kod zubara kad hoce da menja nesto o sebi
app.get('/vratiInformacijeZubar/:username', async (req, res) => {
  const usernameZubar = req.params.username;
  const session = driver.session();

  let cypher =
    'match(z:Zubar) WHERE z.username="' + usernameZubar + '" return z';

  session
    .run(cypher)
    .then((result) => {
      let resultObject;
      result.records.map((informationResult) => {
        console.log(informationResult.get('z').properties);
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
//TREBA DA SE ISTESTIRA-----------------
//Zubar Promenio informacije o sebi
app.put('/updateInfoZubar', async (req, res) => {
  const usernameZubara = req.body.usernameZubara;
  const novusernameZubara = req.body.novusernameZubara;
  const sifra = req.body.prezimeKorisnika;
  const ime = req.body.ime;
  const prezime = req.body.prezime;
  const grad = req.body.grad;
  const telefon = req.body.telefon;
  let cypher =
    'match (z:Zubar) WHERE z.username="' +
    usernameZubara +
    '" set k.username="' +
    novusernameZubara +
    '" k.sifra="' +
    sifra +
    '" k.ime="' +
    ime +
    '" z.prezime="' +
    prezime +
    '" z.grad="' +
    grad +
    '" z.telefon="' +
    telefon;
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
//#endregion

//----------ADMIN--------
//#region
//Admin brise bilo koji odgovor
app.post('/obrisiOdgovor', function (req, res) {
  const session = driver.session();
  let idOdgovora = req.body.idOdgovora;
  //MATCH (k:idPitanja)-[:POSTAVIO]->(p:Pitanje) WHERE p.id='5'AND k.id='asd' DETACH DELETE p

  const cypher =
    'MATCH (o:Odgovor)-[:ODGOVOR_NA]->(p:Pitanje) WHERE ID(o)=' +
    idOdgovora +
    ' DETACH DELETE o';

  session
    .run(cypher)
    .then((result) => {
      // result.records.map(terminResult=>{
      //   console.log( terminResult.get("t").properties );
      // })
      console.log(cypher);
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

//Adminu se vraca lista prijavljenih komentara/pitanja
app.get('/vratiPrijavljene', function (req, res) {
  const session = driver.session();

  const cypher = 'MATCH (p:Pitanje)<-[:PRIJAVIO]-(k) RETURN p';
  let pomocniNiz = [];

  session
    .run(cypher)
    .then((result) => {
      result.records.map((pitanjaResult) => {
        //console.log(tagoviResult.get("p.tagoviZaFlitriranje"));

        let objekat = pitanjaResult.get('p').properties;
        objekat.idPitanja = pitanjaResult.get('p').identity.low;
        pomocniNiz.push(objekat);
      });
    })
    .catch((e) => {
      // Output the error
      console.log(e);
    })
    .then(() => {
      // Close the Session
      console.log(pomocniNiz);
      res.json(pomocniNiz);
      return session.close();
    })
    .then(() => {
      // Close the Driver
      //return driver.close();
    });
});

//Admin brise prijavu (smatra da je prijava ne osnovana (glupa))
app.post('/obrisiPrijavu', function (req, res) {
  const session = driver.session();
  let idPitanja = req.body.idPitanja;

  const cypher =
    'MATCH (p:Pitanje)<-[prij:PRIJAVIO]-(k) WHERE ID(p)=' +
    idPitanja +
    ' DETACH DELETE prij';

  session
    .run(cypher)
    .then((result) => {
      // result.records.map(terminResult=>{
      //   console.log( terminResult.get("t").properties );
      // })
      console.log(cypher);
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

//Admin brise bilo koje pitanje
app.post('/obrisiPitanje', function (req, res) {
  const session = driver.session();
  let idPitanja = req.body.idPitanja;
  //MATCH (k:idPitanja)-[:POSTAVIO]->(p:Pitanje) WHERE p.id='5'AND k.id='asd' DETACH DELETE p

  const cypher =
    'MATCH (k:Korisnik)-[:POSTAVIO]->(p:Pitanje) WHERE p(ID)=' +
    idPitanja +
    ' DETACH DELETE p' +
    session
      .run(cypher)
      .then((result) => {
        // result.records.map(terminResult=>{
        //   console.log( terminResult.get("t").properties );
        // })
        console.log(cypher);
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
//#endregion

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
