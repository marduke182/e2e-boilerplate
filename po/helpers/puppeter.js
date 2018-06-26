import Curry from 'lodash/fp/curry';
import CurryN from 'lodash/fp/curryN';
import Compose from 'lodash/fp/compose';

export const exist = Curry(async (page, selector) => (await page.$(selector)) !== null);
export const visible = Curry(async (page, selector) =>
  page.$eval(selector, el => {
    if (!el) {
      return false;
    }
    const style = window.getComputedStyle(el);
    return (
      style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0'
    );
  }));

export const safeOperation = (fn) => async (page, selector, ...args) => {
  if (await exist(page,selector)) {
    return fn.apply(fn, [ page, selector, ...args]);
  }
  return null;
};

const Curried2AndSafe = Compose(
  CurryN(2),
  safeOperation,
);
const Curried3AndSafe = Compose(
  CurryN(3),
  safeOperation,
);

export const clear = Curried2AndSafe(async (page, selector) => await page.$eval(selector, input => (input.value = '')));
export const click = Curried2AndSafe(async (page, selector) => await page.click(selector));
export const type = Curried3AndSafe(async (page, selector, value) => await page.type(selector, value));
export const attr = Curried3AndSafe(async (page, selector, attr) => await page.$eval(selector, el => el[attr]));
