import {Response} from 'express';

const errorRes = (res: Response, errorText: string, errorCode: number) => res.status(errorCode).json({errorText});
const resultRes = (res: Response, answer: any) => res.json(answer);

export {errorRes, resultRes};
