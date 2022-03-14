import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LastfmService {
  private _config = {
    _baseURL: 'http://ws.audioscrobbler.com',
    _api_key: '20327811f8be3854472bce5150f8d8a2',
    format: 'json',
  };
  constructor(private _http: HttpClient) {}

  getArtistsbyCountry(
    country: string,
    limit?: number,
    page?: number
  ): Observable<Object> {
    // Returns Top[limit] Artists of Country[country] as an Observable...
    return this._http.get(
      this._createRequestURL(
        '/2.0/?method=geo.gettopartists&country=' + country,
        limit,
        page
      )
    );
  }
  searchArtist(
    searchTerm: string,
    limit?: number,
    page?: number
  ): Observable<any> {
    //Returns Search Results of Artists for given SearchTerm[searchTerm] as an Observable...
    return this._http.get(
      this._createRequestURL(
        '/2.0/?method=artist.search&artist=' + searchTerm,
        limit,
        page
      )
    );
  }
  getArtist(mbid: string): Observable<Object> {
    // Returns Artist[mbid] Info for Detail Page as an Observable...
    return this._http.get(
      this._createRequestURL('/2.0/?method=artist.getinfo&mbid=' + mbid)
    );
  }
  getArtistByName(artist: string) {
    // Returns Artist[artist] Info for Comparision as an Observable...
    return this._http.get(
      this._createRequestURL('/2.0/?method=artist.getinfo&artist=' + artist)
    );
  }
  getAlbums(mbid: string, limit?: number) {
    // Returns Top[limit] Albums of given Artist[mbid] as an Obseravable...
    return this._http.get(
      this._createRequestURL(
        '/2.0/?method=artist.gettopalbums&mbid=' + mbid,
        limit
      )
    );
  }
  getTracks(mbid: string, limit?: number) {
    // Returns Top[limit] Tracks of given Artist[mbid] as an Obseravable...
    return this._http.get(
      this._createRequestURL(
        '/2.0/?method=artist.gettoptracks&mbid=' + mbid,
        limit
      )
    );
  }
  private _createRequestURL(_url: string, limit?: number, page?: number) {
    // Returns full URL for Get request...
    let sURL =
      this._config._baseURL +
      _url +
      '&api_key=' +
      this._config._api_key +
      '&format=json';
    if (page) {
      sURL = sURL + '&page=' + page;
    }
    if (limit) {
      sURL = sURL + '&limit=' + limit;
    }
    return sURL;
  }
}
