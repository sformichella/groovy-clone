import pg from 'pg'

const db = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString: db, ssl: { rejectUnauthorized: false }})

export default function sql(query, variables) {
  return pool.query(query, variables).then(adapt)
}

function adapt(result) {
  return result.rows[0]
}
