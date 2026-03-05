import { executeSP } from '@core/db/executeSp';
export interface CreateSchedulingGroupParams {
  AreaId: number;
  GroupName: string;
  AllocationsMenu: number;
  Notes?: string;
  UserId: number;
}

export interface UpdateSchedulingGroupParams {
  GroupId: number;
  GroupName?: string;
  AllocationsMenu?: number;
  Notes?: string;
  UserId: number;
}

export const SchedulingGroupSP = {
  async create(params:CreateSchedulingGroupParams) {
    return executeSP('sp_CreateSchedulingGroup', params);
  },

  async update(params:UpdateSchedulingGroupParams) {
    return executeSP('sp_UpdateSchedulingGroup', params);
  },

  
};