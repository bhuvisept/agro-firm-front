import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router} from '@angular/router'
@Injectable({
  providedIn: 'root'
})
export class LoginAuthGuard implements CanActivate {
  userInfo: any;
  constructor(private router : Router ){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      this.userInfo = JSON.parse(localStorage.getItem('truckStorage'))


      if(this.userInfo && this.userInfo['token'] && this.userInfo.userInfo._id ){
        this.router.navigate(['/home-page'])
      }else{
        return true;
      }
  }
  
}
