import { Injectable } from '@angular/core';
import { MenuController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})

export class MenuService {

    constructor(private menuController: MenuController) { }

    disableMenu() {
        this.menuController.enable(false);
    }

    setActiveMenu(v: boolean = false) {
      this.menuController.enable(v);
  }
}
