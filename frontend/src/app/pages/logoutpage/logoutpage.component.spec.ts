import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoutpageComponent } from './logoutpage.component';

describe('LogoutpageComponent', () => {
  let component: LogoutpageComponent;
  let fixture: ComponentFixture<LogoutpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogoutpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
