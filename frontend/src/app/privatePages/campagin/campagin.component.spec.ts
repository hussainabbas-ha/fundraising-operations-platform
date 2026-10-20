import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaginComponent } from './campagin.component';

describe('CampaginComponent', () => {
  let component: CampaginComponent;
  let fixture: ComponentFixture<CampaginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampaginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampaginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
