import ConfigStore from '../config-store';
import { z } from 'zod';

export const awesomeSchema = z.object({
  apiBasePath: z.string(),
  clientId: z.string(),
  xFactor: z.object({
    x: z.boolean(),
    y: z.string(),
    z: z.tuple([z.number(), z.number()]),
  }),
});

export const superSchema = z.object({
  serverSecret: z.string(),
  databaseUrl: z.string(),
});

ConfigStore.add<typeof awesomeSchema>(awesomeSchema, {
  apiBasePath: '/api',
  clientId: '1234',
  xFactor: {
    x: true,
    y: 'y',
    z: [1, 2],
  },
}).add(superSchema, {
  serverSecret: 'super-secret',
  databaseUrl: 'postgres://localhost/db',
});
