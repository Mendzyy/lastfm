import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SearchArtistPage } from '../search-artist/search-artist.page';
import { LastfmService } from '../services/lastfm.service';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.page.html',
  styleUrls: ['./compare.page.scss'],
})
export class ComparePage implements OnInit {
  first_artist: string;
  second_artist: string;
  missing_artist: boolean = false;
  comparision: Observable<any[]>;
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _api: LastfmService,
    private _modal: ModalController
  ) {}

  ngOnInit() {
    this._activatedRoute.queryParams.subscribe((data) => {
      // Fetchting Query Params, if navigated from Artist Page
      if (data.first_artist) {
        this.first_artist = data.first_artist;
      }
      if (data.second_artist) {
        this.second_artist = data.second_artist;
      }
      if (!this.second_artist || !this.first_artist) {
        this.missing_artist = true;
      } else {
        this.missing_artist = false;
        this.fetchData();
      }
    });
  }
  fetchData() {
    const firstArtist = this._api.getArtistByName(this.first_artist).pipe(
      map((data) => {
        return data['artist'];
      })
    );
    const secondArtist = this._api.getArtistByName(this.second_artist).pipe(
      map((data) => {
        return data['artist'];
      })
    );
    this.comparision = combineLatest(firstArtist, secondArtist).pipe(
      map((first, second) => {
        return this.formatData(first.concat(second));
      })
    );
  }
  formatData(data: any): any {
    let aData = [];
    if (Array.isArray(data)) {
      for (let [index, artist] of data.entries()) {
        if (index === 0) {
          if (!!artist.image.length) {
            this.buildComparisionObjects(aData, artist, data, 'image');
          }
          if (!!artist.name) {
            this.buildComparisionObjects(aData, artist, data, 'name');
          }
          if (!!artist.mbid) {
            this.buildComparisionObjects(aData, artist, data, 'mbid');
          }
          if (!!artist.tags) {
            this.buildComparisionObjects(aData, artist, data, 'tags');
          }
          if (!!artist.stats.listeners) {
            this.buildComparisionObjects(aData, artist, data, 'listeners');
          }
          if (!!artist.stats.listeners) {
            this.buildComparisionObjects(aData, artist, data, 'playcount');
          }
          if (!!artist.bio.published) {
            this.buildComparisionObjects(aData, artist, data, 'published');
          }
          if (!!artist.url) {
            this.buildComparisionObjects(aData, artist, data, 'url');
          }
        }
      }
      return aData;
    }
  }

  buildComparisionObjects(aData, artist, aArtists, parameter: string) {
    let oObject;
    if (parameter === 'tags') {
      oObject = {
        parameter: '',
        first: '',
        second: '',
      };
      oObject['parameter'] = parameter;
      let sTags: string;
      for (let i of [0, 1]) {
        //0 == first Artist, 1 == second Artist
        sTags = ''; // Emptying sTags for the Second Iteration
        for (let [index, tag] of aArtists[i][parameter]['tag'].entries()) {
          if (index === 0) {
            sTags = tag['name']; //Direct Assignment of Tag Name
          } else {
            sTags = sTags + ',' + ' ' + tag['name']; // Tag Name + Comma + Space + New Tag Name
          }
        }
        if (i === 0) {
          oObject['first'] = sTags;
        } else {
          oObject['second'] = sTags;
        }
      }
    } else if (parameter === 'playcount' || parameter === 'listeners') {
      oObject = {
        parameter: parameter,
        first: artist['stats'][parameter],
        second: aArtists[1]['stats'][parameter],
      };
    } else if (parameter === 'published') {
      oObject = {
        parameter: parameter,
        first: artist['bio'][parameter],
        second: aArtists[1]['bio'][parameter],
      };
    } else {
      oObject = {
        parameter: parameter,
        first: artist[parameter],
        second: aArtists[1][parameter],
      };
    }

    aData.push(oObject);
  }
  async chooseArtist(sOrder: string) {
    const _searchArtist = await this._modal.create({
      backdropDismiss: false,
      animated: true,
      component: SearchArtistPage,
      componentProps: {
        order: sOrder,
      },
    });
    _searchArtist.onDidDismiss().then((data) => {
      const sKey = Object.keys(data.data)[0];
      this[sKey] = data['data'][sKey];
    });
    await _searchArtist.present();
  }
  compareWithSelections() {
    this.missing_artist = false;
    this.fetchData();
  }
}
