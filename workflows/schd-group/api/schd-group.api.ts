import { APIRequestContext } from '@playwright/test';
import {
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
} from '../../../core/api/apiClient';

export function createSchedulingGroup(
  api: APIRequestContext,
  payload: {
    area: string;
    groupName: string;
    allocationsMenu?: boolean;
    notes?: string;
  }
) {
  return apiPost(api, '/scheduling-groups', payload);
}

export function editSchedulingGroup(
  api: APIRequestContext,
  id: number,
  payload: {
    area?: string;
    groupName?: string;
    allocationsMenu?: boolean;
    notes?: string;
  }
) {
  return apiPut(api, `/scheduling-groups/${id}`, payload);
}

export function deleteSchedulingGroup(
  api: APIRequestContext,
  id: number
) {
  return apiDelete(api, `/scheduling-groups/${id}`);
}

export function listSchedulingGroups(
  api: APIRequestContext
) {
  return apiGet(api, '/scheduling-groups');
}
