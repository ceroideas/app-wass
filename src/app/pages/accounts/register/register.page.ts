import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { MenuService } from '../../../services/menu/menu.service';
import { AccountsService } from '../../../services/accounts/accounts.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm: FormGroup;
  loading: any;
  optionsContries: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private menuService: MenuService,
    private accountsService: AccountsService
  ) { }

  ngOnInit() {

    this.menuService.disableMenu();
    this.optionsContries = this.accountsService.getCountries();
    this.registerForm = this.formBuilder.group({
      firstName : [null, Validators.required],
      nationality : [null, Validators.required],
      email : [null, [Validators.required, Validators.email]],
      password : [null, [Validators.required, Validators.minLength(6)]]
    });
  }

  async onFormSubmit(form: NgForm) {
    const navigationExtras: NavigationExtras = {
      state: {
        registerData: form
      }
    };
    this.router.navigate(['/avatar'], navigationExtras);
  }

  goPageAvatar() {
    this.router.navigate(['/avatar']);
  }
}
