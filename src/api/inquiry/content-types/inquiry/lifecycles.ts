export default {
  async afterCreate(event: any) {
    const { result } = event;

    try {
      await strapi.plugin('email').service('email').send({
        to: result.inquiry_email,
        from: 'ust.icssc.noreply@gmail.com',
        replyTo: 'ust.icssc.noreply@gmail.com',
        subject: `Inquiry Received — UST ICSSC`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #AA0924;">UST ICSSC — Inquiry Confirmation</h2>
            <p>Dear ${result.fullName},</p>
            <p>Thank you for reaching out! We have received your inquiry and will get back to you as soon as possible.</p>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><strong>Subject</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${result.inquiry_subject}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><strong>Message</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${result.inquiry_message}</td>
              </tr>
            </table>
            <p style="margin-top: 24px;">We typically respond within 1-3 business days.</p>
            <p>If you have any urgent concerns, please contact us at sc.cics@ust.edu.ph</p>
            <br/>
            <p>Best regards,</p>
            <p><strong>UST ICSSC</strong><br/>sc.cics@ust.edu.ph</p>
          </div>
        `,
      });
    } catch (err) {
      console.error('Failed to send inquiry confirmation email:', err);
    }
  },

  async afterUpdate(event: any) {
    const { result, params } = event;

    // Only send reply email if adminReply was just added
    if (!result.adminReply) return;

    // Check if repliedAt is empty (meaning this is a new reply)
    const previousData = params.data;
    if (!previousData.adminReply) return;

    try {
      await strapi.plugin('email').service('email').send({
        to: result.inquiry_email,
        from: 'ust.icssc.noreply@gmail.com',
        replyTo: 'sc.cics@ust.edu.ph',
        subject: `Re: Your Inquiry — UST ICSSC`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #AA0924;">UST ICSSC — Reply to Your Inquiry</h2>
            <p>Dear ${result.fullName},</p>
            <p>Thank you for your patience. Here is our response to your inquiry:</p>
            <div style="background: #f9f9f9; border-left: 4px solid #AA0924; padding: 16px; margin: 16px 0; border-radius: 4px;">
              <p style="margin: 0;">${result.adminReply}</p>
            </div>
            <p>Your original message:</p>
            <div style="background: #f0f0f0; padding: 16px; margin: 16px 0; border-radius: 4px;">
              <p style="margin: 0; color: #666;">${result.inquiry_message}</p>
            </div>
            <p>If you have further questions, feel free to reach out to us at sc.cics@ust.edu.ph</p>
            <br/>
            <p>Best regards,</p>
            <p><strong>UST ICSSC</strong><br/>sc.cics@ust.edu.ph</p>
          </div>
        `,
      });

    } catch (err) {
      console.error('Failed to send inquiry reply email:', err);
    }
  },
};
