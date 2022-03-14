import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder/Artists',
    pathMatch: 'full',
  },
  {
    path: 'folder/:id',
    loadChildren: () =>
      import('./folder/folder.module').then((m) => m.FolderPageModule),
  },
  {
    path: 'artist/:mbid',
    loadChildren: () =>
      import('./artist/artist.module').then((m) => m.ArtistPageModule),
  },
  {
    path: 'compare',
    loadChildren: () => import('./compare/compare.module').then( m => m.ComparePageModule)
  },
  {
    path: 'search-artist',
    loadChildren: () => import('./search-artist/search-artist.module').then( m => m.SearchArtistPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
