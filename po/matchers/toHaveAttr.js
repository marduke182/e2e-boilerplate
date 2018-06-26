module.exports = async function(element, attr, value) {
  const attrValue = await element.attr(attr);
  if (attrValue === value) {
    return {
      message: () =>
        `
${this.utils.matcherHint('.not.toHaveAttr', 'element', 'attribute', { secondArgument: 'value' })}

Expected element ${element.selector} to not have attribute "${attr}":
  ${this.utils.printExpected(value)}
Received:
  ${this.utils.printReceived(attrValue)}`,
      pass: true,
    };
  } else {
    return {
      message: () =>
        `
${this.utils.matcherHint('.toHaveAttr', 'element', 'attribute', { secondArgument: 'value' })}

Expected element ${element.selector} to have attribute "${attr}":
  ${this.utils.printExpected(value)}
Received:
  ${this.utils.printReceived(attrValue)}`,
      pass: false,
    };
  }
};
