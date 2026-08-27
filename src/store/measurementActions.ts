import { BodyMeasurement } from '@/types';

export const measurementActions = (set: any, get: any) => ({
  addBodyMeasurement: (measurement: BodyMeasurement) => {
    set((state: any) => ({
      bodyMeasurements: [measurement, ...state.bodyMeasurements],
    }));
  },
});
