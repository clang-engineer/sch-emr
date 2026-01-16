import { Chart, Form } from 'app/modules/emr-viewer/emr-finder.reducer';
import { FormNode, NormalizedForm } from './types';

type FormLike = Form & {
  chartNo?: string;
  formNo?: string | number;
  parentFormNo?: string | number;
  name?: string;
  type?: string;
  RECDD?: string;
};

const parseSortValue = (value: unknown) => {
  const numberValue = typeof value === 'string' ? Number(value) : typeof value === 'number' ? value : NaN;
  return Number.isFinite(numberValue) ? numberValue : undefined;
};

export const normalizeForms = (forms: FormLike[], selectedChart?: Chart): NormalizedForm[] => {
  if (!forms.length || !selectedChart) {
    return [];
  }

  const hasItemIndexSeq = forms.some(form => form.ITEMINDXSEQ !== undefined && form.ITEMINDXSEQ !== null);
  const normalized: NormalizedForm[] = (
    hasItemIndexSeq
      ? forms.map<NormalizedForm>(form => ({
          id: String(form.ITEMINDXSEQ ?? ''),
          parentId: form.SUPITEMINDXSEQ && form.SUPITEMINDXSEQ !== 0 ? String(form.SUPITEMINDXSEQ) : null,
          name: form.INDXNM && form.INDXNM !== '-' ? form.INDXNM : form.FORMNM ?? '',
          type: String(form.LEVL) === '1' ? 'folder' : 'form',
          date: form.RECDD ?? '',
          sortKeys: {
            first: parseSortValue(form.FIRSTSORTNO),
            second: parseSortValue(form.SECONDSORTNO),
            third: parseSortValue(form.THIRDSORTNO),
          },
        }))
      : forms
          .filter(form => (form.chartNo ? selectedChart.chartNo === form.chartNo : false))
          .map<NormalizedForm>(form => ({
            id: String(form.formNo ?? ''),
            parentId: form.parentFormNo ? String(form.parentFormNo) : null,
            name: form.name ?? '',
            type: form.type === 'folder' ? 'folder' : 'form',
            date: (form as { RECDD?: string }).RECDD ?? '',
          }))
  ).filter(form => form.id && form.name);

  return normalized;
};

export const buildTree = (normalized: NormalizedForm[]): FormNode[] => {
  const nodes = new Map<string, FormNode>();
  normalized.forEach(form => {
    nodes.set(form.id, {
      id: form.id,
      name: form.name,
      type: form.type,
      date: form.date,
      sortKeys: form.sortKeys,
      children: [],
    });
  });

  const roots: FormNode[] = [];
  normalized.forEach(form => {
    const node = nodes.get(form.id);
    if (!node) {
      return;
    }
    if (!form.parentId || !nodes.has(form.parentId)) {
      roots.push(node);
      return;
    }
    const parent = nodes.get(form.parentId);
    if (parent) {
      parent.children = parent.children ?? [];
      parent.children.push(node);
    }
  });

  return roots;
};

export const sortTree = (items: FormNode[]) => {
  items.sort((a, b) => {
    if (a.sortKeys?.first !== undefined || b.sortKeys?.first !== undefined) {
      return (a.sortKeys?.first ?? Number.MAX_SAFE_INTEGER) - (b.sortKeys?.first ?? Number.MAX_SAFE_INTEGER);
    }
    if (a.sortKeys?.second !== undefined || b.sortKeys?.second !== undefined) {
      return (a.sortKeys?.second ?? Number.MAX_SAFE_INTEGER) - (b.sortKeys?.second ?? Number.MAX_SAFE_INTEGER);
    }
    if (a.sortKeys?.third !== undefined || b.sortKeys?.third !== undefined) {
      return (a.sortKeys?.third ?? Number.MAX_SAFE_INTEGER) - (b.sortKeys?.third ?? Number.MAX_SAFE_INTEGER);
    }
    return a.name.localeCompare(b.name, 'ko-KR');
  });
  items.forEach(item => {
    if (item.children?.length) {
      sortTree(item.children);
    }
  });
};

export const filterTree = (nodes: FormNode[], normalizedSearch: string): FormNode[] => {
  if (!normalizedSearch) {
    return nodes;
  }

  return nodes.reduce<FormNode[]>((acc, node) => {
    const nameMatch = node.name.toLowerCase().includes(normalizedSearch);
    const dateMatch = node.date ? String(node.date).toLowerCase().includes(normalizedSearch) : false;
    const filteredChildren = node.children ? filterTree(node.children, normalizedSearch) : [];
    if (nameMatch || dateMatch || filteredChildren.length > 0) {
      acc.push({
        ...node,
        children: filteredChildren,
      });
    }
    return acc;
  }, []);
};

export const collectFolderIds = (nodes: FormNode[]) => {
  const ids: string[] = [];
  const walk = (items: FormNode[]) => {
    items.forEach(node => {
      if (node.type === 'folder') {
        ids.push(node.id);
        if (node.children?.length) {
          walk(node.children);
        }
      }
    });
  };
  walk(nodes);
  return ids;
};

export const buildFormNodeMap = (nodes: FormNode[]) => {
  const map = new Map<string, FormNode>();
  const walk = (items: FormNode[]) => {
    items.forEach(node => {
      if (node.type === 'form') {
        map.set(node.id, node);
      }
      if (node.children?.length) {
        walk(node.children);
      }
    });
  };
  walk(nodes);
  return map;
};
