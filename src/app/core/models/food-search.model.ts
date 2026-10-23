export type AttributeComparisonOperator =
  | 'Equal'
  | 'NotEqual'
  | 'GreaterThan'
  | 'GreaterThanOrEqual'
  | 'LessThan'
  | 'LessThanOrEqual';

export interface FoodAttributeFilter {
  attributeId: number;
  operator: AttributeComparisonOperator;
  value: number;
}

export interface FoodSort {
  attributeId: number;
  descending: boolean;
}

export interface FoodSearchRequest {
  search: string | null;
  categoryIds: number[];
  classificationIds: number[];
  attributeFilters: FoodAttributeFilter[];
  sort: FoodSort | null;
}

export interface PageResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ComparisonOperatorOption {
  value: AttributeComparisonOperator;
  label: string;
  symbol: string;
}

export const COMPARISON_OPERATORS: readonly ComparisonOperatorOption[] = [
  { value: 'Equal', label: 'Igual a', symbol: '=' },
  { value: 'NotEqual', label: 'Distinto de', symbol: '≠' },
  { value: 'GreaterThan', label: 'Mayor que', symbol: '>' },
  { value: 'GreaterThanOrEqual', label: 'Mayor o igual que', symbol: '≥' },
  { value: 'LessThan', label: 'Menor que', symbol: '<' },
  { value: 'LessThanOrEqual', label: 'Menor o igual que', symbol: '≤' },
];
