import { Injectable, ErrorHandler } from '@angular/core';
import RoutableException from '../../exceptions/RoutableException';
import { Router } from '@angular/router';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(private _router: Router) {}

    handleError(error: any): void {
        let errorMessage = 'An unexpected error occurred.';

        if (error instanceof RoutableException) {
            this._router.navigate([error.route], { state: { error: error } });
            return;
        } else if (error instanceof Error) {
            errorMessage = error.message;
        } else {
            errorMessage = `Unknown error: ${JSON.stringify(error)}`;
        }

        console.error(error);
    }
}
