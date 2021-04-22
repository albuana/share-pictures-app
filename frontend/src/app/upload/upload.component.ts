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


  user: User = {
    _id: "",
    nickname: "",
    password: "",
    favourites:[""],
    likes:[""],
  };

  title: string = "";
  description: string = "";
  photo: string = "";
  fileName:string = "";

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
      alert("A foto nao tem descricao, clique confirmar para confirmar");
      this.flagConfirm = true;
      return;
    }

    if (this.description.length == 0 && this.flagConfirm == true) {
      this.postService.addPost({ title: this.title, description: this.description, photo: this.photo, user: this.user._id } as Post).subscribe(() => this.toWall());

    }else{


    this.postService.addPost({ title: this.title, description: this.description, photo: this.photo, user: this.user._id } as Post).subscribe(() => this.toWall());
    }
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
