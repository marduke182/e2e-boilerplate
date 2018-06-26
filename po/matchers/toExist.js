


module.exports = async function(element) {
  const exist = await element.exist();
  if (exist) {
    return {
      message: () =>
        `
${this.utils.matcherHint('.not.toExist')}

Expected element to not exist, but exist.`,
      pass: true,
    };
  } else {
    return {
      message: () =>
        `
${this.utils.matcherHint('.toExist')}

Expected element to exist, but doesn't exist.`,
      pass: false,
    };
  }
};
