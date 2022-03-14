import { Component } from '@angular/core';
import { LastfmService } from './services/lastfm.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Artists', url: '/folder/Artists', icon: 'person' },
    { title: 'Compare', url: '/compare', icon: 'git-compare' },
  ];
  constructor(private _api: LastfmService) {}
}
