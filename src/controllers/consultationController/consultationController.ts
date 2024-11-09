import { BADREQUESTCODE, SUCCESSCODE } from "../../constants";
import { db } from "../../database/db";
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
    if (bookingDate.getDay() === 6) throw { status: BADREQUESTCODE, message: "We are closed on saturday" };
    if (bookingDate.getDay() === 7) throw { status: BADREQUESTCODE, message: "We are closed on sunday" };
    const consultation = await db.consultationBooking.create({
      data: {
        name,
        email,
        phone,
        message,
        bookingDate
      }
    });
    httpResponse(req, res, SUCCESSCODE, "Please check you email for confirmation", consultation);
  })
};
