// @flow

import type { GrpcStatusObject, ServiceError } from '../../../network/grpc/service-error';
import { generateId } from '../../../common/misc';

export type GrpcMessage = {
  id: string,
  text: string,
  created: number,
};

export const GrpcActionTypeEnum = {
  reset: 'reset',
  start: 'start',
  stop: 'stop',
  responseMessage: 'responseMessage',
  requestMessage: 'requestStream',
  error: 'error',
};
type GrpcActionType = $Values<typeof GrpcActionTypeEnum>;

type Action<T: GrpcActionType> = {
  type: T,
  requestId: string,
};

type Payload<T> = {
  payload: T,
};

type ResetAction = Action<GrpcActionTypeEnum.reset>;
type StartAction = Action<GrpcActionTypeEnum.start>;
type StopAction = Action<GrpcActionTypeEnum.stop>;
export type RequestMessageAction = Action<GrpcActionTypeEnum.requestMessage> & Payload<GrpcMessage>;
export type ResponseMessageAction = Action<GrpcActionTypeEnum.responseMessage> &
  Payload<GrpcMessage>;
export type ErrorAction = Action<GrpcActionTypeEnum.error> & Payload<ServiceError>;
export type StatusAction = Action<GrpcActionTypeEnum.error> & Payload<GrpcStatusObject>;

export type GrpcAction =
  | ResetAction
  | StartAction
  | StopAction
  | ResponseMessageAction
  | RequestMessageAction
  | ErrorAction
  | StatusAction;

export type GrpcDispatch = (action: GrpcAction) => void;

const reset = (requestId: string): ResetAction => ({
  type: GrpcActionTypeEnum.reset,
  requestId,
});

const start = (requestId: string): StartAction => ({
  type: GrpcActionTypeEnum.start,
  requestId,
});

const stop = (requestId: string): StopAction => ({
  type: GrpcActionTypeEnum.stop,
  requestId,
});

const responseMessage = (requestId: string, value: Object): ResponseMessageAction => ({
  type: GrpcActionTypeEnum.responseMessage,
  requestId,
  payload: { id: generateId(), text: JSON.stringify(value), created: Date.now() },
});

const requestMessage = (requestId: string, text: string): RequestMessageAction => ({
  type: GrpcActionTypeEnum.requestMessage,
  requestId,
  payload: { id: generateId(), text, created: Date.now() },
});

const error = (requestId: string, error: ServiceError): ErrorAction => ({
  type: GrpcActionTypeEnum.error,
  requestId,
  payload: error,
});

const status = (requestId: string, status: GrpcStatusObject): ErrorAction => ({
  type: GrpcActionTypeEnum.status,
  requestId,
  payload: status,
});

export const grpcActions = { reset, start, stop, responseMessage, requestMessage, error, status };
