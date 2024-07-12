const hasAuth = process.argv[2] !== 'noauth';

const fs = require('fs');
const bodyParser = require('body-parser');
const jsonServer = require('json-server');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const server = jsonServer.create();

const dbFilePath = './db.json';
const userdb = JSON.parse(fs.readFileSync('./users.json', 'UTF-8'));

const SECRET_KEY = process.env.SECRET_KEY;
const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION;
const REACT_APP_FRONTEND_ORIGIN = process.env.REACT_APP_FRONTEND_ORIGIN;

server.use(jsonServer.defaults());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(
  cors({
    origin: process.env.REACT_APP_FRONTEND_ORIGIN,
    credentials: true,
  })
);

server.get('/calendar/:month', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

function findUser({ email, password }) {
  return userdb.users.find(
    user => user.email === email && user.password === password
  );
}

function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(' ')[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

server.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = findUser({ email, password });
  if (!user) {
    const status = 401;
    const message = 'Incorrect email or password';
    res.status(status).json({ status, message });
  } else {
    jwt.sign(
      { email: user.email },
      SECRET_KEY,
      { expiresIn: TOKEN_EXPIRATION },
      (err, token) => {
        if (err) {
          res.sendStatus(500);
        } else {
          res.status(200).json({ email: user.email, name: user.name, token });
        }
      }
    );
  }
});

server.get('/auth/user', verifyToken, (req, res) => {
  jwt.verify(req.token, SECRET_KEY, (err, decoded) => {
    if (err) {
      res.status(401).json({ status: 401, message: 'Not authenticated' });
    } else {
      const user = userdb.users.find(user => user.email === decoded.email);
      res.status(200).json({ email: user.email, name: user.name });
    }
  });
});

server.post('/auth/logout', verifyToken, (req, res) => {
  jwt.verify(req.token, SECRET_KEY, (err, decoded) => {
    if (err) {
      res.status(401).json({ status: 401, message: 'Not authenticated' });
    } else {
      res.status(200).json({ message: 'Signed out' });
    }
  });
});

if (hasAuth) {
  server.use(/^(?!\/auth).*$/, verifyToken, (req, res, next) => {
    jwt.verify(req.token, SECRET_KEY, err => {
      if (err) {
        const status = 401;
        res.status(status).json({ status, message: 'Not authenticated' });
      } else {
        next();
      }
    });
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
      time: '13:00',
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
