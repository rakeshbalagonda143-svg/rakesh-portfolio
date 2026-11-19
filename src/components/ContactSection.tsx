import { useEffect, useRef, useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import {
  Mail,
  Phone,
  Linkedin,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ArrowUpRight,
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface ContactSectionProps {
  prefilledSubject?: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

interface SubmissionReceipt {
  id: string;
  submittedAt: string;
  message: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactSection({ prefilledSubject }: ContactSectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<SubmissionReceipt | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const nameInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (prefilledSubject) {
      setSubject(`Inquiry regarding ${prefilledSubject}`);
      setReceipt(null);
    }
  }, [prefilledSubject]);

  const focusContactForm = () => {
    setReceipt(null);
    window.requestAnimationFrame(() => {
      nameInputRef.current?.focus();
    });
  };

  const validateClient = (): FormErrors => {
    const errors: FormErrors = {};
    if (name.trim().length < 2) {
      errors.name = 'Please enter your name (at least 2 characters).';
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }
    if (subject.trim().length < 3) {
      errors.subject = 'Please enter a subject (at least 3 characters).';
    }
    if (message.trim().length < 10) {
      errors.message = 'Please enter a message (at least 10 characters).';
    }
    return errors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);

    const errors = validateClient();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        if (data.errors && typeof data.errors === 'object') {
          setFieldErrors(data.errors);
        }
        setServerError(
          data.message || 'Could not submit your message. Please check your entries.'
        );
        return;
      }

      setReceipt({
        id: data.id,
        submittedAt: data.submittedAt,
        message: data.message,
      });
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch {
      setServerError(
        'Network error while sending your message. Please try again or use Email Me directly.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PERSONAL_INFO.email);
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2200);
    } catch {
      setCopiedEmail(false);
    }
  };

  return (
    <section
      id="contact"
      className="border-b border-[#151515]/15 bg-[#FAF7F2] py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Editorial Heading + Direct Contact Channels */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-between lg:col-span-5"
          >
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-[#A8502D] uppercase">
                06 · Contact
              </p>
              <h2 className="mt-2 font-condensed text-5xl leading-[0.9] tracking-tight text-[#151515] sm:text-6xl lg:text-7xl">
                LET&apos;S WORK
                <br />
                TOGETHER
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-[#38342F]">
                I&apos;m always excited to learn, collaborate, and explore new opportunities.
              </p>

              {/* Direct Contact Rows */}
              <div className="mt-10 divide-y divide-[#151515]/12 border-y border-[#151515]/12">
                {/* Email */}
                <div className="flex items-center justify-between gap-4 py-4">
                  <div className="flex min-w-0 items-center gap-3.5">
                    <Mail className="h-4 w-4 shrink-0 text-[#C96D48]" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-xs text-[#5C574F]">Email</p>
                      <a
                        href={`mailto:${PERSONAL_INFO.email}`}
                        className="block truncate text-sm font-medium text-[#151515] hover:text-[#A8502D] hover:underline"
                      >
                        {PERSONAL_INFO.email}
                      </a>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    aria-label="Copy email address"
                    className="inline-flex min-h-[36px] items-center gap-1.5 rounded-md border border-[#151515]/15 bg-[#F5F0E7] px-3 py-1.5 text-xs font-medium text-[#151515] transition-colors hover:border-[#C96D48] shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C96D48]"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-[#A8502D]" aria-hidden="true" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-3.5 py-4">
                  <Phone className="h-4 w-4 shrink-0 text-[#C96D48]" aria-hidden="true" />
                  <div>
                    <p className="text-xs text-[#5C574F]">Phone</p>
                    <a
                      href={PERSONAL_INFO.phoneHref}
                      className="text-sm font-medium text-[#151515] tabular-nums hover:text-[#A8502D] hover:underline"
                    >
                      {PERSONAL_INFO.phone}
                    </a>
                  </div>
                </div>

                {/* LinkedIn */}
                <div className="flex items-center gap-3.5 py-4">
                  <Linkedin className="h-4 w-4 shrink-0 text-[#C96D48]" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-xs text-[#5C574F]">LinkedIn</p>
                    <a
                      href={PERSONAL_INFO.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block truncate text-sm font-medium text-[#151515] hover:text-[#A8502D] hover:underline"
                    >
                      linkedin.com/in/rakesh-roshan-0b025543b
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-3.5 py-4">
                  <MapPin className="h-4 w-4 shrink-0 text-[#C96D48]" aria-hidden="true" />
                  <div>
                    <p className="text-xs text-[#5C574F]">Location</p>
                    <p className="text-sm font-medium text-[#151515]">
                      {PERSONAL_INFO.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons: Contact Me, LinkedIn, Email Me */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={focusContactForm}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-[#151515] px-5 py-2.5 text-xs font-semibold tracking-wider text-[#F5F0E7] uppercase transition-colors hover:bg-[#C96D48] hover:text-white whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C96D48]"
              >
                <span>Contact Me</span>
              </button>

              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-[#151515]/20 bg-[#F5F0E7] px-5 py-2.5 text-xs font-semibold tracking-wider text-[#151515] uppercase transition-colors hover:border-[#C96D48] hover:text-[#A8502D] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C96D48]"
              >
                <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Email Me</span>
              </a>

              <a
                href={PERSONAL_INFO.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-[#151515]/20 bg-[#F5F0E7] px-5 py-2.5 text-xs font-semibold tracking-wider text-[#151515] uppercase transition-colors hover:border-[#C96D48] hover:text-[#A8502D] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C96D48]"
              >
                <Linkedin className="h-3.5 w-3.5" aria-hidden="true" />
                <span>LinkedIn</span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </motion.div>

          {/* Right Column: Functional Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-xl border border-[#151515]/14 bg-[#F5F0E7] p-6 sm:p-8 lg:col-span-7"
          >
            {receipt ? (
              <div
                role="status"
                aria-live="polite"
                className="flex h-full flex-col justify-center py-8 text-left"
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-emerald-700/25 bg-emerald-600/10 text-emerald-800">
                  <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-5 font-condensed text-3xl text-[#151515]">
                  MESSAGE SENT SUCCESSFULLY
                </h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-[#38342F]">
                  {receipt.message}
                </p>

                <div className="mt-6 space-y-1.5 rounded-lg border border-[#151515]/12 bg-[#FAF7F2] p-4 text-xs text-[#4A4640]">
                  <p>
                    <span className="font-semibold text-[#151515]">Reference ID:</span>{' '}
                    <span>{receipt.id}</span>
                  </p>
                  <p>
                    <span className="font-semibold text-[#151515]">Recorded At:</span>{' '}
                    <span className="tabular-nums">
                      {new Date(receipt.submittedAt).toLocaleString()}
                    </span>
                  </p>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => setReceipt(null)}
                    className="inline-flex min-h-[40px] items-center rounded-md border border-[#151515]/20 bg-[#FAF7F2] px-4 py-2 text-xs font-semibold text-[#151515] transition-colors hover:border-[#C96D48] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C96D48]"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="border-b border-[#151515]/12 pb-4">
                  <h3 className="font-condensed text-3xl tracking-tight text-[#151515]">
                    SEND A MESSAGE
                  </h3>
                  <p className="mt-1 text-xs text-[#5C574F]">
                    Messages are validated and persisted on the server backend.
                  </p>
                </div>

                {serverError && (
                  <div
                    role="alert"
                    className="flex items-start gap-2.5 rounded-lg border border-red-700/30 bg-red-600/10 p-3.5 text-xs text-red-900"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-700" aria-hidden="true" />
                    <span>{serverError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-semibold text-[#151515]"
                    >
                      Your Name
                    </label>
                    <input
                      ref={nameInputRef}
                      id="contact-name"
                      name="name"
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (fieldErrors.name) {
                          setFieldErrors((prev) => ({ ...prev, name: undefined }));
                        }
                      }}
                      placeholder="Enter your full name"
                      aria-invalid={Boolean(fieldErrors.name)}
                      className="mt-2 w-full rounded-md border border-[#151515]/20 bg-[#FAF7F2] px-3.5 py-2.5 text-sm text-[#151515] placeholder-[#7C756C] transition-colors focus:border-[#C96D48] focus:outline-none"
                    />
                    {fieldErrors.name && (
                      <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-800">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span>{fieldErrors.name}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-semibold text-[#151515]"
                    >
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (fieldErrors.email) {
                          setFieldErrors((prev) => ({ ...prev, email: undefined }));
                        }
                      }}
                      placeholder="you@example.com"
                      aria-invalid={Boolean(fieldErrors.email)}
                      className="mt-2 w-full rounded-md border border-[#151515]/20 bg-[#FAF7F2] px-3.5 py-2.5 text-sm text-[#151515] placeholder-[#7C756C] transition-colors focus:border-[#C96D48] focus:outline-none"
                    />
                    {fieldErrors.email && (
                      <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-800">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span>{fieldErrors.email}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-subject"
                    className="block text-xs font-semibold text-[#151515]"
                  >
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    value={subject}
                    onChange={(e) => {
                      setSubject(e.target.value);
                      if (fieldErrors.subject) {
                        setFieldErrors((prev) => ({ ...prev, subject: undefined }));
                      }
                    }}
                    placeholder="Internship, project collaboration, or inquiry"
                    aria-invalid={Boolean(fieldErrors.subject)}
                    className="mt-2 w-full rounded-md border border-[#151515]/20 bg-[#FAF7F2] px-3.5 py-2.5 text-sm text-[#151515] placeholder-[#7C756C] transition-colors focus:border-[#C96D48] focus:outline-none"
                  />
                  {fieldErrors.subject && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-800">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>{fieldErrors.subject}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-semibold text-[#151515]"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (fieldErrors.message) {
                        setFieldErrors((prev) => ({ ...prev, message: undefined }));
                      }
                    }}
                    placeholder="Write your message here..."
                    aria-invalid={Boolean(fieldErrors.message)}
                    className="mt-2 w-full resize-y rounded-md border border-[#151515]/20 bg-[#FAF7F2] px-3.5 py-2.5 text-sm text-[#151515] placeholder-[#7C756C] transition-colors focus:border-[#C96D48] focus:outline-none"
                  />
                  {fieldErrors.message && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-800">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>{fieldErrors.message}</span>
                    </p>
                  )}
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-md bg-[#C96D48] px-7 py-3 text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-[#151515] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#151515]"
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                    <span>{submitting ? 'Sending Message...' : 'Send Message'}</span>
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
