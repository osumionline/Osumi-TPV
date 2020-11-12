import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent }         from './pages/main/main.component';
import { InstallationComponent } from './pages/installation/installation.component';


const routes: Routes = [
  { path: '',             component: MainComponent },
  { path: 'installation', component: InstallationComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}