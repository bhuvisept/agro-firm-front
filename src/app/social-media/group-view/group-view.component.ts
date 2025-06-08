import { ChangeDetectorRef, Component, Inject, NgZone, OnInit, Renderer2 } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { environment } from 'src/environments/environment'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { CreateGroupPostConfirmationDialogComponent } from '../../../app/create-group-post-confirmation-dialog/create-group-post-confirmation-dialog.component'
import { MatDialog } from '@angular/material/dialog'
import { EditGroupPostConfirmationDialogComponent } from '../../edit-group-post-confirmation-dialog/edit-group-post-confirmation-dialog.component'
import { DeleteGroupPostConfirmationDialogComponent } from '../../delete-group-post-confirmation-dialog/delete-group-post-confirmation-dialog.component'
import { SliderImgComponent } from 'src/app/slider-img/slider-img.component'
import { DeleteCommentConfirmationComponent } from 'src/app/delete-comment-confirmation/delete-comment-confirmation.component'
import { EditCommentComponent } from 'src/app/edit-comment/edit-comment.component'
import { TotalCommentDialogComponent } from 'src/app/total-comment-dialog/total-comment-dialog.component'
import { ReportPostComponent } from 'src/app/report-post/report-post.component'
const Filter = require('bad-words')
const customFilter = new Filter({ regex: /\*|\.|$/gi })
@Component({
  selector: 'app-group-view',
  templateUrl: './group-view.component.html',
  styleUrls: ['./group-view.component.css'],
  providers: [NgxSpinnerService],
})
export class GroupViewComponent implements OnInit {
  public banner_img_path = environment.URLHOST + '/uploads/group/'
  public group_Image_path = environment.URLHOST + '/uploads/group/'
  public enduser_url_profile = environment.URLHOST + '/uploads/enduser/'
  public image_url_profile = environment.URLHOST + '/uploads/group/coverImage/'
  public endUser_profile = environment.URLHOST + '/uploads/enduser/'
  public networkImages = genralConfig.networkImages.network_image
  public postVideo_path = genralConfig.networkImages.network_video

