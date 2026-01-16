export interface FormNode {
  id: string;
  name: string;
  type: 'folder' | 'form';
  date?: string;
  sortKeys?: {
    first?: number;
    second?: number;
    third?: number;
  };
  children?: FormNode[];
}

export interface NormalizedForm {
  id: string;
  parentId: string | null;
  name: string;
  type: 'folder' | 'form';
  date?: string;
  sortKeys?: {
    first?: number;
    second?: number;
    third?: number;
  };
}
