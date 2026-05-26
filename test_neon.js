const { neon, neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');
neonConfig.webSocketConstructor = ws;

const sql = neon('postgresql://neondb_owner:npg_Io9EBMnWk1AT@ep-wild-shape-aol7rw84-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require');

async function test() {
  try {
    const result = await sql`SELECT 1 as connected`;
    console.log("Success with @neondatabase/serverless!", result);
  } catch (err) {
    console.error("Failed with serverless driver:", err);
  }
}
test();
