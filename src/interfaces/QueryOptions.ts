export interface QueryOptions extends RequestInit {
  shouldLog?: boolean;
  dataFn?: 'json' | 'text' | 'buffer' | 'arrayBuffer' | 'blob';
}
