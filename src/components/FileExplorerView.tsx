import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ChevronDown,
  ChevronRight,
  RotateCw,
  Search,
  Monitor,
  FileText,
  Image as ImageIcon,
  Music,
  Box,
  Download,
  Film,
  HardDrive,
  Disc,
  Network,
  Cloud,
  Star,
  Pin,
  HelpCircle,
  LayoutList,
  LayoutGrid,
} from 'lucide-react';

interface FileExplorerViewProps {
  currentResponse: string | null;
  onSendQuery: (query: string) => void;
  onClearResponse: () => void;
  onGoHome: () => void;
}

export default function FileExplorerView({
  currentResponse,
  onSendQuery,
  onClearResponse,
  onGoHome,
}: FileExplorerViewProps) {
  const [searchText, setSearchText] = useState('');
  const [foldersOpen, setFoldersOpen] = useState(true);
  const [drivesOpen, setDrivesOpen] = useState(true);
  const [networkOpen, setNetworkOpen] = useState(true);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const videosLabel = currentResponse || 'Vidéos';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchText.trim();
    if (!trimmed) return;
    onSendQuery(trimmed);
    setSearchText('');
    searchInputRef.current?.focus();
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1f1f1f] font-sans antialiased select-none">
      {/* Window Title Bar */}
      <div className="h-[28px] bg-white px-2.5 flex items-center justify-between text-[12px]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onGoHome}
            className="w-4 h-4 rounded-xs bg-[#0078d4] flex items-center justify-center text-white text-[9px] font-bold cursor-pointer border-0 p-0"
          >
            PC
          </button>
          <span className="text-[#cccccc]">|</span>
          <button
            type="button"
            onClick={onClearResponse}
            className="text-[#1f1f1f] hover:underline cursor-pointer bg-transparent border-0 text-[12px]"
          >
            Ce PC
          </button>
        </div>
      </div>

      {/* Ribbon Tabs Row */}
      <div className="h-[24px] bg-white border-b border-[#e5e5e5] flex items-center justify-between text-[11.5px]">
        <div className="flex items-center h-full">
          <button
            type="button"
            className="bg-[#0066b8] hover:bg-[#005a9e] text-white px-4 h-full flex items-center cursor-pointer"
          >
            Fichier
          </button>
          <button
            type="button"
            className="px-3.5 h-full flex items-center text-[#222222] hover:bg-[#f2f2f2] cursor-pointer"
          >
            Ordinateur
          </button>
          <button
            type="button"
            className="px-3.5 h-full flex items-center text-[#222222] hover:bg-[#f2f2f2] cursor-pointer"
          >
            Affichage
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-2">
          <ChevronDown className="w-3.5 h-3.5 text-[#555555]" />
          <HelpCircle className="w-4 h-4 text-[#0066b8]" />
        </div>
      </div>

      {/* Address Bar & Top-Right Search Bar ("Rechercher dans : Ce PC") */}
      <div className="bg-white px-2 py-1.5 flex items-center gap-2 border-b border-[#e5e5e5]">
        {/* Navigation Arrows */}
        <div className="flex items-center gap-1 text-[#777777] shrink-0">
          <button type="button" className="p-1 hover:bg-[#f2f2f2] rounded-xs opacity-55">
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button type="button" className="p-1 hover:bg-[#f2f2f2] rounded-xs opacity-45">
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <ChevronDown className="w-3 h-3 opacity-60" />
          <button type="button" className="p-1 hover:bg-[#f2f2f2] rounded-xs opacity-65">
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Breadcrumb Path Box */}
        <div className="flex-1 h-[26px] border border-[#d9d9d9] bg-white px-2 flex items-center justify-between text-[12px] min-w-0">
          <div className="flex items-center gap-1.5 truncate">
            <Monitor className="w-3.5 h-3.5 text-[#0078d4] shrink-0" />
            <ChevronRight className="w-3 h-3 text-[#777777] shrink-0" />
            <span className="text-[#1f1f1f]">Ce PC</span>
            <ChevronRight className="w-3 h-3 text-[#777777] shrink-0" />
          </div>
          <div className="flex items-center gap-1.5 text-[#666666] shrink-0">
            <ChevronDown className="w-3 h-3" />
            <span className="text-[#e0e0e0]">|</span>
            <button
              type="button"
              onClick={onClearResponse}
              title="Actualiser"
              className="hover:text-[#0066b8] cursor-pointer"
            >
              <RotateCw className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Top-Right Search Input ("Rechercher dans : Ce PC") */}
        <form
          onSubmit={handleSearchSubmit}
          className="w-[190px] sm:w-[270px] h-[26px] border border-[#d9d9d9] focus-within:border-[#0078d4] bg-white px-2 flex items-center gap-1.5 shrink-0"
        >
          <input
            ref={searchInputRef}
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Rechercher dans : Ce PC"
            autoComplete="off"
            autoFocus
            aria-label="Rechercher dans : Ce PC"
            className="flex-1 bg-transparent outline-none text-[12px] text-[#1f1f1f] placeholder-[#767676] min-w-0"
          />
          <button
            type="submit"
            aria-label="Rechercher"
            className="text-[#666666] hover:text-[#0078d4] cursor-pointer shrink-0"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Main Two-Column Explorer Area */}
      <div className="flex-1 flex min-h-0">
        {/* Left Navigation Tree */}
        <aside className="w-[165px] sm:w-[195px] border-r border-[#e5e5e5] bg-white py-2 px-1 text-[12px] text-[#222222] shrink-0 hidden sm:block">
          {/* Accès rapide */}
          <div className="flex items-center gap-1.5 px-2 py-1 hover:bg-[#e5f3ff] cursor-pointer">
            <Star className="w-3.5 h-3.5 text-[#0078d4] fill-[#0078d4] shrink-0" />
            <span>Accès rapide</span>
          </div>

          <div className="pl-5 space-y-0.5 mt-0.5">
            {[
              { label: 'Desktop', icon: Monitor, color: 'text-[#0078d4]' },
              { label: 'Téléchargements', icon: Download, color: 'text-[#0078d4]' },
              { label: 'Documents', icon: FileText, color: 'text-[#4472c4]' },
              { label: 'Images', icon: ImageIcon, color: 'text-[#0078d4]' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-center justify-between px-1.5 py-1 hover:bg-[#e5f3ff] cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${item.color}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  <Pin className="w-3 h-3 text-[#777777] rotate-45 shrink-0" />
                </div>
              );
            })}
          </div>

          <div className="mt-2 space-y-0.5">
            <div className="flex items-center gap-1.5 px-2 py-1 hover:bg-[#e5f3ff] cursor-pointer">
              <Cloud className="w-3.5 h-3.5 text-[#0078d4] shrink-0" />
              <span>OneDrive</span>
            </div>

            <div className="flex items-center gap-1.5 px-2 py-1 bg-[#d9d9d9] font-normal cursor-pointer">
              <Monitor className="w-3.5 h-3.5 text-[#0078d4] shrink-0" />
              <span>Ce PC</span>
            </div>

            <div className="flex items-center gap-1.5 px-2 py-1 hover:bg-[#e5f3ff] cursor-pointer">
              <Network className="w-3.5 h-3.5 text-[#0078d4] shrink-0" />
              <span>Réseau</span>
            </div>
          </div>
        </aside>

        {/* Right File & Folder Grid */}
        <main className="flex-1 bg-white px-5 py-3 overflow-y-auto space-y-5">
          {/* Dossiers (7) */}
          <section>
            <button
              type="button"
              onClick={() => setFoldersOpen((o) => !o)}
              className="w-full flex items-center gap-2 text-[13px] text-[#1e5aa8] mb-3 cursor-pointer bg-transparent border-0 text-left"
            >
              {foldersOpen ? (
                <ChevronDown className="w-3.5 h-3.5 text-[#777777] shrink-0" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-[#777777] shrink-0" />
              )}
              <span className="shrink-0">Dossiers (7)</span>
              <span className="flex-1 h-px bg-[#e5e5e5] ml-1" />
            </button>

            {foldersOpen && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 pl-4">
                {[
                  { label: 'Desktop', icon: Monitor, badgeBg: 'text-[#0078d4]' },
                  { label: 'Documents', icon: FileText, badgeBg: 'text-[#4472c4]' },
                  { label: 'Images', icon: ImageIcon, badgeBg: 'text-[#0078d4]' },
                  { label: 'Musique', icon: Music, badgeBg: 'text-[#0078d4]' },
                  { label: 'Objets 3D', icon: Box, badgeBg: 'text-[#00a2ed]' },
                  { label: 'Téléchargements', icon: Download, badgeBg: 'text-[#0078d4]' },
                ].map((folder) => {
                  const BadgeIcon = folder.icon;
                  return (
                    <div
                      key={folder.label}
                      className="flex items-center gap-3 p-1.5 hover:bg-[#e5f3ff] border border-transparent hover:border-[#cce8ff] rounded-xs cursor-pointer"
                    >
                      <div className="relative w-11 h-9 shrink-0 flex items-center justify-center">
                        <div className="w-9 h-8 bg-[#f7d774] border border-[#e0b84c] rounded-xs shadow-2xs" />
                        <BadgeIcon
                          className={`w-5 h-5 absolute -bottom-0.5 right-0.5 bg-white/90 rounded-xs p-0.5 ${folder.badgeBg}`}
                        />
                      </div>
                      <span className="text-[12.5px] text-[#1f1f1f]">{folder.label}</span>
                    </div>
                  );
                })}

                {/* Vidéos Folder — displays incoming chat message when received */}
                <div
                  onClick={onClearResponse}
                  className="flex items-center gap-3 p-1.5 hover:bg-[#e5f3ff] border border-transparent hover:border-[#cce8ff] rounded-xs cursor-pointer"
                >
                  <div className="relative w-11 h-9 shrink-0 flex items-center justify-center">
                    <div className="w-9 h-8 bg-[#f7d774] border border-[#e0b84c] rounded-xs shadow-2xs" />
                    <Film className="w-5 h-5 absolute -bottom-0.5 right-0.5 bg-white/95 rounded-xs p-0.5 text-[#3b5998]" />
                  </div>
                  <span className="text-[12.5px] text-[#1f1f1f] break-words leading-snug select-text">
                    {videosLabel}
                  </span>
                </div>
              </div>
            )}
          </section>

          {/* Périphériques et lecteurs (2) */}
          <section>
            <button
              type="button"
              onClick={() => setDrivesOpen((o) => !o)}
              className="w-full flex items-center gap-2 text-[13px] text-[#1e5aa8] mb-3 cursor-pointer bg-transparent border-0 text-left"
            >
              {drivesOpen ? (
                <ChevronDown className="w-3.5 h-3.5 text-[#777777] shrink-0" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-[#777777] shrink-0" />
              )}
              <span className="shrink-0">Périphériques et lecteurs (2)</span>
              <span className="flex-1 h-px bg-[#e5e5e5] ml-1" />
            </button>

            {drivesOpen && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 pl-4">
                <div className="flex items-start gap-3 p-1.5 hover:bg-[#e5f3ff] border border-transparent hover:border-[#cce8ff] rounded-xs cursor-pointer">
                  <div className="relative w-11 h-9 shrink-0 flex items-center justify-center">
                    <HardDrive className="w-9 h-8 text-[#9aa0a6]" />
                    <span className="absolute top-1 left-1 w-3.5 h-3.5 bg-[#00a4ef] rounded-xs opacity-90" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12.5px] text-[#1f1f1f]">Windows (C:)</div>
                    <div className="mt-1 w-full max-w-[165px] h-[11px] bg-[#e6e6e6] border border-[#bcbcbc] overflow-hidden">
                      <div className="h-full bg-[#26a0da] w-[84%]" />
                    </div>
                    <div className="mt-0.5 text-[11px] text-[#666666]">
                      17,9 Go libres sur 117 Go
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-1.5 hover:bg-[#e5f3ff] border border-transparent hover:border-[#cce8ff] rounded-xs cursor-pointer">
                  <div className="relative w-11 h-9 shrink-0 flex items-center justify-center">
                    <Disc className="w-8 h-8 text-[#5f6368]" />
                  </div>
                  <div className="text-[12.5px] text-[#1f1f1f] mt-1">
                    Lecteur DVD RW (D:)
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Emplacements réseau (1) */}
          <section>
            <button
              type="button"
              onClick={() => setNetworkOpen((o) => !o)}
              className="w-full flex items-center gap-2 text-[13px] text-[#1e5aa8] mb-3 cursor-pointer bg-transparent border-0 text-left"
            >
              {networkOpen ? (
                <ChevronDown className="w-3.5 h-3.5 text-[#777777] shrink-0" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-[#777777] shrink-0" />
              )}
              <span className="shrink-0">Emplacements réseau (1)</span>
              <span className="flex-1 h-px bg-[#e5e5e5] ml-1" />
            </button>

            {networkOpen && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 pl-4">
                <div className="flex items-start gap-3 p-1.5 hover:bg-[#e5f3ff] border border-transparent hover:border-[#cce8ff] rounded-xs cursor-pointer">
                  <div className="relative w-11 h-9 shrink-0 flex items-center justify-center">
                    <HardDrive className="w-9 h-8 text-[#8f959b]" />
                    <span className="absolute bottom-0.5 left-1 right-1 h-1.5 bg-[#4caf50] rounded-xs" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] text-[#1f1f1f] leading-tight">
                      Perso
                    </div>
                    <div className="text-[11.5px] text-[#333333] truncate">
                      (\\PEDAGO1.local\Perso\...)
                    </div>
                    <div className="mt-1 w-full max-w-[165px] h-[11px] bg-[#e6e6e6] border border-[#bcbcbc] overflow-hidden">
                      <div className="h-full bg-[#26a0da] w-[76%]" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Bottom Status Bar */}
      <footer className="h-[24px] bg-white border-t border-[#e5e5e5] px-3 flex items-center justify-between text-[11px] text-[#444444]">
        <span>10 élément(s)</span>
        <div className="flex items-center gap-1.5 text-[#666666]">
          <LayoutList className="w-3.5 h-3.5" />
          <LayoutGrid className="w-3.5 h-3.5 text-[#0078d4]" />
        </div>
      </footer>
    </div>
  );
}
