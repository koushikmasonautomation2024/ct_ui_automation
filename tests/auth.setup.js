import { test } from '@playwright/test';
import { existsSync } from 'fs';

const creditUserFile = './credituser.json';
const nonCreditUserFile = './noncredituser.json';
const newUserFile = './newuser.json';

test('setup authentication', async () => {
  if (!existsSync(creditUserFile) || !existsSync(nonCreditUserFile) || !existsSync(newUserFile)) {
    throw new Error('Authentication state files are missing. Run the global setup first.');
  }
});
