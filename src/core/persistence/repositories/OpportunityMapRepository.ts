export interface OpportunityMapRepository {
  findById(id: string): Promise<any>;
  save(entity: any): Promise<void>;
  delete(id: string): Promise<void>;
}
