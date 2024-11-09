import { ADMIN_MAIL_1 } from "../../config/config";
import { BADREQUESTCODE, SUCCESSCODE } from "../../constants";
import { db } from "../../database/db";
import { sendOrRecieveBookingMessage } from "../../services/consultationMessage";
import type { TCONSULTATION } from "../../types";
import { httpResponse } from "../../utils/apiResponseUtils";
import { asyncHandler } from "../../utils/asyncHandlerUtils";

export default {
  // *** create consultaionBooking controller
  createConsultation: asyncHandler(async (req, res) => {
    const { name, email, phone, message, bookingDate } = req.body as TCONSULTATION;

    const isConsultationDateAlreadyBooked = await db.consultationBooking.findUnique({
      where: {
        bookingDate: bookingDate
      }
    });
    if (isConsultationDateAlreadyBooked) throw { status: BADREQUESTCODE, message: "This date is already booked, Please choose another one" };
    if (typeof bookingDate !== "object") throw { status: BADREQUESTCODE, message: "Please enter a valid date" };
    if (bookingDate.getDay() === 6) throw { status: BADREQUESTCODE, message: "We are closed on saturday" };
    if (bookingDate.getDay() === 0) throw { status: BADREQUESTCODE, message: "We are closed on sunday" };

    const bookingHour = bookingDate.getHours();
    if (bookingHour < 9 || bookingHour >= 17) {
      throw { status: BADREQUESTCODE, message: "Consultation time must be between 9 AM and 5 PM" };
    }
    const consultation = await db.consultationBooking.create({
      data: {
        name,
        email,
        phone,
        message,
        bookingDate
      }
    });
    await sendOrRecieveBookingMessage(email, ADMIN_MAIL_1, message, name);
    httpResponse(req, res, SUCCESSCODE, "Please check you email for confirmation", consultation);
  })
};
