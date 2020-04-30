import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { AccountsService } from '../../../services/accounts/accounts.service';
import { AuthService } from '../../../services/auth.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ImagePicker } from '@ionic-native/image-picker/ngx';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  registerForm: FormGroup;
  passwordForm: FormGroup;
  optionsContries: any;
  user: any;
  preload = false;
  imgPreview = '';

  constructor(
    private accountsService: AccountsService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private router: Router,
    private imagePicker: ImagePicker
    ) { }

  ngOnInit() {
    this.optionsContries = this.accountsService.getCountries();
    this.user = this.authService.userAuth();
    this.registerForm = this.formBuilder.group({
      firstName : [this.user.firstName, Validators.required],
      nationality : [this.user.nationality, Validators.required],
      userId : [this.user._id],
      image : [null],
    });

    this.passwordForm = this.formBuilder.group({
      password : [null, Validators.required],
      rePassword : [null, Validators.required],
      userId : [this.user._id],
    }, {validator: this.checkPasswords});
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.controls.password.value;
    let confirmPass = group.controls.rePassword.value;
    if (pass === confirmPass) {
      return null;
    } else {
      return { notSame: true };
    }
  }

  async onFormSubmit(form: NgForm) {
    const data = form;
    this.preload = true;
    this.authService.profileUpdate(form)
      .subscribe(res => {
        this.preload = false;
        if (res.success) {
          this.authService.setUserDataAuthStorage(res.user);
          this.presentToast('Successful updated profile');
        } else {
          this.presentToast('Updated failed, try again');

        }

      }, (err) => {
        this.preload = false;
        this.presentToast('The updated could not be completed');
        console.log(err);
      });
  }

  async onFormSubmitPassword(formPassword: NgForm) {

    this.preload = true;

    this.authService.passwordUpdate(formPassword)
      .subscribe(res => {
        this.preload = false;
        if (res.success) {
          this.passwordForm.reset();
          this.presentToast('Successful updated password');
        } else {
          this.presentToast('Updated failed, try again');

        }

      }, (err) => {
        this.preload = false;
        this.presentToast('The updated could not be completed');
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

        this.registerForm.get('image').setValue(this.imgPreview);
      }
    }, (err) => { alert(err); });
  }

}
