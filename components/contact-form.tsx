"use client";

import { useState } from "react";
import Link from "next/link";
import { FieldHint, Input, Label, Textarea } from "@/components/form-fields";
import { GlassSelect } from "@/components/glass-select";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      action="/kontakt.php"
      method="post"
      onSubmit={() => setSubmitting(true)}
      className="glass-strong rounded-[2rem] p-6 md:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name" required>
            Ihr Name
          </Label>
          <Input id="name" name="name" required placeholder="Max Mustermann" autoComplete="name" />
        </div>
        <div>
          <Label htmlFor="email" required>
            E-Mail-Adresse
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="max.mustermann@example.de"
            autoComplete="email"
          />
        </div>
        <div>
          <Label htmlFor="phone">Telefonnummer</Label>
          <Input id="phone" name="phone" type="tel" placeholder="0123 / 456789" autoComplete="tel" />
        </div>
        <div>
          <Label htmlFor="subject" required>
            Betreff
          </Label>
          <Input id="subject" name="subject" required placeholder="Anfrage Brandschutzprüfung" />
        </div>
      </div>

      <div className="mt-5">
        <Label htmlFor="type" required>
          Art der Anfrage
        </Label>
        <GlassSelect
          id="type"
          name="type"
          required
          options={[
            "Allgemeine Anfrage",
            "Brandschutz-Leistungen",
            "Elektrotechnik-Leistungen",
            "Notfall / Störung",
            "Angebotsanfrage",
          ]}
        />
      </div>

      <div className="mt-5">
        <Label htmlFor="message" required>
          Ihre Nachricht
        </Label>
        <Textarea
          id="message"
          name="message"
          required
          placeholder="Beschreiben Sie Ihr Anliegen so detailliert wie möglich…"
        />
      </div>

      <label className="mt-5 flex items-start gap-3 text-sm text-white/60">
        <input type="checkbox" name="privacy" required className="mt-1 h-4 w-4 shrink-0 accent-white" />
        <span>
          Ich habe die <Link href="/datenschutz" className="text-white underline underline-offset-2 hover:text-white/80">Datenschutzerklärung</Link> gelesen und stimme der
          Verarbeitung meiner Daten zur Bearbeitung der Anfrage zu.
          <span className="text-white"> *</span>
        </span>
      </label>

      <div className="mt-7">
        <LiquidMetalButton
          type="submit"
          disabled={submitting}
          label={submitting ? "Wird gesendet…" : "Nachricht senden"}
        />
      </div>
      <FieldHint>Pflichtfelder sind mit * markiert. Wir melden uns schnellstmöglich bei Ihnen zurück.</FieldHint>
    </form>
  );
}
