import Curry from 'lodash/fp/curry';
import { exist, visible, clear, click, attr } from './puppeter';

function input(page, selector) {
  return {
    selector,
    exist: () => exist(page, selector),
    visible: () => visible(page, selector),
    clear: () => clear(page, selector),
    text: () => attr(page, selector, 'innerText'),
    id: () => attr(page, selector, 'id'),
    click: () => click(page, selector),
    attr: attr(page, selector),
  };
}

export default Curry(input);
