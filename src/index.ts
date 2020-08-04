import express, { Application, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import dotenv from 'dotenv';
import passport from 'passport';
import cors from 'cors';
import expressSession from 'express-session';
import cookieParser from 'cookie-parser';
import router from './routes';
import * as PassportStrategy from './util/passport';

dotenv.config();

if (process.env.DATABASE_URL == undefined) {
    console.error('no database url on .env!')
    process.exit(1);
}
mongoose.connect(process.env.DATABASE_URL, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
const db = mongoose.connection;
db.on('error', (err) => {
    console.error(err);
});
db.once('open', () => {
    console.log('connected to database');
});

const app: Application = express();
//setup
app.use(cors({
  credentials: true, // enable set cookie
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  origin: ['https://master.d36t62qh9mf3h3.amplifyapp.com', 'http://www.armply.com']
}));
app.use(expressSession({
  cookie: {
    secure: true,
    httpOnly: false, // Client-side XHR will be used
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    sameSite: 'none',
  },
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET!,
  store: new (MongoStore(expressSession))({
    mongooseConnection: mongoose.connection
  })
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser(process.env.SESSION_SECRET));
//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(PassportStrategy.localStrategy);
passport.use(PassportStrategy.googleStrategy);
passport.use(PassportStrategy.facebookStrategy);
passport.serializeUser(PassportStrategy.serialize);
passport.deserializeUser(PassportStrategy.deserialize);
app.use((req, res, next) => {
  console.log(req.headers);
  if (!req.session?.passport || JSON.stringify(req.session.passport) === '{}') {
    req.user = undefined;
  }
  res.setHeader('Set-Cookie', 'key=value; HttpOnly; SameSite=strict');
  next();
});

app.use(router);

app.listen(process.env.PORT || 3000, () => console.log('server running'));
