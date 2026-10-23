import { Component, Input } from '@angular/core';
import { Food, FoodAttributeValue } from '../../../../core/models/food.model';

@Component({
  selector: 'app-food-card',
  templateUrl: './food-card.component.html',
  styleUrls: ['./food-card.component.css'],
})
export class FoodCardComponent {
  @Input() food!: Food;

  imageError = false;

  get imageSource(): string | null {
    const url = this.food.imageUrl?.trim();

    if (!url) {
      return null;
    }

    return url;
  }

  get initials(): string {
    const words = this.food.name
      .split(/\s+/)
      .map((word) => word.trim())
      .filter(Boolean)
      .slice(0, 2);

    return words.map((word) => word.charAt(0).toUpperCase()).join('');
  }

  get visibleAttributes(): FoodAttributeValue[] {
    return this.food.attributes.slice(0, 6);
  }

  get hiddenAttributesCount(): number {
    return Math.max(this.food.attributes.length - this.visibleAttributes.length, 0);
  }
}
