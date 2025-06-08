import { Component, OnInit, Input, ChangeDetectorRef, NgZone } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { environment } from 'src/environments/environment'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { CreatePostConfirmationDialogComponent } from 'src/app/create-post-confirmation-dialog/create-post-confirmation-dialog.component'
import { MatDialog } from '@angular/material/dialog'
import { EditPostConfirmationDialogComponent } from '../../../edit-post-confirmation-dialog/edit-post-confirmation-dialog.component'
import { SharePostConfirmationDialogComponent } from '../../../share-post-confirmation-dialog/share-post-confirmation-dialog.component'
import { DeletePostConfirmationDialogComponent } from '../../../delete-post-confirmation-dialog/delete-post-confirmation-dialog.component'
import { ReportPostComponent } from 'src/app/report-post/report-post.component'
import { SliderImgComponent } from 'src/app/slider-img/slider-img.component'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { DeleteCommentConfirmationComponent } from 'src/app/delete-comment-confirmation/delete-comment-confirmation.component'
import { EditCommentComponent } from 'src/app/edit-comment/edit-comment.component'
import { TotalCommentDialogComponent } from '../../../total-comment-dialog/total-comment-dialog.component'
import translate from 'translate'
import { Console } from 'console'
import { CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY } from '@angular/cdk/overlay/typings/overlay-directives'
var leo_filter = require('leo-profanity')

translate.engine = 'google'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [NgxSpinnerService],
})
export class DashboardComponent implements OnInit {
  @Input() public
  createPostCommentForm: FormGroup
  RePostCommentForm: FormGroup
  userId: any
  userInfo: any
  userObj: any
  homePostList: any = []
  pageNumber = 1
  homePostListImage: any
  userName: any
  commentList = false
  reCommentListData = []

  postProfile = environment.URLHOST + '/uploads/enduser/'
  networkImages = environment.URLHOST + '/uploads/post/image/'
  banner_img_path = environment.URLHOST + '/uploads/group/'
  postImage_path = genralConfig.networkImages.network_image
  postVideo_path = genralConfig.networkImages.network_video

