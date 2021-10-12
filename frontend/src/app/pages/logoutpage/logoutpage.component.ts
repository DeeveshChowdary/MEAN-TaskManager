import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-logoutpage',
  templateUrl: './logoutpage.component.html',
  styleUrls: ['./logoutpage.component.scss']
})
export class LogoutpageComponent implements OnInit {

  constructor(private authService:AuthService) { }

  ngOnInit(){
  }
  

}
