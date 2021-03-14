const express = require('express');
const PORT = process.env.PORT || 5000;
const app = express();

const candidateController = require('./controller').candidate;

app.get('/', (req, res) => res.send('Hello San Diego Voters Voice!'))

// use '/agencies/csd/year/2020/candidates'
app.get('/agencies/:agencyShortName/year/:year/candidates', candidateController.getAllCandidatesOfAgencyInYear);


app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
