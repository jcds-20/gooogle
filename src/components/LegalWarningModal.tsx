import React from 'react';
import { X } from 'lucide-react';

interface LegalWarningModalProps {
  onClose: () => void;
  requireAccept?: boolean;
  onAccept?: () => void;
}

export default function LegalWarningModal({
  onClose,
  requireAccept = false,
  onAccept,
}: LegalWarningModalProps) {
  return (
    <div
      className="fixed inset-0 z-[200] bg-neutral-950/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 font-sans antialiased"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-warning-title"
      onClick={() => {
        if (!requireAccept) onClose();
      }}
    >
      {/* Floating Legal Warning Pop-Up */}
      <div
        className="w-full max-w-[560px] bg-white text-neutral-800 rounded-2xl shadow-[0_24px_70px_-12px_rgba(0,0,0,0.45)] ring-1 ring-black/5 overflow-hidden flex flex-col max-h-[88vh] animate-popup-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Line */}
        <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 shrink-0" />

        {/* Pop-Up Header */}
        <div className="px-6 sm:px-7 pt-6 pb-4 bg-white flex items-start gap-4">
          <div
            className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200/70 flex items-center justify-center text-[22px] shrink-0"
            aria-hidden="true"
          >
            ⚠️
          </div>
          <div className="min-w-0 flex-1">
            <h1
              id="legal-warning-title"
              className="text-[15px] sm:text-[17px] font-bold tracking-tight text-neutral-900 leading-snug"
            >
              AVERTISSEMENT – CONDITIONS D&apos;UTILISATION
            </h1>
            <p className="mt-1 text-[13px] text-neutral-500 leading-relaxed">
              Bienvenue sur ce site. Veuillez lire attentivement les informations suivantes.
            </p>
          </div>
          {!requireAccept && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer"
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Clean Editorial Legal Articles */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-7 py-2 bg-[#fafafa] border-y border-neutral-200/80 divide-y divide-neutral-200/70 text-[13px] leading-[1.6] text-neutral-600">
          <section className="py-3.5 space-y-1">
            <h2 className="font-semibold text-neutral-900 text-[13.5px]">
              Article 1 – Nature du site
            </h2>
            <p>
              Ce site est un projet indépendant, créé exclusivement à des fins humoristiques,
              parodiques et expérimentales.
            </p>
            <p>
              Il s&apos;agit d&apos;un site de divertissement dont le contenu ne doit en aucun cas
              être interprété comme une représentation officielle des services ou entreprises dont
              certaines interfaces peuvent s&apos;inspirer.
            </p>
          </section>

          <section className="py-3.5 space-y-1">
            <h2 className="font-semibold text-neutral-900 text-[13.5px]">
              Article 2 – Absence d&apos;affiliation
            </h2>
            <p>
              Ce site n&apos;est ni affilié, ni sponsorisé, ni approuvé par Google ou par les
              autres entreprises dont les interfaces, éléments graphiques ou concepts peuvent être
              évoqués.
            </p>
            <p>
              Les marques et noms commerciaux éventuellement mentionnés restent la propriété de
              leurs titulaires respectifs.
            </p>
          </section>

          <section className="py-3.5 space-y-1">
            <h2 className="font-semibold text-neutral-900 text-[13.5px]">
              Article 3 – Propriété intellectuelle
            </h2>
            <p>
              Les éventuels éléments appartenant à des tiers restent soumis aux droits de leurs
              propriétaires respectifs.
            </p>
            <p>
              La présence d&apos;une mention humoristique ou parodique ne constitue pas une
              autorisation générale de reproduction ou d&apos;utilisation de contenus protégés.
            </p>
          </section>

          <section className="py-3.5 space-y-1">
            <h2 className="font-semibold text-neutral-900 text-[13.5px]">
              Article 4 – Finalité humoristique
            </h2>
            <p>Le site est uniquement destiné au divertissement et à la plaisanterie.</p>
            <p>
              Aucune information, fonctionnalité ou présentation ne doit être considérée comme une
              communication officielle des entreprises évoquées.
            </p>
          </section>

          <section className="py-3.5 space-y-1">
            <h2 className="font-semibold text-neutral-900 text-[13.5px]">
              Article 5 – Responsabilité
            </h2>
            <p>
              L&apos;utilisateur accède à ce site et l&apos;utilise sous sa seule et entière
              responsabilité.
            </p>
            <p>
              En poursuivant sa navigation, il s&apos;engage à faire un usage respectueux et
              conforme aux lois et règlements en vigueur.
            </p>
          </section>
        </div>

        {/* Footer Action Button */}
        <div className="px-6 sm:px-7 py-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-[11.5px] text-neutral-500 leading-snug">
            {requireAccept
              ? "Vous devez accepter les conditions d'utilisation pour accéder au site."
              : "Informations légales et conditions générales d'utilisation du site."}
          </p>
          {requireAccept ? (
            <button
              type="button"
              onClick={() => onAccept?.()}
              className="h-10 px-5 rounded-xl bg-neutral-900 hover:bg-neutral-800 active:bg-black text-white text-[13px] font-semibold inline-flex items-center justify-center cursor-pointer transition-colors shrink-0 whitespace-nowrap"
            >
              Accepter et continuer
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-5 rounded-xl bg-neutral-900 hover:bg-neutral-800 active:bg-black text-white text-[13px] font-semibold inline-flex items-center justify-center cursor-pointer transition-colors shrink-0 whitespace-nowrap"
            >
              Fermer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
