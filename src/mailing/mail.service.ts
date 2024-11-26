import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: any;
  private senderEmail: string;
  private backendUrl: string;

  constructor(private configService: ConfigService) {
    this.senderEmail = this.configService.get<string>('GMAIL_ADDRESS');
    this.backendUrl = this.configService.get<string>('BACKEND_URL');

    // Create mail transporter
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.senderEmail,
        pass: this.configService.get<string>('GMAIL_APP_PASSWORD'),
      },
    });
  }

  async sendVerificationEmail(
    email: string,
    verificationToken: string,
  ): Promise<void> {
    // For now we rae using backend URL gotta change to frontendURL in
    const verificationUrl = `${this.backendUrl}/auth/verify/${verificationToken}`;

    // Email content
    const mailOptions = {
      from: this.senderEmail,
      to: email,
      subject: 'Verify Your Email Address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome!</h2>
          <p>Thank you for registering. Please verify your email address to complete your registration.</p>
          <div style="margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #4CAF50; 
                      color: white; 
                      padding: 12px 24px; 
                      text-decoration: none; 
                      border-radius: 4px;
                      display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p style="color: #666;">${verificationUrl}</p>
          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            If you didn't create an account, you can safely ignore this email.
          </p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error(error);
      throw new Error('Failed to send verification email');
    }
  }

  async sendPasswordResetEmail(
    email: string,
    resetToken: string,
  ): Promise<void> {
    // Replace backendUrl with frontend URL if necessary
    const resetUrl = `${this.backendUrl}/reset-password?token=${resetToken}`;
    // Email content
    const mailOptions = {
      from: this.senderEmail,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>We received a request to reset your password. Click the link below to reset your password:</p>
          <div style="margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #FF6347; 
                      color: white; 
                      padding: 12px 24px; 
                      text-decoration: none; 
                      border-radius: 4px;
                      display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.</p>
          <p>Or copy and paste this link in your browser:</p>
          <p style="color: #666;">${resetUrl}</p>
          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            If you have any questions, feel free to contact our support team.
          </p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch {
      throw new Error('Failed to send password reset email');
    }
  }
}
