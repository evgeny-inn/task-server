import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import { pino } from 'pino';

import { openAPIRouter } from '@/api-docs/openAPIRouter';
import errorHandler from '@/common/middleware/errorHandler';
import requestLogger from '@/common/middleware/requestLogger';
import { env } from '@/common/utils/envConfig';

import { contactsRouter } from './api/contacts/contactRouter';
import db from './common/db/db';

const logger = pino({ name: 'server start' });

const launch = async () => {
  const app: Express = express();

  app.set('trust proxy', true);

  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(helmet());

  app.use(bodyParser.json());

  app.use(requestLogger());

  await db.connect();

  app.use('/contacts', contactsRouter);

  app.use(openAPIRouter);

  app.use(errorHandler());

  const server = app.listen(env.PORT, () => {
    const { NODE_ENV, HOST, PORT } = env;
    logger.info(`Server (${NODE_ENV}) running on port http://${HOST}:${PORT}`);
  });

  const onCloseSignal = () => {
    logger.info('sigint received, shutting down');
    server.close(() => {
      logger.info('server closed');
      process.exit();
    });
    setTimeout(() => process.exit(1), 10000).unref(); // Force shutdown after 10s
  };

  process.on('SIGINT', onCloseSignal);
  process.on('SIGTERM', onCloseSignal);

  return app;
};

export { launch, logger };
