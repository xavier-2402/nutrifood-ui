import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FoodSearchComponent } from './features/food-search/food-search.component';

const routes: Routes = [
  { path: '', component: FoodSearchComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
