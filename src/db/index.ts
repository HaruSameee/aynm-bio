import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";

import * as schema from "@/db/schema";

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.POSTGRES_URL! });

export const db = drizzle(pool, { schema });
