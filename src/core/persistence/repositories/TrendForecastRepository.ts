export interface TrendForecastRepository {
  findById(id: string): Promise<any>;
  save(entity: any): Promise<void>;
  delete(id: string): Promise<void>;
}
