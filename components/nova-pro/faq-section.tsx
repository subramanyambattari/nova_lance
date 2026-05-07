"use client"

import { motion } from "framer-motion"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const faqs = [
  ["Can I cancel anytime?", "Yes. You can cancel Nova Pro anytime from Billing. Your premium benefits remain active until the end of the current billing period."],
  ["Is billing monthly?", "Nova Pro supports monthly billing at $29/month and yearly billing for freelancers who want a discounted annual plan."],
  ["What payment methods are supported?", "You can pay with major cards and supported digital payment methods from the billing page."],
  ["Do I get a refund?", "Refunds depend on usage and timing. Contact priority support from your Nova Pro account for account-specific help."],
  ["Can I upgrade later?", "Yes. You can start on the free plan and upgrade when you want premium visibility, analytics, and proposal tools."],
]

export function FaqSection() {
  return (
    <motion.section initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.45 }}>
      <Card className="rounded-2xl border-white/10 bg-white/[0.045] shadow-2xl shadow-black/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-base text-zinc-100">Frequently asked questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map(([question, answer], index) => (
              <AccordionItem key={question} value={`item-${index}`}>
                <AccordionTrigger>{question}</AccordionTrigger>
                <AccordionContent>{answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </motion.section>
  )
}
