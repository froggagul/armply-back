import express, { Application, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import passport from 'passport';
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
//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(PassportStrategy.localStrategy);
passport.serializeUser(PassportStrategy.serialize);
passport.deserializeUser(PassportStrategy.deserialize);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(router);

app.listen(5000, () => console.log('server running'));
