import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const {
      reportType,
      order,
      supplier,
      manufacturer,
      quantityReceived,
      confirmDelivery,
    } = await request.json();

    // Construct email content
    const subject = `Problem Report for Order #${order.id} - ${reportType}`;
    const message = `
      <h2>Problem Report</h2>
      <h3>Order Details:</h3>
      <ul>
        <li><strong>ID:</strong> ${order.id}</li>
        <li><strong>Material Name:</strong> ${order.materialName}</li>
        <li><strong>Quantity Ordered:</strong> ${order.quantityOrdered}</li>
        <li><strong>Quantity Received:</strong> ${order.quantityReceived}</li>
        <li><strong>Price:</strong> ${order.price}</li>
        <li><strong>Status:</strong> ${order.status}</li>
        <li><strong>Shipped At:</strong> ${order.shippedAt}</li>
        <li><strong>Expected Arrival:</strong> ${order.shouldArriveAt}</li>
        <li><strong>Arrival Status:</strong> ${order.arrivedAt}</li>
      </ul>
      <h3>Supplier Details:</h3>
      <ul>
        <li><strong>Name:</strong> ${supplier?.name || "N/A"}</li>
        <li><strong>Email:</strong> ${supplier?.email || "N/A"}</li>
        <li><strong>Address:</strong> ${supplier?.address || "N/A"}</li>
        <li><strong>Place:</strong> ${supplier?.place || "N/A"}</li>
        <li><strong>Fraud Status:</strong> ${supplier?.fraudStatus || "N/A"}</li>
        <li><strong>Reliability Rating:</strong> ${supplier?.reliabilityRating || "N/A"}</li>
        <li><strong>Violations:</strong> ${supplier?.violations || "0"}</li>
      </ul>
      <h3>Manufacturer Details:</h3>
      <ul>
        <li><strong>Name:</strong> ${manufacturer?.name || "N/A"}</li>
        <li><strong>Email:</strong> ${manufacturer?.email || "N/A"}</li>
        <li><strong>Address:</strong> ${manufacturer?.address || "N/A"}</li>
        <li><strong>Place:</strong> ${manufacturer?.place || "N/A"}</li>
      </ul>
      <h3>Report Details:</h3>
      <p><strong>Report Type:</strong> ${reportType}</p>
      ${
        reportType === "quantity" || reportType === "both"
          ? `<p><strong>Quantity Issue:</strong> Supplier delivered ${quantityReceived} units instead of ${order.quantityOrdered} ordered.</p>`
          : ""
      }
      ${
        reportType === "delay" || reportType === "both"
          ? `<p><strong>Delay Issue:</strong> ${
              confirmDelivery
                ? "Order delivered with delay"
                : "Order not delivered by expected date: " + order.shouldArriveAt
            }</p>`
          : ""
      }
    `;

    // Send email
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.MAILER_USER,
      to: "faresrahm40@gmail.com",
      subject,
      html: `<h3>Name: ${manufacturer?.name || "Manufacturer"}</h3> <h3>Email: ${
        manufacturer?.email || "No email provided"
      }</h3> <p>${message}</p>`,
    };

    await transport.sendMail(mailOptions);

    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}