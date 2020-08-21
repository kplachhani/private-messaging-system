import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatboardComponent } from './dashboard/chatboard/chatboard.component';
import { LoginComponent } from './account/login/login.component';
import { ChatusersComponent } from './dashboard/chatusers/chatusers.component';
import { ChatpopupComponent } from './dashboard/chatpopup/chatpopup.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatboardComponent,
    LoginComponent,
    ChatusersComponent,
    ChatpopupComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
