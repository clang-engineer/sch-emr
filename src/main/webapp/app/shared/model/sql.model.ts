export interface ISql {
  id?: number;
  title?: string;
  description?: string;
  activated?: string;
  orderNo?: number;
}

export const defaultValue: Readonly<ISql> = {};
