import { Injectable } from '@angular/core';
import { ReplaySubject,BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public userData = new ReplaySubject<Object>();
  public headerData: BehaviorSubject<object> = new BehaviorSubject<object>({}); 
  public progressBar: BehaviorSubject<object> = new BehaviorSubject<object>({}); 
  public SelectedGroup: BehaviorSubject<object> = new BehaviorSubject<object>({}); 
  public pathUrl: BehaviorSubject<object> = new BehaviorSubject<object>({}); 
  public recieverId: BehaviorSubject<object> = new BehaviorSubject<object>({}); 
  public paymentKey: BehaviorSubject<object> = new BehaviorSubject<object>({}); 
  public notification: BehaviorSubject<object> = new BehaviorSubject<object>({}); 

  


   
  public url = environment.url;
  // GPSURL = environment.GPSAPI;
  constructor(private http:HttpClient) { }

  /**
   * setter method to pass userData to other components
   * @param value 
   */

  setpaymentKey(data){
   this.paymentKey.next(data);
  
  }

  getpaymentKey(){
    return this.paymentKey.asObservable();
  }

  
  setUserData(value){
    this.userData.next(value);
  }

  /**
   * getter method to get updated userData to other components
   */
  getUserData(){
    return this.userData.asObservable();
  }

  getIPAddress()  
  {  
    return this.http.get("http://api.ipify.org/?format=json");  
  }  

  /** ADDED BY JITENDRA JAIN ON 22-APRIL-2021 */
  setHeader(data) {
    this.headerData.next(data);
  }


  
  getHeader() {
    return this.headerData.asObservable();
  }

  getProfileProgress(){
    return this.progressBar.asObservable();
  }
  setProfileProgress(data){
    this.progressBar.next(data);
  }



  getSelectedGroup(){
    return this.SelectedGroup.asObservable();
  }

  setSelectedGroup(data){
    this.SelectedGroup.next(data);
  }

  getPath(){
    return this.pathUrl.asObservable();
  }

  setPath(data){
    this.pathUrl.next(data);
  }

  getNotification(){
    return this.notification.asObservable();
  }

  setNotification(data){
    this.notification.next(data);
  }

  getreciever(){
    return this.recieverId.asObservable();
  }

  setreciever(data){
    this.recieverId.next(data);
  }







}


