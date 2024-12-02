import { Injectable, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { map, Observable } from 'rxjs';
import Team from '../../../models/Team';
import { TeamDataAccessService } from '../../../services/data-access/team-data-access.service';

export interface IListTeamsResolverData {
    teams: Team[];
}

@Injectable({ providedIn: 'root' })
export class ListTeamsPageResolver implements Resolve<Team[]>, OnInit {
    constructor(
        private _teamDataAccess: TeamDataAccessService,
        private route: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        console.log('balls onInit -->', this.route.snapshot.data['teams']);
    }

    resolve(route: ActivatedRouteSnapshot): Observable<Team[]> {
        return this._teamDataAccess.listTeams().pipe(
            map((response) => {
                return response.teams.map((team) => {
                    return new Team({
                        id: team.id,
                        name: team.name,
                        dateFounded: new Date(team.dateFounded),
                    });
                });
            }),
        );
    }
}
