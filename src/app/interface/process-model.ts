export interface ProcessModel {
    arrivalTime: string;
    processName: string;
    capture: Capture;
    priority: string;
    id: number;
}

export enum Capture {
    SatJun11203930COT2022 = "Sat Jun 11 20:39:30 COT 2022",
}
