import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DripCampaignComponent } from './drip-campaign.component';

describe('DripCampaignComponent', () => {
  let component: DripCampaignComponent;
  let fixture: ComponentFixture<DripCampaignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DripCampaignComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DripCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
