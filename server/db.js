import { Pool } from "pg";

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'hotel_management',
  password: 'Director@1',
  port: 5432,
});

export default pool;
