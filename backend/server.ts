import { Request, Response } from 'express';
import { Lottery } from './types';
import { Redis } from '@upstash/redis';
const express = require('express');
const cors = require('cors');
const ulid = require('ulid');

// Types
type RequestBody<T> = {
  body: T;
};

type SuccessResponse<T> = {
  data: T;
};

type ErrorResponse = {
  error: string;
};

type BaseParams<IDType = number> = {
  id: IDType;
};

type APIResponse<T> = SuccessResponse<T> | ErrorResponse;

type ResponseStatus = 'Success' | 'Error';

type RegisterRequest = {
  lotteryId: string;
  name: string;
};

type RegisterResponse = {
  status: ResponseStatus;
};

// Type guards and helpers

function isLottery(value: unknown): value is Lottery {
  if (!value || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.prize === 'string' &&
    typeof obj.type === 'string' &&
    (obj.status === 'running' || obj.status === 'finished')
  );
}

function toLottery(data: Record<string, unknown> | null): Lottery | null {
  if (!data) return null;
  if (isLottery(data)) return data;
  return null;
}

function lotteryToRecord(lottery: Lottery): Record<string, string> {
  return {
    id: lottery.id,
    name: lottery.name,
    prize: lottery.prize,
    type: lottery.type,
    status: lottery.status,
  };
}

// Redis setup with Upstash SDK

const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = process.env;

if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) {
  console.error('Missing Upstash Redis credentials. Please set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in .env file');
}

const client = new Redis({
  url: UPSTASH_REDIS_REST_URL!,
  token: UPSTASH_REDIS_REST_TOKEN!,
});

// Express setup

const app = express();
const port = 3000;
app.use(express.json({ limit: '10kb' }));

if (process.env.NODE_ENV === 'development') {
  // Enabling Cross-Origin Resource Sharing in development, as we run
  // the frontend and the backend code on different ports while developing.
  app.use(cors());
}

// API routes

app.get(
  '/lotteries',
  async (
    req: Request,
    res: Response<APIResponse<Lottery[]>>,
  ): Promise<void> => {
    try {
      const lotteryIds = await client.lrange('lotteries', 0, -1);

      const transaction = client.multi();
      lotteryIds.forEach((id: string) => transaction.hgetall(`lottery.${id}`));
      const results = await transaction.exec();

      const lotteries = (results as unknown[])
        .map((result) => toLottery(result as Record<string, unknown>))
        .filter((lottery): lottery is Lottery => lottery !== null);

      res.json({ data: lotteries });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to read the lotteries data' });
    }
  },
);

app.post(
  '/lotteries',
  async (
    req: Request<RequestBody<Lottery>>,
    res: Response<Lottery | ErrorResponse>,
  ): Promise<void> => {
    const { type, name, prize } = req.body;

    if (type !== 'simple') {
      res.status(422).json({ error: 'Invalid lottery type' });
      return;
    }

    if (typeof name !== 'string' || name.length < 3) {
      res.status(422).json({ error: 'Invalid lottery name' });
      return;
    }

    if (typeof prize !== 'string' || prize.length < 3) {
      res.status(422).json({ error: 'Invalid lottery prize' });
      return;
    }

    const id = ulid.ulid();
    const newLottery: Lottery = {
      id,
      name,
      prize,
      type,
      status: 'running',
    };

    try {
      await client
        .multi()
        .hset(`lottery.${id}`, lotteryToRecord(newLottery))
        .lpush('lotteries', id)
        .exec();

      console.log('res', res);

      res.json(newLottery);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create the lottery' });
    }
  },
);

app.get(
  '/lottery/:id',
  async (
    req: Request<BaseParams>,
    res: Response<Lottery | ErrorResponse>,
  ): Promise<void> => {
    const { id } = req.params;

    try {
      const data = await client.hgetall(`lottery.${id}`);
      const lottery = toLottery(data as Record<string, unknown> | null);

      if (!lottery) {
        res
          .status(404)
          .json({ error: 'A lottery with the given ID does not exist' });
        return;
      }

      res.json(lottery);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to read the lottery data' });
    }
  },
);

app.post(
  '/register',
  async (
    req: Request<RequestBody<RegisterRequest>>,
    res: Response<RegisterResponse | ErrorResponse>,
  ): Promise<void> => {
    const { lotteryId, name } = req.body;

    if (!lotteryId) {
      res.status(400).json({ error: 'Lottery ID must be provided' });
      return;
    }

    if (!name) {
      res.status(400).json({ error: "Participant's name must be provided" });
      return;
    }

    try {
      const lotteryStatus = await client.hget(`lottery.${lotteryId}`, 'status');

      if (!lotteryStatus) {
        throw new Error("A lottery with the given ID doesn't exist");
      }

      if (lotteryStatus === 'finished') {
        throw new Error('A lottery with the given ID is already finished');
      }

      await client.lpush(`lottery.${lotteryId}.participants`, name);

      res.json({ status: 'Success' });
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        res.status(500).json({
          error: `Failed to register for the lottery: ${error.message}`,
        });
      }
    }
  },
);

if (process.env.NODE_ENV === 'production') {
  // Serving the bundled frontend code together with the backend on the same port in production.
  app.use(express.static('client/dist'));
}

// Server start

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
