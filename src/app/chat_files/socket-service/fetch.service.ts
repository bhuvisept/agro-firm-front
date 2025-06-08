// import { AppService } from "./../app-service/app.service";
// import { AppService } from "src/environments/environment";
import { AppService } from "./app.service";

import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map, tap } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
// import { ApiUrl } from "src/app/api/api-url";


@Injectable({
  providedIn: "root",
})
export class FetchService {
  baseUrl = this.appService.baseUrl;

  constructor(
    private http: HttpClient,
    private appService: AppService,
    private toastrService: ToastrService
  ) {}

  public getChatHistory(groupId): Observable<any> {
    const url = this.baseUrl + "/api/v1/chat/getChatHistory/" + groupId;

    return this.http.get(url).pipe(
      map((res) => res["0"]),
      catchError((e, r) => {
        this.toastrService.error(
          "Failed to load Chat History. Please try again later"
        );
        return of([]);
      })
    );
  }

  public getUserList(userId) {
    return this.http.post(this.baseUrl+"/api/v1/user/userList", {
      roleId: "all",
      userId: userId,
    });
  }

  public chatUserList(id) {
    
    let url = this.baseUrl + "/api/v1/chat/getAllGroupList/" + id;
    return this.http.get(url).pipe(
      map((res) => res),
      catchError((e, r) => {
        this.toastrService.error(
          "Failed to load Chat History. Please try again later"
        );
        return of([]);
      })
    );
  }

  public sendNewMsg(data) {
    return this.http.post(
      this.baseUrl+"/api/v1/chat/addMessages",
      data
    );
  }

  public memberListdetail(grpId) {
    return this.http.post(this.baseUrl+"/api/v1/chat/memberList", {
      groupId: grpId,
    });
  }

  public deleteGroup(grpId) {
    return this.http.post(this.baseUrl+"/api/v1/chat/deleteGroup", {
      groupId: grpId,
    });
  }


  public updateGroupName(grpName,grpId,image) {
    return this.http.post(this.baseUrl+"/api/v1/chat/editGroup", {
      groupName:grpName,
      groupId: grpId,
      groupImage:image
    });
  }
  public removeGroupMembers(grpId,groupMembers) {
    return this.http.post(this.baseUrl+"/api/v1/chat/removeGroupMember", {
      groupId: grpId,
      groupMembers:groupMembers,
    });
  }

  public groupImage(Img) {
    return this.http.post(this.baseUrl+"/api/v1/event/uploads",Img);
  }

  // // Login api 
  // userLogin(data: any): Observable<any> {
  //   return this.http.post(ApiUrl.LOGIN, data)
  // }

}
