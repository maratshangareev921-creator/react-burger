import { refreshAccessToken } from '../utils/burger-api';

import type {
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload,
  PayloadActionCreator,
  Middleware,
  PayloadAction,
} from '@reduxjs/toolkit';

import type { OrdersResponse } from '../types';

type SocketActions = {
  connect: ActionCreatorWithoutPayload | PayloadActionCreator<string>;
  disconnect: ActionCreatorWithoutPayload;
  onOpen: ActionCreatorWithoutPayload;
  onClose: ActionCreatorWithoutPayload;
  onError: ActionCreatorWithPayload<string>;
  onMessage: ActionCreatorWithPayload<OrdersResponse>;
};

type SocketMiddlewareOptions = {
  wsUrl: string;
  withToken?: boolean;
  actions: SocketActions;
};

const stripBearer = (token: string): string => token.replace(/^Bearer\s+/i, '');

export const createSocketMiddleware = ({
  wsUrl,
  withToken = false,
  actions,
}: SocketMiddlewareOptions): Middleware => {
  let socket: WebSocket | null = null;
  let currentToken = '';

  const closeSocket = (): void => {
    if (socket) {
      socket.onopen = null;
      socket.onmessage = null;
      socket.onerror = null;
      socket.onclose = null;
    }
    socket?.close();
    socket = null;
  };

  const createConnection = (token = ''): WebSocket => {
    const url = withToken ? `${wsUrl}?token=${stripBearer(token)}` : wsUrl;
    return new WebSocket(url);
  };

  return (store) => (next) => (action) => {
    const typedAction = action as PayloadAction<string>;

    if (typedAction.type === actions.connect.type) {
      currentToken = typeof typedAction.payload === 'string' ? typedAction.payload : '';
      closeSocket();
      socket = createConnection(currentToken);
      const activeSocket = socket;

      socket.onopen = (): void => {
        if (socket !== activeSocket) return;
        store.dispatch(actions.onOpen());
      };

      socket.onmessage = (event: MessageEvent<string>): void => {
        if (socket !== activeSocket) return;
        const data = JSON.parse(event.data) as OrdersResponse;

        if (!data.success && data.message === 'Invalid or missing token' && withToken) {
          void refreshAccessToken()
            .then(({ accessToken }) => {
              currentToken = accessToken;
              store.dispatch({ type: actions.connect.type, payload: accessToken });
            })
            .catch((): void => {
              store.dispatch(actions.onError('Не удалось обновить токен'));
            });
          return;
        }

        if (!data.success) {
          store.dispatch(actions.onError(data.message ?? 'Ошибка WebSocket'));
          return;
        }

        store.dispatch(actions.onMessage(data));
      };

      socket.onerror = (): void => {
        if (socket !== activeSocket) return;
        store.dispatch(actions.onError('Ошибка WebSocket-соединения'));
      };

      socket.onclose = (): void => {
        if (socket !== activeSocket) return;
        store.dispatch(actions.onClose());
      };
    }

    if (typedAction.type === actions.disconnect.type) {
      closeSocket();
    }

    return next(action);
  };
};
