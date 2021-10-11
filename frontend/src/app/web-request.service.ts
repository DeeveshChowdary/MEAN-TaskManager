import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class WebRequestService {
  readonly ROOT_URL
  constructor(private http: HttpClient) {
    this.ROOT_URL= 'http://localhost:5555';
  }
   get(url : String){
     return this.http.get(`${this.ROOT_URL}/${url}`);
   }
   post(url: String,payload: object){
     return this.http.post(`${this.ROOT_URL}/${url}`,payload);
   }
   patch(url:String,payload){
     return this.http.patch(`${this.ROOT_URL}/${url}`,payload);
   }
   delete(url: String){
     return this.http.delete(`${this.ROOT_URL}/${url}`);
   }
   login(email:String,password:String){
     return this.http.post(`${this.ROOT_URL}/users/login`,{
       email,
       password
     },{
       observe:'response',
       
     });
    
   }
   signup(email:String,password:String){
    return this.http.post(`${this.ROOT_URL}/users`,{
      email,
      password,
    
    },{
      observe:'response'
    });
  }
}
