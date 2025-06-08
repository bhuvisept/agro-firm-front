import { ChangeDetectorRef, Component, Inject, NgZone, OnInit, Renderer2 } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { environment } from 'src/environments/environment'
import { NgxSpinnerService } from 'ngx-spinner'
import { ActivatedRoute } from '@angular/router'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { SliderImgComponent } from 'src/app/slider-img/slider-img.component'
import { ToastrService } from 'ngx-toastr'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { SharePostConfirmationDialogComponent } from 'src/app/share-post-confirmation-dialog/share-post-confirmation-dialog.component'
import { DeleteCommentConfirmationComponent } from 'src/app/delete-comment-confirmation/delete-comment-confirmation.component'
import { EditCommentComponent } from 'src/app/edit-comment/edit-comment.component'
import { ReportPostComponent } from 'src/app/report-post/report-post.component'
import { EditPostConfirmationDialogComponent } from 'src/app/edit-post-confirmation-dialog/edit-post-confirmation-dialog.component'
import { DeletePostConfirmationDialogComponent } from 'src/app/delete-post-confirmation-dialog/delete-post-confirmation-dialog.component'
import { TotalCommentDialogComponent } from 'src/app/total-comment-dialog/total-comment-dialog.component'
const Filter = require('bad-words')
const customFilter = new Filter({ regex: /\*|\.|$/gi })

@Component({
  selector: 'app-profile-connection-view',
  templateUrl: './profile-connection-view.component.html',
  styleUrls: ['./profile-connection-view.component.css'],
  providers: [NgxSpinnerService],
})
export class ProfileConnectionViewComponent implements OnInit {
  public PROFILEBANNEIMAGE = environment.URLHOST + '/uploads/company/banner/'
  public postProfile = environment.URLHOST + '/uploads/enduser/'
  public networkImages = environment.URLHOST + '/uploads/post/image/'
  public banner_img_path = environment.URLHOST + '/uploads/group/'
  public postImage_path = genralConfig.networkImages.network_image
  public postVideo_path = genralConfig.networkImages.network_video

  disableIndex: any

  bannerImage: any
  roleName: any
  userObj: any
  userId: any
  serviceId
  data: any
  list: any = []
  qualificationList: any
  email: any
  skillList: any

  scrollDistance = 2
  throttle = 49
  page: number = 1
  captaion: boolean = true
  postList = []
  createPostCommentForm: FormGroup
  RePostCommentForm: FormGroup
  isCommentShow = false
  userImage: any
  postIdComment: any
  postIndex: any
  commentPostList = []
  rePostID: any
  reCommentListData: any
  reCommentForm: any
  loggedInUser: any
  loggedIn: any
  userName: any
  seeMore: any
  commentCount = genralConfig.commentCount

