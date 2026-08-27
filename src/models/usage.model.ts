export interface Usage {
  id: string;
  startDate: Date;
  endDate: Date | null;
  driverId: string;
  automobileId: string;
  reason: string;
  createdAt: Date;
  updatedAt: Date;
}
