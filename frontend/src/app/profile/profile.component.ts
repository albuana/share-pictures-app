import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from '../post.service';
import { Post } from '../post';
import { User } from '../user';
import { UserService } from '../user.service';
import {NgbModal, ModalDismissReasons} 
      from '@ng-bootstrap/ng-bootstrap';

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

  postToShow: Post = {
    _id:"",
    title:"",
    description:"",
    likes:0,
    user: "", //id não nickname
    date:new Date,
    photo:""
  }
  closeResult = '';
  removeFlag:boolean = false;
  titleToShow:string ="";
  descriptionToShow:string ="";

  idToShow:string = "";
  

  constructor(private router: Router, private userService: UserService, private postService: PostService, private modalService: NgbModal) { 
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
        this.getPosts();
      })
  }

  toWall(): void {
    this.router.navigate(['/wall'], { state: { nickname: this.user.nickname } });
  }

  logout(): void {
    this.router.navigate(['login']);
  }

  getPosts(): void {
    this.postService.getPostsByUser(this.user._id)
      .subscribe(posts => {
        this.posts = posts;
      })
  }

  removePost(id:string){
    if(!this.removeFlag){
      alert("De certeza que quer remover a foto?\nClique de novo em Remover")
      this.removeFlag = true;

    }else{
    console.log(id);
    this.postService.deletePost(id).subscribe(post => this.getPosts());
    this.removeFlag = false;
    }
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
  
  mostraFoto(content: any, id:string){
    this.postService.getPost(id).subscribe(post => this.postToShow = post);
    this.open(content);
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
