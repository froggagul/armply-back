import express, { Application, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import router from './routes';
import dotenv from 'dotenv';
dotenv.config();

if (process.env.DATABASE_URL == undefined) {
    console.error('no database url on .env!')
    process.exit(1);
}

mongoose.connect(process.env.DATABASE_URL, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', (err) => {
    console.error(err);
});
db.once('open', () => {
    console.log('connected to database');
});

const app: Application = express();



app.use(router);

app.listen(5000, () => console.log('server running'));
