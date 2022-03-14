import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchArtistPage } from './search-artist.page';

const routes: Routes = [
  {
    path: '',
    component: SearchArtistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchArtistPageRoutingModule {}
