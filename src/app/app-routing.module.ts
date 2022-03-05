import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

/**
 * We are choosing to not lazy load the default route (dashboard)
 * and import the corresponding dashboard module in our
 * appModule as it seems to be a better practice.
 * https://github.com/mgechev/angular-performance-checklist#dont-lazy-load-the-default-route
 */
const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
