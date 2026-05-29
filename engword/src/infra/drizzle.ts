import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { settings } from '@/config/settings'
import * as schema from './schema'

const client = postgres(settings.db.url!)
export const drizzleDb = drizzle(client, { schema })
