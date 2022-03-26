import {
  Directive,
  HostListener,
  Input,
  OnInit,
  Renderer2,
} from '@angular/core';
import { DomController } from '@ionic/angular';

@Directive({
  selector: '[appHideHeader]',
})
export class HideHeaderDirective implements OnInit {
  @Input('appHideHeader') header: any;
  private lastY = 0;
  private _headerHeight = 0;
  constructor(private renderer: Renderer2, private domCtrl: DomController) {}
  ngOnInit(): void {
    this.header = this.header.el;
    this.domCtrl.write(() => {
      this.renderer.setStyle(this.header, 'transition', 'margin-top 700ms');
    });
    // this.renderer.setStyle(this._header, 'webkitTransition', 'top 700ms');
  }
  @HostListener('ionScroll', ['$event']) onContentScroll($event) {
    if ($event.detail.scrollTop > this.lastY) {
      this.domCtrl.write(() => {
        this.renderer.setStyle(
          this.header,
          'margin-top',
          `-${this.header.clientHeight}px`
        );
      });
    } else {
      this.domCtrl.write(() => {
        this.renderer.setStyle(this.header, 'margin-top', '0');
      });
    }

    this.lastY = $event.detail.scrollTop;
  }
}