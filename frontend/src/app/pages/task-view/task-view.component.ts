import { Component, OnInit } from '@angular/core';
import { WebRequestService } from 'src/app/web-request.service';
import { TaskService} from 'src/app/task.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { list } from 'src/app/models/list.model';
import { Task } from 'src/app/models/task.model';
import { AuthService } from 'src/app/auth.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit {
  
  lists:list[];
  tasks:Task[];
  SelectedListId:String;
  
  constructor(private taskService: TaskService,private route:ActivatedRoute, private router:Router,private authService:AuthService,private toastr:ToastrService) { }
    
  ngOnInit() {
    
    this.route.params.subscribe(
      (params: Params) =>{
       if(params.listId){
        this.SelectedListId=params.listId;
        this.taskService.getTasks(params.listId).subscribe((tasks:Task[])=>{
          this.tasks=tasks;
        })
       }else{
         this.tasks=undefined;
       }
       
      })
      this.taskService.getList().subscribe((lists:list[])=>{
        this.lists=lists;

      })
  
  }
  onTaskClick(task:Task){
    //task has been set to completed successfully
    this.taskService.complete(task).subscribe(()=>{
      console.log("completed successfully");
      task.completed=!task.completed;
    })
  }
  onDeleteListClick(){
    this.taskService.deleteList(this.SelectedListId).subscribe((res:any)=>{
      this.router.navigate(['/lists']);
      console.log(res);
    })
  }
  onDeleteTaskClick(id:String){
    this.taskService.deleteTask(this.SelectedListId,id).subscribe((res:any)=>{
      this.tasks=this.tasks.filter(val => val._id!==id);
      console.log(res);
    })
  }
  onLogoutButtonClicked() {
    this.authService.logout();
    console.log("logged out successfully");
  }
  onNotificationclick(){
    this.route.params.subscribe(
      (params: Params) =>{
       if(params.listId){
        this.SelectedListId=params.listId;
        this.taskService.getTasks(params.listId).subscribe((tasks:Task[])=>{
          this.tasks=tasks;
          for (let index = 0; index < tasks.length; index++) {
            var name =tasks[index].title;
            var element = tasks[index].date;
            var c=tasks[index].completed
            var b=new Date(element.toString()).toLocaleDateString()
            var d=tasks[index]._id;
            var e=tasks[index]._listId;
           
            var today=new Date().toLocaleDateString();
           
         
            if((b>today)&&(c==false)){
    
              this.toastr.info("NAME:"+"  "+name+"  "+"DUE"+" "+b,'pending tasks!!',{timeOut:10000});
             
              
                       
            }
            else if((b==today)&&(c==false)){
                this.toastr.error("NAME:"+"  "+name+"  "+"DUE"+" "+b,'is due today!!',{timeOut:10000});
            }

           
           
          }         
          
        })
       }else{
         this.tasks=undefined;
        }
       
      })
   }
   onMailbuttonClicked(){
    this.taskService.mailButtonClicked().subscribe((res:any)=>{
      console.log(res);
    })
  }


}
 

