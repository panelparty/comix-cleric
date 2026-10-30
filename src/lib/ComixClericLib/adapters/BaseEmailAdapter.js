export class BaseEmailAdapter {
  constructor(config = {}) {
    this.config = config;

    if (this.constructor === BaseEmailAdapter) {
      throw new Error("BaseEmailAdapter is abstract and must be extended");
    }
  }

  async send({ type, to, url, token }) {
    throw new Error(`Adapter ${this.constructor.name} must implement send()`);
  }

  // Bound arrow passed as emailSender to createAuth()
  sender = async (payload) => {
    return this.send(payload);
  };

  validateImplementation() {
    if (typeof this.send !== "function") {
      throw new Error(`Adapter ${this.constructor.name} must implement send()`);
    }
  }
}
