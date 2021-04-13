import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from '../post.service';
import { Post } from '../post';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-wall',
  templateUrl: './wall.component.html',
  styleUrls: ['./wall.component.css']
})
export class WallComponent implements OnInit {
  user: User = {
    authenticated: false,
    _id: "",
    nickname: "",
    password: "",
  };
  users: User[] = [];
  posts: Post[] = [];
  constructor(private router: Router, private userService: UserService, private postService: PostService) { 
    const navigation = this.router.getCurrentNavigation();
    console.log(navigation?.extras.state)
    const state = navigation?.extras.state as {
      nickname: string,
    };
    this.getUserByNickname(state.nickname);
  }

  ngOnInit(): void {
    this.getUsers();
    this.getPosts();
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
  getPosts(): void {
    this.postService.getPosts()
      .subscribe(posts => {
        this.posts = posts;
      })
  }
  toProfile(): void {
    this.router.navigate(['profile',this.user._id], {state: {id:this.user._id}});
  }
}

