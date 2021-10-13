import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/task.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Task } from 'src/app/models/task.model';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit {
  public minDate: Date = new Date ("01/01/2000 2:00 AM");
  public maxDate: Date = new Date ("01/01/2090 11:00 AM");
  public dateValue: Date = new Date ("10/06/2020 5:00 AM");


  constructor(private taskService:TaskService ,private route:ActivatedRoute,private router:Router) { }
  listId:String;
  ngOnInit() {
    this.route.params.subscribe((params:Params) =>{
      this.listId=params['listId'];
    //  console.log(this.listId);
    })
  }
  createTask(title:String,date:String){
    this.taskService.createTask(title,date,this.listId).subscribe((newTask:Task) =>{
      console.log(newTask);
      this.router.navigate(['../'],{relativeTo:this.route});
      
    })
  }
  selectedDate: Date = new Date();
  getDate(date:Date){
   var a = date.toDateString();
   var b= date.toTimeString().substring(0,8);
   var c=a+" "+b;
   console.log(a,"+",b);
   return c;
  
  }

}
