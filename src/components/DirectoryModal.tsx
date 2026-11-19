import React from 'react';
import { FolderOpen, X, ArrowRight, Lock, Unlock } from 'lucide-react';

export type AppViewMode =
  | 'google'
  | 'wordreference'
  | 'ecoledirecte'
  | 'powerpoint'
  | 'reverso'
  | 'word'
  | 'explorer'
  | 'wikipedia'
  | 'mblock'
  | 'quiziniere'
  | 'code';

interface DirectoryModalProps {
  isUnlocked: boolean;
  currentMode: AppViewMode;
  onUnlockAndNavigate: (mode: AppViewMode) => void;
  onClose: () => void;
}

const DIRECTORY_ITEMS: {
  mode: AppViewMode;
  name: string;
  trigger: string;
  details: string;
}[] = [
  {
    mode: 'google',
    name: 'Google (Nouvel onglet)',
    trigger: 'Page par défaut • ↑ ↓ ← → pour activer les messages',
    details:
      'Recherche Google réelle par défaut. Après déverrouillage (↓ ↓ ↑ ← →), appuyer sur ↑ ↓ ← → active l’envoi et l’affichage des messages dans la barre Google.',
  },
  {
    mode: 'wordreference',
    name: 'WordReference.com',
    trigger: 'Taper « wordreference » ou « world reference »',
    details:
      'Taper un texte dans la barre de recherche puis Entrée envoie le message en temps réel et l’affiche dans « Définition » (sans historique).',
  },
  {
    mode: 'ecoledirecte',
    name: 'EcoleDirecte (Cahier de textes)',
    trigger: 'Taper « ecole directe » ou « ecol direct »',
    details:
      'Affiche le Cahier de textes (Compte élève, sans photo). Taper ↓ ↓ ↑ ↑ ← → ouvre l’onglet secret « Messagerie ».',
  },
  {
    mode: 'powerpoint',
    name: 'PowerPoint (Présentation1)',
    trigger: 'Taper « powerpoint »',
    details:
      'Écrire dans la zone encadrée (ou la barre supérieure) puis Entrée remplace « Exposé » en haut de la diapositive chez les autres connectés.',
  },
  {
    mode: 'reverso',
    name: 'Reverso (Traduction)',
    trigger: 'Taper « reverso »',
    details:
      'Écrire dans la zone de texte à gauche puis Entrée envoie le message en temps réel et l’affiche dans la zone de traduction à droite.',
  },
  {
    mode: 'word',
    name: 'Word (Document1 - Word)',
    trigger: 'Taper « word » ou « world »',
    details:
      'Écrire sur la page blanche (ou dans la barre supérieure) puis Entrée envoie le message et l’affiche sur le document Word.',
  },
  {
    mode: 'explorer',
    name: 'Explorateur de fichiers (Ce PC)',
    trigger: 'Taper « explorateur » ou « ce pc »',
    details:
      'Écrire dans la barre « Rechercher dans : Ce PC » en haut à droite puis Entrée envoie le message et l’affiche à la place de « Vidéos ».',
  },
  {
    mode: 'wikipedia',
    name: 'Wikipédia (Espagne / Faire un don)',
    trigger: 'Taper « wikipedia » ou « wiki »',
    details:
      'Cliquer sur « Faire un don » ouvre la page de don : cliquer dans la case « Autre » pour écrire un message puis Entrée l’envoie en temps réel.',
  },
  {
    mode: 'mblock',
    name: 'mBlock (makeblock | mBlock)',
    trigger: 'Taper « mblock »',
    details:
      'Écrire dans la zone « Sans titre » en haut à gauche puis Entrée envoie le message à tout le monde et l’affiche au milieu à gauche.',
  },
  {
    mode: 'quiziniere',
    name: 'Quizinière (Réseau Canopé)',
    trigger: 'Taper « quiziniere » ou « quizinière »',
    details:
      'Écrire dans « Identifiant » à droite (ou « code de l’exercice » à gauche) puis valider envoie le message et l’affiche dans la carte de droite.',
  },
  {
    mode: 'code',
    name: 'Éditeur de code (Temps réel)',
    trigger: 'Taper « code » ou « editeur de code »',
    details:
      'Éditeur HTML / CSS / JavaScript à gauche avec aperçu interactif en temps réel et console JS à droite.',
  },
];

export default function DirectoryModal({
  isUnlocked,
  currentMode,
  onUnlockAndNavigate,
  onClose,
}: DirectoryModalProps) {
  return (
    <div
      className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 font-sans antialiased"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white text-[#202124] rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#202124] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FolderOpen className="w-5 h-5 text-[#8ab4f8]" />
            <div>
              <h2 className="text-base font-semibold leading-tight">Répertoire</h2>
              <p className="text-[11px] text-gray-300">
                Accès et codes des pages (Ctrl + F pour ouvrir / fermer)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full ${
                isUnlocked
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                  : 'bg-amber-500/20 text-amber-200 border border-amber-400/30'
              }`}
            >
              {isUnlocked ? (
                <>
                  <Unlock className="w-3 h-3" />
                  <span>Faux sites activés</span>
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3" />
                  <span>Verrouillé (↓ ↓ ↑ ← →)</span>
                </>
              )}
            </span>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white cursor-pointer"
              aria-label="Fermer le répertoire"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Unlock Code Banner */}
        <div className="bg-[#f8f9fa] border-b border-gray-200 px-5 py-3 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-gray-700">
            <span className="font-semibold text-gray-900">Code d&apos;activation :</span>
            <div className="flex items-center gap-1">
              {['↓', '↓', '↑', '←', '→'].map((arrow, idx) => (
                <kbd
                  key={idx}
                  className="px-2 py-0.5 bg-white border border-gray-300 rounded font-mono text-xs font-bold text-gray-800 shadow-2xs"
                >
                  {arrow}
                </kbd>
              ))}
            </div>
            <span className="text-gray-500 hidden sm:inline">
              (Bas, Bas, Haut, Gauche, Droite)
            </span>
          </div>
        </div>

        {/* Directory Entries */}
        <div className="divide-y divide-gray-100 max-h-[60vh] overflow-y-auto">
          {DIRECTORY_ITEMS.map((item) => {
            const isActive = currentMode === item.mode;
            return (
              <div
                key={item.mode}
                className={`px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                  isActive ? 'bg-blue-50/60' : 'hover:bg-gray-50'
                }`}
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-gray-900">
                      {item.name}
                    </span>
                    {isActive && (
                      <span className="text-[10px] font-semibold uppercase tracking-wide bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                        Actif
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-medium text-[#1a73e8]">
                    {item.trigger}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {item.details}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onUnlockAndNavigate(item.mode)}
                  className="self-start sm:self-center shrink-0 inline-flex items-center gap-1.5 text-xs font-medium bg-[#1a73e8] hover:bg-[#1765cc] text-white px-3.5 py-2 rounded-lg cursor-pointer transition-colors"
                >
                  <span>Ouvrir</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-5 py-2.5 text-[11px] text-gray-500 flex flex-wrap items-center justify-between gap-2">
          <span>« traducteur » (télécharger FR/EN/ES hors-ligne) • /accueil • Alt + F</span>
          <span>Échap ou Ctrl + F pour fermer</span>
        </div>
      </div>
    </div>
  );
}
