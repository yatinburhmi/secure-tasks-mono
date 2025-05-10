import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiAngularComponent } from './ui-angular.component';

describe('UiAngularComponent', () => {
  let component: UiAngularComponent;
  let fixture: ComponentFixture<UiAngularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiAngularComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiAngularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
