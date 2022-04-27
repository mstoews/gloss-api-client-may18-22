import { Injectable } from '@angular/core';
import { AsyncValidator, FormControl } from '@angular/forms';
import { AuthService } from 'app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UniqueUsername implements AsyncValidator {
  constructor(private authService: AuthService) {}
  uniqueUserName = false;
  validate = (control: FormControl) => {
    const { value } = control;

    return this.authService.getAllUsers().subscribe((val) => {
        val.forEach( item => {
            
        }); 
    });
  }
}
