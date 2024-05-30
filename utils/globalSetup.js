import { FullConfig } from "@playwright/test";
import { config as _config } from 'dotenv';

async function globalSetup(config) {
    _config({
      path: '.env',
      override: true
    });
  }
  
  export default globalSetup;