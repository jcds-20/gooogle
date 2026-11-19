import React, { useState, useRef } from 'react';
import { Cookie, HelpCircle } from 'lucide-react';

interface QuiziniereViewProps {
  currentResponse: string | null;
  onSendQuery: (query: string) => void;
  onClearResponse: () => void;
  onGoHome: () => void;
}

export default function QuiziniereView({
  currentResponse,
  onSendQuery,
  onClearResponse,
  onGoHome,
}: QuiziniereViewProps) {
  const [exerciseCode, setExerciseCode] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const exerciseInputRef = useRef<HTMLInputElement>(null);
  const teacherIdInputRef = useRef<HTMLInputElement>(null);

  const handleExerciseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = exerciseCode.trim();
    if (!trimmed) return;
    onSendQuery(trimmed);
    setExerciseCode('');
    exerciseInputRef.current?.focus();
  };

  const handleTeacherIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = teacherId.trim();
    if (!trimmed) return;
    onSendQuery(trimmed);
    setTeacherId('');
    teacherIdInputRef.current?.focus();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#e9f5f8] text-[#1f2937] font-sans antialiased">
      {/* Top White Header */}
      <header className="bg-white border-b border-[#d8e6ec] px-5 sm:px-8 h-[64px] flex items-center justify-between">
        <div className="flex items-center">
          {/* Quizinière par Canopé Logo */}
          <button
            type="button"
            onClick={onGoHome}
            className="flex items-center gap-2 cursor-pointer bg-transparent border-0 p-0 text-left"
          >
            <div className="w-10 h-10 rounded-full border-[3px] border-[#1f5c87] flex items-center justify-center text-[#1f5c87] font-extrabold text-[18px]">
              Q
            </div>
            <div className="leading-none">
              <div className="text-[22px] font-bold italic text-[#1f5c87] tracking-tight">
                Quizinière
              </div>
              <div className="text-[9.5px] text-[#1f5c87] flex items-center gap-1 mt-0.5">
                <span>par</span>
                <span className="bg-[#1f5c87] text-white px-1 py-0.5 text-[8px] font-bold tracking-widest">
                  C A N O P É
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-3 text-[#1f5c87]">
          <button type="button" className="p-1.5 hover:bg-[#e9f5f8] rounded-full cursor-pointer">
            <Cookie className="w-5 h-5" />
          </button>
          <button type="button" className="p-1.5 hover:bg-[#e9f5f8] rounded-full cursor-pointer">
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center pt-9 pb-14 px-4">
        <h1 className="text-[20px] sm:text-[23px] font-semibold text-[#1f5c87] text-center mb-8 max-w-3xl">
          Créez des activités pédagogiques en ligne avec l&apos;exerciseur de Réseau Canopé.
        </h1>

        <div className="w-full max-w-[920px] grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-16 items-stretch">
          {/* Left Card: Élèves */}
          <section className="bg-white shadow-md flex flex-col justify-between">
            <div>
              <div className="bg-[#49ae9d] text-white text-center py-2.5 text-[15px] font-medium">
                Élèves
              </div>

              <form onSubmit={handleExerciseSubmit} className="p-6 space-y-4">
                <div>
                  <label
                    htmlFor="quiz-code"
                    className="block text-[12.5px] text-[#49ae9d] mb-1.5"
                  >
                    Entrez le code de l&apos;exercice
                  </label>
                  <input
                    id="quiz-code"
                    ref={exerciseInputRef}
                    type="text"
                    value={exerciseCode}
                    onChange={(e) => setExerciseCode(e.target.value)}
                    placeholder="Ex.: ABCDEF"
                    autoComplete="off"
                    className="w-full h-[46px] border border-[#49ae9d] rounded-[4px] px-3 text-[14px] text-[#1f2937] placeholder-[#9ca3af] outline-none focus:ring-1 focus:ring-[#49ae9d]"
                  />
                </div>

                <div className="flex flex-col items-end gap-2">
                  <button
                    type="submit"
                    className="bg-[#49ae9d] hover:bg-[#3f9c8c] text-white text-[12px] font-semibold tracking-wide px-5 py-2.5 rounded-[2px] cursor-pointer uppercase"
                  >
                    ACCÉDER À L&apos;EXERCICE
                  </button>
                  <a
                    href="#forgot"
                    onClick={(e) => e.preventDefault()}
                    className="text-[12px] text-[#3a9bd5] underline"
                  >
                    Code oublié ?
                  </a>
                </div>
              </form>
            </div>

            <div className="px-6 pb-6">
              <div className="border-t border-[#d1d5db] pt-4 space-y-3">
                <div className="text-[12.5px] text-[#111827]">
                  Accéder à une copie corrigée ou enregistrée
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="border border-[#49ae9d] text-[#49ae9d] hover:bg-[#49ae9d]/5 text-[11.5px] font-medium tracking-wide px-4 py-2 rounded-[2px] uppercase cursor-pointer"
                  >
                    ACCÉDER À MA COPIE
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Right Card: Enseignants — Identifiant input + received message display */}
          <section className="bg-white shadow-md flex flex-col justify-between">
            <div>
              <div className="bg-[#4eb2d8] text-white text-center py-2.5 text-[15px] font-medium">
                Enseignants
              </div>

              <div className="p-6 space-y-4">
                <ul className="space-y-2 text-[13px] text-[#111827]">
                  <li onClick={onClearResponse} className="cursor-pointer select-text">
                    {currentResponse ? (
                      <span className="font-medium text-[#1f5c87]">{currentResponse}</span>
                    ) : (
                      '- Créez vos exercices en quelques clics.'
                    )}
                  </li>
                  <li>- Visualisez les notions non comprises par activité et par élève.</li>
                  <li>- Annotez, commentez, encouragez.</li>
                  <li>- Partagez vos exercices avec la communauté.</li>
                </ul>

                {/* Identifiant Input on Right Card for chatting */}
                <form onSubmit={handleTeacherIdSubmit} className="pt-2 space-y-3">
                  <div>
                    <label
                      htmlFor="quiz-identifiant"
                      className="block text-[12.5px] text-[#3a9bd5] mb-1.5"
                    >
                      Identifiant
                    </label>
                    <input
                      id="quiz-identifiant"
                      ref={teacherIdInputRef}
                      type="text"
                      value={teacherId}
                      onChange={(e) => setTeacherId(e.target.value)}
                      placeholder="Saisissez votre identifiant"
                      autoComplete="off"
                      className="w-full h-[40px] border border-[#4eb2d8] rounded-[4px] px-3 text-[13.5px] text-[#1f2937] placeholder-[#9ca3af] outline-none focus:ring-1 focus:ring-[#4eb2d8]"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
                    <button
                      type="button"
                      className="border border-[#4eb2d8] text-[#4eb2d8] hover:bg-[#4eb2d8]/5 text-[11.5px] font-medium px-4 py-2 rounded-[2px] uppercase cursor-pointer"
                    >
                      CRÉER UN COMPTE
                    </button>
                    <button
                      type="submit"
                      className="bg-[#4eb2d8] hover:bg-[#3ea1c7] text-white text-[11.5px] font-semibold px-5 py-2 rounded-[2px] uppercase cursor-pointer"
                    >
                      SE CONNECTER
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
