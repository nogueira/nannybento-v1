import { Hono } from "hono";
import type { Env } from './core-utils';
import { TimeLogEntity } from "./entities";
import { ok, bad } from './core-utils';
import { TimeLog } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // --- PontoNanny TimeLog Routes ---
  // Create a new time log entry
  app.post('/api/timelogs', async (c) => {
    try {
      const body = await c.req.json<Omit<TimeLog, 'id'>>();
      if (!body.userId || !body.status || !body.timestamp || !body.coordinates) {
        return bad(c, 'Missing required fields for time log');
      }
      const newLog: TimeLog = { ...body, id: crypto.randomUUID() };
      await TimeLogEntity.create(c.env, newLog);
      return ok(c, newLog);
    } catch (e) {
      console.error("Failed to create timelog:", e);
      return bad(c, 'Invalid request body');
    }
  });
  // Get all time logs for today
  app.get('/api/timelogs/today', async (c) => {
    const { items: allLogs } = await TimeLogEntity.list(c.env, null, 1000); // Assuming max 1000 logs/day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayLogs = allLogs.filter(log => new Date(log.timestamp) >= today);
    return ok(c, todayLogs);
  });
  // Get all time logs ever
  app.get('/api/timelogs/all', async (c) => {
    const { items: allLogs } = await TimeLogEntity.list(c.env, null, 10000); // High limit for all logs
    return ok(c, allLogs);
  });
  // Get the latest status for the babysitter
  app.get('/api/timelogs/status', async (c) => {
    const { items: allLogs } = await TimeLogEntity.list(c.env, null, 1000);
    if (allLogs.length === 0) {
      return ok(c, { status: 'clocked-out' });
    }
    const latestLog = allLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
    return ok(c, { status: latestLog.status });
  });
}