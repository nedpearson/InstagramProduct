export interface MonitoringSignalRepository {
  findById(id: string): Promise<any>;
  save(entity: any): Promise<void>;
  delete(id: string): Promise<void>;
}
