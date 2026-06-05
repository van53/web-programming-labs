const { Client } = require('pg');
require('dotenv').config();

async function setup() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: 'postgres', // Connect to default DB to create new one
  });

  try {
    await client.connect();
    const res = await client.query(`SELECT datname FROM pg_catalog.pg_database WHERE datname = '${process.env.DB_DATABASE}'`);
    if (res.rowCount === 0) {
      console.log(`Database ${process.env.DB_DATABASE} does not exist. Creating...`);
      await client.query(`CREATE DATABASE "${process.env.DB_DATABASE}"`);
      console.log('Database created successfully.');
    } else {
      console.log(`Database ${process.env.DB_DATABASE} already exists.`);
    }
  } catch (err) {
    console.error('Error setting up database:', err);
  } finally {
    await client.end();
  }
}

setup();
