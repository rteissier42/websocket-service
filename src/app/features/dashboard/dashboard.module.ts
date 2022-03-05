import { SharedModule } from './../../shared/shared.module'
import { DashboardRoutingModule } from './dashboard-routing.module'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DashboardComponent } from './dashboard.component'

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    // Vendor
    CommonModule,

    // Local
    DashboardRoutingModule,
    SharedModule,
  ],
})
export class DashboardModule {}
