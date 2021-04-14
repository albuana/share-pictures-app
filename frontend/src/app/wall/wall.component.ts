import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from '../post.service';
import { Post } from '../post';
import { User } from '../user';
import { UserService } from '../user.service';

import {NgbModal, ModalDismissReasons} 
      from '@ng-bootstrap/ng-bootstrap';

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
  closeResult = '';


  constructor(private router: Router, private userService: UserService, private postService: PostService, private modalService: NgbModal) { 
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

  logout(): void {
    this.router.navigate(['login']);
  }

  toUpload(): void {
    this.router.navigate(['upload'], {state: {id:this.user._id}});
  }

  open(content: any) {
    this.modalService.open(content,
   {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = 
         `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }




}

