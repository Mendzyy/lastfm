import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchArtistPageRoutingModule } from './search-artist-routing.module';

import { SearchArtistPage } from './search-artist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchArtistPageRoutingModule
  ],
  declarations: [SearchArtistPage]
})
export class SearchArtistPageModule {}
