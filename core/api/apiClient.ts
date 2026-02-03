import type { APIRequestContext, APIResponse } from "@playwright/test";

export const apiGet = (
  request: APIRequestContext,
  url: string,
): Promise<APIResponse> => {
  return request.get(url);
};

export const apiPost = <T>(
  request: APIRequestContext,
  url: string,
  payload?: T,
): Promise<APIResponse> => {
  return request.post(url, { data: payload });
};

export const apiPut = <T>(
  request: APIRequestContext,
  url: string,
  payload?: T,
): Promise<APIResponse> => {
  return request.put(url, { data: payload });
};

export const apiDelete = (
  request: APIRequestContext,
  url: string,
): Promise<APIResponse> => {
  return request.delete(url);
};
