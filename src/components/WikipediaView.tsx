import React, { useState, useRef } from 'react';
import {
  Menu,
  Search,
  ChevronDown,
  ChevronRight,
  Bookmark,
  MoreVertical,
  Languages,
  Volume2,
  ExternalLink,
} from 'lucide-react';

interface WikipediaViewProps {
  currentResponse: string | null;
  onSendQuery: (query: string) => void;
  onClearResponse: () => void;
  onGoHome: () => void;
}

const TOC_ITEMS = [
  { label: 'Début', active: true, expandable: false },
  { label: 'Histoire', active: false, expandable: true },
  { label: 'Politique', active: false, expandable: false },
  { label: 'Géographie', active: false, expandable: true },
  { label: 'Économie', active: false, expandable: true },
  { label: 'Culture', active: false, expandable: false },
  { label: 'Éducation', active: false, expandable: false },
  { label: 'Santé', active: false, expandable: false },
  { label: 'Sport', active: false, expandable: false },
  { label: 'Notes et références', active: false, expandable: true },
  { label: 'Voir aussi', active: false, expandable: true },
];

const PRESET_AMOUNTS = ['2,50 €', '5 €', '10 €', '20 €', '30 €', '50 €', '100 €'];

export default function WikipediaView({
  currentResponse,
  onSendQuery,
  onClearResponse,
  onGoHome,
}: WikipediaViewProps) {
  const [pageMode, setPageMode] = useState<'article' | 'donate'>('article');
  const [wikiSearch, setWikiSearch] = useState('');
  const [frequency, setFrequency] = useState<'once' | 'monthly' | 'annual'>('once');
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [customAmountMessage, setCustomAmountMessage] = useState('');
  const [contactChoice, setContactChoice] = useState<'yes' | 'no' | null>(null);
  const [textSize, setTextSize] = useState<'small' | 'standard' | 'large'>('standard');
  const [contentWidth, setContentWidth] = useState<'standard' | 'wide'>('standard');

  const customInputRef = useRef<HTMLInputElement>(null);

  const handleWikiSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = wikiSearch.trim();
    if (!trimmed) return;
    onSendQuery(trimmed);
    setWikiSearch('');
  };

  const handleCustomMessageSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = customAmountMessage.trim();
    if (!trimmed) return;
    onSendQuery(trimmed);
    setCustomAmountMessage('');
    customInputRef.current?.focus();
  };

  const handleFocusCustomAmount = () => {
    setSelectedPreset('other');
    setTimeout(() => {
      customInputRef.current?.focus();
    }, 0);
  };

  // =========================================================================
  // DONATION PAGE ("L'Internet qu'on nous avait promis" + Montant du don)
  // =========================================================================
  if (pageMode === 'donate') {
    return (
      <div className="min-h-screen bg-white text-[#202122] font-sans antialiased">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 pt-6 pb-14 grid grid-cols-1 lg:grid-cols-[150px_1fr_340px] gap-8 items-start">
          {/* Left Wikipedia + Wikimedia Foundation Logos */}
          <div className="flex flex-col gap-5 pt-1">
            <button
              type="button"
              onClick={onGoHome}
              className="text-left cursor-pointer bg-transparent border-0 p-0"
              title="Retour à Wikipédia"
            >
              <div
                className="text-[20px] tracking-[0.04em] text-[#111111] font-serif leading-none"
                style={{ fontVariant: 'small-caps' }}
              >
                WIKIPEDIA
              </div>
            </button>

            <button
              type="button"
              onClick={onGoHome}
              className="flex items-center gap-2 text-left cursor-pointer bg-transparent border-0 p-0"
            >
              <div className="w-7 h-7 rounded-full border-[3px] border-[#111111] flex items-center justify-center shrink-0 relative">
                <div className="w-2.5 h-2.5 rounded-full bg-[#111111]" />
                <div className="absolute -top-1.5 w-3 h-2 bg-white" />
              </div>
              <div className="leading-tight">
                <div className="text-[11px] font-bold tracking-wider text-[#111111]">
                  WIKIMEDIA
                </div>
                <div className="text-[9.5px] tracking-[0.14em] text-[#444444]">
                  FOUNDATION
                </div>
              </div>
            </button>
          </div>

          {/* Center Appeal Column (Displays live received message cleanly) */}
          <div className="pt-1">
            <h1
              onClick={onClearResponse}
              className="text-[22px] sm:text-[24px] font-normal text-[#111111] pb-2 mb-4 border-b border-[#c8ccd1] cursor-pointer select-text break-words"
            >
              {currentResponse || "L'Internet qu'on nous avait promis"}
            </h1>

            <div className="space-y-4 text-[14.5px] leading-[1.6] text-[#202122]">
              <p>
                Merci d&apos;envisager de faire un don à la Wikimedia Foundation. Nous vous invitons à
                réfléchir au nombre de fois où vous avez consulté Wikipédia cette année. Si vous avez
                bénéficié des connaissances acquises sur l&apos;encyclopédie, merci de rejoindre les 2 % de
                lecteurs et lectrices qui font un don. Tout montant nous aide : 5 €, 20 €, 50 € ou ce
                qui vous paraît juste aujourd&apos;hui.
              </p>
              <p>
                L&apos;Internet qu&apos;on nous avait promis — un lieu de savoir libre, collaboratif et
                accessible — est sans cesse menacé. Les bénévoles de Wikipédia travaillent ensemble à
                créer et vérifier les pages auxquelles vous faites confiance à l&apos;aide d&apos;outils qui
                effacent les actes de vandalisme en quelques minutes pour que vous trouviez des
                informations fiables.
              </p>
              <p>
                Si Wikipédia vous a transmis des connaissances utiles cette année, merci de donner à
                votre tour. Il n&apos;y a pas de petites contributions : chaque modification de page, chaque
                don compte.
              </p>
              <p>Merci.</p>
            </div>
          </div>

          {/* Right Donation Form Card */}
          <aside className="border border-[#c8ccd1] bg-white p-4 text-[13px] shadow-2xs">
            <div className="text-center text-[12px] text-[#202122] pb-2 mb-3 border-b border-[#eaecf0]">
              France{' '}
              <button
                type="button"
                className="text-[#3366cc] hover:underline cursor-pointer bg-transparent border-0 p-0"
              >
                modifier
              </button>
            </div>

            <div className="text-center font-bold text-[13px] mb-2.5">
              Montant du don (EUR)
            </div>

            {/* Frequency Tabs */}
            <div className="grid grid-cols-3 gap-1.5 mb-3">
              {[
                { id: 'once' as const, label: 'Don ponctuel' },
                { id: 'monthly' as const, label: 'Don mensuel' },
                { id: 'annual' as const, label: 'Don annuel' },
              ].map((tab) => {
                const isActive = frequency === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFrequency(tab.id)}
                    className={`py-2.5 px-1.5 text-[12px] font-medium border rounded-[2px] cursor-pointer transition-colors ${
                      isActive
                        ? 'bg-[#2a4b8d] border-[#2a4b8d] text-white'
                        : 'bg-[#f8f9fa] hover:bg-[#eaecf0] border-[#c8ccd1] text-[#202122]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Amount Grid including "Autre" message input */}
            <form onSubmit={handleCustomMessageSubmit}>
              <div className="grid grid-cols-4 gap-1.5 mb-3">
                {PRESET_AMOUNTS.map((amt) => {
                  const isActive = selectedPreset === amt;
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setSelectedPreset(amt)}
                      className={`h-[46px] border rounded-[2px] text-[13px] cursor-pointer transition-colors ${
                        isActive
                          ? 'bg-[#eaf3ff] border-[#3366cc] text-[#2a4b8d] font-semibold'
                          : 'bg-[#f8f9fa] hover:bg-[#eaecf0] border-[#c8ccd1] text-[#202122]'
                      }`}
                    >
                      {amt}
                    </button>
                  );
                })}

                {/* "Autre" box — clicking focuses input, typing + Enter sends message */}
                <div
                  onClick={handleFocusCustomAmount}
                  className={`h-[46px] border rounded-[2px] px-1.5 py-1 flex flex-col items-center justify-between cursor-text ${
                    selectedPreset === 'other'
                      ? 'bg-white border-[#3366cc] ring-1 ring-[#3366cc]'
                      : 'bg-[#f8f9fa] border-[#c8ccd1]'
                  }`}
                >
                  <span className="text-[11px] text-[#202122] leading-none">Autre</span>
                  <input
                    ref={customInputRef}
                    type="text"
                    value={customAmountMessage}
                    onFocus={() => setSelectedPreset('other')}
                    onChange={(e) => setCustomAmountMessage(e.target.value)}
                    aria-label="Saisir le montant"
                    autoComplete="off"
                    className="w-full h-[22px] bg-white border border-[#a2a9b1] rounded-[2px] px-1 text-[11px] text-[#202122] outline-none focus:border-[#3366cc]"
                  />
                </div>
              </div>

              {/* Contact Question */}
              <div className="mb-3 space-y-2 text-[12px]">
                <div className="font-bold">Peut-on rester en contact avec vous ?</div>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="wiki-contact"
                    checked={contactChoice === 'yes'}
                    onChange={() => setContactChoice('yes')}
                    className="mt-0.5"
                  />
                  <span>
                    Oui, la Wikimedia Foundation peut m&apos;envoyer un courriel de temps en temps.
                  </span>
                </label>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="wiki-contact"
                    checked={contactChoice === 'no'}
                    onChange={() => setContactChoice('no')}
                    className="mt-0.5"
                  />
                  <span>Non, je ne pourrai pas vous soutenir ou vous conseiller à l&apos;avenir.</span>
                </label>
              </div>

              <p className="text-[11px] leading-snug text-[#202122] mb-3.5">
                La Wikimedia Foundation vous enverra des nouvelles par courriel et vous informera si
                Wikipédia a besoin de votre soutien ou de votre avis. Nous traitons toutes les données de
                nos utilisateurs et utilisatrices dans le respect de notre{' '}
                <a
                  href="#privacy"
                  onClick={(e) => e.preventDefault()}
                  className="text-[#3366cc] hover:underline inline-flex items-center gap-0.5"
                >
                  Politique de confidentialité
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
                , et vous trouverez dans chacun de nos courriels une option de désabonnement.
              </p>

              {/* Payment Buttons (also submit customAmountMessage if entered) */}
              <div className="space-y-2">
                <button
                  type="submit"
                  className="w-full h-[38px] bg-[#f8f9fa] hover:bg-[#eaecf0] border border-[#c8ccd1] rounded-[2px] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="text-[12px] font-extrabold italic text-[#1a1f71]">VISA</span>
                  <span className="inline-flex items-center">
                    <span className="w-4 h-4 rounded-full bg-[#eb001b] inline-block" />
                    <span className="w-4 h-4 rounded-full bg-[#f79e1b] -ml-2 inline-block opacity-90" />
                  </span>
                  <span className="bg-[#2e77bc] text-white text-[9px] font-bold px-1 py-0.5 leading-none rounded-2xs">
                    AM EX
                  </span>
                </button>

                <button
                  type="submit"
                  className="w-full h-[38px] bg-[#f8f9fa] hover:bg-[#eaecf0] border border-[#c8ccd1] rounded-[2px] flex items-center justify-center cursor-pointer"
                >
                  <span className="text-[15px] font-extrabold italic">
                    <span className="text-[#003087]">Pay</span>
                    <span className="text-[#0079c1]">Pal</span>
                  </span>
                </button>

                <button
                  type="submit"
                  className="w-full h-[38px] bg-[#f8f9fa] hover:bg-[#eaecf0] border border-[#c8ccd1] rounded-[2px] flex items-center justify-center text-[14px] font-semibold text-[#111111] cursor-pointer"
                >
                  Pay
                </button>

                <button
                  type="submit"
                  className="w-full h-[38px] bg-[#f8f9fa] hover:bg-[#eaecf0] border border-[#c8ccd1] rounded-[2px] flex items-center justify-center cursor-pointer"
                >
                  <span className="border border-[#747775] rounded-full px-2.5 py-0.5 text-[12px] font-medium bg-white">
                    <span className="text-[#4285f4] font-bold">G</span> Pay
                  </span>
                </button>

                <button
                  type="submit"
                  className="w-full py-2 px-3 bg-[#f8f9fa] hover:bg-[#eaecf0] border border-[#c8ccd1] rounded-[2px] text-[12.5px] font-medium text-[#3366cc] cursor-pointer"
                >
                  Faire un don par prélèvement bancaire (SEPA)
                </button>
              </div>
            </form>

            <div className="mt-4 pt-3 border-t border-[#eaecf0] text-[11px] leading-snug text-[#202122]">
              <div className="font-bold mb-1">Où va votre don :</div>
              <p>
                <strong>Infrastructure technologique</strong> : serveurs, bande passante, maintenance,
                développement. Wikipédia est l&apos;un des 10 sites web les plus visités au monde alors
                qu&apos;elle fonctionne avec une infime fraction de ce que dépensent d&apos;autres grands sites.
              </p>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  // =========================================================================
  // DEFAULT ARTICLE PAGE ("Espagne — Wikipédia")
  // =========================================================================
  const articleTextClass =
    textSize === 'small'
      ? 'text-[13px]'
      : textSize === 'large'
      ? 'text-[16px]'
      : 'text-[14px]';

  return (
    <div className="min-h-screen bg-white text-[#202122] font-sans antialiased">
      {/* Top Vector 2022 Header */}
      <header className="max-w-[1460px] mx-auto px-4 sm:px-6 h-[60px] flex items-center justify-between gap-4">
        {/* Left: Menu + Globe + WIKIPÉDIA */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            className="p-2 hover:bg-[#eaecf0] rounded cursor-pointer text-[#202122]"
            aria-label="Menu principal"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={onGoHome}
            className="flex items-center gap-2.5 cursor-pointer bg-transparent border-0 p-0 text-left"
          >
            {/* Wikipedia Puzzle Globe */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f8f9fa] via-[#d7dadf] to-[#a2a9b1] border border-[#c8ccd1] flex items-center justify-center relative shadow-2xs shrink-0">
              <span className="font-serif text-[13px] font-semibold text-[#222222] tracking-tight">
                W
              </span>
            </div>
            <div className="leading-tight">
              <div
                className="text-[18px] font-serif tracking-[0.04em] text-[#000000]"
                style={{ fontVariant: 'small-caps' }}
              >
                WIKIPÉDIA
              </div>
              <div className="text-[11px] text-[#54595d]">
                L&apos;encyclopédie libre
              </div>
            </div>
          </button>
        </div>

        {/* Center: Search Bar */}
        <form
          onSubmit={handleWikiSearchSubmit}
          className="flex-1 max-w-[460px] flex items-center h-[34px]"
        >
          <div className="flex-1 h-full border border-[#a2a9b1] focus-within:border-[#3366cc] bg-white px-2.5 flex items-center gap-2">
            <Search className="w-4 h-4 text-[#72777d] shrink-0" />
            <input
              type="text"
              value={wikiSearch}
              onChange={(e) => setWikiSearch(e.target.value)}
              placeholder="Rechercher sur Wikipédia"
              autoComplete="off"
              className="w-full bg-transparent outline-none text-[13.5px] text-[#202122] placeholder-[#72777d]"
            />
          </div>
          <button
            type="submit"
            className="h-full px-3.5 bg-[#f8f9fa] hover:bg-[#ffffff] border border-l-0 border-[#a2a9b1] text-[13px] font-bold text-[#202122] cursor-pointer"
          >
            Rechercher
          </button>
        </form>

        {/* Right: Faire un don / Créer un compte / Se connecter */}
        <nav className="hidden md:flex items-center gap-3.5 text-[13px] text-[#3366cc] shrink-0">
          <button
            type="button"
            onClick={() => setPageMode('donate')}
            className="hover:underline cursor-pointer bg-transparent border-0 text-[#3366cc] p-0 font-normal"
          >
            Faire un don
          </button>
          <a href="#create" onClick={(e) => e.preventDefault()} className="hover:underline">
            Créer un compte
          </a>
          <a href="#login" onClick={(e) => e.preventDefault()} className="hover:underline">
            Se connecter
          </a>
        </nav>
      </header>

      {/* Main 3-Column Wikipedia Layout */}
      <div
        className={`mx-auto px-4 sm:px-6 pt-3 pb-12 grid grid-cols-1 lg:grid-cols-[190px_1fr_210px] gap-7 items-start ${
          contentWidth === 'wide' ? 'max-w-[1540px]' : 'max-w-[1380px]'
        }`}
      >
        {/* Left Sidebar: Sommaire */}
        <aside className="hidden lg:block text-[13px] pt-2">
          <div className="flex items-center gap-2 pb-2 border-b border-[#eaecf0] mb-2">
            <span className="font-bold text-[#202122]">Sommaire</span>
            <span className="text-[11px] bg-[#eaecf0] text-[#202122] px-1.5 py-0.5 rounded-2xs">
              masquer
            </span>
          </div>
          <ul className="space-y-1.5">
            {TOC_ITEMS.map((item) => (
              <li key={item.label} className="flex items-center gap-1.5">
                {item.expandable ? (
                  <ChevronRight className="w-3 h-3 text-[#72777d] shrink-0" />
                ) : (
                  <span className="w-3 shrink-0" />
                )}
                <a
                  href="#section"
                  onClick={(e) => e.preventDefault()}
                  className={
                    item.active
                      ? 'font-bold text-[#202122]'
                      : 'text-[#3366cc] hover:underline'
                  }
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        {/* Center Article Body */}
        <main className="min-w-0">
          {/* Article Title Row */}
          <div className="flex items-baseline justify-between border-b border-[#a2a9b1] pb-1">
            <h1 className="text-[28px] font-serif font-normal text-[#000000]">Espagne</h1>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#3366cc] hover:bg-[#eaf3ff] px-2 py-1 rounded cursor-pointer"
            >
              <Languages className="w-4 h-4" />
              <span>312 langues</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Article Tabs Row */}
          <div className="flex items-center justify-between border-b border-[#eaecf0] text-[13px] mb-3">
            <div className="flex items-center gap-4">
              <span className="py-2 border-b-2 border-[#202122] font-medium text-[#202122]">
                Article
              </span>
              <a
                href="#discussion"
                onClick={(e) => e.preventDefault()}
                className="py-2 text-[#3366cc] hover:underline"
              >
                Discussion
              </a>
            </div>

            <div className="hidden sm:flex items-center gap-3.5 text-[#3366cc]">
              <span className="py-2 border-b-2 border-[#202122] text-[#202122]">Lire</span>
              <a href="#edit" onClick={(e) => e.preventDefault()} className="hover:underline">
                Modifier
              </a>
              <a href="#source" onClick={(e) => e.preventDefault()} className="hover:underline">
                Modifier le code
              </a>
              <a href="#history" onClick={(e) => e.preventDefault()} className="hover:underline">
                Voir l&apos;historique
              </a>
              <Bookmark className="w-4 h-4 text-[#202122]" />
              <MoreVertical className="w-4 h-4 text-[#202122]" />
            </div>
          </div>

          <div className="flex justify-end text-[12px] text-[#3366cc] mb-2">
            40° 12&apos; N, 3° 30&apos; O
          </div>

          {/* Disambiguation Notice (also reflects incoming message if received on article view) */}
          <div className="text-[13.5px] italic text-[#202122] space-y-1 mb-3 pl-4">
            <p onClick={onClearResponse} className="cursor-pointer select-text">
              {currentResponse || (
                <>
                  Pour les articles homonymes, voir{' '}
                  <a href="#h" onClick={(e) => e.preventDefault()} className="text-[#3366cc] hover:underline">
                    Espagne (homonymie)
                  </a>{' '}
                  et{' '}
                  <a href="#e" onClick={(e) => e.preventDefault()} className="text-[#3366cc] hover:underline">
                    España
                  </a>
                  .
                </>
              )}
            </p>
            <p>
              « Royaume d&apos;Espagne » redirige ici. Pour les autres significations, voir{' '}
              <a href="#r" onClick={(e) => e.preventDefault()} className="text-[#3366cc] hover:underline">
                Royaume d&apos;Espagne (homonymie)
              </a>
              .
            </p>
          </div>

          {/* Mobile Donate Button */}
          <div className="md:hidden mb-3">
            <button
              type="button"
              onClick={() => setPageMode('donate')}
              className="text-[13px] text-[#3366cc] underline cursor-pointer"
            >
              Faire un don
            </button>
          </div>

          {/* Article Content + Right Infobox */}
          <div className="flex flex-col md:flex-row gap-5 items-start">
            <div className={`flex-1 space-y-3.5 leading-[1.6] text-[#202122] ${articleTextClass}`}>
              <p>
                L&apos;<strong>Espagne</strong> (en{' '}
                <a href="#es" onClick={(e) => e.preventDefault()} className="text-[#3366cc] hover:underline">
                  espagnol
                </a>{' '}
                : <span className="italic">España</span>{' '}
                <Volume2 className="w-3.5 h-3.5 inline text-[#3366cc]" />{' '}
                <a href="#ecouter" onClick={(e) => e.preventDefault()} className="text-[#3366cc] text-[12px] hover:underline">
                  Écouter
                </a>
                ), en forme longue le <strong>royaume d&apos;Espagne</strong> (en espagnol :{' '}
                <span className="italic">Reino de España</span>), est un État souverain transcontinental
                d&apos;
                <a href="#eur" onClick={(e) => e.preventDefault()} className="text-[#3366cc] hover:underline">
                  Europe du Sud-Ouest
                </a>
                , qui occupe la plus grande partie de la{' '}
                <a href="#ib" onClick={(e) => e.preventDefault()} className="text-[#3366cc] hover:underline">
                  péninsule Ibérique
                </a>
                . Sa superficie est de 505 990 km².
              </p>

              <p>
                L&apos;Espagne est bordée au nord-est par les{' '}
                <a href="#pyr" onClick={(e) => e.preventDefault()} className="text-[#3366cc] hover:underline">
                  Pyrénées
                </a>
                , qui constituent une frontière naturelle avec la{' '}
                <a href="#fr" onClick={(e) => e.preventDefault()} className="text-[#3366cc] hover:underline">
                  France
                </a>{' '}
                et l&apos;
                <a href="#and" onClick={(e) => e.preventDefault()} className="text-[#3366cc] hover:underline">
                  Andorre
                </a>
                , à l&apos;est et au sud-est par la{' '}
                <a href="#med" onClick={(e) => e.preventDefault()} className="text-[#3366cc] hover:underline">
                  mer Méditerranée
                </a>
                , au sud-sud-ouest par le territoire britannique de{' '}
                <a href="#gib" onClick={(e) => e.preventDefault()} className="text-[#3366cc] hover:underline">
                  Gibraltar
                </a>{' '}
                et le{' '}
                <a href="#det" onClick={(e) => e.preventDefault()} className="text-[#3366cc] hover:underline">
                  détroit du même nom
                </a>
                , ce dernier séparant le continent européen de l&apos;
                <a href="#af" onClick={(e) => e.preventDefault()} className="text-[#3366cc] hover:underline">
                  Afrique
                </a>
                . Le{' '}
                <a href="#pt" onClick={(e) => e.preventDefault()} className="text-[#3366cc] hover:underline">
                  Portugal
                </a>{' '}
                est limitrophe de l&apos;Espagne à l&apos;ouest tandis que l&apos;océan Atlantique borde le pays au
                sud-ouest et à l&apos;ouest-nord-ouest ; enfin le{' '}
                <a href="#gasc" onClick={(e) => e.preventDefault()} className="text-[#3366cc] hover:underline">
                  golfe de Gascogne
                </a>{' '}
                baigne le littoral nord.
              </p>

              <p>
                L&apos;Espagne en tant que pays naît de l&apos;union dynastique au XV<sup>e</sup> siècle de deux
                États souverains, les couronnes de Castille et d&apos;Aragon — elles-mêmes construites tout
                au long du Moyen Âge par l&apos;union ou la conquête d&apos;entités politiques, culturelles et
                linguistiques initialement distinctes.
              </p>
            </div>

            {/* Infobox */}
            <aside className="w-full md:w-[270px] bg-[#f8f9fa] border border-[#a2a9b1] p-2.5 text-[12px] shrink-0">
              <div className="bg-[#eaecf0] py-2 px-2 text-center mb-3">
                <div className="text-[15px] font-bold text-[#202122]">Royaume d&apos;Espagne</div>
                <div className="text-[12.5px] italic font-semibold text-[#202122] mt-0.5">
                  Reino de España
                </div>
              </div>

              {/* Flag + Coat of Arms */}
              <div className="grid grid-cols-2 gap-3 items-center justify-items-center mb-3">
                <div className="text-center">
                  <div className="w-20 h-14 border border-[#c8ccd1] flex flex-col mx-auto overflow-hidden">
                    <div className="h-1/4 bg-[#aa151b]" />
                    <div className="h-2/4 bg-[#f1bf00] flex items-center pl-3">
                      <div className="w-3 h-4 bg-[#aa151b] rounded-xs opacity-85" />
                    </div>
                    <div className="h-1/4 bg-[#aa151b]" />
                  </div>
                  <div className="text-[11px] text-[#3366cc] mt-1">Drapeau de l&apos;Espagne</div>
                </div>

                <div className="text-center">
                  <div className="w-12 h-14 border border-[#c8ccd1] bg-white rounded-b-lg flex flex-col items-center justify-center mx-auto">
                    <div className="w-5 h-2 bg-[#f1bf00] rounded-t-sm border border-[#aa151b] mb-0.5" />
                    <div className="w-7 h-8 bg-[#aa151b] rounded-b-md border border-[#f1bf00]" />
                  </div>
                  <div className="text-[11px] text-[#3366cc] mt-1">Armoiries de l&apos;Espagne</div>
                </div>
              </div>

              <div className="space-y-1.5 text-[12px] border-t border-[#eaecf0] pt-2">
                <div className="grid grid-cols-[95px_1fr] gap-2">
                  <span className="font-bold">Devise</span>
                  <span>
                    en latin : <span className="italic">Plus ultra</span> (« Plus loin »)
                  </span>
                </div>
                <div className="grid grid-cols-[95px_1fr] gap-2">
                  <span className="font-bold">Hymne</span>
                  <span>
                    en espagnol : <span className="text-[#3366cc]">Marcha Real</span> (« Marche royale »)
                  </span>
                </div>
                <div className="grid grid-cols-[95px_1fr] gap-2">
                  <span className="font-bold">Fête nationale</span>
                  <span className="text-[#3366cc]">12 octobre</span>
                </div>
                <div className="grid grid-cols-[95px_1fr] gap-2">
                  <span className="font-bold">Événement commémoré</span>
                  <span>Découverte de l&apos;Amérique par Christophe Colomb (1492)</span>
                </div>
              </div>

              {/* Map Illustration */}
              <div className="mt-3 pt-2 border-t border-[#eaecf0] text-center">
                <div className="w-full h-36 bg-[#edf3f8] border border-[#c8ccd1] flex items-center justify-center relative overflow-hidden">
                  <svg viewBox="0 0 200 130" className="w-full h-full">
                    <rect width="200" height="130" fill="#e6f0f7" />
                    <path
                      d="M45 95 L72 86 L95 70 L125 45 L155 55 L165 82 L130 92 L95 100 L65 112 Z"
                      fill="#c8d6bf"
                      stroke="#95a38e"
                      strokeWidth="1"
                    />
                    <path
                      d="M42 92 L68 88 L66 108 L42 106 Z"
                      fill="#1b7f2b"
                    />
                  </svg>
                </div>
                <p className="text-[11px] text-[#202122] mt-1.5 leading-snug">
                  Le royaume d&apos;Espagne en Europe (l&apos;<span className="text-[#3366cc]">Union européenne</span> en vert clair et l&apos;<span className="text-[#3366cc]">Europe</span> en gris foncé).
                </p>
              </div>
            </aside>
          </div>
        </main>

        {/* Right Sidebar: Apparence */}
        <aside className="hidden lg:block text-[13px] pt-2">
          <div className="flex items-center gap-2 pb-2 border-b border-[#eaecf0] mb-3">
            <span className="font-bold text-[#202122]">Apparence</span>
            <span className="text-[11px] bg-[#eaecf0] text-[#202122] px-1.5 py-0.5 rounded-2xs">
              masquer
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-[12px] text-[#54595d] border-b border-[#eaecf0] pb-1 mb-2">
                Taille du texte
              </div>
              <div className="space-y-1.5">
                {[
                  { id: 'small' as const, label: 'Petite' },
                  { id: 'standard' as const, label: 'Standard' },
                  { id: 'large' as const, label: 'Grande' },
                ].map((opt) => (
                  <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="wiki-size"
                      checked={textSize === opt.id}
                      onChange={() => setTextSize(opt.id)}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[12px] text-[#54595d] border-b border-[#eaecf0] pb-1 mb-2">
                Largeur
              </div>
              <div className="space-y-1.5">
                {[
                  { id: 'standard' as const, label: 'Standard' },
                  { id: 'wide' as const, label: 'Large' },
                ].map((opt) => (
                  <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="wiki-width"
                      checked={contentWidth === opt.id}
                      onChange={() => setContentWidth(opt.id)}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[12px] text-[#54595d] border-b border-[#eaecf0] pb-1 mb-2">
                Couleur (bêta)
              </div>
              <div className="space-y-1.5">
                {['Automatique', 'Clair', 'Sombre'].map((label) => (
                  <label key={label} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="wiki-color" defaultChecked={label === 'Clair'} />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
