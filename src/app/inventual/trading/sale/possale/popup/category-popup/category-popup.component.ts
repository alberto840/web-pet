import {
  Component,
  Injectable,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {
  PosCategoriesInterfaceData,
  posCategoriesData,
} from 'src/app/inventual/data/posCategoriesData';

@Injectable({
  providedIn: 'root',
})
export class CategorySelectionService {
  selectedCategories: PosCategoriesInterfaceData[] = [];

  constructor() {}
}

@Component({
  selector: 'app-category-popup',
  templateUrl: './category-popup.component.html',
  styleUrls: ['./category-popup.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CategoryPopupComponent implements OnInit {
  categories: PosCategoriesInterfaceData[] = [];
  selectedCategories: PosCategoriesInterfaceData[] = [];

  constructor(
    private dialogRef: MatDialogRef<CategoryPopupComponent>,
    private categorySelectionService: CategorySelectionService // Inject the service here
  ) {}

  ngOnInit(): void {
    // Load categories directly from the posCategoriesData array
    this.categories = posCategoriesData;
    // Retrieve previously selected categories from the service
    this.selectedCategories = this.categorySelectionService.selectedCategories;
  }

  selectCategory(category: PosCategoriesInterfaceData) {
    // Toggle selection status
    category.selected = !category.selected;

    if (category.selected) {
      // If the category is newly selected, add it to the selectedCategories array
      this.selectedCategories.push(category);
    } else {
      // If the category is being deselected, remove it from the selectedCategories array
      const index = this.selectedCategories.findIndex(
        (selectedCategory) => selectedCategory.id === category.id
      );
      if (index !== -1) {
        this.selectedCategories.splice(index, 1);
      }
    }
  }

  closeDialog() {
    // Update selected categories in the service
    this.categorySelectionService.selectedCategories = this.selectedCategories;
    this.dialogRef.close(this.selectedCategories); // Pass selected categories to the parent component
  }
}
