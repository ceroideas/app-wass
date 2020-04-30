import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreloadComponent } from './preload.component';

describe('PreloadComponent', () => {
  let component: PreloadComponent;
  let fixture: ComponentFixture<PreloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreloadComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
