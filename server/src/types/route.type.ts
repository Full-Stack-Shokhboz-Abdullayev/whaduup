export type Route<T> = {
  method: 'get' | 'post' | 'put' | 'delete';
  path: string;
  main: T;
  authRequired?: boolean;
  handlers: Array<keyof T>;
};
