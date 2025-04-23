"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const faqData = [
  {
    question: "How long until we deliver your first blog post?",
    answer:
      "Really boy law county she unable her sister. Feet you off its like like six. Among sex are leave law built now. In built table in an rapid blush. Merits behind on afraid or warmly.",
  },
  {
    question: "Can I track my shipment?",
    answer:
      "Yes, once your parcel is picked up, you can track it live from our website or mobile app using your reference number.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "We currently offer service across major cities and towns in India. You’ll be notified if your pincode is not serviceable.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "We currently offer service across major cities and towns in India. You’ll be notified if your pincode is not serviceable.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "We currently offer service across major cities and towns in India. You’ll be notified if your pincode is not serviceable.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "We currently offer service across major cities and towns in India. You’ll be notified if your pincode is not serviceable.",
  },
];

export default function Faqs() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full mt-32 px-6">
      <h1 className="text-xl lg:text-4xl font-medium mb-10 tracking-tight uppercase">
        Frequently Asked Questions
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {faqData.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={`rounded-xl bg-[#f9f9f9] px-6 py-4 shadow-sm transition-all duration-300 ${
                isOpen ? "shadow-md" : ""
              }`}
            >
              <button
                className="flex items-start w-full text-left"
                onClick={() => toggle(index)}
              >
                <span
                  className={`text-2xl font-bold mr-4 ${
                    isOpen ? "text-green-500" : "text-red-500"
                  } leading-6`}
                >
                  {isOpen ? "–" : "+"}
                </span>
                <span className="text-base font-semibold text-gray-900 leading-6 pt-0.5">
                  {faq.question}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="mt-4 ml-9 text-gray-500 text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
