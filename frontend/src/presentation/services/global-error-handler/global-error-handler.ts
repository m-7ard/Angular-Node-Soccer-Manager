import { Injectable, ErrorHandler } from '@angular/core';
import { Router } from '@angular/router';
import RoutableException from '../../exceptions/RoutableException';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(private router: Router) {}

    handleError(error: any): void {
        if (error instanceof RoutableException) {
            // Redirect to the "Not Found" page
            this.router.navigate([error.route]);
        } else {
            // Handle other errors as needed
            console.error('An unexpected error occurred:', error);
        }
    }
}
