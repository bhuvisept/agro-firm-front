import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LightboxDialogComponent } from '../lightbox-dialog/lightbox-dialog.component';

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
   images: GalleryImage[] = [
    { src: 'assets/gallery/1.jpg', thumb: 'https://picsum.photos/300/200?image=10', alt: 'Field' },
    { src: 'assets/gallery/1.jpg', thumb: 'https://picsum.photos/300/200?image=10', alt: 'Irrigation' },
    { src: 'assets/gallery/1.jpg', thumb: 'https://picsum.photos/300/200?image=10', alt: 'Harvest' },
    { src: 'assets/gallery/1.jpg', thumb: 'https://picsum.photos/300/200?image=10', alt: 'Agri-tech' }
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
