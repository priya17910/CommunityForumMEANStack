import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { SharedService } from '../../shared.service';
import { PostService } from '../../post/post.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  username!: string;
  email!: string;
  password!: string;
  credentials: any = {};
  successMessage: string = '';
  errorMessage: string = '';
  loginActive: boolean = true;
  registerActive: boolean = false;
  constructor(private authService: AuthService, private router: Router, private sharedService: SharedService, private postService: PostService) { }
  ngOnInit(): void {
    this.sharedService.loginEvent.subscribe(() => {
      this.errorMessage = "";
      this.successMessage = "";
      this.loginActive = true;
      this.registerActive = false;
      this.email = "";
      this.password = "";
      this.username = "";
    });
    this.sharedService.registerEvent.subscribe(() => {
      this.errorMessage = "";
      this.successMessage = "";
      this.registerActive = true;
      this.loginActive = false;
      this.email = "";
      this.password = "";
      this.username = "";
    });
  }

  login(): void {
    const credentials = {
      email: this.email,
      password: this.password
    };
    this.authService.login(credentials).subscribe(
      (response: any) => {
        const token = response.token;
        localStorage.setItem("token", token);
        this.authService.setAuthenticationStatus(true);
        this.authService.emitLoggedInEvent();
        this.loginActive = false;
        this.registerActive = false;
        this.successMessage = response.message;
        this.router.navigate(["/getAllPosts"]);
      },
      error => {
        console.error('Error logging in:', error);
        this.errorMessage = "Login unsuccessfull ! Please reload or try in incognito tab";
      }
    );
  }

  register(): void {
    const userData = {
      username: this.username,
      email: this.email,
      password: this.password
    };

    this.authService.register(userData).subscribe(
      (response: any) => {
        this.successMessage = response.message;
        this.loginActive = true;
        this.registerActive = false;
      },
      (error: any) => {
        console.error(error);
        this.errorMessage = "User not registered successfully";
      }
    );
  }

}
