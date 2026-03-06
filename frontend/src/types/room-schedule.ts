export interface Room {
  RoomID: number;
  RoomName?: string;
  RoomType?: string;
  Campus?: string;
  Capacity?: number;
  Status?: string;
}

export interface Schedule {
  ScheduleID: number;
  RoomID: number;
  SectionID: number;
  DayOfWeek?: string;
  StartPeriod?: number;
  EndPeriod?: number;
  TotalPeriods?: number;
  StartDate?: string;
  EndDate?: string;
}

export interface UsageHistory {
  UsageHistoryID: number;
  RoomID: number;
  StartTime?: string;
  EndTime?: string;
  Note?: string;
}

export interface UsageSection {
  UsageHistoryID: number;
  SectionID: number;
}
