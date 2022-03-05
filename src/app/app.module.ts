import { NgModule } from '@angular/core'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { CoreModule } from './core/core.module'
import { DashboardModule } from './features/dashboard/dashboard.module'

@NgModule({
  declarations: [AppComponent],
  imports: [
    // Local
    CoreModule,
    DashboardModule,

    // Vendor
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
