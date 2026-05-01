const express = require('express');
const rateLimit = require('express-rate-limit');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;
var app = express();

app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }));

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append server.log.');
    }
  });
  next();
});

// app.use((req, res, next) => {
//   res.render('maintenance.hbs', {
//     pageTitle: 'Under Maintenance',
//     welcomeMessage: 'We are currently in maintenance mode.  Please check back soon.'
//   });
// });

app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home',
    activePage: 'home',
    welcomeMessage: 'Practical cloud and DevOps engineering, built to outlast the engagement.'
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About',
    activePage: 'about'
  });
});

app.get('/projects', (req, res) => {
  res.render('projects.hbs', {
    pageTitle: 'Projects',
    activePage: 'projects'
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request'
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
});
