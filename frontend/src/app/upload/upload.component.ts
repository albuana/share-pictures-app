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

  user: User = {
    authenticated: false,
    _id: "",
    nickname: "",
    password: "",
  };
  title: string ="";
  description: string = "";
  photo: string = "";
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

  processFile() {
    const file = (event!.target as HTMLInputElement).files!;
    const Reader=new FileReader();
    Reader.readAsDataURL(file[0]);
    Reader.onload = () => {
      this.photo = Reader.result as string;
      }
      
  }

  upload() {
    this.postService.addPost({title:this.title, description:this.description, photo:this.photo, user:this.user._id} as Post).subscribe(() => this.toWall());
  }
  
  getUser(id: string): void {
    this.userService.getUser(id)
      .subscribe(user => {
        this.user = user;
      })
  }

  toProfile(): void {
    this.router.navigate(['profile',this.user._id], {state: {id:this.user._id}});
  }

  
  toWall(): void {
    this.router.navigate(['/wall'], { state: { nickname: this.user.nickname } });
  }
}
