import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskViewComponent } from './pages/task-view/task-view.component';
import { NewListComponent } from './pages/new-list/new-list.component';
import { NewTaskComponent } from './pages/new-task/new-task.component';
import { LoginpageComponent } from './pages/loginpage/loginpage.component';
import { SignupPageComponent } from './pages/signup-page/signup-page.component';
import { EditTaskComponent } from './pages/edit-task/edit-task.component';
import { EditListComponent } from './pages/edit-list/edit-list.component';
import { LogoutpageComponent } from './pages/logoutpage/logoutpage.component';
import { ConfirmationpageComponent } from './pages/confirmationpage/confirmationpage.component';



const routes: Routes = [
  {path:'',redirectTo:'lists',pathMatch:'full'},
  {path:'new-list',component:NewListComponent},
  {path:'lists/:listId/edit-task/:taskId', component: EditTaskComponent },
  {path:'login',component:LoginpageComponent},
  {path:'signup',component:SignupPageComponent},
  {path:'lists/:listId',component:TaskViewComponent},
  {path:'lists',component:TaskViewComponent},
  {path:'lists/:listId/tasks',component:TaskViewComponent},
  {path:'lists/:listId/new-task',component:NewTaskComponent},
  { path: 'edit-list/:listId', component: EditListComponent },
  {path:'logout',component:LogoutpageComponent},
  {path:'confirmation',component:ConfirmationpageComponent}
  
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]

})
export class AppRoutingModule { }
