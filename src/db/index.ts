import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { WebSocket } from "ws";

import * as schema from "@/db/schema";

neonConfig.webSocketConstructor = WebSocket;

const pool = new Pool({ connectionString: process.env.POSTGRES_URL! });

export const db = drizzle(pool, { schema });
