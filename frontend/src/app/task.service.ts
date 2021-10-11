import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service'
import { Task } from './models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  

  constructor(private webReqservice:WebRequestService) { }
  createList(title:String){
    return this.webReqservice.post('lists',{title})
   }
   updateList(id:String,title:String){
     //we want to send a webreq to update a list
     return this.webReqservice.patch(`lists/${id}`,{title});
   }
   updateTask(listId: string, taskId: string, title: string,date:String) {
    // We want to send a web request to update a list
    return this.webReqservice.patch(`lists/${listId}/tasks/${taskId}`, { title,date });
  }

   deleteList(id:String){
     return this.webReqservice.delete(`lists/${id}`);
   }
   deleteTask(listId:String,taskId:String){
     return this.webReqservice.delete(`lists/${listId}/tasks/${taskId}`);
   }

   getList(){
     return this.webReqservice.get('lists');
   }
   getTasks(listId:String){
     return this.webReqservice.get(`lists/${listId}/tasks/`);
   }
   createTask(title:String,date:String,listId:String){
    return this.webReqservice.post(`lists/${listId}/tasks/`,{title,date});
   }
   complete(task:Task){
     
     console.log(task.title);
     return this.webReqservice.patch(`lists/${task._listId}/tasks/${task._id}`,{
       completed: !task.completed
     });
    }
    mailButtonClicked(){
      return this.webReqservice.get('notifications');
    }
 
}