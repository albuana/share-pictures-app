import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../post.service';
import { Post } from '../post';
import { User } from '../user';
import { UserService } from '../user.service';
import { NgbModal, ModalDismissReasons }
  from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  postToShow: Post = {
    _id: "",
    title: "",
    description: "",
    likes: 0,
    user: "", //id não nickname
    date: new Date,
    photo: ""
  }
  
  constructor(private router: ActivatedRoute, private userService: UserService, private postService: PostService, private modalService: NgbModal) { 
    const id = this.router.snapshot.paramMap.get('id');
    this.getPost(id!);
  }

  ngOnInit(): void {
  }

  getPost(id: string): void {
    this.postService.getPost(id)
      .subscribe(postToShow1 => {
        this.postToShow = postToShow1;
      })
  }

}
