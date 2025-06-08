import { Directive, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[ReadMoreLess]'
})
export class ReadMoreLessDirective implements OnChanges, OnInit {

  @Input() maxLength: number = 22;
  @Input() text: any = '';
  btn: HTMLButtonElement = document.createElement('button');
  showText: 'less' | 'more' = 'less';

  constructor(private _el: ElementRef) {
    _el.nativeElement.style.transition = 'all .25s ease-in-out';
    this.btn.style.border = 'none';
    this.btn.style.background = 'transparent';
    this.btn.style.color = '#18568a';
    this.btn.style.cursor = 'pointer';
    this.btn.style.fontSize = '13px';
    this.btn.style.fontWeight = '700'
    this.btn.innerText = 'Show more';
    this.btn.style.outline = 'none';
    this.btn.style.padding = '0px';
    // this.btn.style.marginLeft = '.5rem';
    this.btn.addEventListener('click', (e) => {
      if (this.showText == 'less') {
        this.showText = 'more';
        console.log(_el)
        _el.nativeElement.innerHTML = this.text
        console.log('helllllllllllllllllll', this.text)
        this.btn.innerText = 'Show less';
      } else {
        this.showText = 'less';
        _el.nativeElement.innerHTML = this.text.substring(0, this.maxLength) + '...';
        this.btn.innerText = 'Show more';
      }
    });
    this.btn.addEventListener('mouseover', (e) => {
      this.btn.style.textDecoration = 'underline';
    });
    this.btn.addEventListener('mouseout', (e) => {
      this.btn.style.textDecoration = 'none';
    });
    _el.nativeElement.after(this.btn);
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['text']) {
      if (this.text && this.text.length <= this.maxLength) {
        this._el.nativeElement.innerHTML = this.text
      } else {
        this._el.nativeElement.innerHTML = this.text.substring(0, this.maxLength) + '...';
      }
    }
    if (this.text.length <= this.maxLength) {
      this.btn.style.visibility = 'hidden';
    } else {
      this.btn.style.visibility = 'visible';
    }
    if (this.text.length <= this.maxLength) {
      this.btn.style.display = 'none';
    } else {
      this.btn.style.display = 'inline-flex';
    }
  }

}
