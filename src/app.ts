import express, { Application, Request, Response, NextFunction } from 'express';

const app: Application = express();

app.get('/', (_req: Request, res: Response, next: NextFunction) => {
    console.log('hello')
    res.send('Hello');
});

app.listen(5000, () => console.log('server running'));
