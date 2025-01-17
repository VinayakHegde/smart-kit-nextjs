import { z } from 'zod';
import ConfigStore from './config-store';
import { awesomeSchema, superSchema } from './__mock__/init-config-store';

test('ConfigStore.get - should return the configuration of the specified schema type', () => {
  expect(ConfigStore.get(awesomeSchema)).toEqual({
    apiBasePath: '/api',
    clientId: '1234',
    xFactor: {
      x: true,
      y: 'y',
      z: [1, 2],
    },
  });

  expect(ConfigStore.get(superSchema)).toEqual({
    serverSecret: 'super-secret',
    databaseUrl: 'postgres://localhost/db',
  });
});

test('ConfigStore.get - should throw an error when configuration is not found', () => {
  const newConfig = z.object({
    a: z.string(),
    b: z.boolean(),
  });

  expect(() => ConfigStore.get(newConfig)).toThrowError(
    'Configuration for the provided schema has not been added.',
  );
});

test('ConfigStore.add - should set new configuration', () => {
  const newConfig = z.object({
    a: z.string(),
    b: z.boolean(),
  });
  ConfigStore.add(newConfig, {
    a: 'hello',
    b: true,
  });

  const config = ConfigStore.get(newConfig);
  expect(config).toEqual({
    a: 'hello',
    b: true,
  });
});

test('ConfigStore.add - should throw an error when configuration already exists', () => {
  expect(() =>
    ConfigStore.add(awesomeSchema, {
      apiBasePath: '/api',
      clientId: '1234',
      xFactor: {
        x: true,
        y: 'y',
        z: [1, 2],
      },
    }),
  ).toThrowError('Configuration for the provided schema already exists.');
});

test('ConfigStore.add - should update existing configuration', () => {
  ConfigStore.add(
    awesomeSchema,
    {
      apiBasePath: '/api/v1',
      clientId: '1234',
      xFactor: {
        x: false,
        y: 'y',
        z: [4, 5],
      },
    },
    true,
  );

  const config = ConfigStore.get(awesomeSchema);
  expect(config).toEqual({
    apiBasePath: '/api/v1',
    clientId: '1234',
    xFactor: {
      x: false,
      y: 'y',
      z: [4, 5],
    },
  });
});
