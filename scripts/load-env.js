import path from 'path';
import dotenv from 'dotenv';

dotenv.config({
    path: process.env.CY_ENV_FILE || path.join(__dirname, '../.env'),
    silent: true,
});
