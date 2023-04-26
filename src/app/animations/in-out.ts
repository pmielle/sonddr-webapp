import { trigger, transition, style, animate } from "@angular/animations";
import { DURATION_MS } from "src/globals";

export let fadeSlideInOut = trigger('fadeSlideInOut', [
    transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate(`${DURATION_MS}ms ease-out`, style({ opacity: 1, transform: 'translateY(0)' })),
    ]),
    transition(':leave', [
        animate(`${DURATION_MS}ms ease-in`, style({ opacity: 0, transform: 'translateY(10px)' })),
    ]),
])