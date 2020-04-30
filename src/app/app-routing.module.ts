import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: 'welcome', loadChildren: './pages/welcome/welcome.module#WelcomePageModule' },
  { path: 'register', loadChildren: './pages/accounts/register/register.module#RegisterPageModule' },
  { path: 'avatar', loadChildren: './pages/accounts/avatar/avatar.module#AvatarPageModule' },
  { path: 'login', loadChildren: './pages/accounts/login/login.module#LoginPageModule' },
  { path: 'messages', loadChildren: './pages/messages/list/list.module#ListPageModule' },
  { path: 'messages/chat', loadChildren: './pages/messages/chat/chat.module#ChatPageModule' },
  { path: 'blog', loadChildren: './pages/blog/list/list.module#ListPageModule' },
  { path: 'blog/detail', loadChildren: './pages/blog/detail/detail.module#DetailPageModule' },
  { path: 'map', loadChildren: './pages/location/map/map.module#MapPageModule' },
  { path: 'about', loadChildren: './pages/about/about.module#AboutPageModule' },
  { path: 'privacy', loadChildren: './pages/privacy/privacy.module#PrivacyPageModule' },
  { path: 'profile', loadChildren: './pages/accounts/profile/profile.module#ProfilePageModule' },
  { path: 'routes', loadChildren: './pages/location/routes/routes.module#RoutesPageModule' },
  { path: 'place/detail', loadChildren: './pages/place/detail/detail.module#DetailPageModule' },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
