import { RouterModule } from '@angular/router'
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { MainLayoutComponent } from './layouts/main/main-layout.component'

@NgModule({
    declarations: [MainLayoutComponent],
    imports: [
        // Vendor
        BrowserModule,
        RouterModule,
    ],
    exports: [MainLayoutComponent],
})
export class CoreModule {}
