import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { TeamDataAccessService } from '../../../services/data-access/team-data-access.service';

@Injectable({
    providedIn: 'root',
})
export class FormControllerService {
    constructor(
        private teamDataAccess: TeamDataAccessService,
        private router: Router,
    ) {}

    createTeam(data: { name: string; dateFounded: Date }) {
        this.teamDataAccess.createTeam(data).subscribe({
            next: (response) => {
                const { id } = response;
                this.router.navigate([`/teams/${id}`]);
            },
            error: (error) => {
                if (error.status === 404) {
                    this.router.navigate(['/not-found']);
                } else {
                    this.router.navigate(['/internal-error']);
                }
            },
        });
    }
}
