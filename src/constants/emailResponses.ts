import { COMPANY_NAME } from ".";

export default {
  CONSULTATIONPENDINGMESSAGEFROMADMIN: `Thank You for your interest in ${COMPANY_NAME}. We have received your request for "free consultation". We are reviewing your request and will get back to you as soon as possible.<p>Best regards,</p> Prime Logic Solution`,
  CONSULTATIONAPPROVALMESSAGEFROMADMIN: `I hope you are doing well, Thank You for your Patience. We are excited to tell you that your request for having a free consultation with us has have been accepted,`,
  CONSULTATIONREJECTMESSAGEFROMADMIN: `We hope this message finds you well. Thank you for your understanding and patience. Unfortunately, after careful consideration, we regret to inform you that we are unable to proceed with scheduling your consultation at this time due to internal circumstances. We truly appreciate your interest and hope to have the opportunity to work with you in the future.<p>Best regards,</p>${COMPANY_NAME}`,
  HIREUSMESSAGE: `Thank you for reaching out to us. We would like to inform you that your request is currently under review. Our team is carefully assessing the details, and we will get back to you as soon as possible with an update.We appreciate your patience and understanding during this process. If you have any additional questions or need further assistance in the meantime, please don’t hesitate to reach out. <p>Best Regards,</p> ${COMPANY_NAME}`,
  THANKYOUMESSAGE: `Thank you for submitting your join request to work with us. We truly appreciate the time and effort you took to reach out, and we’re excited to review your profile. We’ll carefully go through your application and get back to you soon. In the meantime, feel free to share any additional details or ask any questions you may have about the project.Looking forward to connecting further!<p>Best Regard,</p> ${COMPANY_NAME}`,
  WELCOMEMESSAGEFORFREELANCER: `Welcome to the team! We’re excited to have you on board and look forward to working with you. Your expertise will be a great asset, and we’re confident this collaboration will be a success. If you have any questions or need anything to get started, feel free to reach out.`,
  ADMINNAME: ` administrator from ${COMPANY_NAME}`,
  OTP_SENDER_MESSAGE: (OTP: string, expireyTime?: string): string => {
    const message = `<br>  Please use this OTP code <span style="color: blue; font-weight: bold"> ${OTP} </span> to verify your account. If you did not request this , please ignore it.<br>${expireyTime ? `<span style="text-align:center; color:red; display:block;font-weight:bold;"><i>OTP is valid for ${expireyTime}</i></span>` : ""}`;
    return message;
  }
};
