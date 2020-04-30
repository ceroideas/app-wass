import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ToastController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../../services/auth.service';
import { MenuService } from '../../../services/menu/menu.service';
import { ImagePicker } from '@ionic-native/image-picker/ngx';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.page.html',
  styleUrls: ['./avatar.page.scss'],
})
export class AvatarPage implements OnInit {

  preload = false;
  registerForm: FormGroup;
  registerData: any;
  loading: any;
  imgPreview = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    public toastController: ToastController,
    public loadingController: LoadingController,
    private authService: AuthService,
    private menuService: MenuService,
    private imagePicker: ImagePicker,
    ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.registerData = this.router.getCurrentNavigation().extras.state.registerData;
        console.log(this.registerData);
      }
    });
  }

  ngOnInit() {

    this.menuService.disableMenu();

    this.registerForm = this.formBuilder.group({
      name : [null, Validators.required],
    });
  }

  async onFormSubmit(form: NgForm) {
    this.registerData.name = form.name;
    this.registerData.image = this.imgPreview;
    this.preload = true;

    this.authService.register(this.registerData)
      .subscribe(res => {
        if (res.success) {
          this.presentToast('Successful registration, Sign In');
          this.router.navigate(['/login']);
        } else {
          this.preload = false;
          this.presentToast('Register failed, try again');

        }

      }, (err) => {
        this.preload = false;
        this.presentToast('The registration could not be completed');
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

  goPageLogin() {
    this.router.navigate(['/login']);
  }

  getPhoto() {
    this.imgPreview = '';

    let options = {
      maximumImagesCount: 1,
      outputType: 1,
      quality: 25,
      width: 500,
    };
    this.imagePicker.getPictures(options).then((results) => {
      if (results.length) {
        this.imgPreview = 'data:image/jpeg;base64,' + results[0];

        // this.setValueForm('image', {
        //   value: this.imgPreview
        // });
      }
      // for (var i = 0; i < results.length; i++) {
      //     this.imgPreview = 'data:image/jpeg;base64,' + results[i];
      //     // this.results = results[i];
      //     // this.base64.encodeFile(results[i]).then((base64File: string) => {
      //     //   this.registerData.image = base64File;
      //     // }, (err) => {
      //     //   console.log(err);
      //     // });
      // }
    }, (err) => { alert(err); });
  }

  setValueForm(property, value) {
    this.registerForm.get(property).setValue(value);
  }
}
