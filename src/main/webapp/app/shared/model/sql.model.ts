export enum SqlParamType {
  STRING = 'STRING',
  INTEGER = 'INTEGER',
  LONG = 'LONG',
  DECIMAL = 'DECIMAL',
  BOOLEAN = 'BOOLEAN',
  DATE = 'DATE',
  DATETIME = 'DATETIME',
  TIME = 'TIME',
}

export interface ISqlParam {
  name?: string;
  type?: SqlParamType;
}

export interface ISql {
  id?: number;
  title?: string;
  description?: string;
  activated?: boolean;
  orderNo?: number;
  params?: ISqlParam[];
}

export const defaultValue: Readonly<ISql> = {
  params: [],
};
