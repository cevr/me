export interface DomainError<Name extends string> extends Error {
  name: Name;
  meta?: any;
}

export namespace DomainError {
  export type Make<T extends typeof make = typeof make> = ReturnType<ReturnType<T>>;
}

const make =
  <Name extends string>(name: Name) =>
  (message?: string, meta?: any): DomainError<Name> => {
    return Object.assign(new Error(message), { name, meta });
  };

export const DomainError = {
  make,
};
