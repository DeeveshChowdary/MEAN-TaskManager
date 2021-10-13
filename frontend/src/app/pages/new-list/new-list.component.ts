import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/task.service';
import { Router } from '@angular/router';
import { list } from 'src/app/models/list.model';

@Component({
  selector: 'app-new-list',
  templateUrl: './new-list.component.html',
  styleUrls: ['./new-list.component.scss']
})
export class NewListComponent implements OnInit {


  constructor(private taskservice:TaskService, private router:Router) { }

  ngOnInit() {
  }
  createList(title:String){
    this.taskservice.createList(title).subscribe((list:list) =>{
      console.log(list);
      //now we navigate to /list/responseid
      this.router.navigate(['./lists',list._id])
  });
  
}}


