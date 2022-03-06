import { HttpClientModule } from '@angular/common/http';
import { AppConfigService, IAppConf } from './services/app-config.service';
import { RouterModule } from '@angular/router';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MainLayoutComponent } from './layouts/main/main-layout.component';
import { Observable } from 'rxjs';

@NgModule({
  declarations: [MainLayoutComponent],
  imports: [
    // Vendor
    BrowserModule,
    HttpClientModule,
    RouterModule,
  ],
  exports: [MainLayoutComponent],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: FetchConfig,
      deps: [AppConfigService],
      multi: true,
    },
  ],
})
export class CoreModule {}

function FetchConfig(configService: AppConfigService): () => Observable<IAppConf> {
  return () => configService.load();
}
