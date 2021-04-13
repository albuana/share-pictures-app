import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service'
import { User } from '../user';
import { Router,NavigationExtras } from '@angular/router'


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

  user: User = {
    authenticated: false,
    _id: "",
    nickname: "",
    password: "",
  };

  notifyMessage: string = '';

  constructor(private userService: UserService, private Router: Router) { }

  ngOnInit() {
    this.getUsers();
  }

  SignUp() {
    let flag = true;

    if(this.reg_username.length < 3){
      alert("O username que escolheu tem de ter pelo menos 3 alagrismos");
      flag = false;
    }

    if(this.reg_password.length < 8){
      alert("A password tem de ter 8 ou mais caracteres");
      flag = false;
    }

    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].nickname == this.reg_username) {
          alert("O username que escolheu ja está a ser utilizado");
          flag = false;
      }
    }

    if(flag){
      this.user.password = this.reg_password;
      this.user.nickname = this.reg_username;
      this.userService.addUser( {nickname: this.user.nickname, password: this.user.password} as User)
      .subscribe(user => {
        this.users.push(user);
      });
      
      this.Router.navigate(['/wall'], {state: {nickname:this.user.nickname}});
    }

  }

  login() {
    let flag = false;
    //Para se autenticar o utilizador deve usar o nickname e password fornecidos durante o processo de registo
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].nickname == this.log_username) {
        if (this.users[i].password == this.log_password) {
          flag = true;
          alert("O Utilizador autenticou com sucesso");
          //Em caso de sucesso na autenticação o utilizador deve ser levado para um ecrã 
          //que mostra as fotografias que carregou para a plataforma no passado, ou, se não tiver carregado nenhuma, 
          //para o ecrã com as fotografias mais recentes na plataforma
          this.Router.navigate(['/wall'], {state: {nickname:this.user.nickname}});
        }
      }
    }

    //Em caso de falha na autenticação, a mensagem de erro não deve permitir saber se o nickname existe no sistema
    if (!flag)
      alert("Os dados do login estão incorretos. Por favor, tente novamente.");
  }

  getUsers(): void {
    this.userService.getUsers()
      .subscribe(users => {
        this.users = users;
      })
  }

}
