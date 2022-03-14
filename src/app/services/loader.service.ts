import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private _nTries: number = 0;
  constructor(public loadingController: LoadingController) {}
  async showLoader(sMessage?: string) {
    // Showing Loader...
    await this.loadingController
      .create({
        message: sMessage ? sMessage : 'Please wait...',
        spinner: 'dots',
      })
      .then((res) => {
        res.present().then(() => {
          this._nTries = 0;
        });
      });
  }
  async hideLoader() {
    // Hiding Loader...
    this.loadingController
      .dismiss()
      .then((res) => {
        console.log('Loading dismissed!', res);
        if (!res) {
          this._nTries += 1;
          this.tryToHideLoaderAgain();
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
  }
  private tryToHideLoaderAgain() {
    if (this._nTries < 3) {
      this.loadingController
        .dismiss()
        .then((res) => {
          console.log('Loading dismissed!', res);
        })
        .catch((error) => {
          console.log('error', error);
        });
    }
  }
}
