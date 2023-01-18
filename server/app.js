const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const mongoSanitizer = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const HttpError = require('./models/http-error');
const userRoutes = require('./routes/user-routes');
const movieRoutes = require('./routes/movie-routes');
const showRoutes = require('./routes/show-routes');
const gameRoutes = require('./routes/game-routes');
const bookRoutes = require('./routes/book-routes');
const animeRoutes = require('./routes/anime-routes');

dotenv.config({ path: './config.env' });

// Start express app
const app = express();

// Body parser, reading data from body into req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.enable('trust proxy');

// Implement CORS
app.use(cors());

app.options('*', cors);

// Set Security HTTP headers
app.use(helmet());

// Limit requests from same API, to prevent brute force attacks and denial of service
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour',
});

app.use('/api', limiter);

// Data sanitization against NoSQL query injection
app.use(mongoSanitizer());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter polution
app.use(hpp());

// To compress response bodies for all requests that traverse through the middleware
app.use(compression());

app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/shows', showRoutes);
//app.use('/api/animes', animeRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/games', gameRoutes);

app.use((req, res, next) => {
  console.log(req.protocol, req.get('host'), req.originalUrl);
  const error = new HttpError('Could not find this route', 404);
  return next(error);
});

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! Shutting down ...');
  console.log(err.name, err.message);
  process.exit(1);
});

let server;
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@chillplanner.yzamz79.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    server = app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down ...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM RECIEVED. Shutting down gracefully!');
  server.close(() => {
    console.log('Process terminated!');
  });
});
