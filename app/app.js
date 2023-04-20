import dotenv from "dotenv";
dotenv.config();
import express from "express";
import Stripe from "stripe";
import cors from "cors";


import connectDatabase from "../config/dbConnect.js";
import { globalErrhandler, notFound } from "../middlewares/globalErrhandler.js";
import userRoutes from "../routes/userRoute.js";
import productRouter from "../routes/productRoutes.js";
import categoryRouter from "../routes/categoriesRoutes.js";
import brandRouter from "../routes/brandRoutes.js";
import ColorRouter from "../routes/colorRoutes.js";
import reviewRouter from "../routes/reviewRoutes.js";
import orderRouter from "../routes/orderRoutes.js";
import couponRouter from "../routes/couponRoutes.js";
import Order from "../model/Order.js";

connectDatabase();

const app = express();
app.use(cors());

// stripe webhook
const stripe = new Stripe(process.env.STRIPE_KEY);

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret =
  "whsec_e598dec00683969133f936247f06c701b76eb8efd66b2d61fbc7b4aceafcc3d2";
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async(request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
      console.log(event);
    } catch (err) {
        console.log(err);
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    if(event.type === "checkout.session.completed"){
      //update the order
      const session = event.data.object;
      const {orderId} = session.metadata;
      const paymentStatus = session.payment_status;
      const paymentMethod = session.payment_method_types[0];
      const totalAmount = session.amount_total;
      const currency = session.currency;
      

      //find the order
      const order = await Order.findByIdAndUpdate(JSON.parse(orderId),
        {
          totalPrice: totalAmount /100,
          currency,
          paymentMethod,
          paymentStatus,
        },
        {
          new : true,
        })
    }else{
      return;
    }

    // Handle the event
    // switch (event.type) {
    //   case "payment_intent.succeeded":
    //     const paymentIntentSucceeded = event.data.object;
    //     // Then define and call a function to handle the event payment_intent.succeeded
    //     break;
    //   // ... handle other event types
    //   default:
    //     console.log(`Unhandled event type ${event.type}`);
    // }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

app.use(express.json());

//routes
app.use("/api/v1/users/", userRoutes);
app.use("/api/v1/products/", productRouter);
app.use("/api/v1/categories/", categoryRouter);
app.use("/api/v1/brand/", brandRouter);
app.use("/api/v1/colors/", ColorRouter);
app.use("/api/v1/review/", reviewRouter);
app.use("/api/v1/orders/", orderRouter);
app.use("/api/v1/coupon", couponRouter);

//err middlewares
app.use(notFound);
app.use(globalErrhandler);

export default app;
