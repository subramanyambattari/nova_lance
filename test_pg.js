const { Pool, Client } = require("pg")

const url = "postgresql://neondb_owner:npg_Io9EBMnWk1AT@ep-wild-shape-aol7rw84-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

const client = new Client({ connectionString: url })

client.connect()
  .then(() => {
    console.log("Connected successfully to Neon via pg.Client!")
    return client.query("SELECT 1 AS connected")
  })
  .then(res => {
    console.log("Query result:", res.rows)
    client.end()
  })
  .catch(err => {
    console.error("Connection failed:", err)
    client.end()
  })
