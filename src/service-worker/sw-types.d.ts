declare const self: ServiceWorkerGlobalScope;

// Extend the global scope to include service worker specific properties
interface ServiceWorkerGlobalScope extends WorkerGlobalScope {
  registration: ServiceWorkerRegistration;
  skipWaiting(): Promise<void>;
  addEventListener<K extends keyof ServiceWorkerGlobalScopeEventMap>(
    type: K,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    listener: (this: ServiceWorkerGlobalScope, ev: ServiceWorkerGlobalScopeEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;
}

// Service Worker specific event maps
interface ServiceWorkerGlobalScopeEventMap extends WorkerGlobalScopeEventMap {
  sync: SyncEvent;
  push: PushEvent;
  message: ExtendableMessageEvent;
}

// SyncEvent interface
interface SyncEvent extends ExtendableEvent {
  readonly tag: string;
  readonly lastChance: boolean;
}

// PushEvent interface
interface PushEvent extends ExtendableEvent {
  readonly data: PushMessageData | null;
}

// PushMessageData interface
interface PushMessageData {
  arrayBuffer(): ArrayBuffer;
  blob(): Blob;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  json(): any;
  text(): string;
}

// ExtendableMessageEvent interface
interface ExtendableMessageEvent extends ExtendableEvent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly data: any;
  readonly origin: string;
  readonly lastEventId: string;
  readonly source: Client | ServiceWorker | MessagePort | null;
  readonly ports: ReadonlyArray<MessagePort>;
}

// ExtendableEvent interface
interface ExtendableEvent extends Event {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  waitUntil(f: Promise<any>): void;
}
