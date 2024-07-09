const hasAuth = process.argv[2] !== 'noauth';

const fs = require('fs');
const bodyParser = require('body-parser');
const jsonServer = require('json-server');
const session = require('express-session');

const server = jsonServer.create();

const dbFilePath = './db.json';
const userdb = JSON.parse(fs.readFileSync('./users.json', 'UTF-8'));

const SECRET_KEY = '123456789';

server.use(jsonServer.defaults());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

server.get('/calendar/:month', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

server.use(
  session({
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  })
);

function findUser({ email, password }) {
  return userdb.users.find(
    user => user.email === email && user.password === password
  );
}

server.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = findUser({ email, password });
  if (!user) {
    const status = 401;
    const message = 'Incorrect email or password';
    res.status(status).json({ status, message });
  } else {
    req.session.user = { name: user.name, email: user.email };
    res.status(200).json(req.session.user);
  }
});

server.get('/auth/user', (req, res) => {
  if (req.session.user) {
    res.status(200).json(req.session.user);
  } else {
    res.status(401).json({ status: 401, message: 'Not authenticated' });
  }
});

server.post('/auth/logout', (req, res) => {
  if (req.session.user) {
    req.session.destroy(function (err) {
      res.status(200).json({ message: 'Signed out' });
    });
  } else {
    res.status(401).json({ status: 401, message: 'Not authenticated' });
  }
});

if (hasAuth) {
  server.use(/^(?!\/auth).*$/, (req, res, next) => {
    if (!req.session.user) {
      const status = 401;
      res.status(status).json({ status, message: 'Not authenticated' });
      return;
    } else {
      next();
    }
  });
}

server.use((req, res, next) => {
  if (req.method === 'GET' && req.path === '/events') {
    const db = JSON.parse(fs.readFileSync(dbFilePath, 'UTF-8'));
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    db.events.forEach(event => {
      const eventDate = new Date(event.date);
      if (eventDate < today) {
        const newDate = new Date(
          currentYear,
          currentMonth,
          eventDate.getDate()
        );
        event.date = newDate.toISOString().split('T')[0];
      }
    });

    const newDate = today.toISOString().split('T')[0];
    db.events.push({
      id: db.events.length + 1,
      date: newDate,
      time: '14:00',
      desc: 'Reunião com a equipe Dev',
      calendarId: 2,
    });
    db.events.push({
      id: db.events.length + 1,
      date: newDate,
      desc: 'Entrega do projeto react-agenda-ts',
      calendarId: 2,
    });

    res.json(db.events);
  } else {
    next();
  }
});

const router = jsonServer.router(dbFilePath);
server.use(router);

server.listen(8080, () => {
  console.log(`Servidor inicializado, auth=${hasAuth}`);
});
