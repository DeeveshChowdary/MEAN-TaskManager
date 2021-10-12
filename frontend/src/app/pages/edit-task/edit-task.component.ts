import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TaskService } from 'src/app/task.service';
import { Task } from 'src/app/models/task.model';




@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss']
})
export class EditTaskComponent implements OnInit {
  public minDate: Date = new Date ("01/01/2000 2:00 AM");
  public maxDate: Date = new Date ("01/01/2090 11:00 AM");
  public dateValue: Date = new Date ("10/06/2020 5:00 AM");

  constructor(private route: ActivatedRoute, private taskService: TaskService, private router: Router) { }

  taskId: string;
  listId: string;
 

  

  
  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.taskId = params.taskId;
        this.listId = params.listId;

      }
    )
  }

  updateTask(title: string,date:String) {
    this.taskService.updateTask(this.listId, this.taskId, title, date).subscribe((task:Task) => {
      this.router.navigate(['/lists', this.listId]);
     
    
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
