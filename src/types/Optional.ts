export type Optional<T extends {}> = {
   [K in keyof T]?: T[K];
};
