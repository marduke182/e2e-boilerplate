import Curry from 'lodash/fp/curry';
import { exist, visible, clear, type, attr } from './puppeter';

function input(page, selector) {
  return {
    selector,
    exist: () => exist(page, selector),
    visible: () => visible(page, selector),
    clear: () => clear(page, selector),
    value: () => attr(page, selector, 'value'),
    id: () => attr(page, selector, 'id'),
    type: type(page, selector),
    attr: attr(page, selector),
  };
}

export default Curry(input);
