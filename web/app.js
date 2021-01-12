const express = require('express');
const PORT = process.env.PORT || 5000;

express()
  .get('/', (req, res) => res.send('Hello San Diego Voters Voice, in Docker, with postgresql and redis addons!'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));
