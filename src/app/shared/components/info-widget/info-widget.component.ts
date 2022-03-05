import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { ITickerValue } from 'src/app/features/dashboard/services/currency-data.service'

@Component({
  selector: 'app-info-widget',
  templateUrl: './info-widget.component.html',
  styleUrls: ['./info-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoWidgetComponent {
  @Input() public label!: string
  @Input() public infos!: ITickerValue
}
