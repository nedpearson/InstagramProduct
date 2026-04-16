export interface BriefVersioningService {
  createVersionVersion(briefId: string, payload: string): Promise<number>;
  diffVersions(briefId: string, v1: number, v2: number): Promise<string[]>;
}
