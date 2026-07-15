"use client";

import { useState } from "react";
import Link from "next/link";
import { FieldHint, Input, Label, Textarea } from "@/components/form-fields";
import { GlassSelect } from "@/components/glass-select";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";

export function ApplicationForm() {
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      action="/bewerbung.php"
      method="post"
      encType="multipart/form-data"
      onSubmit={() => setSubmitting(true)}
      className="glass-strong rounded-[2rem] p-6 md:p-8"
    >
      <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white/45">Ihre persönlichen Daten</h3>
      <div className="mt-4 grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="firstname" required>
            Vorname
          </Label>
          <Input id="firstname" name="firstname" required autoComplete="given-name" />
        </div>
        <div>
          <Label htmlFor="lastname" required>
            Nachname
          </Label>
          <Input id="lastname" name="lastname" required autoComplete="family-name" />
        </div>
        <div>
          <Label htmlFor="email" required>
            E-Mail-Adresse
          </Label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div>
          <Label htmlFor="phone">Telefonnummer</Label>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" />
        </div>
      </div>

      <h3 className="mt-8 text-sm font-semibold uppercase tracking-[0.16em] text-white/45">Ihre Bewerbung</h3>
      <div className="mt-4 space-y-5">
        <div>
          <Label htmlFor="position" required>
            Angestrebte Position
          </Label>
          <GlassSelect
            id="position"
            name="position"
            required
            options={[
              "Meister/in Elektrotechnik (m/w/d)",
              "Ausbildung zum Elektroniker (m/w/d)",
              "Initiativbewerbung",
            ]}
          />
        </div>

        <div>
          <Label htmlFor="motivation">Motivationsschreiben (optional)</Label>
          <Textarea
            id="motivation"
            name="motivation"
            placeholder="Warum möchten Sie bei Paul Grunau arbeiten und welche Qualifikationen bringen Sie mit?"
          />
        </div>

        <div>
          <Label htmlFor="cv" required>
            Lebenslauf
          </Label>
          <Input id="cv" name="cv" type="file" accept="application/pdf" required className="file:mr-4 file:rounded-pill file:border-0 file:bg-white/10 file:px-4 file:py-1.5 file:text-sm file:text-white" />
          <FieldHint>PDF, max. 5 MB – Pflichtfeld.</FieldHint>
        </div>

        <div>
          <Label htmlFor="attachments">Weitere Anlagen</Label>
          <Input
            id="attachments"
            name="attachments"
            type="file"
            accept="application/pdf"
            multiple
            className="file:mr-4 file:rounded-pill file:border-0 file:bg-white/10 file:px-4 file:py-1.5 file:text-sm file:text-white"
          />
          <FieldHint>Zeugnisse, Zertifikate – PDF, max. 10 MB gesamt.</FieldHint>
        </div>
      </div>

      <label className="mt-6 flex items-start gap-3 text-sm text-white/60">
        <input type="checkbox" name="privacy" required className="mt-1 h-4 w-4 shrink-0 accent-white" />
        <span>
          Ich stimme der Verarbeitung meiner Bewerbungsdaten gemäß{" "}
          <Link href="/datenschutz" className="text-white underline underline-offset-2 hover:text-white/80">
            Datenschutzerklärung
          </Link>{" "}
          zu.<span className="text-white"> *</span>
        </span>
      </label>

      <div className="mt-7">
        <LiquidMetalButton
          type="submit"
          disabled={submitting}
          label={submitting ? "Wird gesendet…" : "Bewerbung absenden"}
        />
      </div>
    </form>
  );
}
