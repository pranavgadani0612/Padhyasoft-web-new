/* Privacy Policy + Terms & Conditions – text copied as-is from the original padhyasoft.com pages
   (PadhyaSoft042025-master/Views/Home/Privacy.cshtml and TermsAndConditions.cshtml). */
import { PageHero } from "../components/sections/Sections.jsx";
import { useTitle } from "../components/ui.jsx";

function LegalLayout({ title, sub, children, side }) {
  return (
    <>
      <PageHero title={title} sub={sub} heroView="legal" band={<div className="legal-band" />} />
      <section className="sec bpost-sec">
        <div className="wrap bpost">
          <article className="bp-main prose legal">{children}</article>
          <aside className="bp-side">{side}</aside>
        </div>
      </section>
    </>
  );
}

const ext = { target: "_blank", rel: "noopener noreferrer" };

/* ======================= PRIVACY POLICY ======================= */
export function PrivacyPolicy() {
  useTitle("Privacy Policy - Padhya Software Technologies");
  return (
    <LegalLayout
      title="Privacy Policy"
      sub="Effective date: July 2026"
      side={
        <div className="bp-box legal-contact">
          <h4>Contact Us</h4>
          <p>For privacy inquiries, data requests, or to exercise your rights:</p>
          <dl>
            <dt>Company</dt>
            <dd>Padhya Software Technologies</dd>
            <dt>Email</dt>
            <dd><a href="mailto:info@padhyasoft.com">info@padhyasoft.com</a></dd>
            <dt>Phone</dt>
            <dd><a href="tel:+919016575815">+91 9016575815</a></dd>
            <dt>Address</dt>
            <dd>303, APM Mall Complex, Near Bharat Petrol Pump, Sattadhar Cross Road, Ghatlodiya, Ahmedabad, Gujarat 380061, India</dd>
          </dl>
          <div className="legal-btns">
            <a className="btn btn-ghost" href="/contact">Contact Us</a>
            <a className="btn btn-primary" href="/services">Our Services</a>
          </div>
        </div>
      }
    >
      <p className="legal-intro">
        This Privacy Policy explains how Padhya Software Technologies ("we", "us", "our") collects, uses, and protects information when you use{" "}
        <a href="https://www.padhyasoft.com" {...ext}>padhyasoft.com</a> (the "Website") or contact us.
      </p>

      <h2>1. Information We Collect</h2>
      <ul>
        <li><strong>Information you give us:</strong> name, email address, phone/WhatsApp number, company name, and any details you enter in our enquiry or quote forms.</li>
        <li><strong>Information collected automatically:</strong> IP address, browser type, device, pages viewed, and referring source, via cookies and analytics tools.</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>We use your information to respond to enquiries, prepare quotes and proposals, provide our services, improve the Website, and (where you agree) send relevant updates. We do not sell your personal information.</p>

      <h2>3. Cookies &amp; Analytics</h2>
      <p>We use cookies and similar technologies, including Google Analytics 4 and Google Ads, to understand Website usage and measure our advertising. You can control cookies through your browser settings. By using the Website you consent to this use.</p>

      <h2>4. Advertising</h2>
      <p>
        We use Google Ads and its conversion tracking. Google may use cookies to show ads based on your visit to this and other sites. You can opt out via{" "}
        <a href="https://adssettings.google.com" {...ext}>Google Ads Settings</a>.
      </p>

      <h2>5. Sharing Your Information</h2>
      <p>We share information only with service providers who help us operate (e.g. hosting, analytics, email/CRM) and only as needed. We may disclose information if required by law.</p>

      <h2>6. Data Retention</h2>
      <p>We keep personal information only as long as necessary for the purposes above or as required by law.</p>

      <h2>7. Your Rights</h2>
      <p>
        You may request access to, correction of, or deletion of your personal information by emailing <a href="mailto:info@padhyasoft.com">info@padhyasoft.com</a>. If you are in the EU/UK, you have rights under the GDPR/UK GDPR.
      </p>

      <h2>8. Security</h2>
      <p>We use reasonable technical and organisational measures to protect your information. No method of transmission over the internet is fully secure.</p>

      <h2>9. Third-Party Links</h2>
      <p>Our Website may link to other sites. We are not responsible for their privacy practices.</p>

      <h2>10. Changes</h2>
      <p>We may update this policy and will post the revised version here with a new effective date.</p>
    </LegalLayout>
  );
}

