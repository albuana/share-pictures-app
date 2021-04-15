import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from '../post.service';
import { Post } from '../post';
import { User } from '../user';
import { UserService } from '../user.service';

import {NgbModal, ModalDismissReasons} 
      from '@ng-bootstrap/ng-bootstrap';
import { state } from '@angular/animations';

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

  title: string = "";
  description: string = "";
  photo: string = "";
  fileName:string = "";

  closeResult = '';

  flagConfirm: boolean = false;
  available: boolean = false;
  isRecent: boolean = false;
  dialog: any;


  constructor(private router: Router, private userService: UserService, private postService: PostService, private modalService: NgbModal) { 
    const navigation = this.router.getCurrentNavigation();
    if(localStorage.getItem('nickname')){
      this.getUserByNickname(localStorage.getItem('nickname')!);

    }
    else{
      const state = navigation?.extras.state as {
        nickname: string,
      };
      this.getUserByNickname(state.nickname);
    }

  }

  ngOnInit(): void {
    this.getUsers();
    this.getPosts();
  }
  getUserByNickname(nickname: string): void {
    this.userService.getUserByNickname(nickname)
      .subscribe(user => {
        this.user = user[0];
        localStorage.setItem('nickname', user[0].nickname);
      })
  }
  getUsers(): void {
    this.userService.getUsers()
      .subscribe(users => {
        this.users = users;
      })
  }
  getPosts(): void {
    this.postService.getRecentPosts()
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
   {ariaLabelledBy: 'modal-basic-title', centered : true}).result.then((result) => {
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

  processFile() {
    const file = (event!.target as HTMLInputElement).files!;
    const Reader = new FileReader();
    this.fileName = file[0].name;
    this.available = true;
    Reader.readAsDataURL(file[0]);
    Reader.onload = () => {
      this.photo = Reader.result as string;
    }

  }



  upload() {
    if (this.title.length == 0) {
      this.title = this.fileName;
    }

    if (this.title.length > 100) {
      alert("O titulo é muito grande");
      return;
    }

    if (this.description.length > 500) {
      alert("A descricao é muito grande");
      return;
    }

    if (this.description.length == 0 && this.flagConfirm == false) {
      alert("Parece que não colocou descrição na sua foto.\nPretende proceder?");
      this.flagConfirm = true;
      return;
    }

    if (this.description.length == 0 && this.flagConfirm == true) {
      this.postService.addPost({ title: this.title, description: this.description, photo: this.photo, user: this.user._id } as Post).subscribe(() => this.getPosts());
      this.flagConfirm = false;
    }else{


    this.postService.addPost({ title: this.title, description: this.description, photo: this.photo, user: this.user._id } as Post).subscribe(() => this.getPosts());
    this.flagConfirm = false;
  }
  }

  toWall(): void {
    this.router.navigate(['/wall'], { state: { nickname: this.user.nickname } });
  }

  recentEvent(): void{
    if(this.isRecent){
      this.getPosts();
      this.isRecent=false;
      console.log("isRecent");
    }
    else{
      this.getRecentPosts();
      this.isRecent=true;
      console.log("NotRecent");
    }
  }
  getRecentPosts() {
    this.postService.getRecentPosts()
      .subscribe(posts => {
        this.posts = posts;
      })
  }




}

function DialogContentExampleDialog(DialogContentExampleDialog: any) {
  throw new Error('Function not implemented.');
}

function openDialog() {
  throw new Error('Function not implemented.');
}

