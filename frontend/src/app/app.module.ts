import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatCardModule} from '@angular/material/card';
import {LoginComponent} from './login/login.component'
import {MatTabsModule} from '@angular/material/tabs';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon'
import {FormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService} from '../app/user.service';
import { HttpClientModule } from '@angular/common/http';
import { WallComponent } from './wall/wall.component';
import { DemoMaterialModule } from "./material-module";
import { FlexLayoutModule } from '@angular/flex-layout';
import { ProfileComponent } from './profile/profile.component';
import { UploadComponent } from './upload/upload.component';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FavouritesComponent } from './favourites/favourites.component';
import { LikesComponent } from './likes/likes.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    WallComponent,
    ProfileComponent,
    UploadComponent,
    FavouritesComponent,
    LikesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    HttpClientModule,
    DemoMaterialModule,
    FlexLayoutModule,
    MaterialFileInputModule,
    RouterModule.forRoot([
      {
        path: '',
        component: LoginComponent
      },
      {
        path: 'wall',
        component: WallComponent
      },
      {
        path: 'profile/:id',
        component: ProfileComponent
      },
      {
        path: 'upload',
        component: UploadComponent
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'favourites',
        component: FavouritesComponent
      },
      {
        path: 'likes',
        component: LikesComponent
      }
    ]),
    NgbModule

    
  ],
  providers: [UserService, HttpClientModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
