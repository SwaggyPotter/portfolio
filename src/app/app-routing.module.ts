import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MySiteComponent } from './my-site/my-site.component';
import { ImpressumComponent } from './impressum/impressum.component';

const routes: Routes = [
  { path: '', component: MySiteComponent },
  { path: 'impressum', component: ImpressumComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
