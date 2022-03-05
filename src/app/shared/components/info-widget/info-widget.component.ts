import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

export interface IWidgetInfos {
  last24Hours: number
  total: number
}

@Component({
  selector: 'app-info-widget',
  templateUrl: './info-widget.component.html',
  styleUrls: ['./info-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoWidgetComponent {
  @Input() public label!: string
  @Input() public infos!: IWidgetInfos
}
