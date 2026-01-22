import { Branch } from './Branch';

export interface BranchRepository {
  getById(id: string): Promise<Branch | null>;
  getByBarbershop(barbershopId: string): Promise<Branch[]>;
  save(branch: Branch): Promise<void>;
}
