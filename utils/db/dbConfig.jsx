import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from './schema'

const sql = neon("postgresql://neondb_owner:qy5rVYEQdSI3@ep-jolly-waterfall-a8n6w1y6.eastus2.azure.neon.tech/neondb?sslmode=require");
export const db = drizzle(sql, { schema });
