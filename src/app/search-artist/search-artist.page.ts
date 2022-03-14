import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LastfmService } from '../services/lastfm.service';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-search-artist',
  templateUrl: './search-artist.page.html',
  styleUrls: ['./search-artist.page.scss'],
})
export class SearchArtistPage implements OnInit {
  public order: string;
  public searchTerm: string;
  public searchArtists: Observable<any[]>;
  private _currentSearchPage: number = 1;
  constructor(
    private _modal: ModalController,
    private _api: LastfmService,
    private _loader: LoaderService
  ) {}

  ngOnInit() {
    console.log(this.order);
  }
  async searchArtist($event) {
    // await this._loader.showLoader();
    const searchText = $event.target.value;
    if (searchText) {
      await this._loader.showLoader();
      this.searchArtists = this._api.searchArtist($event.target.value, 15).pipe(
        map((data) => {
          this._loader.hideLoader();
          return data['results']['artistmatches']['artist'];
        })
      );
    }
  }
  async loadData(event) {
    this._currentSearchPage += 1;
    const moreSearchArtists = this._api
      .searchArtist(this.searchTerm, 15, this._currentSearchPage)
      .pipe(
        map((data) => {
          event.target.complete();
          return data['results']['artistmatches']['artist'];
        })
      );
    this.searchArtists = combineLatest(
      this.searchArtists,
      moreSearchArtists
    ).pipe(
      map(([searchArtists, moreartist]) => searchArtists.concat(moreartist))
    );
  }
  async selectArtist(oArtist: any) {
    await this._modal.dismiss({ [this.order]: oArtist['name'] });
  }
}
