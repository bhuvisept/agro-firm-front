import { Component, OnInit } from '@angular/core'
import { AddCardComponent } from 'src/app/addCard/addCard.component'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent implements OnInit {
  userObj: any
  userId: any
  cardDetails: any = []

  constructor(private dialog: MatDialog, private genralServices: GeneralServiceService, private spinner: NgxSpinnerService, private toastr: ToastrService) {}

  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.userId = this.userObj.userInfo._id
    this.listCard()
  }

  dialogBox() {
    const dialogConfig = new MatDialogConfig()

    dialogConfig.disableClose = true
    dialogConfig.autoFocus = true
    ;(dialogConfig.width = '450px'),
      (dialogConfig.data = {
        id: 1,
        title: 'Angular For Beginners',
      })
    // const dialogRef = this.dialog.open(AddCardComponent, { width: '450px', data: { postId: "sdlgfhjdlgfhjdg" } })

    const dialogRef = this.dialog.open(AddCardComponent, dialogConfig)
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 200) {
        this.listCard()
      }
    })
  }

  listCard() {
    let data = {
      userId: this.userId,
    }
    this.spinner.show()

    this.genralServices.listCard(data).subscribe(
      (res) => {
        if (res['code'] == 200) {
          this.cardDetails = res['data']
       
          this.spinner.hide()
        } else this.toastr.warning(res['message'])
        this.spinner.hide()
      },
      () => {
        this.spinner.hide()
        // this.toastr.error(messages.apiError)
      }
    )
  }

  onToggle(token){
    let data = {
      userId: this.userId,
      token: token
    }
    this.spinner.show()
    this.genralServices.defaultCard(data).subscribe(
      (res) => {
        if (res['code'] == 200) {
          this.listCard()     
          this.spinner.hide()
        } else this.toastr.warning(res['message'])
        this.spinner.hide()
      },
      () => {
        this.spinner.hide()
        // this.toastr.error(messages.apiError)
      }
    )
  }

  deleteCard(isDefault,token){
    if (isDefault) return this.toastr.warning("You Cannot delete this card.")
    let data = {
      userId: this.userId,
      token: token
    }
    this.spinner.show()
    this.genralServices.deleteCard(data).subscribe(
      (res) => {
        if (res['code'] == 200) {
          this.listCard()     
          this.spinner.hide()
        } else this.toastr.warning(res['message'])
        this.spinner.hide()
      },
      () => {
        this.spinner.hide()
        // this.toastr.error(messages.apiError)
      }
    )
  }
}
