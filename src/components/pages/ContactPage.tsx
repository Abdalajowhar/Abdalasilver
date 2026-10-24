import React, { useState } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { t, language } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Course Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
  };

  return (
    <div className="py-14 bg-[#050811] min-h-screen text-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight mb-3">
            {language === 'so' ? 'La Xiriir Abdala Silver Studio' : 'Get in Touch with Abdala Silver'}
          </h1>
          <p className="text-sm text-slate-400">
            Have questions about enrollments, commercial training packages, or instructor applications? We would love to talk.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-[#080d1a] border border-slate-800 space-y-5">
              <h2 className="text-base font-bold text-white mb-2">Academy Headquarters</h2>
              
              <div className="flex items-start gap-3 text-xs text-slate-300">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Mogadishu Creative Hub</p>
                  <p className="text-slate-400">Wadajir District, Mogadishu, Somalia</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs text-slate-300">
                <Mail className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Direct Email</p>
                  <p className="text-slate-400">info@abdalasilver.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs text-slate-300">
                <Phone className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">WhatsApp & Studio Line</p>
                  <p className="text-slate-400">+252 61 500 0000</p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-blue-950/30 border border-blue-900/50 text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-2 text-blue-400 font-semibold">
                <MessageSquare className="w-4 h-4" />
                <span>Student Community Discord & Telegram</span>
              </div>
              <p className="text-slate-400">
                Enrolled students receive exclusive invites to weekly live Q&A reviews with Abdala Silver and mentors.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-[#080d1a] border border-slate-800">
            {submitted ? (
              <div className="text-center py-12 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="text-base font-bold text-white">Message Dispatched Successfully!</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Thank you for reaching out. A team member or instructor from Abdala Silver Academy will respond within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setName('');
                    setEmail('');
                    setMessage('');
                  }}
                  className="mt-4 px-4 py-2 rounded-lg text-xs font-semibold text-blue-400 bg-blue-950/60 border border-blue-800/40 hover:bg-blue-900/40"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Your Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Hassan Nur"
                    required
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Your Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    required
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Inquiry Topic</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="Course Inquiry">Course Inquiry & Enrolling</option>
                    <option value="Corporate Workshop">Corporate / Enterprise Team Training</option>
                    <option value="Instructor Application">Teach a Masterclass on Abdala Silver</option>
                    <option value="Technical Support">Platform Support & Certificates</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    placeholder="Describe how we can help you accelerate your creative career..."
                    required
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message to Academy</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
