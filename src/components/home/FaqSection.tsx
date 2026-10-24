import React, { useState } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { ChevronDown } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const { t, language } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: language === 'so' 
        ? 'Ma u baahanahay kombuyuutar aad u awood badan si aan wax u barto?' 
        : 'Do I need a high-end powerful computer to start learning?',
      a: language === 'so'
        ? 'Maya! Waxaan bixinaa koorsooyin ku bilowda CapCut oo taleefanka ama PC caadi ah ku shaqeynaya. Koorsooyinka DaVinci Resolve iyo After Effects, waxaan ku bareynaa sida loo isticmaalo Proxies si computer kasta uu si sahlan ugu socdo.'
        : 'No! You can start with our CapCut masterclass which runs on any mobile phone or standard PC. For heavy software like DaVinci Resolve and After Effects, we teach you proxy workflows so your computer edits smoothly without lagging.',
    },
    {
      q: language === 'so' 
        ? 'Koorsooyinka ma Af-Soomaali baa mise Af-Ingiriis?' 
        : 'Are the courses taught in Somali or English?',
      a: language === 'so'
        ? 'Koorsooyinka intooda badan waa laba-luuqadle (Bilingual). Macallinku wuxuu ku sharaxayaa Af-Soomaali cad isagoo isticmaalaya eray-bixinta caalamiga ah ee software-ka, si aad ugu shaqeyn karto shirkadaha caalamiga ah.'
        : 'Our courses are bilingual. Concepts are explained clearly with industry-standard English terminology so you can confidently collaborate with international clients and studios worldwide.',
    },
    {
      q: language === 'so' 
        ? 'Sideen ku helayaa shahaadadayda marka aan koorsada dhammeeyo?' 
        : 'How do I receive my verified certificate upon course completion?',
      a: language === 'so'
        ? 'Markaad wada daawato oo aad calaamadiso dhammaan casharrada koorsada, nidaamku wuxuu si toos ah kuu siinayaa shahaado digital ah oo leh lambar diiwaan-gelineed oo rasmi ah, oo aad ku daabacan karto ama ku lifaaqi karto LinkedIn iyo Resume-kaaga.'
        : 'Once you complete 100% of the lessons in a course, the platform automatically generates your digital certificate with a unique credential ID and verification QR code, ready for LinkedIn, portfolio embedding, or high-res print.',
    },
    {
      q: language === 'so' 
        ? 'Ma soo dejisan karaa faylasha tababarka (raw project files)?' 
        : 'Can I download the raw project files and practice media?',
      a: language === 'so'
        ? 'Haa! Arday kasta oo koorso ku qoran wuxuu helayaa linkiyo toos ah oo uu ku soo dejisan karo clips-ka 4K, LUTs-ka, presets-ka After Effects, iyo naqshadaha Illustrator.'
        : 'Yes! Every enrolled student gets direct download access to raw 4K practice clips, color grading LUTs, After Effects presets, and Illustrator vector assets inside the lesson player.',
    },
    {
      q: language === 'so' 
        ? 'Sideen u bixinayaa lacagta koorsooyinka lacagta ah?' 
        : 'What payment methods are supported for premium masterclasses?',
      a: language === 'so'
        ? 'Waxaan taageernaa lacag bixinta maxalliga ah ee Soomaaliya (EVC Plus, Zaad, Sahal) iyo kaararka caalamiga ah ee Visa/Mastercard marka la hawlgeliyo.'
        : 'We support local mobile payments across the Horn of Africa (EVC Plus, Zaad, Sahal) alongside international Visa/Mastercard processors.',
    },
  ];

  return (
    <section className="py-16 border-b border-slate-800/80 bg-[#050811]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
            {t.faq.title}
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            {t.faq.subtitle}
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-800/80 bg-[#090f1d] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <span className="text-sm sm:text-base font-semibold text-white">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
