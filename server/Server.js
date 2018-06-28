const Curry = require('lodash/fp/curry');
const IsEmpty = require('lodash/fp/isEmpty');
const Equal = require('fast-deep-equal');
const Joi = require('joi');
const Minimatch = require('minimatch');

/**
 * A request object
 * @typedef {Object} Request
 * @property {string} method - Valid http method
 * @property {string} path - Pathname of request
 * @property {string} host - Origin of request
 * @property {Object} query - Object representation of query arguments
 * @property {string|Object} body - Body of request
 */
const validRequestSchema = Joi.object({
  method: Joi.string()
    .allow(['POST', 'GET', 'PUT', 'HEAD', 'DELETE', 'OPTIONS', 'TRACE', 'PATCH', 'CONNECT'])
    .required()
    .default('GET'),
  path: Joi.string()
    .required()
    .default('/'),
  host: Joi.string().uri(),
  query: Joi.object().default({}),
  body: Joi.object(),
});

/**
 * A response object
 * @typedef {Object} Response
 * @property {string} status - Valid http status
 * @property {string|Object} body - Body of the response
 * @property {Object} headers - Header of the response
 */
const validResponseSchema = Joi.object({
  status: Joi.number()
    .min(100)
    .max(599),
  body: Joi.alternatives([Joi.string(), Joi.object()]),
  headers: Joi.object(),
});

/**
 * An interaction object
 * @typedef {Object} Interaction
 * @property {Request} request - Request of the interaction
 * @property {Response} response - Response of the interaction
 */
const validInteraction = Joi.object({
  request: validRequestSchema,
  response: validResponseSchema,
});

/**
 * Check if a request is the same
 * @param {Request} request
 * @param {Request} other - Request to compare
 * @return {boolean}
 */
const requestEqual = Curry((request, other) => {
  const pathEquals = request.path === other.path;
  const methodEquals = request.method === other.method;

  return pathEquals && methodEquals;
});

const bothAreEmpty = (object, other) => IsEmpty(object) && IsEmpty(other);
const deepEqual = (object, other) => {
  if (object === other) {
    return true;
  }

  if (bothAreEmpty(object, other)) {
    return true;
  }

  return Equal(object, other);
};
/**
 * Check if a request data is the same
 * @param {Request} request
 * @param {Request} other - Request to compare
 * @return {boolean}
 */
const requestDataEqual = Curry((request, other) => {
  const queryEqual = deepEqual(request.query, other.query);
  const bodyEqual = deepEqual(request.body, other.body);

  return queryEqual && bodyEqual;
});

/**
 * Create an unique id for a path and a method
 * @param path - request path
 * @param method - request method
 * @returns {string} - unique id created
 */
const createUniqueRequestId = (path, method) => `${method}->${path}`;

const findInteraction = (path, method, interactions = []) =>
  Array.from(interactions.values()).find(interaction => {
    if (method !== interaction.request.method) {
      return false;
    }

    if (path === interaction.request.path) {
      return true;
    }

    return Minimatch(path, interaction.request.path);
  });

/**
 * Server continue symbol
 * @typedef {Symbol} Server.continue
 * @property {Request} request - Request of the interaction
 * @property {Response} response - Response of the interaction
 */

export default class Server {
  constructor({ baseUrl, interceptUrls = [], baseInteractions = [] } = {}) {
    if (!baseUrl) {
      throw new Error('Need a base url to create a server');
    }
    this.baseUrl = baseUrl;
    this.interceptUrls = interceptUrls;
    this.baseInteractions = baseInteractions;
    this.interactions = new Map();
    this.requestReceived = [];

    this.with(...baseInteractions);

    /**
     * Continue request
     * @typedef {symbol} Server.Continue
     */
    this.continue = Symbol('Server.Continue');

    /**
     * Abort request
     * @typedef {symbol} Server.Abort
     */
    this.abort = Symbol('Server.Abort');
  }

  /**
   * Handle a request and return the expected behaviour
   * @param {Request} request - Request to be handle by the server stub
   * @returns {Server.Abort|Server.Continue|Response}
   */
  handle(request) {
    // Check if request is valid, and fill with default values
    const { error, value: validRequest } = validRequestSchema.validate(request);
    if (error) {
      throw error;
    }
    const { host } = validRequest;

    // If the domain is in our intercepted urls, abort the request
    if (this.interceptUrls.some(url => url === host)) {
      return this.abort;
    }

    // If request is from another domain let continue the request
    if (host !== this.baseUrl) {
      return this.continue;
    }

    const { path, method } = validRequest;
    const interaction = findInteraction(path, method, this.interactions);

    // If I don't have an interaction, should continue request
    if (!interaction) {
      return this.continue;
    }

    // Store request done
    this.requestReceived.push(validRequest);

    return interaction.response;
  }

  /**
   *  Add interactions to stubs on the server
   * @param {...Interaction} interactions - Interactions to add
   */
  with(...interactions) {
    interactions
      .map(interaction => {
        const { error, value } = validInteraction.validate(interaction);
        if (error) {
          throw error;
        }
        return value;
      })
      .forEach(interaction => {
        const {
          request: { path, method },
        } = interaction;
        const requestId = createUniqueRequestId(path, method);
        this.interactions.set(requestId, interaction);
      });
  }

  /**
   * Check if a request was done
   * @param {Request} request
   */
  requestWasMade(request) {
    const { error, value } = validRequestSchema.validate(request);
    if (error) {
      throw error;
    }
    const requestDeepEqual = other => requestEqual(value, other) && requestDataEqual(value, other);

    return this.requestReceived.some(requestDeepEqual);
  }

  /**
   * Clear all request that has been made
   */
  clearRequests() {
    this.requestReceived = [];
  }

  /**
   * Clear and remove all interactions
   */
  resetRequests() {
    this.clearRequests();
    this.interactions.clear();
    this.with(...this.baseInteractions);
  }
}
