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
    _id: "",
    nickname: "",
    password: "",
    favourites:[""],
    likes:[""],
  };
  users: User[] = [];
  posts: Post[] = [];

  postToShow: Post = {
    _id:"",
    title:"",
    description:"",
    likes:0,
    user: "", //id não nickname
    date:new Date,
    photo:""
  }

  title: string = "";
  description: string = "";
  photo: string = "";
  fileName:string = "";
  limit: number = 6;
  closeResult = '';

  flagConfirm: boolean = true;
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
  viewMore(): void {
    this.limit=this.limit+50;
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
    localStorage.removeItem('nickname');
    this.router.navigate(['login']);
  }

  addFavorite(id: string): void {
    this.user.favourites.push(id);
    this.userService.update(this.user).subscribe();
  }
  removeFavorite(id: string): void {
    this.user.favourites.splice(this.user.favourites.indexOf(id), 1);
    this.userService.update(this.user).subscribe();
  }

  isFavorite(id: string): boolean {
    for(let i = 0; i < this.user.favourites.length;i++){
      if(this.user.favourites[i]==id){
        return true;
      }
    }
    return false;
  }

  isLiked(id: string): boolean {
    for(let i = 0; i < this.user.likes.length;i++){
      if(this.user.likes[i]==id){
        return true;
      }
    }
    return false;
  }

  like(id:string): void {
    this.postToShow.likes++;
    this.user.likes.push(id);
    this.userService.update(this.user).subscribe(res => {this.updatePost});
  }
  updatePost() {
    this.postService.update(this.postToShow).subscribe();
  }

  unlike(id:string): void {
    this.postToShow.likes--;
    this.user.likes.splice(this.user.likes.indexOf(id), 1);
    this.userService.update(this.user).subscribe(res => {this.updatePost});
  }

  toUpload(): void {
    this.router.navigate(['upload'], {state: {id:this.user._id}});
  }

  toFavourites(): void {
    this.router.navigate(['favourites'], {state: { id: this.user._id }});
  }

  toLikes(): void {
    this.router.navigate(['likes'], {state: { id: this.user._id }});
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

    if (this.photo.length == 0) {
      alert("O nome da foto não pode exceder os 100 caracteres.");
    }

    if (this.title.length > 100) {
      alert("O nome da foto não pode exceder os 100 caracteres.");
      return;
    }

    if (this.description.length > 500) {
      alert("A descrição não pode exceder os 500 caracteres.");
      return;
    }

    if (this.description.length == 0) {
      const res=confirm("Post doesn't have a description. Are you sure you want to confirm?");
      if(res){
        this.flagConfirm==false;
        this.postService.addPost({ title: this.title, description: this.description, photo: this.photo, user: this.user._id } as Post).subscribe(() => this.getPosts());
      }
      return;
    }
    else{
        this.flagConfirm==false;
        this.postService.addPost({ title: this.title, description: this.description, photo: this.photo, user: this.user._id } as Post).subscribe(() => this.getPosts());
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
      this.getPosts();
      this.isRecent=true;
      console.log("NotRecent");
    }
  }

  mostraFoto(content: any, id:string){
    this.postService.getPost(id).subscribe(post => this.postToShow = post);
    this.open(content);
  }


  share(){
    console.log(this.postToShow._id)
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = "http://localhost:3059/posts/"+this.postToShow._id;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
}


