export interface Schedule {
  scheduleId: number;
  roomId: number;
  roomName: string;
  sectionId: number;
  subjectName: string;
  dayOfWeek: string;
  startPeriod: number;
  endPeriod: number;
  totalPeriods: number;
  startDate: string;
  endDate: string;
}

export interface MyScheduleItem {
  scheduleId: number;
  roomName: string;
  subjectName: string;
  dayOfWeek: string;
  startPeriod: number;
  endPeriod: number;
}

export interface ScheduleUpdateResponse {
  scheduleId: number;
  roomId: number;
  dayOfWeek: string;
}

export interface GetScheduleListParams {
  page?: number;
  limit?: number;
  roomId?: number;
  sectionId?: number;
  dayOfWeek?: string;
  startDate?: string;
  endDate?: string;
}

export interface GetMyScheduleParams {
  sectionId?: number;
  roomId?: number;
  dayOfWeek?: string;
  startDate?: string;
  endDate?: string;
}

export interface GetRoomSchedulesParams {
  startDate?: string;
  endDate?: string;
}

export interface CreateScheduleInput {
  roomId: number;
  sectionId: number;
  dayOfWeek: string;
  startPeriod: number;
  endPeriod: number;
  totalPeriods: number;
  startDate: string;
  endDate: string;
}

export interface UpdateScheduleInput {
  roomId?: number;
  dayOfWeek?: string;
  startPeriod?: number;
  endPeriod?: number;
  totalPeriods?: number;
  startDate?: string;
  endDate?: string;
}
