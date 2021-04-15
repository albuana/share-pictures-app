import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service'
import { User } from '../user';
import { Post } from '../post';
import { Router, NavigationExtras } from '@angular/router'
import {FormControl, Validators} from '@angular/forms';
import { PostService } from '../post.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  log_username: string = "";
  log_password: string = "";

  reg_username: string = "";
  reg_password: string = "";

  users: User[] = [];
  posts: Post[] = [];

  user: User = {
    authenticated: false,
    _id: "",
    nickname: "",
    password: "",
  };

  notifyMessage: string = '';

  constructor(private userService: UserService, private Router: Router, private postService: PostService) { }

  ngOnInit() {
    this.getUsers();
  }

  SignUp() {

    if(this.userVerify() == true && this.passVerify() == true){
      this.user.password = this.reg_password;
      this.user.nickname = this.reg_username;
      this.userService.addUser({ nickname: this.user.nickname, password: this.user.password } as User)
        .subscribe((user: User) => {
          this.users.push(user);
        });

      this.Router.navigate(['/wall'], { state: { nickname: this.user.nickname } });
    }
  }

  login() {
    let flag = false;
    //Para se autenticar o utilizador deve usar o nickname e password fornecidos durante o processo de registo
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].nickname == this.log_username) {
        if (this.users[i].password == this.log_password) {
          flag = true;
          // alert("O Utilizador autenticou-se com sucesso.");
          this.checkWhereToRedirect(this.users[i]);
        }
      }
    }

    //Em caso de falha na autenticação, a mensagem de erro não deve permitir saber se o nickname existe no sistema
    if (!flag)
      alert("Os dados de login estão incorretos. Por favor, tente novamente.");
  }

  getUsers(): void {
    this.userService.getUsers()
      .subscribe(users => {
        this.users = users;
      })
  }

  checkWhereToRedirect(user: User): void {
    this.postService.getPostsByUser(user._id)
      .subscribe(posts => {
        this.posts = posts;
        if(this.posts.length>0){
          this.Router.navigate(['profile',user._id], {state: {id:user._id}});
        }
        else{
          this.Router.navigate(['/wall'], { state: { nickname: user.nickname }});

        }
      })
  }


  passVerify(): boolean {
    let flagLen = true;
    let flagUper = false;
    let flagN = false;
    let flagLower = false;


    if (this.reg_password.length < 8) {
      flagLen = false;
    }

    for(let i = 0; i < this.reg_password.length; i++){
      if( /[A-Z]/.test(this.reg_password.charAt(i))){
        console.log("Uper");
        flagUper = true;
      }

      if( /[a-z]/.test(this.reg_password.charAt(i))){
        console.log("lowe");
        flagLower = true;
      }

      if( /[0-9]/.test(this.reg_password.charAt(i))){
        console.log("num");
        flagN = true;
      }
    }

    if(!flagLen){
      alert("A password deve ter 8 ou mais carateres");
      return false;
    }

    if(!flagLower){
      alert("A password deve ter 1 ou mais caracteres minusculos");
      return false;
    }

    if(!flagUper){
      alert("A password deve ter 1 ou mais caracteres maiusculos");
      return false;
    }

    if(!flagN){
      alert("A password deve ter 1 ou mais caracteres algarismos");
      return false;
    }

    // if(!flagLen || !flagLower || ! flagN || !flagUper){
    //   return false;
    // }
    return true;
  }

  username = new FormControl("", [Validators.required]);

  getErrorMessage() {
    if (this.username.hasError('required')) {
      return 'You must enter a value.';
    }

    return this.username.hasError('username') ? 'Not a valid username' : '';
  }
  password = new FormControl("", [
    Validators.required
    // Validators.pattern('^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{8,}$')
  ]);

  getErrorMessage2() {

    if (this.password.hasError('required')) {
      return 'You must enter a value.';
    }
    return this.password.hasError('password');
  }

  userVerify(): boolean {
    let flag = true;

    //O nickname será o nome pelo qual o utilizador é conhecido na plataforma e deve ser único e ter 3 
    //ou mais carateres (só pode ter letras ou algarismos)
    if (this.reg_username.length < 3) {
      alert("O seu username tem de conter 3 ou mais carateres dos quais só podem ser letras ou algarismos.");
      return false;
    }

    for(let i = 0; i<Array.from(this.reg_username).length; i++){
      if(!this.validCharacter(this.reg_username.charAt(i))){
        alert("O username tem de conter apenas letras ou numeros");
        return false;
      }
    }

    for (let i = 0; i < this.users.length; i++) {
      //Se o utilizador tentar registar um nickname que já existe, a mensagem de erro deve indicá-lo claramente
      if (this.users[i].nickname == this.reg_username) {
        alert("O username " + this.reg_username +  " já está a ser utilizado. Por favor escolha outro.");
        return false;
      }


    }
    return flag;
  }

  validCharacter(a:string):boolean{
    if(a.toLowerCase() == a &&  a.toUpperCase() == a){
      if(!(a == "0" || a == "1"|| a == "2"|| a == "3"|| a == "4"|| a == "5"|| a == "6"|| a == "7"|| a == "8"|| a == "9")){
        return false;
      }
    }

      return true;
  }


}