  createPostCommentForm: FormGroup
  roleName: any
  userObj: any
  userId: any
  groupId: any
  invitedList = []
  selectedInvitedPersonArr: any = []
  commentPostList: any[] = []
  getGroupDetails: any
  groupPostList: any
  userInfo: any
  getGroupTotleList: any
  admin: any
  indexof: any
  length: any
  index: any
  loggedInUser: any
  userName
  admin_id: any
  ownerId
  count: number = 9
  page: number = 1
  postList = []
  scrollDistance = 2
  throttle = 49
  userImage: string
  postIndex: any
  postIdComment: any
  RePostCommentForm: FormGroup
  reCommentForm: any
  rePostID: any
  reCommentListData: any
  modalScrollDistance = 2
  modalScrollThrottle = 50
  modalOpen: boolean
  invitationPage = 1
  inviteSearch: any
  clickOnce: boolean = true
  groupRequestLists = []
  GroupRequestPage = 1
  commentCount = genralConfig.commentCount
  isCommentShow = false
  constructor(
    private _generalService: GeneralServiceService,
    private formbuilder: FormBuilder,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef
  ) {
    setTimeout(() => this.ngZone.run(() => this.changeDetector.detectChanges()))
  }

  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.loggedInUser = this.userObj.userInfo._id
    this.route.params.subscribe((params) => (this.groupId = params.Id))
    this.getGroupList()
    this.GroupDetails()
    this.userName = this.userObj.userInfo.personName
    this.userId = this.userObj
    this.roleName = this.userObj.userInfo.roleId.roleTitle
    this.userImage = this.userObj.userInfo.image
    this.createPostCommentForm = this.formbuilder.group({ comment: [''] })
    this.RePostCommentForm = this.formbuilder.group({ comment: ['', Validators.required] })
    this.renderer.addClass(this.document.body, 'remove-sidebar-with-profile')
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'remove-sidebar-with-profile')
  }
  getGroupList() {
    this._generalService.getGroupListDetails({ userId: this.loggedInUser, count: 1000 }).subscribe(
      (response) => response['code'] == genralConfig.statusCode.ok && (this.getGroupTotleList = response['data']),
      () => this.toastr.error('Server Error')
    )
  }

  GroupDetails() {
    let data = { groupId: this.groupId, userId: this.loggedInUser, count: this.count, page: this.page }
    this.spinner.show()
    this._generalService.getCompanyGroupDetails(data).subscribe(
      (response) => {
        if (response['code'] == 200) {
          this.getGroupDetails = response['data']
          this.ownerId = this.getGroupDetails.createdById
          this.getGroupDetails.postData = this.getGroupDetails.postData.map((item) => {
            let data = item.caption.match(/\n/gi)
            if (data) item.isreadMore = data.length
            item.captionTwo = item.caption.replace(/\n/gi, '<br>')
            if (item.orignalPostData && item.orignalPostData.caption) item.orignalPostData.caption = item.orignalPostData.caption.replace(/\n/gi, '<br>')
            return item
          })
          this.postList.push(...this.getGroupDetails.postData)
        }
        this.spinner.hide()
      },
      () => {
        this.spinner.hide()
        this.toastr.warning('Server Error')
      }
    )
  }

  getInvitedListButton() {
    if (this.clickOnce) {
      this.invitedList = []
      this.getInvitedList()
      this.clickOnce = false
    }
  }

  likePostInfo(posts, index) {
    let data = { liked: true, postId: posts._id, userId: this.userObj.userInfo._id, isActive: posts.isLiked ? false : true, userName: this.userObj.userInfo.personName }
    this._generalService.likePostDetails(data).subscribe(
      (response) => {
        if (response['code'] == 200) {
          this.postList[index].totalLike = response.data.totalLike
          this.postList[index].isLiked = response.data.isLiked
          this.postList[index].isDislike = response.data.isDislike
        } else this.toastr.warning('', response['message'])
      },
      () => this.toastr.warning('Server Error')
    )
  }

  // imagesView(postData, img) {
  //   let newArry = []
  //   newArry.push(...postData)
  //   newArry.unshift(img)
  //   let uniqueChars = [...new Set(newArry)]
  //   const dialogRef = this.dialog.open(SliderImgComponent, {
  //     width: '750px',
  //     panelClass: 'my-dialog-creat-post',
  //     data: { postData: uniqueChars },
  //   })  this.isCommentShow = true
  // }
  imagesViewForText(postData, posts, Postindex) {
    // this.isCommentShow = false
    // this.postList[Postindex].commentPage = 1
    // const dialogRef=this.dialog.open(SliderImgComponent, { width: '1200px',height:'600px', panelClass: 'my-dialog-creat-post',  data: { postId: posts._id, userId: this.loggedInUser,media:false } })
    // dialogRef.afterClosed().subscribe((result)=>{
    //    this.postList[Postindex].totalLike=result.totalLikes
    //    this.postList[Postindex].totalCommentWithReComment=result.totalCommentWithReComments
    //    this.postList[Postindex].isLiked=result.isLiked
    // })

    this.spinner.show()
    this.isCommentShow = false
    this.postList[Postindex].commentPage = 1

    let data = { postId: posts._id, userId: this.loggedInUser }
    this._generalService.PostsList(data).subscribe(
      (response) => {
        if (response['code'] == 200) {
          let allData = response['data']
          this.spinner.hide()
          const dialogRef = this.dialog.open(SliderImgComponent, { width: '1200px', height: '600px', panelClass: 'my-dialog-creat-post', data: { media: false, allData: allData } })
          dialogRef.afterClosed().subscribe((result) => {
            this.postList[Postindex].totalLike = result.totalLikes
            this.postList[Postindex].totalCommentWithReComment = result.totalCommentWithReComments
            this.postList[Postindex].isLiked = result.isLiked
          })
        } else this.toastr.warning(response['message'])
        this.spinner.hide()
      },
      () => {
        this.spinner.hide()
        this.toastr.warning('Server Error')
      }
    )
  }

  imagesView(postData, img, posts, Postindex: number) {
    // this.postList[Postindex].commentPage = 1
    // this.isCommentShow = false
    // const dialogRef = this.dialog.open(SliderImgComponent, { width: '1200px', height: '600px', panelClass: 'my-dialog-creat-post', data: { postId: posts._id, userId: this.loggedInUser, media: true } })
    // dialogRef.afterClosed().subscribe((result) => {
    //   this.postList[Postindex].totalLike = result.totalLikes
    //   this.postList[Postindex].totalCommentWithReComment = result.totalCommentWithReComments
    //   this.postList[Postindex].isLiked = result.isLiked
    // })

    this.spinner.show()
    this.postList[Postindex].commentPage = 1
    this.isCommentShow = false
    let data = { postId: posts._id, userId: this.loggedInUser }
    this._generalService.PostsList(data).subscribe(
      (response) => {
        if (response['code'] == 200) {
          let allData = response['data']
          const dialogRef = this.dialog.open(SliderImgComponent, { width: '1200px', height: '600px', panelClass: 'my-dialog-creat-post', data: { media: true, allData: allData } })
          dialogRef.afterClosed().subscribe((result) => {
            this.postList[Postindex].totalLike = result.totalLikes
            this.postList[Postindex].totalCommentWithReComment = result.totalCommentWithReComments
            this.postList[Postindex].isLiked = result.isLiked
          })
        } else this.toastr.warning(response['message'])
        this.spinner.hide()
      },
      () => {
        this.spinner.hide()
        this.toastr.warning('Server Error')
      }
    )
  }

  // For Reset InviteConnection
  reset() {
    this.invitationPage = 1
    this.invitedList = []
    this.inviteSearch = ''
    this.getInvitedList()
    this.clickOnce = true
  }

  getInvitedListSearch() {
    this.invitationPage = 1
    this.invitedList = []
    this.getInvitedList()
  }

  getInvitedList() {
    let data = { userId: this.userObj.userInfo._id, groupId: this.groupId, page: this.invitationPage, searchText: this.inviteSearch }
    this.spinner.show()
    this._generalService.getInvitedListDetails(data).subscribe(
      (response) => {
        if (response['code'] == 200) {
          this.invitedList.push(...response['data'])
          this.spinner.hide()
        } else {
          this.toastr.warning(response['message'])
          this.spinner.hide()
        }
      },
      () => {
        this.toastr.error('Server Error')
        this.spinner.hide()
      }
    )
  }

  sendInviteList(event, list) {
    if (event.checked) {
      this.selectedInvitedPersonArr.push(list)
    } else {
      this.selectedInvitedPersonArr = this.selectedInvitedPersonArr.filter((data) => data != list)
    }
  }

  onSubmit() {
    let data = {
      sendBy: this.userObj.userInfo._id,
      groupId: this.groupId,
      sendTo: this.selectedInvitedPersonArr,
      userName: this.userObj.userInfo.personName,
      userImage: this.userObj.userInfo.image,
      groupName: this.getGroupDetails.name,
    }
    this.spinner.show()
    this._generalService.sendMultipalInvation(data).subscribe((response) => {
      this.spinner.hide()
      if (response['code'] == 200) {
        this.invitedList = response['data']
        this.toastr.success('', response['message'])
        this.invitedList = []
        this.invitationPage = 1
        this.getInvitedList()
        this.selectedInvitedPersonArr = []
      } else {
        this.toastr.warning('', response['message'])
        this.spinner.hide()
      }
    })
    ;() => {
      this.toastr.warning('Server Error')
      this.spinner.hide()
    }
  }

  getGroupListView() {
    let data = { groupId: this.groupId, userId: this.userObj.userInfo._id }
    this._generalService.getgroupPostList(data).subscribe((response) => {
      if (response['code'] == 200) {
        this.groupPostList = response['data']
      } else {
        this.toastr.warning(response['message'])
      }
    })
    ;(error) => {
      this.toastr.warning('Server Error')
    }
  }

  createPostInfo(data) {
    const dialogRef = this.dialog.open(CreateGroupPostConfirmationDialogComponent, {
      width: '558px',
      data: { groupId: this.groupId, type: data, groupDetails: this.getGroupDetails },
      panelClass: 'my-dialog-creat-post',
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.apiHit == true) {
        this.postList = []
        this.page = 1
        this.GroupDetails()
      }
    })
  }

  editPostInfo(postId, index) {
    const dialogRef = this.dialog.open(EditGroupPostConfirmationDialogComponent, {
      width: '558px',
      data: postId,
      panelClass: 'my-dialog-creat-post',
    })
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.apiHit) {
        let data = result.caption.match(/\n/gi)
        if (data) {
          result.isreadMore = data.length
        }
        result.captionTwo = result.caption.replace(/\n/gi, '<br>')
        this.postList[index].media = result.media
        this.postList[index].captionTwo = result.captionTwo
        this.postList[index].caption = result.caption
        if (data) {
          this.postList[index].isreadMore = result.isreadMore
        }
      }
    })
  }

  reportPostInfo(postId, index) {
    this.dialog
      .open(ReportPostComponent, { width: '558px', panelClass: 'my-dialog-creat-post', data: { postId: postId } })
      .afterClosed()
      .subscribe((result) => result && result.apiHit == true && this.postList.splice(index, 1))
  }

  deletePostList(postdata, index) {
    const dialogRef = this.dialog.open(DeleteGroupPostConfirmationDialogComponent, {
      width: '450px',
      data: { postId: postdata._id, userId: this.loggedInUser, groupId: this.groupId, postedById: postdata.postedById },
      panelClass: 'my-dialog-creat-post',
    })
    dialogRef.afterClosed().subscribe((result) => {
      this.spinner.show()

      if (result && result.apiHit) {
        this.postList.splice(index, 1)
        this.spinner.hide()
      } else {
        this.spinner.hide()
      }
    })
  }

  removemember(memberID) {
    let data = {
      invitationId: memberID._id,
      userId: memberID.userId,
      groupId: this.groupId,
      actionType: 'REMOVEMEMBER',
      loggedInUserId: this.loggedInUser,
    }

    this.spinner.show()
    this._generalService.removedmember(data).subscribe((response) => {
      this.spinner.hide()
      if (response['code'] == 200) {
        this.toastr.success('', response['message'])
        this.getGroupDetails.totalMembers--
        this.getGroupListView()
      } else {
        this.toastr.warning('', response['message'])
      }
    })
  }

  refreshapi(element) {
    if (element !== this.groupId) {
      this.groupId = element
      this.postList = []
      this.groupRequestLists = []
      this.page = 1
      this.invitationPage = 1
      this.GroupRequestPage = 1
      this.GroupDetails()
      this.clickOnce = true
      window.scroll(0, 0)
    }
  }

  onScrollDown() {
    if (this.getGroupDetails && this.getGroupDetails.postData && this.getGroupDetails.postData.length) {
      this.page += 1
      this.GroupDetails()
    }
  }

  getPostCommentList(postId, i) {
    this.postIdComment = postId._id
    this.postIndex = i
    let data = {
      postId: postId._id,
      count: this.commentCount,
      page: 1,
      userId: this.loggedInUser,
    }
    this.isCommentShow = true
    if (postId.commentPage == 1) {
      this._generalService.getPostCommentListDetails(data).subscribe(
        (response) => {
          if (response['code'] == 200) {
            this.postList[i].comments = []
            this.commentPostList = response['data']
            this.postList[i].comments.push(...this.commentPostList)
            this.postList[i].commentPage++
          } else {
            this.spinner.hide()
            this.toastr.warning(response['message'])
          }
        },
        (error) => {
          this.spinner.hide()
          this.toastr.warning('Server Error')
        }
      )
    }
  }

  // Add Comment
  commentPostInfo(posts, i) {
    let text
    let data = {}
    if (this.createPostCommentForm.value.comment) text = this.createPostCommentForm.value.comment.trim()
    if (!text) return false
    else {
      this.createPostCommentForm.reset()
      text = customFilter.clean(text)
      data = { userId: this.loggedInUser, postId: posts._id, comment: text, userName: this.userObj.userInfo.personName, userImage: this.userObj.userInfo.image }
    }
    this._generalService.commentPostDetails(data).subscribe((response) => {
      if (response['code'] == 200) {
        let commentpostData = {
          comment: text,
          image: this.userImage,
          personName: this.userName,
          userId: this.loggedInUser,
          _id: response['data']._id,
          isEdited: false,
          isMyComment: true,
          reCommentArr: [],
          totalReComment: 0,
        }
        this.postList[i].totalComment++
        this.postList[i].totalCommentWithReComment++
        this.postList[i].comments.unshift(commentpostData)
        this.createPostCommentForm.reset()
        text = null
      }
    })
  }

  readMore(index, value) {
    let id = `caption${index}`
    let more = `more${index}`
    document.getElementById(id).classList.toggle('post_caption')
    document.getElementById(more).classList.add('d-none')
  }
  readMoreRecomment(index, value) {
    let id = `Relist${index}`
    let readMore = `RelistComment${index}`
    document.getElementById(id).classList.toggle('post_caption_two')
    document.getElementById(readMore).classList.add('d-none')
  }

  innerRecomment(index, value) {
    let id = `innerRecomment${index}`
    let readMore = `innerRecommentID${index}`
    document.getElementById(id).classList.toggle('post_caption_two')
    document.getElementById(readMore).classList.add('d-none')
  }

  getId(list) {
    this.reCommentForm = list._id
    this.rePostID = list._id
  }

  //RecommentPostInfo
  RecommentPostInfo(post, index, postIndex) {
    let text
    if (this.RePostCommentForm.value.comment) text = this.RePostCommentForm.value.comment.trim()
    let data = {}
    if (!text) return false
    else {
      this.RePostCommentForm.reset()
      text = customFilter.clean(text)
      data = { postId: post._id, commentId: this.rePostID, comment: text, userId: this.loggedInUser }
    }
    this._generalService.ReCommentAdd(data).subscribe(
      (response) => {
        if (response['code'] == 200) {
          let reCommentDone = { comment: text, image: this.userImage, personName: this.userName, userId: this.loggedInUser, isEdited: false, isMyComment: true, _id: response.data._id }
          this.postList[postIndex].comments[index].reCommentArr.push(reCommentDone)
          this.postList[postIndex].totalComment++
          this.postList[postIndex].comments[index].totalReComment++
          this.postList[postIndex].totalCommentWithReComment++
          this.RePostCommentForm.reset()
          text = null
          data = {}
        } else this.toastr.warning(response.message)
        this.spinner.hide()
      },
      () => this.spinner.hide()
    )
  }

  reCommentList(list, i, index) {
    this.rePostID = list._id
    let data = { postId: this.postIdComment, commentId: this.rePostID, page: this.postList[i].comments[index].page, userId: this.loggedInUser, count: this.commentCount }
    this._generalService.getPostCommentListDetails(data).subscribe(
      (response) => {
        if (response['code'] == 200) {
          this.reCommentListData = response['data']
          this.postList[i].comments[index].reCommentArr.push(...this.reCommentListData)
          this.postList[i].comments[index].page++
        } else this.toastr.warning(response.message)
        this.spinner.hide()
      },
      () => {
        this.spinner.hide()
        this.toastr.warning('Server Error')
      }
    )
  }

  onModalScrollDown() {
    this.invitationPage++
    this.getInvitedList()
  }

  toggleModal() {
    this.modalOpen = !this.modalOpen
  }

  getPostCommentListmore(postId, i) {
    this.postIdComment = postId._id
    this.postIndex = i
    let data = { postId: postId._id, page: this.postList[i].commentPage, count: this.commentCount, userId: this.loggedInUser }
    this.spinner.show()
    this._generalService.getPostCommentListDetails(data).subscribe(
      (response) => {
        if (response['code'] == 200) {
          this.commentPostList = response['data']
          this.postList[i].comments.push(...this.commentPostList)
          this.postList[i].commentPage++
        } else this.toastr.warning(response['message'])
        this.spinner.hide()
      },
      () => this.spinner.hide()
    )
  }

  deleteComment(postId, Postindex, Commentindex, reCommentIndex, commentId, type) {
    this.dialog
      .open(DeleteCommentConfirmationComponent, { width: '450px', data: { postId: postId, userId: this.loggedInUser, commentId: commentId } })
      .afterClosed()
      .subscribe((result) => {
        if (result && result.apiHit) {
          if (type == 'COMMENT') {
            this.postList[Postindex].totalComment--
            let totalComment = this.postList[Postindex].totalCommentWithReComment - (this.postList[Postindex].comments[Commentindex].totalReComment + 1)
            this.postList[Postindex].totalCommentWithReComment = totalComment
            this.postList[Postindex].comments.splice(Commentindex, 1)
          } else {
            this.postList[Postindex].comments[Commentindex].reCommentArr.splice(reCommentIndex, 1)
            this.postList[Postindex].comments[Commentindex].totalReComment--
            this.postList[Postindex].totalCommentWithReComment--
          }
        }
      })
  }

  // edit Comment
  editComment(postId, Postindex, Commentindex, reCommentIndex, comment, type) {
    this.dialog
      .open(EditCommentComponent, { width: '600px', panelClass: 'my-dialog-creat-post', data: { postId: postId, userId: this.loggedInUser, commentId: comment } })
      .afterClosed()
      .subscribe((result) => {
        if (result && result.comment) {
          if (type == 'COMMENT') {
            this.postList[Postindex].comments[Commentindex].comment = result.comment
            this.postList[Postindex].comments[Commentindex].isEdited = true
          } else {
            this.postList[Postindex].comments[Commentindex].reCommentArr[reCommentIndex].comment = result.comment
            this.postList[Postindex].comments[Commentindex].reCommentArr[reCommentIndex].isEdited = true
          }
        }
      })
  }

  totalLikeInfo(postId, post) {
    if (post.totalLike) {
      this.dialog
        .open(TotalCommentDialogComponent, { width: '558px', data: { postId: postId, likedCount: post.totalLike } })
        .afterClosed()
        .subscribe((res) => res && res.routeBack && this.router.navigate(['/layout/social-media/group-list']))
    }
  }

  groupRequestListPageUpdate() {
    this.groupRequestLists = []
    this.GroupRequestPage = 1
    this.groupRequestList()
  }
  groupRequestList() {
    let data = { userId: this.loggedInUser, groupId: this.groupId, count: 10, page: this.GroupRequestPage }
    this._generalService.groupRequestList(data).subscribe(
      (res) => {
        if (res.code == 200) this.groupRequestLists.push(...res['data'])
        else this.toastr.error(res.message)
      },
      () => this.toastr.error('Server Error')
    )
  }

  requestToJoin() {
    let data = { userId: this.loggedInUser, groupId: this.groupId }
    this.spinner.show()
    this._generalService.groupRequest(data).subscribe(
      (res) => {
        if (res.code == 200) this.getGroupDetails.status = 'REQUESTED'
        else this.toastr.warning(res.message)
        this.spinner.hide()
      },
      () => {
        this.spinner.hide()
        this.toastr.warning('Server Error')
      }
    )
  }

  acceptGroupJoinRequest(userId, Type, index) {
    let data = { loggedInUserId: this.loggedInUser, groupId: this.groupId, action: Type, userId: userId }
    this.spinner.show()
    this._generalService.groupRequestAccept(data).subscribe(
      (res) => {
        if (res.code == 200) {
          if (data.userId === data.loggedInUserId && Type == 'DECLINE') this.getGroupDetails.status = 'JOIN'
          else {
            this.groupRequestLists.splice(index, 1)
            if (Type == 'ACCEPT') this.getGroupDetails.totalMembers++
            this.getGroupDetails.totalRequests--
          }
        } else this.toastr.warning(res.message)
        this.spinner.hide()
      },
      () => {
        this.spinner.hide()
        this.toastr.warning('Server Error')
      }
    )
  }

  onAcceptInvitation() {
    let data = { invitationId: this.getGroupDetails.invitationId, userId: this.loggedInUser }
    this._generalService.acceptInvitation(data).subscribe(
      (response) => {
        if (response['code'] == 200) {
          this.page = 1
          this.GroupDetails()
        } else this.toastr.success(response['message'])
      },
      () => this.toastr.success('Server Error')
    )
  }

  onIgnoreInvitation() {
    let data = { invitationId: this.getGroupDetails.invitationId, userId: this.loggedInUser }
    this.spinner.show()
    this._generalService.ignoreInvitation(data).subscribe(
      (response) => {
        if (response['code'] == 200) this.getGroupDetails.status = 'JOIN'
        else this.toastr.warning(response['message'])
        this.spinner.hide()
      },
      () => {
        this.spinner.hide()
        this.toastr.warning('Server Error')
      }
    )
  }

  joinGroupPublic() {
    let data = { userId: this.loggedInUser, groupId: this.groupId }
    this.spinner.show()
    this._generalService.joinGroupPublic(data).subscribe(
      (response) => {
        if (response['code'] == 200) {
          this.page = 1
          this.GroupDetails()
        } else this.toastr.warning(response['message'])
        this.spinner.hide()
      },
      () => {
        this.spinner.hide()
        this.toastr.warning('Server Error')
      }
    )
  }

  onModalScrollDownGroupRequest() {
    if (this.getGroupDetails.totalRequests > this.groupRequestLists.length) {
      this.GroupRequestPage++
      this.groupRequestList()
    }
  }
}
