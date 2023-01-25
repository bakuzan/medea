export {};

declare global {
  // Copied from undici directly because it wasn't working...
  export type RequestInfo = string | URL | Request;

  export interface RequestInit {
    method?: string;
    keepalive?: boolean;
    headers?: HeadersInit;
    body?: BodyInit;
    redirect?: RequestRedirect;
    integrity?: string;
    signal?: AbortSignal;
    credentials?: RequestCredentials;
    mode?: RequestMode;
    referrer?: string;
    referrerPolicy?: ReferrerPolicy;
    window?: null;
    dispatcher?: Dispatcher;
    duplex?: RequestDuplex;
  }

  export declare interface Response {
    readonly headers: Headers;
    readonly ok: boolean;
    readonly status: number;
    readonly statusText: string;
    readonly type: ResponseType;
    readonly url: string;
    readonly redirected: boolean;

    readonly body: ReadableStream | null;
    readonly bodyUsed: boolean;

    readonly arrayBuffer: () => Promise<ArrayBuffer>;
    readonly buffer: () => Promise<Buffer>;
    readonly blob: () => Promise<Blob>;
    readonly formData: () => Promise<FormData>;
    readonly json: () => Promise<unknown>;
    readonly text: () => Promise<string>;
  }

  export declare function fetch(
    input: RequestInfo,
    init?: RequestInit
  ): Promise<Response>;
}
