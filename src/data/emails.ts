import { Email } from '../types';

export const presetEmails: Email[] = [
  // --- PHISHING EMAILS ---
  {
    id: 'phish-1',
    sender: 'security@paypal-verification-alert.com',
    subject: 'URGENT: Your account has been temporarily suspended',
    body: `Dear customer,

We detected some unauthorized login attempts to your PayPal account from an unfamiliar IP address. To protect your funds, we have temporarily restricted your account.

You must click the link below to verify your identity and restore access immediately:
http://paypal-identity-secure-login.net/verify/login.php

If you do not complete verification within 24 hours, your account will be permanently closed and any remaining balance will be forfeited.

Thank you,
PayPal Security Team`,
    label: 'Phishing'
  },
  {
    id: 'phish-2',
    sender: 'billing@netflix-updates-support.com',
    subject: 'Action Required: Update your payment details to avoid service suspension',
    body: `Your subscription payment of $15.49 was declined by your bank. As a result, we could not renew your Netflix membership.

To prevent your service from being terminated, please update your billing info as soon as possible.

Update Billing Info Now:
http://netflix-billing-renew-portal.com/update-payment

We will try to process your subscription again in 48 hours.

Happy streaming,
The Netflix Team`,
    label: 'Phishing'
  },
  {
    id: 'phish-3',
    sender: 'irs-refund-alert-992@irs-tax-refund.org',
    subject: 'Notice of Tax Refund - Urgent action required to claim $1,420.50',
    body: `Internal Revenue Service
Office of the Commissioner

After completing our annual tax calculation, we have discovered that you are eligible to receive a tax refund of $1,420.50.

To file your claim and receive your refund directly into your bank account, please use the secure IRS refund form here:
http://irs-tax-gov-refunds.com/claim-form.html

Please note that processing claims can take up to 3 days. Do not share your tax file number with anyone.

Sincerely,
IRS Tax Commissioner`,
    label: 'Phishing'
  },
  {
    id: 'phish-4',
    sender: 'ceo-office-direct@tech-corp-hq.com',
    subject: 'Confidential: Wire Transfer Request - Complete by EOD',
    body: `Hi,

Are you at your desk right now? I need you to handle a highly confidential wire transfer for an acquisition we are closing by the end of today.

Please send $45,000 to the bank details in the attached request. Since this is highly sensitive and we are under NDA, do not discuss this with anyone in the office or call me, as I am in back-to-back board meetings.

Confirm once you have processed this, and I will send over the billing codes tomorrow morning.

Thanks,
Robert Vance, CEO`,
    label: 'Phishing'
  },
  {
    id: 'phish-5',
    sender: 'delivery-alerts@dhl-tracking-express.com',
    subject: 'Your package could not be delivered - Missing delivery address fee',
    body: `DHL Express Courier Notification

We attempted to deliver your parcel (Tracking ID: #DHL-99281-US) at 10:15 AM today, but the driver reported a missing apartment number or incorrect postal code.

A small address-correction fee of $1.50 is required before we can schedule a redelivery.

Pay shipping correction fee and schedule delivery:
http://dhl-package-tracking-fees.com/redelivery-portal

If unclaimed within 3 business days, the parcel will be returned to the sender.

Best regards,
DHL Support Service`,
    label: 'Phishing'
  },
  {
    id: 'phish-6',
    sender: 'no-reply@meta-business-verification.com',
    subject: 'Alert: Your Facebook Business Page will be unpublished due to copyright violations',
    body: `Meta Business Suite Protection

We have received multiple complaints regarding copyright infringements on your business page. Your page has been flagged and is scheduled to be deleted/unpublished in 12 hours.

If you believe this is a mistake, you must submit an appeal immediately to prove ownership of the content.

Submit Copyright Appeal:
http://meta-appeals-case-resolution.net/auth/index.php

Failure to appeal within the time limit will result in permanent loss of your business assets.

Meta Platforms Inc.`,
    label: 'Phishing'
  },
  {
    id: 'phish-7',
    sender: 'rewards-notification@amazon-gift-card-rewards.com',
    subject: 'Congratulations! You won a $1,000 Amazon Gift Card!',
    body: `Shopper Survey Winner!

You have been selected as our Grand Prize Winner of the weekly Amazon Loyalty Survey! You are entitled to claim a free $1,000 Amazon Electronic Gift Card.

To claim your prize, simply answer our brief 3-minute shopper experience survey and verify your email:
http://claim-free-amazon-giftcard.net/loyalty-winner

Supplies are limited. Act fast to lock in your reward!

Amazon Rewards Panel`,
    label: 'Phishing'
  },
  {
    id: 'phish-8',
    sender: 'support@chase-bank-online-alert.com',
    subject: 'Security Alert: Suspicious transaction detected on your Credit Card',
    body: `Chase Online Fraud Protection

Our systems detected a suspicious purchase of $899.99 at "Best Buy Online" using your Chase Debit Card.

If this was NOT you, please click the link below immediately to cancel the charge and block your card:
http://chase-bank-fraud-cancel.com/security-check

If you do not report this within 1 hour, we may not be able to dispute the transaction.

Thank you for choosing Chase.`,
    label: 'Phishing'
  },
  {
    id: 'phish-9',
    sender: 'it-support@office-microsoft-login.com',
    subject: 'Urgent: Microsoft Office365 password expiration notice',
    body: `IT Service Desk Alert

Your Microsoft Office365 enterprise password is scheduled to expire in exactly 4 hours. If your password expires, you will lose access to Outlook, Teams, and SharePoint.

To keep your current password, click below and verify your credentials:
http://microsoft-office365-password-renew.com/verify-current-pass

Please do not ignore this notification.

Microsoft Office Administrator`,
    label: 'Phishing'
  },
  {
    id: 'phish-10',
    sender: 'support@binance-crypto-staking.net',
    subject: 'Double your Bitcoin! Binance staking anniversary promo',
    body: `To celebrate our anniversary, we are giving back to our community!

Send any amount of Bitcoin (BTC) or Ethereum (ETH) to our official staking address below, and our automated smart contract will instantly send you DOUBLE (2x) the amount back!

Official Promotion Address: 1Lbc7t96G7v54u5yDI6y56rS6Y7s
Verify staking details and make transfer:
http://binance-anniversary-staking-double.org/promo

Hurry up, only 500 BTC are allocated for this reward pool!`,
    label: 'Phishing'
  },
  {
    id: 'phish-11',
    sender: 'hr@internal-talent-portal.com',
    subject: 'Urgent: Review your salary adjustment plan for Q3',
    body: `Hello Team,

Please review the attached spreadsheet containing the updated salary adjustments and performance bonus plans for Q3 of 2026.

All employees are required to verify their details and sign the policy statement:
http://internal-talent-portal-company-review.com/salary-adjustment

Any adjustments not verified by Friday will be delayed to the next quarter.

Best regards,
Human Resources Department`,
    label: 'Phishing'
  },
  {
    id: 'phish-12',
    sender: 'verification-system@wellsfargo-accounts.com',
    subject: 'Security Verification Required: Verify your online banking credentials',
    body: `Dear Wells Fargo Customer,

During our routine security check, we noticed missing demographic information on your online banking profile. For your safety, we require all customers to complete full profile verification.

Please click here to log in and update your security questions:
http://wellsfargo-banking-profile-auth.com/login

Failure to verify within 48 hours will result in temporary lockouts of your ATM and online access.

Wells Fargo Customer Service`,
    label: 'Phishing'
  },

  // --- SAFE EMAILS ---
  {
    id: 'safe-1',
    sender: 'sarah.connor@acme-corp.com',
    subject: 'Q3 Product Roadmap Review - Meeting notes and slides',
    body: `Hi team,

Thanks to everyone who attended the roadmap review session today! I have attached the meeting notes and the slide deck for your reference.

Key takeaways:
- We are aiming to release Phase 1 of the new dashboard by mid-August.
- Dev and design teams need to sync on the Figma layouts by next Tuesday.
- Marketing will start preparing the press release drafts.

Please let me know if you have any questions or if I missed anything in the notes.

Best regards,
Sarah Connor
Director of Product, Acme Corp`,
    label: 'Safe'
  },
  {
    id: 'safe-2',
    sender: 'github-updates@github.com',
    subject: '[GitHub] Security Alert: 3 dependencies require immediate update',
    body: `Hello @dev_user,

We found vulnerabilities in the following dependencies of your repository 'my-project-app':
- lodash (low severity)
- axios (high severity)
- express (medium severity)

Please review the alerts and run 'npm audit fix' or merge the automated Pull Requests generated by Dependabot to resolve these issues.

View vulnerability details:
https://github.com/my-user/my-project-app/security/dependabot

GitHub Security Team`,
    label: 'Safe'
  },
  {
    id: 'safe-3',
    sender: 'billing@billing-services.stripe.com',
    subject: 'Your receipt for invoice #INV-928117 from Slack Technologies',
    body: `Receipt from Slack Technologies

Thank you for your payment of $48.00 USD. Your credit card ending in 4242 was successfully charged.

Invoice details:
- Slack Pro Subscription (4 seats)
- Period: July 15, 2026 - August 15, 2026

You can download a PDF version of your invoice or manage your billing settings in your Slack workspace settings page.

If you have any questions, reply to support@slack.com.

Stripe Billing Services`,
    label: 'Safe'
  },
  {
    id: 'safe-4',
    sender: 'newsletter@hacker-news-weekly.com',
    subject: 'Hacker News Weekly: Why CSS is turning into a programming language',
    body: `Here are the top stories on Hacker News this week:

1. CSS Anchor Positioning is a Game Changer (342 points, 89 comments)
2. Why SQLite is perfect for your next SaaS startup (298 points, 142 comments)
3. Show HN: PyScript running complete machine learning models in browser (512 points, 203 comments)
4. Show HN: Elegant responsive charting with React and Tailwind (195 points, 38 comments)

To unsubscribe from this weekly newsletter, click the link below:
https://hacker-news-weekly.com/unsubscribe?email=user@example.com

Have a great week!`,
    label: 'Safe'
  },
  {
    id: 'safe-5',
    sender: 'noreply@zoom.us',
    subject: 'Scheduled Zoom Meeting: Weekly Sync with Marketing Team',
    body: `Hi David,

You are invited to a scheduled Zoom meeting.

Topic: Weekly Marketing Sync
Time: Jul 17, 2026 10:00 AM Pacific Time (US and Canada)

Join Zoom Meeting:
https://zoom.us/j/98172655182?pwd=ZXlGSHRSTXp3RGRoM2kxUT09

Meeting ID: 981 7265 5182
Passcode: marketing123

Find your local number: https://zoom.us/u/abC12def

See you then!`,
    label: 'Safe'
  },
  {
    id: 'safe-6',
    sender: 'support@digitalocean.com',
    subject: 'Monthly Cloud Usage Bill - July 2026',
    body: `Hello Customer,

Your DigitalOcean invoice for the month of July 2026 is now available.

Total Amount Due: $12.40 USD
Payment Method: Visa ending in 9876 (auto-charged on the 1st of the month)

Summary:
- 1x Droplet (2GB RAM, 1 vCPU): $10.00
- 1x Automated Backups: $2.00
- Taxes & Fees: $0.40

You can view the full itemized breakdown inside your DigitalOcean control panel:
https://cloud.digitalocean.com/billing

Thanks for building on DigitalOcean!`,
    label: 'Safe'
  },
  {
    id: 'safe-7',
    sender: 'grandma.helen@gmail.com',
    subject: 'Recipe for the peach cobbler we talked about!',
    body: `Hi sweetie,

It was so wonderful talking to you on the phone yesterday. I'm so glad your new job is going well!

As promised, here is the recipe for the peach cobbler that you loved so much:
- 4 cups peeled, sliced peaches
- 1 cup all-purpose flour
- 1 cup granulated sugar
- 1 tablespoon baking powder
- 1/4 teaspoon salt
- 1 cup whole milk
- 1/2 cup unsalted butter, melted

Mix the dry ingredients, stir in milk and butter, then top with peaches and bake at 350F for 45 minutes until golden brown.

Let me know how it turns out. Sending you lots of love!

Love,
Grandma Helen`,
    label: 'Safe'
  },
  {
    id: 'safe-8',
    sender: 'notifications@linkedin.com',
    subject: 'Michael Vance and 2 others viewed your profile this week',
    body: `LinkedIn

Hi David,

People are looking at your profile on LinkedIn! See who viewed your profile and what industries they work in.

- Michael Vance (CEO at Vance Refrigeration)
- 2 recruiters from TechCorp and SoftDev Systems

Upgrade to Premium to unlock full names and search terms that brought them to your profile.

View Views:
https://www.linkedin.com/me/profile-views

You received this email because you are a registered LinkedIn user.`,
    label: 'Safe'
  },
  {
    id: 'safe-9',
    sender: 'university-library@state-college.edu',
    subject: 'Library book overdue reminder: "Introduction to Algorithms"',
    body: `State College Library System
Notice of Overdue Materials

Dear student,

According to our database, the following book borrowed under your student ID is currently overdue:

Title: "Introduction to Algorithms, Third Edition"
Due Date: July 12, 2026
Barcode: #STC-L-98281

Please return the book to the front desk or renew it online at your earliest convenience to avoid incurring additional overdue fines ($0.25 per day).

Renew Online:
https://library.state-college.edu/my-account

Thank you for your cooperation.`,
    label: 'Safe'
  },
  {
    id: 'safe-10',
    sender: 'noreply@trello.com',
    subject: '[Trello] Action items assigned to you in board "Product Launch"',
    body: `Trello Notification

Hey David,

Sarah Connor added you to the following cards in 'Product Launch':

1. Draft Email Templates for Beta Users
2. Set up Google Analytics tracking IDs
3. Review pricing structure proposals

Please check the board details to see checklists and due dates for each task:
https://trello.com/b/8291A77x/product-launch

If you want to turn off email notifications, edit your profile preferences inside Trello.`,
    label: 'Safe'
  },
  {
    id: 'safe-11',
    sender: 'airline-receipts@delta.com',
    subject: 'Your Delta Flight Flight Confirmation - Flight DL2084 to Seattle',
    body: `Delta Air Lines

Thank you for booking with us. Your flight reservation is confirmed.

Passenger: DAVID MILLER
Confirmation Code: #DL-XR8193
Flight: DL2084
Departing: San Francisco (SFO) - July 20, 2026 at 2:15 PM
Arriving: Seattle (SEA) - July 20, 2026 at 4:30 PM

Check-in online starting 24 hours before your departure:
https://www.delta.com/flight-checkin

We look forward to welcoming you onboard!`,
    label: 'Safe'
  },
  {
    id: 'safe-12',
    sender: 'support@figma.com',
    subject: 'Figma: New comment on "Acme Redesign Mockups"',
    body: `Figma Design Team

Hi David,

Jessica Adams left a new comment on 'Acme Redesign Mockups' (page 'Dashboard - V2'):

"I think we should increase the padding on these card containers and use a slightly lighter gray for the subtexts. Right now the contrast is a bit low. What do you think?"

Reply to comment on Figma:
https://www.figma.com/file/acme-redesign-v2?comment=8828192

To change your notification settings, go to Account Settings in Figma.`,
    label: 'Safe'
  }
];
