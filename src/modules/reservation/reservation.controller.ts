import { Reservation } from "../../DB/models/reservation.model.js";
import { Room, IRoom } from "../../DB/models/room.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { Request, Response, NextFunction } from "express";
import Stripe from "stripe";
import { Types } from "mongoose";
import { error } from "console";

export const createReservation = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { roomId, checkInDate, checkOutDate, userId } = req.body;
    const room = await Room.findById(roomId);
    if (!room) return next(new Error("room not found"));
    // check في حجز ولا للوضه
    const isRoomReserved = await Reservation.findOne({
      room: roomId,
      $or: [
        { checkInDate: { $gte: checkInDate, $lt: checkOutDate } },
        { checkOutDate: { $gt: checkInDate, $lte: checkOutDate } },

        {
          checkInDate: { $lte: checkInDate },
          checkOutDate: { $gte: checkOutDate },
        },
      ],
    });

    if (isRoomReserved) return next(new Error("room is already reserved"));
    // تحويل تسجيل الدخول والخروح من string to date عشان جايه من ال body

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // حساب عدد الايام

    const defTime = checkOut.getTime() - checkIn.getTime();
    const difDays = Math.ceil(defTime / (1000 * 60 * 60 * 24));
    const calculatedTotalPrice = difDays * room.price;

    // create reservation
    // 4️⃣ إنشاء الحجز
    const reservation = await Reservation.create({
      room: roomId,
      user: userId,
      checkInDate,
      checkOutDate,
      totalPrice: calculatedTotalPrice,
      status: "pending",
    });
    // send response
    return res.status(201).json({
      success: true,
      message: "Reservation created successfully",
      reservation,
    });
  }
);

// update reservation
export const updateReservation = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { checkInDate, checkOutDate, room } = req.body;
    const reservation = await Reservation.findById(req.params.id).populate<{
      room: IRoom;
    }>("room");

    if (!reservation)
      return next(
        new Error("cant update reservation before create reservation")
      );

    const currentRoom = reservation.room as IRoom & { _id: string };
    let newRoomId = currentRoom._id;
    let newRoomPrice = reservation.room.price;

    if (room && room !== currentRoom._id.toString()) {
      const newRoom = (await Room.findById(room)) as IRoom & { _id: string };
      if (!newRoom) return next(new Error("New room not found"));

      newRoomPrice = newRoom.price;
      reservation.room = room;
      newRoomId = newRoom._id.toString();
    }

    // لو هيعدل الوقت
    const checkIn = checkInDate
      ? new Date(checkInDate)
      : reservation.checkInDate;
    const checkOut = checkOutDate
      ? new Date(checkOutDate)
      : reservation.checkOutDate;

    // check في حجز فنفس الوقت لنفس الغرفه ولا

    const conflicting = await Reservation.findOne({
      _id: { $ne: req.params.id },
      room: newRoomId,
      $or: [
        { checkInDate: { $gte: checkIn, $lt: checkOut } },
        { checkOutDate: { $gt: checkIn, $lte: checkOut } },
        {
          checkInDate: { $lte: checkIn },
          checkOutDate: { $gte: checkOut },
        },
      ],
    });
    if (conflicting) return next(new Error("Room is already reserved"));

    reservation.checkInDate = checkIn;
    reservation.checkOutDate = checkOut;

    // تحديث السعر تلقائيًا
    const diffTime = checkOut.getTime() - checkIn.getTime();
    const difDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    reservation.totalPrice = difDays * newRoomPrice;

    await reservation.save();

    return res.json({
      success: true,
      message: "Reservation updated successfully",
      reservation,
    });
  }
);
// cancelReservation
export const cancelReservation = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const reservation = await Reservation.findById(id);
    if (!reservation)
      return next(
        new Error("cant cancel reservation before make reservation:D")
      );
    // تحقق إن صاحب الحجز هو اللي بيطلب الإلغاء

    const userId = (req.user as { _id: string })?._id;
    if (reservation.user.toString() !== userId?.toString()) {
      return next(new Error("You can only cancel your own reservations"));
    }
    // if (
    //   req.user &&
    //   (req.user as { role: string; _id: string }).role === "user" &&
    //   reservation.user.toString() !==
    //     (req.user as { _id: string })._id.toString()
    // )
    // {
    //   return next(new Error("Not authorized to cancel this reservation"));
    // }
    // لو الحجز already cancelled أو completed
    if (reservation.status === "cancelled") {
      return next(new Error("Reservation is already cancelled"));
    }
    if (reservation.status === "completed") {
      return next(new Error("Completed reservations cannot be cancelled"));
    }
    // تحديث الحالة
    reservation.status = "cancelled";
    await reservation.save();

    return res.status(200).json({
      success: true,
      message: "Reservation cancelled successfully",
      reservation,
    });
  }
);
// payment
export const payForReservation = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const reservation = await Reservation.findById(id).populate<{
      room: IRoom;
    }>("room");
    if (!reservation) {
      return next(new Error("Reservation not found"));
    }
    const successUrl = "http://localhost:3000/success";
    const cancelUrl = "http://localhost:3000/cancel";

    if (!successUrl || !cancelUrl) {
      return next(new Error("Stripe URLs are not defined in env"));
    }
    if (!process.env.STRIPE_KEY) {
      return next(new Error("Stripe secret key is not defined in env"));
    }
    const stripe = new Stripe(process.env.STRIPE_KEY!);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      metadata: {
        reservationId: (reservation._id as Types.ObjectId).toString(),
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
      line_items: [
        {
          price_data: {
            currency: "egp",
            product_data: {
              name: `Room ${(reservation.room as IRoom)._id} Booking`,
              description: `From ${reservation.checkInDate} to ${reservation.checkOutDate}`,
            },
            unit_amount: reservation.totalPrice * 100, // Stripe بالقرش
          },
          quantity: 1,
        },
      ],
    });
    return res.status(200).json({
      success: true,
      message: "Payment session created successfully",
      session,
    });
  }
);

//reservationWebhook
export const reservationWebhook = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const stripe = new Stripe(process.env.STRIPE_KEY!);
    const signature = req.headers["stripe-signature"]!;
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      return res.status(400).send("Webhook signature verification failed");
    }
    // Handle the event
    const session = event.data.object as Stripe.Checkout.Session;
    const reservationID = session.metadata?.reservationId;
    if (!reservationID) {
      return res.status(400).send("Reservation ID missing in metadata");
    }

    if (event.type === "checkout.session.completed") {
      //change reservation status
      await Reservation.findOneAndUpdate(
        { _id: reservationID },
        { status: "completed" }
      );
      return;
    }
    await Reservation.findOneAndUpdate(
      { _id: reservationID },
      { status: "cancelled" }
    );
    res.sendStatus(200);
  }
);
