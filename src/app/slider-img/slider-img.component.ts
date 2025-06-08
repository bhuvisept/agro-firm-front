import { Component, Inject, OnInit } from '@angular/core'
import { environment } from 'src/environments/environment'

import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { OwlOptions } from 'ngx-owl-carousel-o'
import { genralConfig } from '../constant/genral-config.constant'
import { GeneralServiceService } from '../core/general-service.service'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { EditCommentComponent } from '../edit-comment/edit-comment.component'
import { DeleteCommentConfirmationComponent } from '../delete-comment-confirmation/delete-comment-confirmation.component'
var leo_filter = require('leo-profanity')
@Component({
  selector: 'app-slider-img',
  templateUrl: './slider-img.component.html',
  styleUrls: ['./slider-img.component.css'],
})
export class SliderImgComponent implements OnInit {
  public postImage_path = genralConfig.networkImages.network_image
  public postVideo_path = genralConfig.networkImages.network_video
  Allposts: any
  slider: any[] = []
  reCommentListData: any[] = []
  TotalLike: any
  TotalComment: any
  modalScrollDistance = 2
  modalScrollThrottle = 50
  userImage: any
  reCommentForm = false
  rePostID: any
  userID: any
  commentPost: any[] = []
  userLikedList: any[] = []
  loggedInUser: any
  loggedIn: any
  commentList = false
  like = false
  comment = true
  createPostCommentForm: FormGroup
  RePostCommentForm: FormGroup
  customOptions: OwlOptions = {
    autoplay: false,
    center: true,
    nav: true,
    dots: false,
    loop: false,
    freeDrag: false,
    autoHeight: false,
    autoWidth: false,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    navText: ['<', '>'],
    responsive: {
      0: { items: 1, mouseDrag: false, touchDrag: false, pullDrag: false },
      600: { items: 1, mouseDrag: false, touchDrag: false, pullDrag: false },
      1000: { items: 1, mouseDrag: false, touchDrag: false, pullDrag: false },
      1366: { items: 1, mouseDrag: false, touchDrag: false, pullDrag: false },
    },
  }
  allData: any
  commentCount = genralConfig.commentCount
  postText: any
  roleName: any
  visible = false
  userObj: any
  postId: any
  postProfile = environment.URLHOST + '/uploads/enduser/'
  banner_img_path = environment.URLHOST + '/uploads/group/'
  public endUserProfileImage = environment.URLHOST + '/uploads/enduser/'

  constructor(
    private _generalService: GeneralServiceService,
    private formbuilder: FormBuilder,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<SliderImgComponent>,
    @Inject(MAT_DIALOG_DATA) public data = <dataModel>{}
  ) {}

  ngOnInit() {
    console.log("data",this.data.allData)
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.loggedInUser = this.userObj.userInfo._id
    this.userImage = this.userObj.userInfo.image
    this.loggedIn = this.userObj.userInfo.image
    this.roleName = this.userObj.userInfo.roleId.roleTitle
    this.createPostCommentForm = this.formbuilder.group({ comment: ['', Validators.required] })
    this.RePostCommentForm = this.formbuilder.group({ comment: ['', Validators.required] })
    if (this.data) {
      this.allData = this.data.allData
      if (this.allData.media.length > 0) {
        this.slider = this.allData.media
        this.postText = this.allData.caption
        if (this.slider.length > 1) {
          this.customOptions.loop = true
          this.customOptions.responsive[0].mouseDrag = true
          this.customOptions.responsive[0].touchDrag = true
          this.customOptions.responsive[0].pullDrag = true
          this.customOptions.responsive[600].mouseDrag = true
          this.customOptions.responsive[600].touchDrag = true
          this.customOptions.responsive[600].pullDrag = true
          this.customOptions.responsive[1000].mouseDrag = true
          this.customOptions.responsive[1000].mouseDrag = true
          this.customOptions.responsive[1000].touchDrag = true
          this.customOptions.responsive[1366].touchDrag = true
          this.customOptions.responsive[1366].pullDrag = true
          this.customOptions.responsive[1366].pullDrag = true
        }
      } else {
        this.postText = this.allData.caption
      }
      this.commentslist()
    } else {
      this.dialogRef.close()
    }
  }

