import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController, LoadingController, MenuController } from '@ionic/angular';
import { AuthService } from '../../../services/auth.service';
import { MenuService } from '../../../services/menu/menu.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  loading: any;
  preload = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    public toastController: ToastController,
    public loadingController: LoadingController,
    public menuController: MenuController,
    public menuService: MenuService
  ) { }

  ngOnInit() {

    this.menuService.disableMenu();

    this.loginForm = this.formBuilder.group({
      'email' : [null, [Validators.required, Validators.email]],
      'password' : [null, Validators.required]
    });
  }

  async onFormSubmit(form: NgForm) {
    this.preload = true;

    this.authService.login(form)
      .subscribe(res => {
        console.log(res);

        if (res.success) {

          this.authService.setUserDataAuthStorage(res.user);

          localStorage.setItem('token', res.user._id);

          this.router.navigate(['/map']);
        } else {
          this.preload = false;
          this.presentToast('Account invalid, verify the data');
        }

      }, (err) => {
        this.preload = false;
        this.presentToast('Impossible to sign in');
        console.log(err);
      });
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  goPageMap() {
    this.router.navigateByUrl('/map');
    // this.router.navigate(['/map']);
  }

  goPageRegister() {
    this.router.navigate(['/register']);
  }
}
