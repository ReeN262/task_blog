import {Response} from 'express';

export const errorRes = (res: Response, errorText: any, errorCode: number) => res.status(errorCode).json({errorText});
export const resultRes = (res: Response, answer: any) => res.json(answer);

