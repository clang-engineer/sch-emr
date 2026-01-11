export interface IBook {
  id?: number;
  title?: string;
  description?: string;
  activated?: boolean;
  orderNo?: number;
}

export const defaultValue: Readonly<IBook> = {
  activated: false,
};
