import { store } from '.'; // ❌ DO NOT import store here to avoid circular import

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
