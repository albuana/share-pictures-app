import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-wall',
  templateUrl: './wall.component.html',
  styleUrls: ['./wall.component.css']
})
export class WallComponent implements OnInit {
  user: User | undefined;
  users: User[] = [];

  constructor(private router: Router, private userService: UserService) { 
    const navigation = this.router.getCurrentNavigation();
    console.log(navigation?.extras.state)
    const state = navigation?.extras.state as {
      nickname: string,
    };
    this.getUserByNickname(state.nickname);
  }


  ngOnInit(): void {
    this.getUsers();
  }

  getUserByNickname(nickname: string): void {
    this.userService.getUserByNickname(nickname)
      .subscribe(user => {
        this.user = user[0];
      })
  }

  getUsers(): void {
    this.userService.getUsers()
      .subscribe(users => {
        this.users = users;
      })
  }
}

