import { trigger, state, style, transition, animate, animateChild, query } from '@angular/animations';

export const onSideNavChange = trigger('onSideNavChange', [
  state('close',
    style({
      'min-width': '0px'
    })
  ),
  state('open',
    style({
      'min-width': '200px'
    })
  ),
  transition('close => open', animate('1s ease-in')),
  transition('open => close', animate('1s ease-in')),
]);


export const onMainContentChange = trigger('onMainContentChange', [
  state('close',
    style({
      'margin-left': '0px'
    })
  ),
  state('open',
    style({
      'margin-left': '200px'
    })
  ),
  transition('close => open', animate('500ms ease-in')),
  transition('open => close', animate('500ms ease-in')),
]);


export const animateText = trigger('animateText', [
  state('hide',
    style({
      display: 'none',
      opacity: 0,
    })
  ),
  state('show',
    style({
      display: 'block',
      opacity: 1,
    })
  ),
  transition('close => open', animate('350ms ease-in')),
  transition('open => close', animate('200ms ease-out')),
]);