  postId: any
  commentpost: any
  commentPostList: any[] = []
  scrollDistance = 2
  throttle = 49
  sum: any
  count = 10
  postTotalCount: any
  ROLETITLE: any
  loggedIn: any
  isCommentShow = false
  index: any[]
  loggedInUser: any
  listData
  postLength
  userImage: any
  reCommentForm = false
  rePostID: any
  postIdComment
  page = 1
  truckNews: any
  commentCount = genralConfig.commentCount
  constructor(
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    private _generalService: GeneralServiceService,
    private formbuilder: FormBuilder,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    setTimeout(() => this.zone.run(() => this.cdr.detectChanges()))
  }

  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.getPostList()
    this.ROLETITLE = this.userObj.userInfo.roleId.roleTitle
    this.loggedIn = this.userObj.userInfo.image
    this.loggedInUser = this.userObj.userInfo._id
    this.userName = this.userObj.userInfo.personName
    this.userImage = this.userObj.userInfo.image
    this.createPostCommentForm = this.formbuilder.group({ comment: ['', Validators.required] })
    this.RePostCommentForm = this.formbuilder.group({ comment: ['', Validators.required] })
    this._generalService.getTruckNews('').subscribe((res) => res['code'] == 200 && (this.truckNews = res['data'].item))
  }

  //comment translation function
  async seeTranalation(comment, postIndex, commentIndex, trans) {
    let data = await translate(comment, { to: 'pa' })
    this.homePostList[postIndex].comments[commentIndex].translation = data
    this.homePostList[postIndex].comments[commentIndex].seeTrans = !trans
  }

  //comment translation function
  async seeTranalationRecomment(comment, postIndex, parentcomment, commentIndex, trans) {
    let data = await translate(comment, { to: 'pa' })
    this.homePostList[postIndex].comments[parentcomment].reCommentArr[commentIndex].translation = data
    this.homePostList[postIndex].comments[parentcomment].reCommentArr[commentIndex].seeTrans = !trans
  }

  createPostInfo() {
    const dialogRef = this.dialog.open(CreatePostConfirmationDialogComponent, { width: '558px', panelClass: 'my-dialog-creat-post', data: 'Are you sure you want to archive this post?' })
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.apiHit == true) {
        this.pageNumber = 1
        this.homePostList = []
        this.getPostList()
      }
    })
  }

  reportPostInfo(postId, index) {
    this.dialog
      .open(ReportPostComponent, { width: '558px', panelClass: 'my-dialog-creat-post', data: { postId: postId } })
      .afterClosed()
      .subscribe((result) => result && result.apiHit == true && this.homePostList.splice(index, 1))
  }
  editPostInfo(postId, index) {
    const dialogRef = this.dialog.open(EditPostConfirmationDialogComponent, { width: '558px', data: postId, panelClass: 'my-dialog-creat-post' })
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.apiHit) {
        let data = result.caption.match(/\n/gi)
        if (data) result.isreadMore = data.length
        result.captionTwo = result.caption.replace(/\n/gi, '<br>')
        this.homePostList[index].media = result.media
        this.homePostList[index].captionTwo = result.captionTwo
        this.homePostList[index].caption = result.caption
        if (data) this.homePostList[index].isreadMore = result.isreadMore
      }
    })
  }

  onScrollDown() {
    this.count = 9
    if (this.postTotalCount > this.postLength) {
      this.pageNumber += 1
      this.getPostList()
    }
  }
  getPostList() {
    let data = { userId: this.userObj.userInfo._id, count: this.count, page: this.pageNumber }
    this.spinner.show()
    this._generalService.getHomePagePostList(data).subscribe(
      (response) => {
        if (response['code'] == 200) {
          this.postTotalCount = response.totalCount
          this.listData = response['data']
          this.listData = this.listData.map((item) => {
            let data = item.caption.match(/\n/gi)
            if (data) item.isreadMore = data.length
            item.captionTwo = item.caption.replace(/\n/gi, '<br>')
            if (item.orignalPostData && item.orignalPostData.caption) item.orignalPostData.caption = item.orignalPostData.caption.replace(/\n/gi, '<br>')
            return item
          })
          this.homePostList.push(...this.listData)
          // console.log(this.homePostList.forEach(element => {
          // }))
          this.postLength = this.homePostList.length
        }
        this.spinner.hide()
      },
      () => {
        this.toastr.error('Server Error')
        this.spinner.hide()
      }
    )
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
          this.homePostList[index].totalLike = response.data.totalLike
          this.homePostList[index].isLiked = response.data.isLiked
          this.homePostList[index].totalDislike = response.data.totalDislike
          this.homePostList[index].isDeleted = response.data.isDeleted
          this.homePostList[index].isDislike = response.data.isDislike
        } else this.toastr.warning(response['message'])
      },
      () => this.toastr.warning('Server Error')
    )
  }
  getPostCommentList(postId, i: number) {
    this.postIdComment = postId._id
    let data = { postId: postId._id, count: this.commentCount, page: 1, userId: this.loggedInUser }
    this.isCommentShow = true
    if (postId.commentPage == 1) {
      this._generalService.getPostCommentListDetails(data).subscribe(
        (response) => {
          if (response['code'] == 200) {
            this.homePostList[i].comments = []
            this.commentPostList = response['data']
            this.homePostList[i].comments.push(...this.commentPostList)
            this.homePostList[i].commentPage++
          } else this.toastr.warning(response['message'])
        },
        () => this.toastr.warning('Server Error')
      )
    }
  }

  commentPostInfo(posts, i) {
    let text
    if (this.createPostCommentForm.value.comment) text = this.createPostCommentForm.value.comment.trim()
    let data = {}
    if (!text) return false
    else {
      this.index = i
      this.createPostCommentForm.reset()
      text = leo_filter.clean(text)
      data = { userId: this.userObj.userInfo._id, postId: posts._id, comment: text, userName: this.userObj.userInfo.personName, userImage: this.userObj.userInfo.image }
    }
    this._generalService.commentPostDetails(data).subscribe(
      (response) => {
        if (response['code'] == 200) {
          let commentpostData = {
            comment: text,
            image: this.loggedIn,
            personName: this.userName,
            userId: this.loggedInUser,
            _id: response['data']._id,
            isEdited: false,
            isMyComment: true,
            reCommentArr: [],
            totalReComment: 0,
          }
          this.homePostList[i].totalComment++
          this.homePostList[i].totalCommentWithReComment++
          this.homePostList[i].comments.unshift(commentpostData)
          this.commentList = true
          text = null
        } else this.toastr.warning(response['message'])
      },
      () => this.toastr.warning('Server Error')
    )
  }
  sharePostInfo(post) {
    console.log(post);
    
    const dialogRef = this.dialog.open(SharePostConfirmationDialogComponent, { width: '558px', panelClass: 'my-dialog-creat-post', data: { post: post } })
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.apiHit) {
        this.pageNumber = 1
        this.homePostList = []
        this.getPostList()
      }
    })
  }
  deletePostList(postId, index, type) {
    const dialogRef = this.dialog.open(DeletePostConfirmationDialogComponent, { width: '450px', data: { postId: postId, userId: this.loggedInUser } })
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.apiHit) {
        this.homePostList.splice(index, 1)
        if (type == 'SHARED') this.homePostList = this.homePostList.filter((item) => item.postId != postId)
      }
    })
  }

  deleteComment(postId, Postindex, Commentindex, reCommentIndex, commentId, type) {
    const dialogRef = this.dialog.open(DeleteCommentConfirmationComponent, { width: '450px', data: { postId: postId, userId: this.loggedInUser, commentId: commentId } })
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.apiHit) {
        if (type == 'COMMENT') {
          this.homePostList[Postindex].totalComment--
          let totalComment = this.homePostList[Postindex].totalCommentWithReComment - (this.homePostList[Postindex].comments[Commentindex].totalReComment + 1)
          this.homePostList[Postindex].totalCommentWithReComment = totalComment
          this.homePostList[Postindex].comments.splice(Commentindex, 1)
        } else {
          this.homePostList[Postindex].comments[Commentindex].reCommentArr.splice(reCommentIndex, 1)
          this.homePostList[Postindex].comments[Commentindex].totalReComment--
          this.homePostList[Postindex].totalCommentWithReComment--
        }
      }
    })
  }
  // edit Comment
  editComment(postId, Postindex, Commentindex, reCommentIndex, comment, type) {
    this.dialog
      .open(EditCommentComponent, { width: '600px', data: { postId: postId, userId: this.loggedInUser, commentId: comment } })
      .afterClosed()
      .subscribe((result) => {
        if (result && result.comment) {
          if (type == 'COMMENT') {
            this.homePostList[Postindex].comments[Commentindex].comment = result.comment
            this.homePostList[Postindex].comments[Commentindex].isEdited = true
          } else {
            this.homePostList[Postindex].comments[Commentindex].reCommentArr[reCommentIndex].comment = result.comment
            this.homePostList[Postindex].comments[Commentindex].reCommentArr[reCommentIndex].isEdited = true
          }
        }
      })
  }
  readMore(index, value) {
    let id = `caption${index}`
    let more = `more${index}`
    document.getElementById(id).classList.toggle('post_caption')
    document.getElementById(more).classList.add('d-none')
  }

  readMoreshr(index, value) {
    let id = `captionshr${index}`
    let more = `moreshr${index}`
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

  imagesViewForText(postData, posts, Postindex) {
    this.spinner.show()
    this.homePostList[Postindex].commentPage = 1
    this.isCommentShow = false
    let data = { postId: posts._id, userId: this.loggedInUser }
    this._generalService.PostsList(data).subscribe(
      (response) => {
        if (response['code'] == '200') {
          let allData = response['data']
          this.spinner.hide()
          const dialogRef = this.dialog.open(SliderImgComponent, { width: '1200px', height: '600px', panelClass: 'my-dialog-creat-post', data: { media: false, allData: allData } })
          dialogRef.afterClosed().subscribe((result) => {
            this.homePostList[Postindex].totalLike = result.totalLikes
            this.homePostList[Postindex].totalCommentWithReComment = result.totalCommentWithReComments
            this.homePostList[Postindex].isLiked = result.isLiked
          })
          this.spinner.hide()
        }
      },
      () => {
        this.spinner.hide()
        this.toastr.warning('Server Error')
      }
    )
  }
  imagesView(postData, img, posts, Postindex: number) {
    this.spinner.show()
    this.homePostList[Postindex].commentPage = 1
    this.isCommentShow = false
    let data = { postId: posts._id, userId: this.loggedInUser }
    this._generalService.PostsList(data).subscribe(
      (response) => {
        if (response['code'] == '200') {
          let allData = response['data']
          this.spinner.hide()
          const dialogRef = this.dialog.open(SliderImgComponent, { width: '1200px', height: '600px', panelClass: 'my-dialog-creat-post', data: { media: true, allData: allData } })
          dialogRef.afterClosed().subscribe((result) => {
            this.homePostList[Postindex].totalLike = result.totalLikes
            this.homePostList[Postindex].totalCommentWithReComment = result.totalCommentWithReComments
            this.homePostList[Postindex].isLiked = result.isLiked
          })
          this.spinner.hide()
        }
      },
      () => {
        this.spinner.hide()
        this.toastr.warning('Server Error')
      }
    )
  }
  getId(list) {
    this.reCommentForm = list._id
    this.rePostID = list._id
  }

  RecommentPostInfo(post, index, postIndex) {
    let text
    if (this.RePostCommentForm.value.comment) text = this.RePostCommentForm.value.comment.trim()
    let data = {}
    if (!text) return false
    else {
      this.RePostCommentForm.reset()
      text = leo_filter.clean(text)
      data = { postId: post._id, commentId: this.rePostID, comment: text, userId: this.loggedInUser, userName: this.userObj.userInfo.personName, userImage: this.userObj.userInfo.image }
    }
    this._generalService.ReCommentAdd(data).subscribe(
      (response) => {
        if (response['code'] == 200) {
          let reCommentDone = { comment: text, image: this.loggedIn, personName: this.userName, userId: this.loggedInUser, isEdited: false, isMyComment: true, _id: response.data._id }
          this.homePostList[postIndex].comments[index].reCommentArr.push(reCommentDone)
          this.homePostList[postIndex].comments[index].totalReComment++
          this.homePostList[postIndex].totalCommentWithReComment++
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
  reCommentList(list, i, index) {
    this.rePostID = list._id
    let data = { postId: this.postIdComment, userId: this.loggedInUser, commentId: this.rePostID, page: this.homePostList[i].comments[index].page, count: this.commentCount }
    this._generalService.getPostCommentListDetails(data).subscribe(
      (response) => {
        if (response['code'] == 200) {
          this.reCommentListData = response['data']
          this.homePostList[i].comments[index].reCommentArr.push(...this.reCommentListData)
          this.homePostList[i].comments[index].page++
        } else this.toastr.success(response['message'])
      },
      () => this.toastr.success('Server Error')
    )
  }
  getPostCommentListmore(postId, i) {
    this.postIdComment = postId._id
    let data = { postId: postId._id, userId: this.loggedInUser, page: this.homePostList[i].commentPage, count: this.commentCount }
    this._generalService.getPostCommentListDetails(data).subscribe(
      (response) => {
        if (response['code'] == 200) {
          this.commentPostList = response['data']
          this.homePostList[i].comments.push(...this.commentPostList)
          this.homePostList[i].commentPage++
        } else this.toastr.warning(response['message'])
      },
      () => this.toastr.warning('Server Error')
    )
  }
  totalLikeInfo(postId, post) {
    if (post.totalLike) this.dialog.open(TotalCommentDialogComponent, { width: '558px', data: { postId: postId, likedCount: post.totalLike } })
  }
}
