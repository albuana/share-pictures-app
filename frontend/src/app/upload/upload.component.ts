import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from '../post';
import { PostService } from '../post.service';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  flagConfirm: boolean = false;
  available: boolean = false;

  postToShow: Post = {
    _id:"",
    title:"",
    description:"",
    likes:0,
    user: "", //id não nickname
    date:new Date,
    photo:""
  }

  user: User = {
    _id: "",
    nickname: "",
    password: "",
    favourites:[""],
    likes:[""],
  };
  start:number=0;
  posts: Post[] = [];
  initial:boolean = true;
  photos= [""];
  fileName=[""];
  title: string = "";
  description: string = "";

  constructor(private router: Router, private userService: UserService, private postService: PostService) {
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

  processFile() {
    const files = (event!.target as HTMLInputElement).files!;
    let file;
    for(let i = 0; i < files.length;i++){
      console.log(files[i]);
      this.posts.push({
        _id:"",
        title:"",
        description:"",
        likes:0,
        user: "", //id não nickname
        date:new Date,
        photo:""});
      this.posts[i].title = files[i].name;
      let reader = new FileReader();
      file = files [i];
      reader.onload = (file) => {
          this.posts[i].photo = reader.result as string;
       }
      reader.readAsDataURL(file)
    }
    this.postToShow=this.posts[0];
    this.title=this.postToShow.title;
  }
  confirmarFolder(): void{
    this.initial=false;
    console.log(this.initial);
  }

  upload() {
    if (this.title.length > 100) {
      alert("O titulo é muito grande");
      return;
    }

    if (this.description.length > 500) {
      alert("A descricao é muito grande");
      return;
    }

    if (this.description.length == 0 && this.flagConfirm == false) {
      alert("A foto nao tem descricao, clique confirmar para confirmar");
      this.flagConfirm = true;
      return;
    }

    if (this.description.length == 0 && this.flagConfirm == true) {
      if(this.start!=this.posts.length-1){
        this.posts[this.start].title=this.title;
        this.posts[this.start].description=this.description;
        this.start++;
        this.postToShow=this.posts[this.start]
        this.title=this.postToShow.title;
        this.description="";
      }else{
        this.posts[this.start].title=this.title;
        this.posts[this.start].description=this.description;
        this.uploadPhotos();
      }

    }else{
      if(this.start!=this.posts.length-1){
        this.posts[this.start].title=this.title;
        this.posts[this.start].description=this.description;
        this.start++;
        this.postToShow=this.posts[this.start]
        this.title=this.postToShow.title;
        this.description="";
      }else{
        this.posts[this.start].title=this.title;
        this.posts[this.start].description=this.description;
        this.uploadPhotos();
      }
    }
  }
  uploadPhotos() : void{
    for(let i = 0; i < this.posts.length;i++){
      if(i==this.posts.length-1){
        this.postService.addPost({ title: this.posts[i].title, description: this.posts[i].description, photo: this.posts[i].photo, user: this.user._id } as Post).subscribe(res=>this.restart());
      }
      else{
        this.postService.addPost({ title: this.posts[i].title, description: this.posts[i].description, photo: this.posts[i].photo, user: this.user._id } as Post).subscribe();
      }
    }
  }
  restart(): void {
    alert("Fotos Publicadas");
    this.posts=[]
    this.postToShow={
      _id:"",
      title:"",
      description:"",
      likes:0,
      user: "", //id não nickname
      date:new Date,
      photo:""
    }  
    this.initial=true;
  }

  getUser(id: string): void {
    this.userService.getUser(id)
      .subscribe(user => {
        this.user = user;
      })
  }

  toProfile(): void {
    this.router.navigate(['profile', this.user._id], { state: { id: this.user._id } });
  }


  toWall(): void {
    this.router.navigate(['/wall'], { state: { nickname: this.user.nickname } });
  }
}


