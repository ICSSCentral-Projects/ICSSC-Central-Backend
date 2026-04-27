export default {
  async afterCreate(event: any) {
    const { result } = event;

    try {
      await strapi.plugin('email').service('email').send({
        to: result.foi_email,
        from: 'ust.icssc.noreply@gmail.com',
        replyTo: 'ust.icssc.noreply@gmail.com',
        subject: `FOI Request Received — ${result.refId}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #AA0924;">UST ICSSC — FOI Request Confirmation</h2>
            <p>Dear ${result.requestedBy},</p>
            <p>Your FOI request has been successfully received. Here are your details:</p>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><strong>Reference No.</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${result.refId}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><strong>Document Requested</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${result.foi_title}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><strong>Affiliation</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${result.foi_affiliation}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><strong>Status</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">Pending</td>
              </tr>
            </table>
            <p style="margin-top: 24px;">We will process your request within 5-7 business days.</p>
            <p>If you have any questions, please contact us at sc.cics@ust.edu.ph</p>
            <br/>
            <p>Best regards,</p>
            <p><strong>UST ICSSC</strong><br/>sc.cics@ust.edu.ph</p>
          </div>
        `,
      });
    } catch (err) {
      console.error('Failed to send FOI confirmation email:', err);
    }
  },
};
