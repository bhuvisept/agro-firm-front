import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LightboxDialogComponent } from '../lightbox-dialog/lightbox-dialog.component';
import { environment } from 'src/environments/environment';
import { GeneralServiceService } from 'src/app/core/general-service.service';
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { genralConfig } from 'src/app/constant/genral-config.constant';

import { LanguageService } from 'src/app/service/language.service';
import { Subscription } from 'rxjs';


interface GalleryImage {
  src: string;
  thumb?: string;
  alt?: string;
}

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  galleriesList: any;
  gallery_url = environment.URLHOST + '/uploads/gallery/thumbnail_350X300/'
  gallery_url_full = environment.URLHOST + '/uploads/gallery/thumbnail_525X350/'

  image_list: any = [];
  images: any;
  currentLang: string;
  langSub: Subscription;
  constructor(
    private dialog: MatDialog,
    private _generalService: GeneralServiceService,
    private formbuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private languageService: LanguageService) { }

  ngOnInit() {
    this.currentLang = this.languageService.getCurrentLanguage();
    this.galleryList(this.currentLang);
    this.langSub = this.languageService.currentLanguage$.subscribe(lang => {
      console.log("SELECTED LANGUAGE IS ,", lang)
      if (lang !== this.currentLang) {
        this.currentLang = lang;
        this.galleryList(this.currentLang);
      }
    });
  }
  galleryList(lang: string) {
    let data = { title: lang }
    this.spinner.show()
    this._generalService.getGalleryList(data).subscribe((res) => {
      if (res['code'] == genralConfig.statusCode.ok) {
        setTimeout(() => {
          this.spinner.hide();
        }, 2000);
        this.galleriesList = res['data'];
        this.galleriesList.forEach((item) => {
          this.image_list.push({ src: this.gallery_url_full + item.url })
        })
        this.images = this.image_list
        window.scroll(0, 0)
      } else {
        window.scroll(0, 0)
        this.spinner.hide()
      }
    })
  }
  open(index: number) {
    this.dialog.open(LightboxDialogComponent, {
      data: { images: this.images, index },
      panelClass: 'lightbox-panel',
      backdropClass: 'lightbox-backdrop',
      maxWidth: '100vw',
      width: '100vw',
      height: '100vh'
    });
  }

}
