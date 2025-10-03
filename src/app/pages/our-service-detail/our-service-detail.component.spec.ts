import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OurServiceDetailComponent } from './our-service-detail.component';

describe('OurServiceDetailComponent', () => {
  let component: OurServiceDetailComponent;
  let fixture: ComponentFixture<OurServiceDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OurServiceDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OurServiceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
