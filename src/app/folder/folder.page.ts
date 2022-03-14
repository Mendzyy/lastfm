import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { concat, Observable, combineLatest } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { LastfmService } from '../services/lastfm.service';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  @ViewChild(IonContent) ionContent: IonContent;
  private _currentX;
  private _currentY;
  public country: string = 'germany';
  public page: string;
  public searchTerm: string;
  public searching: boolean = false;
  public artists: Observable<any[]>;
  public searchArtists: Observable<any[]>;
  private _currentPage: number = 1;
  private _currentSearchPage: number = 1;
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _api: LastfmService,
    private _loader: LoaderService
  ) {}

  ngOnInit() {
    this.page = this._activatedRoute.snapshot.paramMap.get('id');
    this.getArtists();
  }

  async getArtists(country?: string) {
    await this._loader.showLoader();
    if (country) {
      this.country = country;
    }
    this.artists = this._api
      .getArtistsbyCountry(this.country.toLowerCase(), 15)
      .pipe(
        map((data) => {
          this._loader.hideLoader();
          return data['topartists']['artist'];
        })
      );
  }
  scroll(ev) {
    this._currentX = ev.detail.currentX;
    this._currentY = ev.detail.currentY;
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
    if (this.searchTerm) {
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
    } else {
      this._currentPage += 1;
      await this._loader.showLoader();
      const moreArtists = this._api
        .getArtistsbyCountry(this.country.toLowerCase(), 15, this._currentPage)
        .pipe(
          map((data) => {
            event.target.complete();
            console.log(this._currentX + ' ' + this._currentY);
            // this.ionContent.scrollByPoint(this._currentX, this._currentY, 1);
            this._loader.hideLoader();
            return data['topartists']['artist'];
          })
        );
      this.artists = combineLatest(this.artists, moreArtists).pipe(
        map(([artist, moreartist]) => artist.concat(moreartist))
      );
    }
  }
}
