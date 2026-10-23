export interface FoodAttributeValue {
  attributeName: string;
  value: number;
  measureUnitName: string | null;
  measureUnitAbbreviation: string | null;
}

export interface Food {
  id: number;
  code: string;
  name: string;
  description: string | null;
  foodCategoryId: number;
  foodCategoryName: string | null;
  foodClassificationId: number | null;
  foodClassificationName: string | null;
  imageUrl: string | null;
  active: boolean;
  attributes: FoodAttributeValue[];
}

export interface FoodCategory {
  id: number;
  code: string;
  name: string;
  active: boolean;
}

export interface FoodClassification {
  id: number;
  code: string;
  name: string;
  active: boolean;
}

export interface FoodAttribute {
  id: number;
  code: string;
  name: string;
  description: string | null;
  measureUnitId: number;
  active: boolean;
}
