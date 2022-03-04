import { createLogger, format, transports } from 'winston';
import * as ecs from '@elastic/ecs-winston-format';
const requestId = require('request-local').requestId;

export const logger = createLogger({
  level: 'debug',
  defaultMeta: {
    requestId
  },
  format:  ecs({ convertReqRes: true }),
  transports: [
    new transports.Console({
      stderrLevels: ['error'],
    }),
    new transports.File({
      format: ecs({ convertReqRes: true }),
      dirname: '/static/logs/',
      filename: 'hub-middleware.log',
    }),
  ],
});
