export interface BriefVersionRepository {
  findById(id: string): Promise<any>;
  save(entity: any): Promise<void>;
  delete(id: string): Promise<void>;
}
