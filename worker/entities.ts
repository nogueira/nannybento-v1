import { IndexedEntity } from "./core-utils";
import type { TimeLog } from "@shared/types";
// TIME LOG ENTITY: one DO instance per log entry
export class TimeLogEntity extends IndexedEntity<TimeLog> {
  static readonly entityName = "timelog";
  static readonly indexName = "timelogs";
  static readonly initialState: TimeLog = {
    id: "",
    userId: "dilma",
    status: "clocked-out",
    timestamp: "",
    coordinates: { latitude: 0, longitude: 0, accuracy: 0 },
  };
}