  // this.allData.commentCount
  commentslist() {
    let data = { postId: this.allData._id, count: 3, page: 1, userId: this.loggedInUser }
    this._generalService.getPostCommentListDetails(data).subscribe(
      (response) => {
        if (response['code'] == 200) this.commentPost = response.data
        else this.toastr.warning(response['message'])
        this.spinner.hide()
      },
      () => {
        this.spinner.hide()
        this.toastr.warning('Server Error')
      }
    )
  }

  onNoClick(): void {
    let data = { totalLikes: this.allData.totalLike, totalCommentWithReComments: this.allData.totalCommentWithReComment, isLiked: this.allData.isLiked }
    this.dialogRef.close(data)
  }

  getId(list) {
    this.reCommentForm = list._id
    this.rePostID = list._id
  }
  reCommentList(list, index) {
    this.rePostID = list._id
    let data = { postId: this.allData._id, userId: this.loggedInUser, commentId: this.rePostID }

    this._generalService.getPostCommentListDetails(data).subscribe(
      (response) => {
        this.reCommentListData = response['data']
        list.reCommentArr.push(...this.reCommentListData)
      },
      () => this.toastr.success('Server Error')
    )
  }

  RecommentPostInfo(list, index) {
    let text
    if (this.RePostCommentForm.value.comment) text = this.RePostCommentForm.value.comment.trim()
    let data = {}
    if (!text) return false
    else {
      this.RePostCommentForm.reset()
      text = leo_filter.clean(text)
      data = { postId: this.allData._id, commentId: this.rePostID, comment: text, userId: this.loggedInUser, userName: this.userObj.userInfo.personName, userImage: this.userObj.userInfo.image }
    }

    let reCommentDone = { comment: text, image: this.loggedIn, personName: this.userObj.userInfo.personName, userId: this.loggedInUser, isEdited: false, isMyComment: true }
    this._generalService.ReCommentAdd(data).subscribe(
      (response) => {
        if (response['code'] == 200) {
          let reCommentDone = {
            comment: text,
            image: this.loggedIn,
            personName: this.userObj.userInfo.personName,
            userId: this.loggedInUser,
            isEdited: false,
            isMyComment: true,
            _id: response.data._id,
          }
          list.reCommentArr.push(reCommentDone)

          this.RePostCommentForm.reset()
          data = {}
          text = ''
        } else this.toastr.success(response.message)
        this.spinner.hide()
      },
      () => {
        this.spinner.hide()
        this.toastr.success('Server Error')
      }
    )
  }
  commentPostInfo(commentPost) {
    let text
    if (this.createPostCommentForm.value.comment) text = this.createPostCommentForm.value.comment.trim()
    let data = {}
    if (!text) return false
    else {
      // this.index = i
      this.createPostCommentForm.reset()
      text = leo_filter.clean(text)
      data = { userId: this.userObj.userInfo._id, postId: this.allData._id, comment: text, userName: this.userObj.userInfo.personName, userImage: this.loggedIn }
    }

    this._generalService.commentPostDetails(data).subscribe(
      (response) => {
        if (response['code'] == 200) {
          let commentpostData = {
            comment: text,
            image: this.loggedIn,
            personName: this.userObj.userInfo.personName,
            userId: this.loggedInUser,
            _id: response['data']._id,
            isEdited: false,
            isMyComment: true,
            reCommentArr: [],
            totalReComment: 0,
          }
          // this.homePostList[i].totalComment++
          // this.homePostList[i].totalCommentWithReComment++
          commentPost.unshift(commentpostData)
          this.allData.totalCommentWithReComment++
          this.commentList = true

          text = null
        } else this.toastr.warning(response['message'])
      },
      () => this.toastr.warning('Server Error')
    )
  }
  editComment(comment, type) {
    this.dialog
      .open(EditCommentComponent, { width: '600px', data: { postId: this.allData._id, userId: this.loggedInUser, commentId: comment } })
      .afterClosed()
      .subscribe((result) => {
        if (result && result.comment) {
          if (type == 'COMMENT') {
            comment.comment = result.comment
            comment.isEdited = true
          } else {
            comment.comment = result.comment
            comment.comment.isEdited = true
          }
        }
      })
  }
  deleteComment(Commentindex, comment, type) {
    const dialogRef = this.dialog.open(DeleteCommentConfirmationComponent, { width: '450px', data: { postId: this.allData._id, userId: this.loggedInUser, commentId: comment[Commentindex]._id } })
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.apiHit) {
        if (type == 'COMMENT') {
          this.allData.totalCommentWithReComment--
          this.allData.totalComment--
          this.commentslist()
          comment.splice(Commentindex, 1)
        } else {
         
          this.allData.totalCommentWithReComment--
          this.allData.totalComment--
          this.commentslist()
          comment.splice(Commentindex, 1)
        }
      }
    })
  }
  getPostCommentList() {
    let data = { userId: this.userObj.userInfo._id, postId: this.allData._id, count: 3 }
    this._generalService.getPostLikeDetails(data).subscribe(
      (response) => {
        if (response['code'] == 200) {
          this.userLikedList = response['data']
        } else if (response['code'] == 405) {
          this.dialogRef.close({ routeBack: true })
          this.toastr.warning(response['message'])
        } else {
          this.toastr.warning(response['message'])
          this.dialogRef.close()
        }
      },
      () => {
        this.toastr.warning('Server Error')
      }
    )
  }
  showLike() {
    this.getPostCommentList()
    this.comment = false
    this.like = true
    this.userLikedList = []
  }
  showComment() {
    this.like = false
    this.comment = true
    this.userLikedList = []
  }
  likePostInfo(posts, index) {
    let data = {
      userId: this.userObj.userInfo._id,
      postId: posts._id,
      liked: true,
      isActive: posts.isLiked ? false : true,
      userName: this.userObj.userInfo.personName,
      userImage: this.userObj.userInfo.image,
    }
    this._generalService.likePostDetails(data).subscribe(
      (response) => {
        if (response['code'] == 200) {
          this.allData.totalLike = response.data.totalLike
          this.allData.isLiked = response.data.isLiked
          this.allData.totalDislike = response.data.totalDislike
          this.allData.isDeleted = response.data.isDeleted
          this.allData.isDislike = response.data.isDislike
        } else this.toastr.warning(response['message'])
      },
      () => this.toastr.warning('Server Error')
    )
  }
  readMoreRecomment() {
    let id = `Relist`
    let readMore = `RelistComment`
    document.getElementById(id).classList.toggle('post_caption_two')
    document.getElementById(readMore).classList.add('d-none')
  }
  getPostCommentListmore(allData) {
    this.allData.commentPage++
console.log( this.allData.commentPage,"------------------------111111111111111")
    let data = { postId: allData._id, userId: this.loggedInUser, page: this.allData.commentPage, count: 3 }

    this._generalService.getPostCommentListDetails(data).subscribe(
      (response) => {
        if (response['code'] == 200) {
          this.commentPost.push(...response['data'])
          //this.commentPostList = response['data']
          // this.homePostList[i].comments.push(...this.commentPostList)
          // this.homePostList[i].commentPage++
          console.log(this.commentPost,"----------------------------")
        } else this.toastr.warning(response['message'])
      },
      () => this.toastr.warning('Server Error')
    )
  }
  readMoreshr(value) {
    let id = `captionshr`
    let more = `moreshr`
    document.getElementById(id).classList.toggle('post_caption')
    document.getElementById(more).classList.add('d-none')
  }
  innerRecomment(value) {
    let id = `innerRecomment`
    let readMore = `innerRecommentID`
    document.getElementById(id).classList.toggle('post_caption_two')
    document.getElementById(readMore).classList.add('d-none')
  }
}

interface dataModel {
  // postId: number;
  // userId: number;
  media: boolean
  allData: {}
}
