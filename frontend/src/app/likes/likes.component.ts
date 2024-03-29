import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Post } from '../post';
import { PostService } from '../post.service';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-likes',
  templateUrl: './likes.component.html',
  styleUrls: ['./likes.component.css']
})
export class LikesComponent implements OnInit {
  user: User = {
    _id: "",
    nickname: "",
    password: "",
    favourites:[""],
    likes:[""],
  };
  posts: Post[] = [];

  userOfPostToShow: User = {
    _id: "",
    nickname: "",
    password: "",
    favourites:[""],
    likes:[""],
  };

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
    if(localStorage.getItem('id')){
      this.getUser(localStorage.getItem('id')!);

    }
    else{
      const state = navigation?.extras.state as {
        id: string,
      };
      this.getUser(state.id);
    }

  }

  ngOnInit(): void {
  }
  viewMore(): void {
    this.limit=this.limit+50;
  }
  getUserByID(id: string): void {
    this.userService.getUser(id)
      .subscribe(userOfPostToShow => {
        this.userOfPostToShow = userOfPostToShow;
      })
  }
  getUser(id: string): void {
    console.log("Ola");
    this.userService.getUser(id)
      .subscribe(user => {
        this.user = user;
        localStorage.setItem('id', user._id);
        this.getPosts();
      })
  }
  getPosts(): void {
    this.postService.getPostsByLikes()
    .subscribe(posts => {
      this.posts = posts;
      console.log(posts[0]);
    })
  }
  toProfile(): void {
    this.router.navigate(['profile',this.user._id], {state: {id:this.user._id}});
  }

  logout(): void {
    this.user = {
      _id: "",
      nickname: "",
      password: "",
      favourites:[""],
      likes:[""],
    };
    this.posts=[];
    this.postToShow={
      _id:"",
      title:"",
      description:"",
      likes:0,
      user: "", //id não nickname
      date:new Date,
      photo:""
    };
    localStorage.removeItem('nickname');
    this.router.navigate(['login']);
  }

  toUpload(): void {
    this.router.navigate(['upload'], {state: {id:this.user._id}});
  }

  addFavorite(id: string): void {
    this.user.favourites.push(id);
    this.userService.update(this.user).subscribe(res=>{this.getPosts();})
  }
  removeFavorite(id: string): void {
    this.user.favourites.splice(this.user.favourites.indexOf(id), 1);
    this.userService.update(this.user).subscribe(res=>{this.getPosts();});
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
    this.userService.update(this.user).subscribe(res=>{this.updatePost()});
  }
  updatePost() {
    this.postService.update(this.postToShow).subscribe();
  }

  unlike(id:string): void {
    this.postToShow.likes--;
    this.user.likes.splice(this.user.likes.indexOf(id), 1);
    this.userService.update(this.user).subscribe(res=>{this.updatePost()});
  }

  toFavourites(): void {
    this.router.navigate(['favourites'], {state: { id: this.user._id }});
  }
  
  open(content: any) {
    this.modalService.open(content,
   {size: 'sm', centered : true}).result.then((result) => {
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