/* ======================= TERMS & CONDITIONS ======================= */
export function TermsConditions() {
  useTitle("Terms & Conditions - Padhya Software Technologies");
  return (
    <LegalLayout
      title="Terms & Conditions"
      sub="These Terms & Conditions govern your access to and use of our website and services. Please read them carefully."
      side={
        <div className="bp-box legal-contact">
          <h4>19. Contact Us</h4>
          <p>For any questions regarding these Terms &amp; Conditions, please contact us:</p>
          <div className="tc-contact-box">
            <p><strong>Padhya Software Technologies</strong></p>
            <p>
              303, APM Mall Complex, Near Bharat Petrol Pump,<br />
              Sattadhar Cross Road, Ghatlodiya,<br />
              Ahmedabad, Gujarat 380061, India
            </p>
            <p>Email: <a href="mailto:info@padhyasoft.com">info@padhyasoft.com</a></p>
            <p>Phone: <a href="tel:+919016575815">+91 9016575815</a></p>
            <p>
              <strong>Denmark Office:</strong> 54 Glentehusene, 2620 Albertslund, Copenhagen, Denmark<br />
              Email: <a href="mailto:enquirydk@padhyasoft.com">enquirydk@padhyasoft.com</a> | Phone: <a href="tel:+4571834730">+45 71 83 47 30</a>
            </p>
          </div>
        </div>
      }
    >
      <h2 className="legal-doc-title">Terms &amp; Conditions</h2>
      <p className="tc-updated">Last Updated: 06 July 2026</p>

      <p>
        Welcome to Padhya Software Technologies. These Terms &amp; Conditions ("Terms") govern your access to and use of our website{" "}
        <a href="https://www.padhyasoft.com" {...ext}>www.padhyasoft.com</a> ("Website") and the services provided by Padhya Software Technologies ("Company", "we", "us", or "our"), having its registered office at 303, APM Mall
        Complex, Near Bharat Petrol Pump, Sattadhar Cross Road, Ghatlodiya, Ahmedabad, Gujarat 380061, India.
      </p>
      <p>
        By accessing or using this Website, submitting an enquiry, or engaging our services, you ("Client", "User", or "you") agree to be bound by these Terms. If you do not agree with any part of these Terms, please do not
        use this Website or our services.
      </p>

      <h2>1. About Our Services</h2>
      <p>Padhya Software Technologies is an information technology company providing the following services to clients in India and international markets:</p>
      <ul>
        <li>Custom Software Development (Web applications, ERP, CRM and enterprise solutions)</li>
        <li>Mobile App Development (Android and iOS)</li>
        <li>Web Development and Web Design</li>
        <li>Industry Automation</li>
        <li>QR Code Solutions and Track &amp; Trace Systems</li>
        <li>Digital Marketing, SEO and Social Media Management</li>
        <li>Video Editing and Graphic Design Services</li>
      </ul>
      <p>
        The scope, deliverables, timelines and pricing of any engagement shall be defined in a separate written proposal, quotation, scope of work document or service agreement ("Project Agreement") executed between the
        Company and the Client. In case of any conflict between these Terms and a signed Project Agreement, the Project Agreement shall prevail for that engagement.
      </p>

      <h2>2. Use of the Website</h2>
      <p>You agree to use this Website only for lawful purposes. You must not:</p>
      <ul>
        <li>Use the Website in any manner that may damage, disable or impair the Website or interfere with any other party's use of it;</li>
        <li>Attempt to gain unauthorised access to the Website, its server, or any connected database or systems;</li>
        <li>Copy, scrape, reproduce or republish Website content for commercial purposes without our prior written consent;</li>
        <li>Submit false, misleading or fraudulent information through our enquiry or consultation forms.</li>
      </ul>

      <h2>3. Quotations, Proposals and Consultations</h2>
      <p>
        Free consultations, cost estimates and quotations provided through the Website are indicative and do not constitute a binding offer. All estimates are subject to a detailed requirement analysis. A project is
        considered confirmed only upon written acceptance of a proposal and receipt of the agreed advance payment.
      </p>

      <h2>4. Payment Terms</h2>
      <ul>
        <li>Payment schedules, milestones and amounts shall be specified in the applicable Project Agreement or invoice.</li>
        <li>Unless otherwise agreed in writing, an advance payment is required before commencement of work, with the balance payable as per agreed milestones.</li>
        <li>All invoices are payable within the due date mentioned on the invoice. Delayed payments may result in suspension of work, withholding of deliverables, or interest charges as permitted under applicable law.</li>
        <li>All prices are exclusive of applicable taxes (including GST for Indian clients and VAT where applicable for international clients) unless expressly stated otherwise.</li>
        <li>
          Third-party costs such as domain registration, hosting, SSL certificates, premium plugins, licenses, app store fees, and advertising budgets are payable by the Client and are separate from our service fees unless
          included in the Project Agreement.
        </li>
      </ul>

      <h2>5. Refund and Cancellation Policy</h2>
      <ul>
        <li>Advance payments made to initiate a project are non-refundable once work has commenced, as they cover resource allocation, planning and initial development effort.</li>
        <li>If the Client cancels a project mid-way, the Client shall pay for all work completed up to the date of cancellation on a pro-rata basis.</li>
        <li>
          Fees for recurring services (such as digital marketing, SEO, social media management or maintenance retainers) are charged in advance and are non-refundable for the billing period already commenced. Such services
          may be discontinued for future periods with prior written notice as specified in the Project Agreement.
        </li>
        <li>No refund shall be payable for delays caused by the Client, including delays in providing content, approvals, access credentials or feedback.</li>
        <li>Any refund, where applicable, will be processed to the original payment method within 15–30 business days of approval.</li>
      </ul>

      <h2>6. Client Responsibilities</h2>
      <p>The Client agrees to:</p>
      <ul>
        <li>Provide accurate and complete requirements, content, images, branding materials and approvals in a timely manner;</li>
        <li>Ensure that all materials supplied to us do not infringe any third-party intellectual property rights;</li>
        <li>Provide necessary access (hosting, domains, accounts, APIs) required for project execution;</li>
        <li>Review and approve deliverables within the review period specified in the Project Agreement. Deliverables not disputed within such period shall be deemed accepted.</li>
      </ul>

      <h2>7. Intellectual Property Rights</h2>
      <ul>
        <li>
          All content on this Website — including text, graphics, logos, images, designs, case studies and software — is the property of Padhya Software Technologies or its licensors and is protected under applicable
          copyright and trademark laws.
        </li>
        <li>Upon receipt of full and final payment for a project, ownership of the final custom deliverables developed specifically for the Client shall transfer to the Client, unless otherwise specified in the Project Agreement.</li>
        <li>
          The Company retains ownership of its pre-existing tools, frameworks, libraries, know-how and reusable code components, and grants the Client a non-exclusive license to use them as embedded in the deliverables.
        </li>
        <li>Third-party components (themes, plugins, fonts, stock media, open-source libraries) remain subject to their respective licenses.</li>
        <li>
          The Company reserves the right to display completed projects in its portfolio and marketing materials, unless the Client requests otherwise in writing or a confidentiality agreement provides otherwise.
        </li>
      </ul>

      <h2>8. Project Delivery and Support</h2>
      <ul>
        <li>
          Timelines mentioned in proposals are estimates made in good faith. Delivery dates may be adjusted due to changes in scope, delays in Client inputs, or circumstances beyond our reasonable control.
        </li>
        <li>Post-delivery support, warranty period and maintenance terms, if any, shall be as specified in the Project Agreement.</li>
        <li>Change requests outside the agreed scope will be estimated and billed separately.</li>
      </ul>

      <h2>9. Digital Marketing and SEO Disclaimer</h2>
      <p>
        Digital marketing, SEO and social media services depend on third-party platforms (including Google, Meta and others) whose algorithms and policies change frequently. While we follow industry best practices, the
        Company does not guarantee specific rankings, traffic volumes, lead counts, follower growth or revenue outcomes. All performance projections shared are estimates and not commitments.
      </p>

      <h2>10. Third-Party Links and Services</h2>
      <p>
        This Website may contain links to third-party websites or services. We are not responsible for the content, policies or practices of any third-party websites. Accessing such links is at your own risk.
      </p>

      <h2>11. Limitation of Liability</h2>
      <ul>
        <li>The Website and its content are provided on an "as is" and "as available" basis without warranties of any kind, express or implied.</li>
        <li>
          To the maximum extent permitted by law, the Company shall not be liable for any indirect, incidental, consequential or special damages, including loss of profits, loss of data or business interruption, arising out
          of the use of this Website or our services.
        </li>
        <li>In any event, the Company's total aggregate liability arising from any engagement shall not exceed the total fees actually paid by the Client to the Company for that specific engagement.</li>
      </ul>

      <h2>12. Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless Padhya Software Technologies, its directors, employees and partners from any claims, damages, losses or expenses (including reasonable legal fees) arising from your breach
        of these Terms, misuse of the Website, or infringement of any third-party rights through materials supplied by you.
      </p>

      <h2>13. Confidentiality</h2>
      <p>
        Both parties agree to keep confidential any non-public business, technical or financial information shared during an engagement, and to use such information only for the purpose of the engagement. This
        obligation survives the completion or termination of any project.
      </p>

      <h2>14. Privacy</h2>
      <p>
        Your use of this Website is also governed by our <a href="/privacy-policy">Privacy Policy</a>, which explains how we collect, use and protect your personal information in accordance with applicable data
        protection laws, including the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023.
      </p>

      <h2>15. Termination</h2>
      <p>
        We reserve the right to suspend or terminate access to the Website or discontinue services for any User who violates these Terms. Either party may terminate a Project Agreement in accordance with its termination
        clause. Upon termination, the Client shall pay for all work completed up to the effective date of termination.
      </p>

      <h2>16. Force Majeure</h2>
      <p>
        The Company shall not be liable for any delay or failure in performance caused by events beyond its reasonable control, including natural disasters, war, internet or power outages, government actions, pandemics or
        failures of third-party service providers.
      </p>

      <h2>17. Governing Law and Jurisdiction</h2>
      <p>
        These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with these Terms or our services shall be subject to the exclusive jurisdiction of
        the competent courts at Ahmedabad, Gujarat, India.
      </p>

      <h2>18. Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time. The revised Terms will be posted on this page with an updated "Last Updated" date. Continued use of the Website after such changes constitutes acceptance of the
        revised Terms.
      </p>
    </LegalLayout>
  );
}