  constructor(
    private _generalService: GeneralServiceService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public dialog: MatDialog,
    private formbuilder: FormBuilder,
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef
  ) {
    setTimeout(() => this.ngZone.run(() => this.changeDetector.detectChanges()))
  }

  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.loggedInUser = this.userObj.userInfo._id
    this.userImage = this.userObj.userInfo.image
    this.roleName = this.userObj.userInfo.roleId.roleTitle
    this.userName = this.userObj.userInfo.personName
    this.route.params.subscribe((params) => (this.serviceId = params.Id))
    this.renderer.addClass(this.document.body, 'remove-sidebar-with-profile')
    this.createPostCommentForm = this.formbuilder.group({ comment: [''] })
    this.RePostCommentForm = this.formbuilder.group({ comment: ['', Validators.required] })
    this.getData()
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'remove-sidebar-with-profile')
  }

  getData() {
    let data = {
      userId: this.loggedInUser,
      friendId: this.serviceId,
      page: this.page,
      count: 9,
    }
    this.spinner.show()
    this._generalService.getConnectionDetails(data).subscribe(
      (Response) => {
        if (Response['code'] == 200) {
          this.list = Response['data']
          this.list.postData = this.list.postData.map((item) => {
            let data = item.caption.match(/\n/gi)
            if (data) {
              item.isreadMore = data.length
            }
            item.captionTwo = item.caption.replace(/\n/gi, '<br>')
            if (item.orignalPostData && item.orignalPostData.caption) {
              item.orignalPostData.caption = item.orignalPostData.caption.replace(/\n/gi, '<br>')
            }
            return item
          })
          this.postList.push(...this.list.postData)
          this.qualificationList = Response['data'].qualificationD
          this.spinner.hide()
        } else {
          this.spinner.hide()
          this.toastr.warning(Response['message'])
        }
      },
      () => {
        this.spinner.hide()
        this.toastr.warning('Server Error')
      }
    )
  }

  onScrollDown() {
    this.page += 1
    this.getData()
  }

  getPostCommentList(postId, i) {
    this.isCommentShow = true
    this.postIdComment = postId._id
    this.postIndex = i
    let data = { postId: postId._id, count: this.commentCount, page: 1, userId: this.loggedInUser }
    if (postId.commentPage == 1) {
      this.spinner.show()
      this._generalService.getPostCommentListDetails(data).subscribe(
        (response) => {
          if (response['code'] == 200) {
            this.spinner.hide()
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
          this.toastr.warning('Serve Error')
        }
      )
    }
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
  //   })
  // }
  imagesViewForText(postData, posts, Postindex) {
    // this.isCommentShow = false
    // this.postList[Postindex].commentPage = 1
    // const dialogRef = this.dialog.open(SliderImgComponent, { width: '1200px', height: '600px', panelClass: 'my-dialog-creat-post', data: { postId: posts._id, userId: this.loggedInUser, media: false } })
    // dialogRef.afterClosed().subscribe((result) => {
    //   this.postList[Postindex].totalLike = result.totalLikes
    //   this.postList[Postindex].totalCommentWithReComment = result.totalCommentWithReComments
    //   this.postList[Postindex].isLiked = result.isLiked
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
    // this.isCommentShow = false
    // this.postList[Postindex].commentPage = 1
    // const dialogRef = this.dialog.open(SliderImgComponent, { width: '1200px', height: '600px', panelClass: 'my-dialog-creat-post', data: { postId: posts._id, userId: this.loggedInUser, media: true } })
    // dialogRef.afterClosed().subscribe((result) => {
    //   this.postList[Postindex].totalLike = result.totalLikes
    //   this.postList[Postindex].totalCommentWithReComment = result.totalCommentWithReComments
    //   this.postList[Postindex].isLiked = result.isLiked
    // })

    this.spinner.show()
    this.isCommentShow = false
    this.postList[Postindex].commentPage = 1
    let data = { postId: posts._id, userId: this.loggedInUser }
    this._generalService.PostsList(data).subscribe(
      (response) => {
        if (response['code'] == '200') {
          let allData = response['data']
          this.spinner.hide()
          const dialogRef = this.dialog.open(SliderImgComponent, { width: '1200px', height: '600px', panelClass: 'my-dialog-creat-post', data: { media: true, allData: allData } })
          dialogRef.afterClosed().subscribe((result) => {
            this.postList[Postindex].totalLike = result.totalLikes
            this.postList[Postindex].totalCommentWithReComment = result.totalCommentWithReComments
            this.postList[Postindex].isLiked = result.isLiked
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

  likePostInfo(posts, index) {
    let data = {
      userId: this.userObj.userInfo._id,
      postId: posts._id,
      liked: true,
      isActive: posts.isLiked ? false : true,
      userName: this.userName,
    }
    this._generalService.likePostDetails(data).subscribe(
      (response) => {
        if (response['code'] == 200) {
          ;(this.postList[index].totalLike = response.data.totalLike), (this.postList[index].isLiked = response.data.isLiked), (this.postList[index].isDislike = response.data.isDislike)
        } else {
          this.toastr.warning('', response['message'])
        }
      },
      (error) => {
        this.toastr.warning('Server Error')
      }
    )
  }

  editPostInfo(postId, index) {
    const dialogRef = this.dialog.open(EditPostConfirmationDialogComponent, {
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

  deletePostList(postId, index, type) {
    const dialogRef = this.dialog.open(DeletePostConfirmationDialogComponent, {
      width: '450px',
      data: { postId: postId, userId: this.userObj.userInfo._id },
    })
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.apiHit) {
        this.postList.splice(index, 1)
        if ((type = 'SHARED')) {
          this.postList = this.postList.filter((item) => item.postId != postId)
        }
      }
    })
  }

  sendConnectionIvite(list) {
    let data = {
      invitedBy: this.userObj.userInfo._id,
      invitedTo: list,
      userName: this.userObj.userInfo.personName,
      userImage: this.userObj.userInfo.image,
    }
    this.spinner.show()
    this._generalService.connect(data).subscribe((response) => {
      if (response['code'] == 200) {
        this.spinner.hide()
        this.toastr.success(response['message'])
        this.list.inConnection = 'pending'
        this.list.invitedBy = this.userObj.userInfo._id
        this.list.invitationId = response.data.invitationId
      } else {
        this.spinner.hide()
        this.toastr.warning(response['message'])
      }
    })
    ;() => {
      this.spinner.hide()
      this.toastr.warning('Server Error')
    }
  }

  reCommentList(list, i, index) {
    this.rePostID = list._id

    let data = {
      postId: this.postIdComment,
      commentId: this.rePostID,
      page: this.postList[i].comments[index].page,
      userId: this.loggedInUser,
      count: this.commentCount,
    }
    // page: this.homePostList[i].comments[index].page,
    this._generalService.getPostCommentListDetails(data).subscribe(
      (response) => {
        if (response['code'] == 200) {
          this.reCommentListData = response['data']
          this.commentPostList[index].reCommentArr.push(...this.reCommentListData)
          // this.commentPostList[index].page++
          this.postList[i].comments[index].page++
        } else {
          this.toastr.warning(response['message'])
        }
      },
      (error) => {
        this.toastr.warning('Server Error')
      }
    )
  }

  getId(list) {
    this.reCommentForm = list._id
    this.rePostID = list._id
  }

  RecommentPostInfo(post, index, postIndex) {
    let text = this.RePostCommentForm.value.comment.trim()
    let data = {}
    if (!text) {
      return false
    } else {
      this.RePostCommentForm.reset()
      text = customFilter.clean(text)
      data = {
        postId: post._id,
        commentId: this.rePostID,
        comment: text,
        userId: this.loggedInUser,
        userName: this.userObj.userInfo.personName,
        userImage: this.userObj.userInfo.image,
      }
    }
    this._generalService.ReCommentAdd(data).subscribe((response) => {
      if (response['code'] == 200) {
        let reCommentDone = {
          comment: text,
          image: this.loggedIn,
          personName: this.userName,
          userId: this.loggedInUser,
          isEdited: false,
          isMyComment: true,
          _id: response.data._id,
        }
        this.postList[postIndex].comments[index].reCommentArr.push(reCommentDone)
        this.postList[postIndex].comments[index].totalReComment++
        this.postList[postIndex].totalCommentWithReComment++
        this.postList[postIndex].totalComment++

        this.RePostCommentForm.reset()
        data = {}
        text = ''
      } else {
        this.toastr.success(response['message'])
      }
    }),
      (error) => {
        this.spinner.hide()
        this.toastr.success('Server Error')
      }
  }

  commentPostInfo(posts, i) {
    let text = this.createPostCommentForm.value.comment.trim()
    let data = {}
    if (!text) {
      return false
    } else {
      this.createPostCommentForm.reset()
      text = customFilter.clean(text)
      data = {
        userId: this.loggedInUser,
        postId: posts._id,
        comment: text,
        userName: this.userObj.userInfo.personName,
        userImage: this.userObj.userInfo.image,
      }
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
          this.postList[i].comments.unshift(commentpostData)
          this.postList[i].totalComment++
          this.postList[i].totalCommentWithReComment++

          this.createPostCommentForm.reset()
        } else {
          this.toastr.warning(response['message'])
        }
      },
      (error) => {
        this.toastr.warning('Server Error')
      }
    )
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

  sharePostInfo(post) {
    const dialogRef = this.dialog.open(SharePostConfirmationDialogComponent, {
      width: '558px',
      panelClass: 'my-dialog-creat-post',
      data: {
        post: post,
      },
    })
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.apiHit) {
        this.page = 1
        this.postList = []
        this.getData()
      }
    })
  }

  // delete Comment
  deleteComment(postId, Postindex, Commentindex, reCommentIndex, commentId, type) {
    const dialogRef = this.dialog.open(DeleteCommentConfirmationComponent, {
      width: '450px',
      data: { postId: postId, userId: this.loggedInUser, commentId: commentId },
    })
    dialogRef.afterClosed().subscribe((result) => {
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
    const dialogRef = this.dialog.open(EditCommentComponent, { width: '600px', data: { postId: postId, userId: this.loggedInUser, commentId: comment } })
    dialogRef.afterClosed().subscribe((result) => {
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

  getPostCommentListmore(postId, i) {
    this.postIdComment = postId._id
    let data = { postId: postId._id, userId: this.loggedInUser, page: this.postList[i].commentPage, count: this.commentCount }
    this._generalService.getPostCommentListDetails(data).subscribe(
      (response) => {
        this.spinner.show()
        if (response['code'] == 200) {
          this.commentPostList = response['data']
          this.postList[i].comments.push(...this.commentPostList)
          this.postList[i].commentPage++
        } else this.toastr.warning(response['message'])
        this.spinner.hide()
      },
      () => {
        this.spinner.hide()
        this.toastr.warning('Server Error')
      }
    )
  }

  reportPostInfo(postId, index) {
    const dialogRef = this.dialog.open(ReportPostComponent, { width: '558px', panelClass: 'my-dialog-creat-post', data: { postId: postId } })
    dialogRef.afterClosed().subscribe((result) => result && result.apiHit == true && this.postList.splice(index, 1))
  }

  onAcceptInvitation(_id: string) {
    let data = { invitationId: _id, userId: this.userObj.userInfo._id }
    this.spinner.show()
    this._generalService.acceptInvitation(data).subscribe(
      (response) => {
        if (response['code'] == 200) {
          this.toastr.success('', response['message'])
          this.list = {}
          this.getData()
        }
        this.spinner.hide()
      },
      () => {
        this.spinner.hide()
        this.toastr.success('Server Error')
      }
    )
  }
  onIgnoreInvitation(_id: string) {
    this.spinner.show()
    this._generalService.ignoreInvitation({ invitationId: _id, userId: this.loggedInUser }).subscribe(
      (response) => {
        if (response['code'] == 200) this.list.inConnection = 'false'
        else this.toastr.warning(response['message'])
        this.spinner.hide()
      },
      () => {
        this.spinner.hide()
        this.toastr.warning('Server Error')
      }
    )
  }

  totalLikeInfo(postId, post) {
    if (post.totalLike) this.dialog.open(TotalCommentDialogComponent, { width: '558px', data: { postId: postId, likedCount: post.totalLike } })
  }
}
