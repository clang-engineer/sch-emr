export interface IBook {
  id?: number;
  title?: string;
  description?: string;
  activated?: string;
  orderNo?: number;
}

export const defaultValue: Readonly<IBook> = {};
