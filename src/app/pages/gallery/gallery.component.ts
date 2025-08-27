import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LightboxDialogComponent } from '../lightbox-dialog/lightbox-dialog.component';
import { environment } from 'src/environments/environment';

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
  gallery_url = environment.URLHOST + '/uploads/gallery/'
   images: GalleryImage[] = [
    { src: this.gallery_url+'1.jpg', thumb: 'https://picsum.photos/300/200?image=10', alt: 'Jitendra' },
    { src: this.gallery_url+'1.jpg', thumb: 'https://picsum.photos/300/200?image=10', alt: 'Neha' },
    { src: this.gallery_url+'1.jpg', thumb: 'https://picsum.photos/300/200?image=10', alt: 'Bhavya' },
    { src: this.gallery_url+'1.jpg', thumb: 'https://picsum.photos/300/200?image=10', alt: 'Bhuvi' }
  ];
  constructor(private dialog: MatDialog) {}

  ngOnInit() {
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
