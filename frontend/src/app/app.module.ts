import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TaskViewComponent } from './pages/task-view/task-view.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NewListComponent } from './pages/new-list/new-list.component';
import { NewTaskComponent } from './pages/new-task/new-task.component';
import { LoginpageComponent } from './pages/loginpage/loginpage.component';
import { WebReqInterceptor } from './web-req.interceptor';
import { SignupPageComponent } from './pages/signup-page/signup-page.component';
import { EditListComponent } from './pages/edit-list/edit-list.component';
import { EditTaskComponent } from './pages/edit-task/edit-task.component';
import { LogoutpageComponent } from './pages/logoutpage/logoutpage.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { DateTimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { ToastrModule } from 'ngx-toastr';
import { ConfirmationpageComponent } from './pages/confirmationpage/confirmationpage.component';




@NgModule({
  declarations: [
    AppComponent,
    TaskViewComponent,
    NewListComponent,
    NewTaskComponent,
    LoginpageComponent,
    SignupPageComponent,
    EditListComponent,
    EditTaskComponent,
    LogoutpageComponent,
    ConfirmationpageComponent,
   
    
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatInputModule,
    FormsModule,
    DateTimePickerModule,
    ToastrModule.forRoot({
      timeOut:500000,
      positionClass:'toast-top-right',
      preventDuplicates:true
    })   
   
  
  ],
  providers: [
  
    {provide:HTTP_INTERCEPTORS,useClass:WebReqInterceptor,multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
