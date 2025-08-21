import { Component, Inject, HostListener } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface GalleryImage { src: string; thumb?: string; alt?: string; }

@Component({
  selector: 'app-lightbox-dialog',
  templateUrl: './lightbox-dialog.component.html',
  styleUrls: ['./lightbox-dialog.component.css']
})
export class LightboxDialogComponent {
  images: GalleryImage[] = [];
  index = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { images: GalleryImage[]; index: number },
    private dialogRef: MatDialogRef<LightboxDialogComponent>
  ) {
    this.images = data.images || [];
    this.index = data.index || 0;
  }

  get current(): GalleryImage { return this.images[this.index]; }

  next() { this.index = (this.index + 1) % this.images.length; }
  prev() { this.index = (this.index - 1 + this.images.length) % this.images.length; }
  close() { this.dialogRef.close(); }

  @HostListener('window:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    if (e.key === 'ArrowRight') this.next();
    else if (e.key === 'ArrowLeft') this.prev();
    else if (e.key === 'Escape') this.close();
  }
}
