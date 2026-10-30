import { BaseEmailAdapter } from "./BaseEmailAdapter.js";
import { Resend } from "resend";
import { env } from "$env/dynamic/private";
import { consoleWarn } from "$lib/utils/debug.js";

export class ResendEmailAdapter extends BaseEmailAdapter {
  constructor(config = {}) {
    super(config);

    const apiKey = config.apiKey || env.EMAIL_API_KEY;
    if (!apiKey) {
      consoleWarn("ResendEmailAdapter requires apiKey in config or EMAIL_API_KEY environment variable");
      this.resend = null;
    } else {
      this.fromEmail = config.fromEmail || env.EMAIL_SENDER;
      if (!this.fromEmail && apiKey) {
        throw new Error(
          "ResendEmailAdapter requires fromEmail in config or EMAIL_SENDER environment variable",
        );
      }
      this.resend = new Resend(apiKey);
    }

  }

  async send({ type, to, url, token }) {
    const templates = {
      verification: (url) => ({
        subject: "Verify your email address",
        html: `
              <h2>Verify your email</h2>
              <p>Click the link below to verify your email:</p>
              <a href="${url}" style="background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
              <p>Or copy and paste this link: ${url}</p>
              <p>This link will expire in 1 hour.</p>
              <p>If you didn't request this, please ignore this email.</p>
            `,
      }),
      "password-reset": (url) => ({
        subject: "Reset your password",
        html: `
              <h2>Password Reset Request</h2>
              <p>Click the link below to reset your password:</p>
              <a href="${url}" style="background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
              <p>Or copy and paste this link: ${url}</p>
              <p>This link will expire in 1 hour.</p>
              <p>If you didn't request this, please ignore this email.</p>
            `,
      }),
    };

    const template = templates[type];
    if (!template) {
      throw new Error(`ResendEmailAdapter: unknown email type "${type}"`);
    }

    const { error } = await this.resend.emails.send({
      from: this.fromEmail,
      to,
      ...template(url),
    });

    if (error) {
      throw new Error(
        `ResendEmailAdapter: failed to send email - ${error.message}`,
      );
    }
  }
}

export default ResendEmailAdapter;
