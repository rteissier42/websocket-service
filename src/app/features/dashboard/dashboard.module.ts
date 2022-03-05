import { CurrencyDataService } from './services/currency-data.service'
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
  providers: [CurrencyDataService],
})
export class DashboardModule {}
