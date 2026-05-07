# Hotel GuestHub — Admin How-To Guide

> Plain-English walkthrough for hotel staff. No technical knowledge required.

This guide explains everything you can do as an admin: from logging in to setting up rooms, sending QR codes to guests, replying to messages, and reading your monthly value report.

---

## 1. Logging in

1. Open your hotel's website.
2. Scroll to the bottom — click the small **Staff** link in the footer.
3. Enter your email and password.
4. The dashboard opens at `/admin`.

If you forget the URL, you can also go directly to **`yourwebsite.com/admin/login`**.

### Switching language
In the top-right corner of every admin page, click the 🌐 **EN / RO** dropdown to switch between English and Romanian.

---

## 2. Creating new staff accounts

The very first person to sign up automatically becomes admin. Every additional staff member needs to be promoted.

**To add a new admin:**

1. Ask the new staff member to open `/admin/login` and click **"Need an account? Sign up"**.
2. They enter their email and password.
3. After they sign up, ask them to send you their **User ID** (they can find this in their browser, or you can find it in the Cloud → Users section).
4. You go to **Users** in the admin sidebar.
5. Paste their User ID and click **Grant admin**.
6. They sign out and back in — they now have full access.

You can also **revoke** admin access from the same page. The system prevents you from accidentally locking everyone out (at least one admin must remain).

---

## 3. Dashboard

The first page after login. At a glance you see:
- Open requests today
- Revenue from paid extras this month
- Recent guest activity
- Quick links to common tasks

---

## 4. Requests

Every time a guest scans the room QR and submits a request, it appears here.

**Statuses:**
- **New** — just received, no one has acted yet.
- **In progress** — staff has acknowledged.
- **Done** — completed.
- **Cancelled / Rejected** — won't be fulfilled.

**Actions:**
- Mark in progress / done.
- Add an internal staff note.
- **Reopen** a closed request if you closed it by mistake or the guest reports the issue isn't actually fixed.

Filter by status or by room to focus your view.

---

## 5. Messages

Submissions from the public **Contact** page land here. You can:
- Read the message.
- Reply directly from the dashboard (sends an email to the guest).
- Mark as replied / archived.

> **To enable real email sending**, the Resend integration must be connected once. Until then, replies are saved but not delivered.

---

## 6. Services

This is your **service catalog** — what guests can request through the QR.

**Examples:**
- Free: extra towels, late check-out request, taxi booking.
- Paid: airport transfer, in-room champagne, spa session.

**For each service you can set:**
- Title and description
- Category (Housekeeping, F&B, Concierge, etc.)
- Whether it's a paid extra (and the price estimate)
- Whether staff confirmation is required
- Sort order
- Active / inactive

Paid services contribute to the revenue figures shown in **Reports**.

---

## 7. Rooms

CRUD for the rooms that appear on your public website **and** that drive QR codes.

**When you add a room:**
- Fill name, slug (URL-friendly), short and long description.
- Capacity, bed type, amenities, sort order.
- Upload a **main image** (shown in the rooms grid).
- Upload **additional gallery images** (shown on the room detail page).
- Save.

**Automatic actions:**
- A QR code entry is automatically created for the new room (visible in **QR codes**).

The room appears immediately on the public site, and clicking **View details** opens its own page with the gallery you uploaded.

---

## 8. Offers

Promotional packages (e.g. "Romantic Weekend", "3 nights for the price of 2").

- Toggle the entire **Offers page** on/off in **Settings** (or via the toggle here).
- For each offer: title, badge, description, perks list, image, sort order, active/inactive.
- Active offers appear at `/offers` and in the navigation.

---

## 9. QR codes

One QR per physical room. Used by guests to access the service hub.

**You can:**
- Download each QR as PNG and print it.
- Edit the room label.
- Activate / deactivate codes (e.g. for renovation).
- Re-print at any time.

When you create a new room, its QR is automatically generated here.

---

## 10. Content

Manages the editorial content on the public website. Three tabs:

### Sections
Edit headline / subhead / paragraph text for:
- **Hero** (homepage banner)
- **About** section
- **Amenities**
- **Footer** tagline

Changes are live on the website immediately after saving.

### Hero image
Upload the large background image shown on the homepage hero. JPG or PNG, ideally 1920 × 1080 or larger.

### Gallery
The public **Gallery** page on your website.
- Upload one or many images at once.
- Add alt text and a category (Rooms, Common areas, Surroundings, Food).
- Reorder, deactivate, delete.

---

## 11. Reports

Your **monthly value report** — proves to the owner why this product is worth €30/month.

**You'll see:**
- Total guest interactions handled this month.
- Revenue from paid extras.
- Estimated staff time saved.
- Average guest satisfaction (from feedback).
- Trend vs previous month.

Use this in management meetings or directly when justifying the subscription renewal.

---

## 12. MVP checklist

A built-in setup checklist for new properties. Tick items off as you complete:
- Property settings filled in
- Logo / colours configured
- At least 3 rooms with QR codes
- Service catalog populated
- Hero image uploaded
- Test request submitted

Helps you know when the system is "demo-ready" or "guest-ready".

---

## 13. Settings

The hotel-wide configuration:

- **Property name, type**
- **Address, city, country**
- **Phone, WhatsApp, email**
- **Booking URL** (the link your "Book Direct" buttons open — set this to your booking engine, Booking.com page, etc.)
- **Check-in / check-out times**
- **Default language**
- **Currency**
- **Primary & secondary colour** — these instantly re-skin the whole public website.
- **Toggle Offers page on/off**

Save and the website updates immediately.

---

## 14. Tips & best practices

- **Print QR codes on quality cardstock** and place them somewhere obvious in the room (bedside, desk, behind the door).
- **Keep services up to date** — guests trust the catalog more than a paper directory.
- **Respond to requests within 15 minutes** during the day — this is what guests value most.
- **Reply to contact messages within 24 hours** — directly affects conversion to direct bookings.
- **Update the hero image seasonally** — winter view in winter, terrace in summer, etc.
- **Use offers for low-occupancy nights** rather than dropping the public rate.

---

## 15. Need help?

- For anything technical (deployment, integrations, custom domain, email DNS), see **DOCUMENTATION.md**.
- For sales conversations: open **Reports** and screen-share the monthly value figures — the conversation usually answers itself.
