import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from '../post.service';
import { Post } from '../post';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User = {
    authenticated: false,
    _id: "",
    nickname: "",
    password: "",
  };
  posts: Post[] = [];
  constructor(private router: Router, private userService: UserService, private postService: PostService) { 
    const navigation = this.router.getCurrentNavigation();
    console.log(navigation?.extras.state)
    const state = navigation?.extras.state as {
      id: string,
    };
    this.getUser(state.id);
  }

  ngOnInit(): void {
  }
  
  getUser(id: string): void {
    this.userService.getUser(id)
      .subscribe(user => {
        this.user = user;
      })
  }

}
