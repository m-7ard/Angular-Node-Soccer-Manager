import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTeamMembershipPageComponent } from './create-team-membership-page.component';

describe('CreateTeamMembershipPageComponent', () => {
    let component: CreateTeamMembershipPageComponent;
    let fixture: ComponentFixture<CreateTeamMembershipPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CreateTeamMembershipPageComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CreateTeamMembershipPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
