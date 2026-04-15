import { ChevronDown } from "lucide-react";
import { useState } from "react";
import "./PrivacyPolicyPage.css";

export default function PrivacyPolicyPage() {
  const [expandedSections, setExpandedSections] = useState(new Set(["1"]));

  const toggleSection = (id) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSections(newExpanded);
  };

  const sections = [
    {
      id: "1",
      title: "1. Introduction",
      content: `BookNest ("Company," "we," "us," "our," or "our Company") operates the booknest.com website and related mobile applications (collectively, the "Service"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.

Please read this Privacy Policy carefully. If you do not agree with our policies and practices, please do not use our Service. By accessing and using BookNest, you acknowledge that you have read, understood, and agree to be bound by all the terms of this Privacy Policy.

We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will notify you of any changes by updating the "Last Updated" date of this Privacy Policy. Your continued use of BookNest following the posting of revised Privacy Policy means you accept and agree to the changes.`
    },
    {
      id: "2",
      title: "2. Information We Collect",
      content: `We collect information about you in a variety of ways. The information we may collect on our Service includes:

Personal Data:
- Full Name: We collect your first and last name to create your account and identify you in our system.
- Email Address: Used for account verification, order updates, customer support communication, and promotional materials (if opted in).
- Phone Number: Collected optionally for order delivery purposes and customer support contact.
- Mailing Address: Required for order fulfillment and delivery of books.
- Billing Information: Including credit card details, billing address, and transaction history (processed securely through third-party payment processors).
- Account Password: Encrypted and stored securely for account access authentication.
- User Preferences: Book genres, reading history, wishlist items, saved for later collections.
- Review and Rating Data: Text, ratings, and timestamps of reviews you submit for books.
- Support Tickets: Communication history, issues reported, and resolutions documented.
- Points and Loyalty Data: Loyalty points balance, redemption history, referral information.

Automatically Collected Data:
- Device Information: Operating system, browser type, device model, unique device identifiers, mobile device identifiers, and hardware model.
- Log Data: IP addresses, access times, pages viewed, the referring URL, and your activity on our Service.
- Usage Information: How you interact with the Service, pages visited, features used, searches performed, the time and duration of your activities.
- Location Data: General geographic location based on IP address (not precise GPS location unless explicitly authorized).
- Cookies and Tracking Technologies: Session cookies, persistent cookies, web beacons, pixel tags, and similar tracking tools.

Cookies and Tracking Technologies:
We use cookies to enhance your user experience, remember your preferences, and understand how you use our Service. Types of cookies include:
- Session Cookies: Temporary cookies that expire when you close your browser
- Persistent Cookies: Cookies that remain on your device until manually deleted or they expire
- Third-party Cookies: Placed by analytics and advertising partners

Information Provided by Third Parties:
- Social Media: If you link your social media accounts to BookNest, we access publicly available profile information.
- Payment Processors: Transaction and billing information from Razorpay, PayPal, or other payment partners.
- Analytics Providers: Usage statistics and behavior data from Google Analytics and similar services.
- Shipping Partners: Delivery status, location tracking, and confirmation data.`
    },
    {
      id: "3",
      title: "3. How We Use Your Information",
      content: `BookNest uses the information we collect in various ways, including:

Service Delivery:
- Creating and maintaining your account
- Processing and fulfilling your book orders
- Sending order confirmations, shipment notifications, and delivery updates
- Calculating and applying loyalty points and rewards
- Managing subscription services
- Providing customer support and responding to inquiries

Communication:
- Sending transactional emails (order receipts, password resets, account changes)
- Notifying you about changes to our Service, policies, or terms
- Promotional communications (newsletters, special offers, new releases) - only if opted in
- Conducting surveys to gather feedback on your experience
- Responding to your inquiries and customer support requests

Personalization:
- Customizing your experience based on browsing history and preferences
- Recommending books based on your reading patterns and ratings
- Tailoring content and search results to match your interests
- Saving your preferences, wishlist, and reading lists
- Creating personalized offers and deals

Analytics and Improvements:
- Analyzing usage patterns to understand how customers interact with BookNest
- Identifying trends and preferences to improve our product offerings
- Testing new features and measuring their effectiveness
- Optimizing user interface design and website performance
- Troubleshooting technical issues and website errors

Marketing and Advertising:
- Creating aggregate and anonymized data for market research
- Displaying targeted advertisements on our platform and third-party platforms
- Measuring advertising campaign effectiveness and ROI
- A/B testing different versions of website content
- Understanding which marketing channels are most effective

Legal Compliance:
- Complying with Indian laws, regulations, and legal processes
- Protecting our legal rights and defending against claims
- Detecting, preventing, and addressing fraud and abuse
- Enforcing our Terms of Service and other agreements
- Establishing, exercising, or defending legal claims`
    },
    {
      id: "4",
      title: "4. How We Protect Your Information",
      content: `We implement comprehensive security measures to protect your personal information:

Technical Security:
- SSL/TLS Encryption: All data transmitted between your device and our servers is encrypted using industry-standard protocols
- Database Encryption: Personal information stored in our databases is encrypted at rest
- Secure Servers: Our servers are located in secure data centers with physical access controls
- Regular Security Audits: We conduct regular security assessments and vulnerability testing
- Intrusion Detection: Monitoring systems are in place to detect and prevent unauthorized access attempts

Password Security:
- Strong Password Requirements: Minimum 8 characters, including letters, numbers, and special characters
- Password Hashing: Passwords are hashed using industry-standard algorithms (bcrypt, Argon2)
- Password Reset: Secure password reset process requiring email verification
- Session Management: Automatic logout after periods of inactivity (30 minutes)

Payment Security:
- PCI Compliance: We maintain PCI DSS compliance for payment processing
- Tokenization: Credit card information is tokenized and not stored on our servers
- Third-party Processors: Payment processing handled by secure, certified third-party providers
- No Direct Storage: BookNest does not store full credit card details
- Transaction Monitoring: Continuous monitoring for fraudulent transactions

Access Controls:
- User Authentication: Multi-factor authentication (MFA) available for account security
- Role-Based Access: Employees access only data necessary for their job functions
- Access Logging: All access to personal information is logged and monitored
- Background Checks: All employees undergo background verification
- Confidentiality Agreements: All staff sign strict confidentiality agreements

Data Retention:
- Limited Retention: Personal data retained only as long as necessary for stated purposes
- Secure Deletion: Data securely deleted or anonymized when no longer needed
- Archive Storage: Historical data archived securely for compliance purposes
- Backup Systems: Regular backups maintained for disaster recovery

Limitations:
While we strive to protect your information, no security system is completely impenetrable. We cannot guarantee absolute security of any information transmitted online. You use our Service at your own risk. We are not responsible for any unauthorized access or data breaches due to factors beyond our reasonable control.`
    },
    {
      id: "5",
      title: "5. Sharing and Disclosure of Information",
      content: `We may share your information in the following circumstances:

Service Providers:
- Shipping and Logistics: We share your name, address, and order details with courier partners (Shiprocket, Delhivery, Fedex) for delivery purposes
- Payment Processors: Billing information shared with Razorpay, PayPal, and other payment gateways for transaction processing
- Email Service Providers: Email address shared with platforms like SendGrid or Mailchimp for communications
- Analytics Services: Usage data shared with Google Analytics, Mixpanel for performance analysis
- Cloud Hosting: Your data may be stored on cloud servers (AWS, Google Cloud, Azure)
- Customer Support Tools: Information shared with CRM systems and support ticket platforms

Legal Requirements:
- Law Enforcement: We may disclose information when required by law, legal process, or government officials
- Court Orders: Compliance with subpoenas, court orders, or legal investigations
- Fraud Prevention: Sharing information to prevent fraud, abuse, or security threats
- Rights Protection: Defending our rights, privacy, safety, or property

Business Transfers:
- Acquisitions: If BookNest is acquired or merged, your information may be transferred as part of that transaction
- Asset Sale: Information may be transferred in case of bankruptcy or sale of assets
- Successor Rights: Any successor will be bound by this Privacy Policy for personal information
- Notification: We will notify you of any such changes and provide choices regarding your information

Aggregated and De-identified Data:
- Market Research: We may share anonymized, aggregated data with business partners for market analysis
- Analytics: Trend data and usage patterns shared with advertisers and partners
- No Identification: Shared data cannot identify you personally
- Licensing: Third parties may license anonymized data for research purposes

Publicly Available Information:
- Reviews and Ratings: Your book reviews and ratings may be displayed publicly on product pages (under your chosen username)
- Wishlist Sharing: Public wishlists can be viewed by other users (if privacy settings allow)
- Author Forum: Participation in public forums and discussions may be visible to other users

With Your Consent:
- Referral Programs: Information shared with referral partners if you opt-in to referral programs
- Social Sharing: Optional integration with social media platforms
- Third-party Advertising: Tracking data shared with advertising partners (if cookies enabled)

Opt-Out Rights:
You can opt-out of data sharing for marketing purposes through your account settings. However, we cannot restrict sharing required for order fulfillment and legal compliance.`
    },
    {
      id: "6",
      title: "6. Your Rights and Choices",
      content: `Depending on your location, you have various rights regarding your personal information:

In India (DPDP Act Compliance):
- Right to Notice: You have the right to be informed about collection and use of your data
- Right to Access: You can request a copy of all personal data we hold about you
- Right to Correction: You can request corrections to inaccurate or incomplete data
- Right to Erasure: You can request deletion of your personal data ("Right to be Forgotten")
- Right to Data Portability: You can request your data in a structured, portable format
- Right to Restrict: You can restrict our processing of your data for specific purposes
- Right to Withdraw Consent: You can withdraw consent given for data processing
- Right to Lodge Complaint: You can file complaints with the Data Protection Board

Accessing Your Information:
- Account Settings: Most information can be viewed and updated in your account dashboard
- Data Export: Request complete data export through the "Request Data" feature
- Manual Access: Contact our Data Protection Officer for assistance accessing your data

Updating and Correcting Information:
- Self-Service: Update profile, address, phone number through account settings
- Contact Us: Email support@booknest.com to request updates
- Customer Support: Our team can assist with data corrections upon verification
- Verification: We may request identification to verify requests

Email Preferences:
- Unsubscribe: Click "Unsubscribe" link in any promotional email
- Account Settings: Manage communication preferences in your account
- Email Management: Choose which types of emails you wish to receive
- Opt-Out: Uncheck promotional communication boxes
- Re-subscription: Re-enable communications anytime through account settings

Cookies and Tracking:
- Browser Settings: You can disable cookies in your browser settings
- Do Not Track: Most browsers support "Do Not Track" signals (we honor these signals)
- Opt-Out Tools: Use industry opt-out tools for behavioral advertising
- Clear Data: You can clear cookies and browsing data from your device
- Cookie Preferences: Manage cookie preferences through our cookie consent banner

Location Data:
- Disable Location: Turn off location services for the BookNest app
- Regional Settings: Adjust regional preferences in account settings
- IP Masking: Use VPN services if concerned about IP-based location tracking

Data Deletion:
- Account Deletion: Request permanent account deletion (data deleted within 30 days)
- Irreversible: Account deletion is permanent and cannot be undone
- Residual Data: Some data may be retained for legal or tax purposes
- Contact: Email support@booknest.com with deletion requests

Response Timeline:
- 30 Days: We will respond to your data requests within 30 days
- Extensions: Complex requests may take up to 60 days with explanation
- No Cost: Data access requests are free; copies for additional requests may have reasonable fees
- Proof: We may request identification to verify your request`
    },
    {
      id: "7",
      title: "7. Children's Privacy",
      content: `BookNest does not knowingly collect or solicit personal information from anyone under the age of 18. Our Service is not directed to individuals under 18.

Age Restrictions:
- Minimum Age: Users must be at least 18 years old to use BookNest
- Account Creation: No accounts can be created for individuals under 18
- Verification: We may require age verification for certain transactions
- Parental Control: We recommend parental controls for younger family members

If We Discover:
If we learn that we have collected personal information of a minor under 18:
- Immediate Deletion: We will promptly delete such data
- Parental Notification: Parents will be notified of the collection
- Account Termination: Associated accounts will be terminated
- Investigation: We will investigate how the data was collected

Parental Guidance:
- Monitor Activity: Parents should monitor their children's internet usage
- Discuss Privacy: Teach children about online privacy and safety
- Restrict Access: Use parental controls and age-appropriate settings
- Report Concerns: Contact us immediately if you discover a minor's account

No Sale of Children's Data:
BookNest does not sell personal information of anyone, including minors. All data handling follows strict child safety regulations.`
    },
    {
      id: "8",
      title: "8. International Data Transfers",
      content: `Your Information and International Transfers:
BookNest operates internationally. Your personal information may be transferred to, stored in, and accessed from countries other than your country of residence.

Data Transfer Mechanisms:
- Cloud Infrastructure: Data may be stored on servers in multiple countries
- Service Providers: Information shared with international service providers
- Affiliate Sharing: Data shared among our affiliated companies globally
- Backup Storage: Redundant backups maintained internationally for disaster recovery

Data Protection Standards:
- Standard Contractual Clauses: We use Standard Contractual Clauses approved by the European Commission
- Transfer Impact Assessment: We conduct Data Protection Impact Assessments
- Recipient Safeguards: International recipients are contractually bound to protect your data
- Adequate Measures: We ensure transfers meet legal requirements

If you are in India:
- POPIA Compliance: We ensure compliance with Protection of Personal Information Act
- Data Localization: Some sensitive data is kept within India per regulatory requirements
- Cross-border Transfers: International transfers are documented and justified

If you are in EU:
- GDPR Compliance: We comply with General Data Protection Regulation requirements
- SCCs: Standard Contractual Clauses ensure adequate protection
- Transfer Permits: We maintain documented approvals for international transfers

Your Rights:
- Question Transfers: You can question the necessity of international transfers
- Refuse Transfer: You can request that data not be transferred internationally
- Restrictions: We respect legal restrictions on data transfer in your jurisdiction
- Enforcement: You can seek legal remedies in your local jurisdiction

Risks:
You acknowledge that international data transfer may involve different privacy protections than your home country. By using BookNest, you consent to such transfers.`
    },
    {
      id: "9",
      title: "9. Third-Party Links and Services",
      content: `Our Website May Contain Links:
BookNest may contain links to third-party websites and services that are not operated by us:

Third-Party Services Include:
- Payment Gateways: Razorpay, PayPal, and other payment processors
- Social Media: Facebook, Twitter, Instagram, LinkedIn, YouTube links
- Analytics: Google Analytics, social media tracking pixels
- Affiliate Links: Amazon Associates, book retailer partnerships
- External Resources: Book reviews, author websites, publishing sites
- Advertisement Networks: Third-party ad networks and ad servers

Disclaimer:
- Separate Policies: Third-party sites have their own privacy policies
- Not Our Responsibility: BookNest is not responsible for third-party practices
- No Endorse: Linking to a site does not imply endorsement or authorization
- Explore Terms: We recommend reviewing third-party privacy policies
- Cookies: Third parties may place their own cookies on your device

Third-Party Data Collection:
- Direct Collection: Third parties may collect data directly from you
- Your Interaction: Information shared based on your interaction with third-party services
- Advertising: Ad networks may use your data for targeted advertising
- Analytics: Analytics providers track your usage across multiple sites
- No Control: BookNest cannot control what third parties do with your data

Opt-Out Options:
- Browser Controls: Disable third-party cookies in browser settings
- Opt-Out Links: Most third parties provide their own opt-out options
- Do Not Track: Some privacy-focused browsers support Do Not Track
- Plugins: Privacy plugins and extensions provide additional protection

We Recommend:
- Read Policies: Review privacy policies of third-party services
- Privacy Settings: Adjust settings to limit data collection
- Be Cautious: Limit information shared with third parties
- Use Attribution: Block third-party trackers using browser extensions

BookNest Privacy Policy Controls Only:
This Privacy Policy controls only BookNest's data practices. We are not responsible for third-party collection, use, or sharing of your data.`
    },
    {
      id: "10",
      title: "10. California Privacy Rights (CCPA)",
      content: `For California Residents:
Although BookNest is based in India, if you are a California resident, the California Consumer Privacy Act (CCPA) may provide you with specific rights.

Your California Rights:
- Right to Know: You can request what personal information we have collected about you
- Right to Delete: You can request deletion of personal information (with some exceptions)
- Right to Opt-Out: You can opt-out of the sale of your personal information
- Right to Non-Discrimination: You cannot be discriminated against for exercising CCPA rights
- Right to Limit Use: You can limit our use of sensitive personal information

Exercising Your Rights:
- Request Process: Submit requests through our Data Request form
- Verification: We will verify your identity before complying
- Response Time: We will respond within 45 days (may extend for complex requests)
- No Cost: Requests are free; additional copies may incur fees
- Contact: privacy@booknest.com or call our toll-free number

Authorized Agents:
If you are a California resident, you can authorize an agent to make requests on your behalf:
- Power of Attorney: Provide valid power of attorney documentation
- Verification: The agent must verify your identity and authority
- Benefits: No loss of benefits or discrimination for using an authorized agent

Sale of Personal Information:
BookNest does not intentionally "sell" personal information as defined by CCPA. However:
- Advertising Data: We share data with ad networks (may be considered "sale")
- Opt-Out System: California residents can opt-out through our opt-out mechanism
- Tracking: Some analytical data may be shared with third parties
- Cookie Tracking: Third-party cookies may track your activity across sites

For More Information:
- CCPA Resources: Visit oag.ca.gov for CCPA guidance
- Your Rights: You have specific rights under California law
- Enforcement: California Attorney General can enforce CCPA rights`
    },
    {
      id: "11",
      title: "11. Changes to This Privacy Policy",
      content: `We May Update This Policy:
BookNest may modify this Privacy Policy at any time. Changes take effect immediately upon posting to the Service.

How We Notify You:
- Email Notification: For material changes, we will email you at your registered email address
- Website Notice: A notice will be posted on our website homepage
- Account Alert: An alert may appear when you log into your account
- Updated Date: The "Last Updated" date at the bottom will reflect the most recent change
- Request Confirmation: For major changes, we may request your explicit consent

Material Changes:
Material changes include anything that significantly affects:
- How we collect your data
- How we use your information
- Your privacy rights
- Data security measures
- Third-party sharing practices
- Your choices and controls

Your Consent:
- Continued Use: Continuing to use BookNest after changes means you accept new terms
- Explicit Consent: For significant changes, explicit consent may be required
- Withdrawal: You can withdraw consent and stop using the service
- No Changes Retroactive: Changes apply only to information collected after the change date

Archival:
We maintain archived versions of this Privacy Policy:
- Historical Versions: Previous versions available upon request
- Access: Email privacy@booknest.com to view older versions
- Comparison: We can help identify specific changes between versions
- Transparency: We are committed to transparency in our policies

Questions About Changes:
- Contact Us: Email privacy@booknest.com with questions about changes
- Clarification: Our privacy team will provide clear explanations
- Impact Assessment: We can explain how changes affect your privacy
- Assistance: We can help you understand your options under new terms`
    },
    {
      id: "12",
      title: "12. Contact Us and Data Protection Officer",
      content: `How to Contact BookNest:
For questions, concerns, or requests regarding this Privacy Policy or your personal information, contact:

Email: privacy@booknest.com
Mailing Address:
BookNest India Pvt. Ltd.
Data Protection & Privacy Department
Bangalore, Karnataka 560001
India

Customer Support: support@booknest.com
Phone: +91-080-XXXX-XXXX (Business Hours)

Data Protection Officer (DPO):
Name: Shourya Sharma
Title: Chief Privacy Officer
Department: Privacy & Compliance
Email: dpo@booknest.com
Phone: +91-080-XXXX-XXXX

Role of DPO:
- Oversight: Oversees privacy practices and compliance
- Inquiries: Handles data protection inquiries and complaints
- Audit: Conducts regular privacy audits and assessments
- Training: Ensures staff privacy training and awareness
- Incident Response: Manages data breach notifications and responses
- Documentation: Maintains privacy impact assessments and compliance records

Grievance Redressal:
- Process: File complaints through our grievance system
- Investigation: We will investigate your complaint within 15 days
- Resolution: We will attempt to resolve issues within 30 days
- Appeal: You can appeal decisions if unsatisfied
- Escalation: Unresolved complaints can be escalated to authorities

Response Times:
- Urgent Inquiries: We aim to respond within 24-48 hours
- Standard Requests: 7-10 business days
- Complex Issues: May take up to 30 days
- Data Requests: 30 days for DPDP Act compliance (may extend to 60 days)
- Breach Notification: Within 72 hours of discovery (as required by law)

Regulatory Authorities:
For complaints escalation in India:
- Data Protection Board
- Indian Institute of Information Technology
- Consumer Protection Authority

Availability:
- Business Hours: Monday-Friday, 9 AM to 6 PM IST
- Email Support: 24/7 (response within 24 hours)
- Live Chat: Available during business hours on website

We Value Your Privacy:
We take your privacy seriously and are committed to maintaining your trust through transparent practices and prompt responses to any concerns.`
    }
  ];

  return (
    <div className="privacy-policy-page">
      <div className="container">
        {/* HEADER */}
        <div className="policy-header">
          <h1>Privacy Policy</h1>
          <p className="policy-intro">
            Your privacy is important to us. This comprehensive policy explains how BookNest collects, uses, and protects your personal information.
          </p>
          <div className="policy-metadata">
            <div className="meta-item">
              <span className="meta-label">Last Updated:</span>
              <span className="meta-value">April 8, 2026</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Effective Date:</span>
              <span className="meta-value">April 8, 2026</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Version:</span>
              <span className="meta-value">1.0</span>
            </div>
          </div>
        </div>

        {/* TABLE OF CONTENTS */}
        <div className="toc-section">
          <h2>Table of Contents</h2>
          <div className="toc-list">
            {sections.map(section => (
              <button
                key={section.id}
                className="toc-item"
                onClick={() => {
                  const element = document.getElementById(`section-${section.id}`);
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>

        {/* SECTIONS */}
        <div className="policy-sections">
          {sections.map(section => (
            <div key={section.id} id={`section-${section.id}`} className="policy-section">
              <button
                className={`section-header ${expandedSections.has(section.id) ? 'expanded' : ''}`}
                onClick={() => toggleSection(section.id)}
              >
                <h2>{section.title}</h2>
                <ChevronDown size={20} className="chevron-icon" />
              </button>
              {expandedSections.has(section.id) && (
                <div className="section-content">
                  {section.content.split('\n\n').map((paragraph, idx) => {
                    if (paragraph.includes(':') && !paragraph.startsWith(' ')) {
                      const [heading, ...content] = paragraph.split(':');
                      if (content.length > 0 && content[0].length < 100) {
                        return (
                          <div key={idx} className="section-subsection">
                            <h3>{heading}:</h3>
                            <p>{content.join(':')}</p>
                          </div>
                        );
                      }
                    }
                    return (
                      <p key={idx}>{paragraph}</p>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* FOOTER NOTE */}
        <div className="policy-footer">
          <h3>Questions About This Policy?</h3>
          <p>
            If you have any questions or concerns about this Privacy Policy or BookNest's privacy practices, please contact our Data Protection Officer at <a href="mailto:privacy@booknest.com">privacy@booknest.com</a>. We are committed to resolving any privacy concerns you may have.
          </p>
          <div className="policy-signature">
            <p><strong>BookNest India Pvt. Ltd.</strong></p>
            <p>Privacy & Data Protection Department</p>
            <p>Bangalore, India</p>
          </div>
        </div>
      </div>
    </div>
  );
}
