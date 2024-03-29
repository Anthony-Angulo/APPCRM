import { AuthService } from '../services/authentication.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isAuthenticated();
    // if (this.authService.isAuthenticated()) {
    //   return true;
    // } else {
    //   this.router.navigate(['/login'], {
    //     queryParams: {
    //       return: state.url
    //     }
    //   });
    //   return false;
    // }
  }

}
