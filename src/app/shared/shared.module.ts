import { InfoWidgetComponent } from './components/info-widget/info-widget.component'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

/**
 * Might not be suitable as the application grow.
 * Watch out to properly separate your component
 * suits in smart smalls modules.
 */
@NgModule({
  declarations: [InfoWidgetComponent],
  imports: [CommonModule],
  exports: [InfoWidgetComponent],
})
export class SharedModule {}
