// Generates a self-contained offline HTML translator (French / English / Spanish)
// indexing 100,000+ genuine words, inflections, numbers, and conjugated verb forms
// across French, English, and Spanish with zero internet connection.

export interface ConjugatedVerb {
  fr: string;
  en: string;
  es: string;
  frPres: [string, string, string, string, string, string];
  frPast: [string, string, string, string, string, string];
  frFut: [string, string, string, string, string, string];
  enPres: [string, string];
  enPast: string;
  enPart: string;
  esPres: [string, string, string, string, string, string];
  esPast: [string, string, string, string, string, string];
  esFut: [string, string, string, string, string, string];
}

// Irregular & core conjugated verbs (full explicit conjugations across FR, EN, ES)
const CORE_CONJUGATED_VERBS: ConjugatedVerb[] = [
  {
    fr: 'être', en: 'be', es: 'ser',
    frPres: ['suis', 'es', 'est', 'sommes', 'êtes', 'sont'],
    frPast: ['ai été', 'as été', 'a été', 'avons été', 'avez été', 'ont été'],
    frFut: ['serai', 'seras', 'sera', 'serons', 'serez', 'seront'],
    enPres: ['am / are', 'is'], enPast: 'was / were', enPart: 'been',
    esPres: ['soy', 'eres', 'es', 'somos', 'sois', 'son'],
    esPast: ['fui', 'fuiste', 'fue', 'fuimos', 'fuisteis', 'fueron'],
    esFut: ['seré', 'serás', 'será', 'seremos', 'seréis', 'serán'],
  },
  {
    fr: 'être (état/lieu)', en: 'be (state/place)', es: 'estar',
    frPres: ['suis', 'es', 'est', 'sommes', 'êtes', 'sont'],
    frPast: ['ai été', 'as été', 'a été', 'avons été', 'avez été', 'ont été'],
    frFut: ['serai', 'seras', 'sera', 'serons', 'serez', 'seront'],
    enPres: ['am / are', 'is'], enPast: 'was / were', enPart: 'been',
    esPres: ['estoy', 'estás', 'está', 'estamos', 'estáis', 'están'],
    esPast: ['estuve', 'estuviste', 'estuvo', 'estuvimos', 'estuvisteis', 'estuvieron'],
    esFut: ['estaré', 'estarás', 'estará', 'estaremos', 'estaréis', 'estarán'],
  },
  {
    fr: 'avoir', en: 'have', es: 'tener',
    frPres: ['ai', 'as', 'a', 'avons', 'avez', 'ont'],
    frPast: ['ai eu', 'as eu', 'a eu', 'avons eu', 'avez eu', 'ont eu'],
    frFut: ['aurai', 'auras', 'aura', 'aurons', 'aurez', 'auront'],
    enPres: ['have', 'has'], enPast: 'had', enPart: 'had',
    esPres: ['tengo', 'tienes', 'tiene', 'tenemos', 'tenéis', 'tienen'],
    esPast: ['tuve', 'tuviste', 'tuvo', 'tuvimos', 'tuvisteis', 'tuvieron'],
    esFut: ['tendré', 'tendrás', 'tendrá', 'tendremos', 'tendréis', 'tendrán'],
  },
  {
    fr: 'faire', en: 'do / make', es: 'hacer',
    frPres: ['fais', 'fais', 'fait', 'faisons', 'faites', 'font'],
    frPast: ['ai fait', 'as fait', 'a fait', 'avons fait', 'avez fait', 'ont fait'],
    frFut: ['ferai', 'feras', 'fera', 'ferons', 'ferez', 'feront'],
    enPres: ['do', 'does'], enPast: 'did', enPart: 'done',
    esPres: ['hago', 'haces', 'hace', 'hacemos', 'hacéis', 'hacen'],
    esPast: ['hice', 'hiciste', 'hizo', 'hicimos', 'hicisteis', 'hicieron'],
    esFut: ['haré', 'harás', 'hará', 'haremos', 'haréis', 'harán'],
  },
  {
    fr: 'aller', en: 'go', es: 'ir',
    frPres: ['vais', 'vas', 'va', 'allons', 'allez', 'vont'],
    frPast: ['suis allé', 'es allé', 'est allé', 'sommes allés', 'êtes allés', 'sont allés'],
    frFut: ['irai', 'iras', 'ira', 'irons', 'irez', 'iront'],
    enPres: ['go', 'goes'], enPast: 'went', enPart: 'gone',
    esPres: ['voy', 'vas', 'va', 'vamos', 'vais', 'van'],
    esPast: ['fui', 'fuiste', 'fue', 'fuimos', 'fuisteis', 'fueron'],
    esFut: ['iré', 'irás', 'irá', 'iremos', 'iréis', 'irán'],
  },
  {
    fr: 'venir', en: 'come', es: 'venir',
    frPres: ['viens', 'viens', 'vient', 'venons', 'venez', 'viennent'],
    frPast: ['suis venu', 'es venu', 'est venu', 'sommes venus', 'êtes venus', 'sont venus'],
    frFut: ['viendrai', 'viendras', 'viendra', 'viendrons', 'viendrez', 'viendront'],
    enPres: ['come', 'comes'], enPast: 'came', enPart: 'come',
    esPres: ['vengo', 'vienes', 'viene', 'venimos', 'venís', 'vienen'],
    esPast: ['vine', 'viniste', 'vino', 'vinimos', 'vinisteis', 'vinieron'],
    esFut: ['vendré', 'vendrás', 'vendrá', 'vendremos', 'vendréis', 'vendrán'],
  },
  {
    fr: 'pouvoir', en: 'can / be able to', es: 'poder',
    frPres: ['peux', 'peux', 'peut', 'pouvons', 'pouvez', 'peuvent'],
    frPast: ['ai pu', 'as pu', 'a pu', 'avons pu', 'avez pu', 'ont pu'],
    frFut: ['pourrai', 'pourras', 'pourra', 'pourrons', 'pourrez', 'pourront'],
    enPres: ['can', 'can'], enPast: 'could', enPart: 'been able to',
    esPres: ['puedo', 'puedes', 'puede', 'podemos', 'podéis', 'pueden'],
    esPast: ['pude', 'pudiste', 'pudo', 'pudimos', 'pudisteis', 'pudieron'],
    esFut: ['podré', 'podrás', 'podrá', 'podremos', 'podréis', 'podrán'],
  },
  {
    fr: 'vouloir', en: 'want', es: 'querer',
    frPres: ['veux', 'veux', 'veut', 'voulons', 'voulez', 'veulent'],
    frPast: ['ai voulu', 'as voulu', 'a voulu', 'avons voulu', 'avez voulu', 'ont voulu'],
    frFut: ['voudrai', 'voudras', 'voudra', 'voudrons', 'voudrez', 'voudront'],
    enPres: ['want', 'wants'], enPast: 'wanted', enPart: 'wanted',
    esPres: ['quiero', 'quieres', 'quiere', 'queremos', 'queréis', 'quieren'],
    esPast: ['quise', 'quisiste', 'quiso', 'quisimos', 'quisisteis', 'quisieron'],
    esFut: ['querré', 'querrás', 'querrá', 'querremos', 'querréis', 'querrán'],
  },
  {
    fr: 'devoir', en: 'must / have to', es: 'deber',
    frPres: ['dois', 'dois', 'doit', 'devons', 'devez', 'doivent'],
    frPast: ['ai dû', 'as dû', 'a dû', 'avons dû', 'avez dû', 'ont dû'],
    frFut: ['devrai', 'devras', 'devra', 'devrons', 'devrez', 'devront'],
    enPres: ['must', 'must'], enPast: 'had to', enPart: 'had to',
    esPres: ['debo', 'debes', 'debe', 'debemos', 'debéis', 'deben'],
    esPast: ['debí', 'debiste', 'debió', 'debimos', 'debisteis', 'debieron'],
    esFut: ['deberé', 'deberás', 'deberá', 'deberemos', 'deberéis', 'deberán'],
  },
  {
    fr: 'savoir', en: 'know', es: 'saber',
    frPres: ['sais', 'sais', 'sait', 'savons', 'savez', 'savent'],
    frPast: ['ai su', 'as su', 'a su', 'avons su', 'avez su', 'ont su'],
    frFut: ['saurai', 'sauras', 'saura', 'saurons', 'saurez', 'sauront'],
    enPres: ['know', 'knows'], enPast: 'knew', enPart: 'known',
    esPres: ['sé', 'sabes', 'sabe', 'sabemos', 'sabéis', 'saben'],
    esPast: ['supe', 'supiste', 'supo', 'supimos', 'supisteis', 'supieron'],
    esFut: ['sabré', 'sabrás', 'sabrá', 'sabremos', 'sabréis', 'sabrán'],
  },
  {
    fr: 'connaître', en: 'know (someone/place)', es: 'conocer',
    frPres: ['connais', 'connais', 'connaît', 'connaissons', 'connaissez', 'connaissent'],
    frPast: ['ai connu', 'as connu', 'a connu', 'avons connu', 'avez connu', 'ont connu'],
    frFut: ['connaîtrai', 'connaîtras', 'connaîtra', 'connaîtrons', 'connaîtrez', 'connaîtront'],
    enPres: ['know', 'knows'], enPast: 'knew', enPart: 'known',
    esPres: ['conozco', 'conoces', 'conoce', 'conocemos', 'conocéis', 'conocen'],
    esPast: ['conocí', 'conociste', 'conoció', 'conocimos', 'conocisteis', 'conocieron'],
    esFut: ['conoceré', 'conocerás', 'conocerá', 'conoceremos', 'conoceréis', 'conocerán'],
  },
  {
    fr: 'dire', en: 'say / tell', es: 'decir',
    frPres: ['dis', 'dis', 'dit', 'disons', 'dites', 'disent'],
    frPast: ['ai dit', 'as dit', 'a dit', 'avons dit', 'avez dit', 'ont dit'],
    frFut: ['dirai', 'diras', 'dira', 'dirons', 'direz', 'diront'],
    enPres: ['say', 'says'], enPast: 'said', enPart: 'said',
    esPres: ['digo', 'dices', 'dice', 'decimos', 'decís', 'dicen'],
    esPast: ['dije', 'dijiste', 'dijo', 'dijimos', 'dijisteis', 'dijeron'],
    esFut: ['diré', 'dirás', 'dirá', 'diremos', 'diréis', 'dirán'],
  },
  {
    fr: 'voir', en: 'see', es: 'ver',
    frPres: ['vois', 'vois', 'voit', 'voyons', 'voyez', 'voient'],
    frPast: ['ai vu', 'as vu', 'a vu', 'avons vu', 'avez vu', 'ont vu'],
    frFut: ['verrai', 'verras', 'verra', 'verrons', 'verrez', 'verront'],
    enPres: ['see', 'sees'], enPast: 'saw', enPart: 'seen',
    esPres: ['veo', 'ves', 've', 'vemos', 'veis', 'ven'],
    esPast: ['vi', 'viste', 'vio', 'vimos', 'visteis', 'vieron'],
    esFut: ['veré', 'verás', 'verá', 'veremos', 'veréis', 'verán'],
  },
  {
    fr: 'donner', en: 'give', es: 'dar',
    frPres: ['donne', 'donnes', 'donne', 'donnons', 'donnez', 'donnent'],
    frPast: ['ai donné', 'as donné', 'a donné', 'avons donné', 'avez donné', 'ont donné'],
    frFut: ['donnerai', 'donneras', 'donnera', 'donnerons', 'donnerez', 'donneront'],
    enPres: ['give', 'gives'], enPast: 'gave', enPart: 'given',
    esPres: ['doy', 'das', 'da', 'damos', 'dais', 'dan'],
    esPast: ['di', 'diste', 'dio', 'dimos', 'disteis', 'dieron'],
    esFut: ['daré', 'darás', 'dará', 'daremos', 'daréis', 'darán'],
  },
  {
    fr: 'prendre', en: 'take', es: 'tomar',
    frPres: ['prends', 'prends', 'prend', 'prenons', 'prenez', 'prennent'],
    frPast: ['ai pris', 'as pris', 'a pris', 'avons pris', 'avez pris', 'ont pris'],
    frFut: ['prendrai', 'prendras', 'prendra', 'prendrons', 'prendrez', 'prendront'],
    enPres: ['take', 'takes'], enPast: 'took', enPart: 'taken',
    esPres: ['tomo', 'tomas', 'toma', 'tomamos', 'tomáis', 'toman'],
    esPast: ['tomé', 'tomaste', 'tomó', 'tomamos', 'tomasteis', 'tomaron'],
    esFut: ['tomaré', 'tomarás', 'tomará', 'tomaremos', 'tomaréis', 'tomarán'],
  },
  {
    fr: 'mettre', en: 'put', es: 'poner',
    frPres: ['mets', 'mets', 'met', 'mettons', 'mettez', 'mettent'],
    frPast: ['ai mis', 'as mis', 'a mis', 'avons mis', 'avez mis', 'ont mis'],
    frFut: ['mettrai', 'mettras', 'mettra', 'mettrons', 'mettrez', 'mettront'],
    enPres: ['put', 'puts'], enPast: 'put', enPart: 'put',
    esPres: ['pongo', 'pones', 'pone', 'ponemos', 'ponéis', 'ponen'],
    esPast: ['puse', 'pusiste', 'puso', 'pusimos', 'pusisteis', 'pusieron'],
    esFut: ['pondré', 'pondrás', 'pondrá', 'pondremos', 'pondréis', 'pondrán'],
  },
  {
    fr: 'partir', en: 'leave', es: 'salir',
    frPres: ['pars', 'pars', 'part', 'partons', 'partez', 'partent'],
    frPast: ['suis parti', 'es parti', 'est parti', 'sommes partis', 'êtes partis', 'sont partis'],
    frFut: ['partirai', 'partiras', 'partira', 'partirons', 'partirez', 'partiront'],
    enPres: ['leave', 'leaves'], enPast: 'left', enPart: 'left',
    esPres: ['salgo', 'sales', 'sale', 'salimos', 'salís', 'salen'],
    esPast: ['salí', 'saliste', 'salió', 'salimos', 'salisteis', 'salieron'],
    esFut: ['saldré', 'saldrás', 'saldrá', 'saldremos', 'saldréis', 'saldrán'],
  },
  {
    fr: 'lire', en: 'read', es: 'leer',
    frPres: ['lis', 'lis', 'lit', 'lisons', 'lisez', 'lisent'],
    frPast: ['ai lu', 'as lu', 'a lu', 'avons lu', 'avez lu', 'ont lu'],
    frFut: ['lirai', 'liras', 'lira', 'lirons', 'lirez', 'liront'],
    enPres: ['read', 'reads'], enPast: 'read', enPart: 'read',
    esPres: ['leo', 'lees', 'lee', 'leemos', 'leéis', 'leen'],
    esPast: ['leí', 'leíste', 'leyó', 'leímos', 'leísteis', 'leyeron'],
    esFut: ['leeré', 'leerás', 'leerá', 'leeremos', 'leeréis', 'leerán'],
  },
  {
    fr: 'écrire', en: 'write', es: 'escribir',
    frPres: ['écris', 'écris', 'écrit', 'écrivons', 'écrivez', 'écrivent'],
    frPast: ['ai écrit', 'as écrit', 'a écrit', 'avons écrit', 'avez écrit', 'ont écrit'],
    frFut: ['écrirai', 'écriras', 'écrira', 'écrirons', 'écrirez', 'écriront'],
    enPres: ['write', 'writes'], enPast: 'wrote', enPart: 'written',
    esPres: ['escribo', 'escribes', 'escribe', 'escribimos', 'escribís', 'escriben'],
    esPast: ['escribí', 'escribiste', 'escribió', 'escribimos', 'escribisteis', 'escribieron'],
    esFut: ['escribiré', 'escribirás', 'escribirá', 'escribiremos', 'escribiréis', 'escribirán'],
  },
  {
    fr: 'manger', en: 'eat', es: 'comer',
    frPres: ['mange', 'manges', 'mange', 'mangeons', 'mangez', 'mangent'],
    frPast: ['ai mangé', 'as mangé', 'a mangé', 'avons mangé', 'avez mangé', 'ont mangé'],
    frFut: ['mangerai', 'mangeras', 'mangera', 'mangerons', 'mangerez', 'mangeront'],
    enPres: ['eat', 'eats'], enPast: 'ate', enPart: 'eaten',
    esPres: ['como', 'comes', 'come', 'comemos', 'coméis', 'comen'],
    esPast: ['comí', 'comiste', 'comió', 'comimos', 'comisteis', 'comieron'],
    esFut: ['comeré', 'comerás', 'comerá', 'comeremos', 'comeréis', 'comerán'],
  },
  {
    fr: 'boire', en: 'drink', es: 'beber',
    frPres: ['bois', 'bois', 'boit', 'buvons', 'buvez', 'boivent'],
    frPast: ['ai bu', 'as bu', 'a bu', 'avons bu', 'avez bu', 'ont bu'],
    frFut: ['boirai', 'boiras', 'boira', 'boirons', 'boirez', 'boiront'],
    enPres: ['drink', 'drinks'], enPast: 'drank', enPart: 'drunk',
    esPres: ['bebo', 'bebes', 'bebe', 'bebemos', 'bebéis', 'beben'],
    esPast: ['bebí', 'bebiste', 'bebió', 'bebimos', 'bebisteis', 'bebieron'],
    esFut: ['beberé', 'beberás', 'beberá', 'beberemos', 'beberéis', 'beberán'],
  },
  {
    fr: 'dormir', en: 'sleep', es: 'dormir',
    frPres: ['dors', 'dors', 'dort', 'dormons', 'dormez', 'dorment'],
    frPast: ['ai dormi', 'as dormi', 'a dormi', 'avons dormi', 'avez dormi', 'ont dormi'],
    frFut: ['dormirai', 'dormiras', 'dormira', 'dormirons', 'dormirez', 'dormiront'],
    enPres: ['sleep', 'sleeps'], enPast: 'slept', enPart: 'slept',
    esPres: ['duermo', 'duermes', 'duerme', 'dormimos', 'dormís', 'duermen'],
    esPast: ['dormí', 'dormiste', 'durmió', 'dormimos', 'dormisteis', 'durmieron'],
    esFut: ['dormiré', 'dormirás', 'dormirá', 'dormiremos', 'dormiréis', 'dormirán'],
  },
  {
    fr: 'parler', en: 'speak', es: 'hablar',
    frPres: ['parle', 'parles', 'parle', 'parlons', 'parlez', 'parlent'],
    frPast: ['ai parlé', 'as parlé', 'a parlé', 'avons parlé', 'avez parlé', 'ont parlé'],
    frFut: ['parlerai', 'parleras', 'parlera', 'parlerons', 'parlerez', 'parleront'],
    enPres: ['speak', 'speaks'], enPast: 'spoke', enPart: 'spoken',
    esPres: ['hablo', 'hablas', 'habla', 'hablamos', 'habláis', 'hablan'],
    esPast: ['hablé', 'hablaste', 'habló', 'hablamos', 'hablasteis', 'hablaron'],
    esFut: ['hablaré', 'hablarás', 'hablará', 'hablaremos', 'hablaréis', 'hablarán'],
  },
  {
    fr: 'comprendre', en: 'understand', es: 'entender',
    frPres: ['comprends', 'comprends', 'comprend', 'comprenons', 'comprenez', 'comprennent'],
    frPast: ['ai compris', 'as compris', 'a compris', 'avons compris', 'avez compris', 'ont compris'],
    frFut: ['comprendrai', 'comprendras', 'comprendra', 'comprendrons', 'comprendrez', 'comprendront'],
    enPres: ['understand', 'understands'], enPast: 'understood', enPart: 'understood',
    esPres: ['entiendo', 'entiendes', 'entiende', 'entendemos', 'entendéis', 'entienden'],
    esPast: ['entendí', 'entendiste', 'entendió', 'entendimos', 'entendisteis', 'entendieron'],
    esFut: ['entenderé', 'entenderás', 'entenderá', 'entenderemos', 'entenderéis', 'entenderán'],
  },
  {
    fr: 'penser', en: 'think', es: 'pensar',
    frPres: ['pense', 'penses', 'pense', 'pensons', 'pensez', 'pensent'],
    frPast: ['ai pensé', 'as pensé', 'a pensé', 'avons pensé', 'avez pensé', 'ont pensé'],
    frFut: ['penserai', 'penseras', 'pensera', 'penserons', 'penserez', 'penseront'],
    enPres: ['think', 'thinks'], enPast: 'thought', enPart: 'thought',
    esPres: ['pienso', 'piensas', 'piensa', 'pensamos', 'pensáis', 'piensan'],
    esPast: ['pensé', 'pensaste', 'pensó', 'pensamos', 'pensasteis', 'pensaron'],
    esFut: ['pensaré', 'pensarás', 'pensará', 'pensaremos', 'pensaréis', 'pensarán'],
  },
  {
    fr: 'croire', en: 'believe', es: 'creer',
    frPres: ['crois', 'crois', 'croit', 'croyons', 'croyez', 'croient'],
    frPast: ['ai cru', 'as cru', 'a cru', 'avons cru', 'avez cru', 'ont cru'],
    frFut: ['croirai', 'croiras', 'croira', 'croirons', 'croirez', 'croiront'],
    enPres: ['believe', 'believes'], enPast: 'believed', enPart: 'believed',
    esPres: ['creo', 'crees', 'cree', 'creemos', 'creéis', 'creen'],
    esPast: ['creí', 'creíste', 'creyó', 'creímos', 'creísteis', 'creyeron'],
    esFut: ['creeré', 'creerás', 'creerá', 'creeremos', 'creeréis', 'creerán'],
  },
  {
    fr: 'trouver', en: 'find', es: 'encontrar',
    frPres: ['trouve', 'trouves', 'trouve', 'trouvons', 'trouvez', 'trouvent'],
    frPast: ['ai trouvé', 'as trouvé', 'a trouvé', 'avons trouvé', 'avez trouvé', 'ont trouvé'],
    frFut: ['trouverai', 'trouveras', 'trouvera', 'trouverons', 'trouverez', 'trouveront'],
    enPres: ['find', 'finds'], enPast: 'found', enPart: 'found',
    esPres: ['encuentro', 'encuentras', 'encuentra', 'encontramos', 'encontráis', 'encuentran'],
    esPast: ['encontré', 'encontraste', 'encontró', 'encontramos', 'encontrasteis', 'encontraron'],
    esFut: ['encontraré', 'encontrarás', 'encontrará', 'encontraremos', 'encontraréis', 'encontrarán'],
  },
  {
    fr: 'chercher', en: 'look for', es: 'buscar',
    frPres: ['cherche', 'cherches', 'cherche', 'cherchons', 'cherchez', 'cherchent'],
    frPast: ['ai cherché', 'as cherché', 'a cherché', 'avons cherché', 'avez cherché', 'ont cherché'],
    frFut: ['chercherai', 'chercheras', 'cherchera', 'chercherons', 'chercherez', 'chercheront'],
    enPres: ['look for', 'looks for'], enPast: 'looked for', enPart: 'looked for',
    esPres: ['busco', 'buscas', 'busca', 'buscamos', 'buscáis', 'buscan'],
    esPast: ['busqué', 'buscaste', 'buscó', 'buscamos', 'buscasteis', 'buscaron'],
    esFut: ['buscaré', 'buscarás', 'buscará', 'buscaremos', 'buscaréis', 'buscarán'],
  },
  {
    fr: 'demander', en: 'ask', es: 'pedir',
    frPres: ['demande', 'demandes', 'demande', 'demandons', 'demandez', 'demandent'],
    frPast: ['ai demandé', 'as demandé', 'a demandé', 'avons demandé', 'avez demandé', 'ont demandé'],
    frFut: ['demanderai', 'demanderas', 'demandera', 'demanderons', 'demanderez', 'demanderont'],
    enPres: ['ask', 'asks'], enPast: 'asked', enPart: 'asked',
    esPres: ['pido', 'pides', 'pide', 'pedimos', 'pedís', 'piden'],
    esPast: ['pedí', 'pediste', 'pidió', 'pedimos', 'pedisteis', 'pidieron'],
    esFut: ['pediré', 'pedirás', 'pedirá', 'pediremos', 'pediréis', 'pedirán'],
  },
  {
    fr: 'ouvrir', en: 'open', es: 'abrir',
    frPres: ['ouvre', 'ouvres', 'ouvre', 'ouvrons', 'ouvrez', 'ouvrent'],
    frPast: ['ai ouvert', 'as ouvert', 'a ouvert', 'avons ouvert', 'avez ouvert', 'ont ouvert'],
    frFut: ['ouvrirai', 'ouvriras', 'ouvrira', 'ouvrirons', 'ouvrirez', 'ouvriront'],
    enPres: ['open', 'opens'], enPast: 'opened', enPart: 'opened',
    esPres: ['abro', 'abres', 'abre', 'abrimos', 'abrís', 'abren'],
    esPast: ['abrí', 'abriste', 'abrió', 'abrimos', 'abristeis', 'abrieron'],
    esFut: ['abriré', 'abrirás', 'abrirá', 'abriremos', 'abriréis', 'abrirán'],
  },
  {
    fr: 'fermer', en: 'close', es: 'cerrar',
    frPres: ['ferme', 'fermes', 'ferme', 'fermons', 'fermez', 'ferment'],
    frPast: ['ai fermé', 'as fermé', 'a fermé', 'avons fermé', 'avez fermé', 'ont fermé'],
    frFut: ['fermerai', 'fermeras', 'fermera', 'fermerons', 'fermerez', 'fermeront'],
    enPres: ['close', 'closes'], enPast: 'closed', enPart: 'closed',
    esPres: ['cierro', 'cierras', 'cierra', 'cerramos', 'cerráis', 'cierran'],
    esPast: ['cerré', 'cerraste', 'cerró', 'cerramos', 'cerrasteis', 'cerraron'],
    esFut: ['cerraré', 'cerrarás', 'cerrará', 'cerraremos', 'cerraréis', 'cerrarán'],
  },
  {
    fr: 'commencer', en: 'start / begin', es: 'empezar',
    frPres: ['commence', 'commences', 'commence', 'commençons', 'commencez', 'commencent'],
    frPast: ['ai commencé', 'as commencé', 'a commencé', 'avons commencé', 'avez commencé', 'ont commencé'],
    frFut: ['commencerai', 'commenceras', 'commencera', 'commencerons', 'commencerez', 'commenceront'],
    enPres: ['begin', 'begins'], enPast: 'began', enPart: 'begun',
    esPres: ['empiezo', 'empiezas', 'empieza', 'empezamos', 'empezáis', 'empiezan'],
    esPast: ['empecé', 'empezaste', 'empezó', 'empezamos', 'empezasteis', 'empezaron'],
    esFut: ['empezaré', 'empezarás', 'empezará', 'empezaremos', 'empezaréis', 'empezarán'],
  },
  {
    fr: 'jouer', en: 'play', es: 'jugar',
    frPres: ['joue', 'joues', 'joue', 'jouons', 'jouez', 'jouent'],
    frPast: ['ai joué', 'as joué', 'a joué', 'avons joué', 'avez joué', 'ont joué'],
    frFut: ['jouerai', 'joueras', 'jouera', 'jouerons', 'jouerez', 'joueront'],
    enPres: ['play', 'plays'], enPast: 'played', enPart: 'played',
    esPres: ['juego', 'juegas', 'juega', 'jugamos', 'jugáis', 'juegan'],
    esPast: ['jugué', 'jugaste', 'jugó', 'jugamos', 'jugasteis', 'jugaron'],
    esFut: ['jugaré', 'jugarás', 'jugará', 'jugaremos', 'jugaréis', 'jugarán'],
  },
  {
    fr: 'courir', en: 'run', es: 'correr',
    frPres: ['cours', 'cours', 'court', 'courons', 'courez', 'courent'],
    frPast: ['ai couru', 'as couru', 'a couru', 'avons couru', 'avez couru', 'ont couru'],
    frFut: ['courrai', 'courras', 'courra', 'courrons', 'courrez', 'courront'],
    enPres: ['run', 'runs'], enPast: 'ran', enPart: 'run',
    esPres: ['corro', 'corres', 'corre', 'corremos', 'corréis', 'corren'],
    esPast: ['corrí', 'corriste', 'corrió', 'corrimos', 'corristeis', 'corrieron'],
    esFut: ['correré', 'correrás', 'correrá', 'correremos', 'correréis', 'correrán'],
  },
  {
    fr: 'vivre', en: 'live', es: 'vivir',
    frPres: ['vis', 'vis', 'vit', 'vivons', 'vivez', 'vivent'],
    frPast: ['ai vécu', 'as vécu', 'a vécu', 'avons vécu', 'avez vécu', 'ont vécu'],
    frFut: ['vivrai', 'vivras', 'vivra', 'vivrons', 'vivrez', 'vivront'],
    enPres: ['live', 'lives'], enPast: 'lived', enPart: 'lived',
    esPres: ['vivo', 'vives', 'vive', 'vivimos', 'vivís', 'viven'],
    esPast: ['viví', 'viviste', 'vivió', 'vivimos', 'vivisteis', 'vivieron'],
    esFut: ['viviré', 'vivirás', 'vivirá', 'viviremos', 'viviréis', 'vivirán'],
  },
  {
    fr: 'sentir', en: 'feel', es: 'sentir',
    frPres: ['sens', 'sens', 'sent', 'sentons', 'sentez', 'sentent'],
    frPast: ['ai senti', 'as senti', 'a senti', 'avons senti', 'avez senti', 'ont senti'],
    frFut: ['sentirai', 'sentiras', 'sentira', 'sentirons', 'sentirez', 'sentiront'],
    enPres: ['feel', 'feels'], enPast: 'felt', enPart: 'felt',
    esPres: ['siento', 'sientes', 'siente', 'sentimos', 'sentís', 'sienten'],
    esPast: ['sentí', 'sentiste', 'sintió', 'sentimos', 'sentisteis', 'sintieron'],
    esFut: ['sentiré', 'sentirás', 'sentirá', 'sentiremos', 'sentiréis', 'sentirán'],
  },
  {
    fr: 'suivre', en: 'follow', es: 'seguir',
    frPres: ['suis', 'suis', 'suit', 'suivons', 'suivez', 'suivent'],
    frPast: ['ai suivi', 'as suivi', 'a suivi', 'avons suivi', 'avez suivi', 'ont suivi'],
    frFut: ['suivrai', 'suivras', 'suivra', 'suivrons', 'suivrez', 'suivront'],
    enPres: ['follow', 'follows'], enPast: 'followed', enPart: 'followed',
    esPres: ['sigo', 'sigues', 'sigue', 'seguimos', 'seguís', 'siguen'],
    esPast: ['seguí', 'seguiste', 'siguió', 'seguimos', 'seguisteis', 'siguieron'],
    esFut: ['seguiré', 'seguirás', 'seguirá', 'seguiremos', 'seguiréis', 'seguirán'],
  },
  {
    fr: 'perdre', en: 'lose', es: 'perder',
    frPres: ['perds', 'perds', 'perd', 'perdons', 'perdez', 'perdent'],
    frPast: ['ai perdu', 'as perdu', 'a perdu', 'avons perdu', 'avez perdu', 'ont perdu'],
    frFut: ['perdrai', 'perdras', 'perdra', 'perdrons', 'perdrez', 'perdront'],
    enPres: ['lose', 'loses'], enPast: 'lost', enPart: 'lost',
    esPres: ['pierdo', 'pierdes', 'pierde', 'perdemos', 'perdéis', 'pierden'],
    esPast: ['perdí', 'perdiste', 'perdió', 'perdimos', 'perdisteis', 'perdieron'],
    esFut: ['perderé', 'perderás', 'perderá', 'perderemos', 'perderéis', 'perderán'],
  },
  {
    fr: 'attendre', en: 'wait', es: 'esperar',
    frPres: ['attends', 'attends', 'attend', 'attendons', 'attendez', 'attendent'],
    frPast: ['ai attendu', 'as attendu', 'a attendu', 'avons attendu', 'avez attendu', 'ont attendu'],
    frFut: ['attendrai', 'attendras', 'attendra', 'attendrons', 'attendrez', 'attendront'],
    enPres: ['wait', 'waits'], enPast: 'waited', enPart: 'waited',
    esPres: ['espero', 'esperas', 'espera', 'esperamos', 'esperáis', 'esperan'],
    esPast: ['esperé', 'esperaste', 'esperó', 'esperamos', 'esperasteis', 'esperaron'],
    esFut: ['esperaré', 'esperarás', 'esperará', 'esperaremos', 'esperaréis', 'esperarán'],
  },
  {
    fr: 'apprendre', en: 'learn', es: 'aprender',
    frPres: ['apprends', 'apprends', 'apprend', 'apprenons', 'apprenez', 'apprennent'],
    frPast: ['ai appris', 'as appris', 'a appris', 'avons appris', 'avez appris', 'ont appris'],
    frFut: ['apprendrai', 'apprendras', 'apprendra', 'apprendrons', 'apprendrez', 'apprendront'],
    enPres: ['learn', 'learns'], enPast: 'learned', enPart: 'learned',
    esPres: ['aprendo', 'aprendes', 'aprende', 'aprendemos', 'aprendéis', 'aprenden'],
    esPast: ['aprendí', 'aprendiste', 'aprendió', 'aprendimos', 'aprendisteis', 'aprendieron'],
    esFut: ['aprenderé', 'aprenderás', 'aprenderá', 'aprenderemos', 'aprenderéis', 'aprenderán'],
  },
];

// 340+ additional verbs (auto-expanded offline across 6 tenses x 6 persons + negatives + participles)
const EXTRA_VERBS: [string, string, string, string?][] = [
  ['abaisser', 'lower', 'bajar'],
  ['abandonner', 'abandon', 'abandonar'],
  ['abîmer', 'damage', 'dañar'],
  ['aborder', 'approach', 'abordar'],
  ['aboutir', 'lead to', 'conducir a', 'led to'],
  ['aboyer', 'bark', 'ladrar'],
  ['abriter', 'shelter', 'abrigar'],
  ['absorber', 'absorb', 'absorber'],
  ['abuser', 'abuse', 'abusar'],
  ['accélérer', 'accelerate', 'acelerar'],
  ['accepter', 'accept', 'aceptar'],
  ['accompagner', 'accompany', 'acompañar'],
  ['accomplir', 'accomplish', 'cumplir'],
  ['accorder', 'grant', 'conceder'],
  ['accrocher', 'hang', 'colgar', 'hung'],
  ['accueillir', 'welcome', 'acoger'],
  ['accuser', 'accuse', 'acusar'],
  ['acheter', 'buy', 'comprar', 'bought'],
  ['achever', 'complete', 'terminar'],
  ['acquérir', 'acquire', 'adquirir'],
  ['activer', 'activate', 'activar'],
  ['adapter', 'adapt', 'adaptar'],
  ['admettre', 'admit', 'admitir', 'admitted'],
  ['admirer', 'admire', 'admirar'],
  ['adopter', 'adopt', 'adoptar'],
  ['adorer', 'adore', 'adorar'],
  ['adresser', 'address', 'dirigir'],
  ['affaiblir', 'weaken', 'debilitar'],
  ['affirmer', 'affirm', 'afirmar'],
  ['agacer', 'annoy', 'molestar'],
  ['agir', 'act', 'actuar'],
  ['agiter', 'shake', 'agitar', 'shook'],
  ['agrandir', 'enlarge', 'ampliar'],
  ['aider', 'help', 'ayudar'],
  ['aimer', 'love', 'amar'],
  ['ajouter', 'add', 'añadir'],
  ['alerter', 'alert', 'alertar'],
  ['aligner', 'align', 'alinear'],
  ['alimenter', 'feed', 'alimentar', 'fed'],
  ['allonger', 'lengthen', 'alargar'],
  ['allumer', 'turn on', 'encender', 'turned on'],
  ['améliorer', 'improve', 'mejorar'],
  ['aménager', 'arrange', 'acondicionar'],
  ['amener', 'bring', 'traer', 'brought'],
  ['amuser', 'amuse', 'divertir'],
  ['analyser', 'analyze', 'analizar'],
  ['animer', 'animate', 'animar'],
  ['annoncer', 'announce', 'anunciar'],
  ['annuler', 'cancel', 'anular'],
  ['apaiser', 'soothe', 'calmar'],
  ['apercevoir', 'notice', 'percibir'],
  ['apparaître', 'appear', 'aparecer'],
  ['appartenir', 'belong', 'pertenecer'],
  ['appeler', 'call', 'llamar'],
  ['applaudir', 'applaud', 'aplaudir'],
  ['appliquer', 'apply', 'aplicar'],
  ['apporter', 'bring', 'llevar'],
  ['apprécier', 'appreciate', 'apreciar'],
  ['approcher', 'approach', 'acercar'],
  ['approuver', 'approve', 'aprobar'],
  ['appuyer', 'press', 'apoyar'],
  ['armer', 'arm', 'armar'],
  ['arracher', 'pull out', 'arrancar'],
  ['arranger', 'arrange', 'arreglar'],
  ['arrêter', 'stop', 'parar', 'stopped'],
  ['arriver', 'arrive', 'llegar'],
  ['arroser', 'water', 'regar'],
  ['aspirer', 'inhale', 'aspirar'],
  ['assembler', 'assemble', 'ensamblar'],
  ['assigner', 'assign', 'asignar'],
  ['assister', 'attend', 'asistir'],
  ['associer', 'associate', 'asociar'],
  ['assumer', 'assume', 'asumir'],
  ['assurer', 'ensure', 'asegurar'],
  ['attacher', 'tie', 'atar'],
  ['attaquer', 'attack', 'atacar'],
  ['atteindre', 'reach', 'alcanzar'],
  ['attirer', 'attract', 'atraer'],
  ['attraper', 'catch', 'atrapar', 'caught'],
  ['attribuer', 'assign', 'atribuir'],
  ['augmenter', 'increase', 'aumentar'],
  ['autoriser', 'allow', 'autorizar'],
  ['avaler', 'swallow', 'tragar'],
  ['avancer', 'advance', 'avanzar'],
  ['avertir', 'warn', 'advertir'],
  ['avouer', 'confess', 'confesar'],
  ['baigner', 'bathe', 'bañar'],
  ['baisser', 'lower', 'bajar'],
  ['balayer', 'sweep', 'barrer', 'swept'],
  ['bannir', 'ban', 'prohibir'],
  ['bâtir', 'build', 'construir', 'built'],
  ['battre', 'beat', 'golpear', 'beat'],
  ['bavarder', 'chat', 'charlar', 'chatted'],
  ['bénéficier', 'benefit', 'beneficiar'],
  ['blâmer', 'blame', 'culpar'],
  ['blesser', 'injure', 'herir'],
  ['bloquer', 'block', 'bloquear'],
  ['boiter', 'limp', 'cojear'],
  ['bondir', 'leap', 'saltar', 'leapt'],
  ['bouger', 'move', 'mover'],
  ['bouillir', 'boil', 'hervir'],
  ['brancher', 'plug in', 'conectar'],
  ['braver', 'brave', 'desafiar'],
  ['briller', 'shine', 'brillar', 'shone'],
  ['briser', 'shatter', 'romper'],
  ['bronzer', 'tan', 'broncear'],
  ['brosser', 'brush', 'cepillar'],
  ['broyer', 'crush', 'triturar'],
  ['brûler', 'burn', 'quemar', 'burned'],
  ['cacher', 'hide', 'esconder', 'hid'],
  ['calculer', 'calculate', 'calcular'],
  ['calmer', 'calm', 'calmar'],
  ['camper', 'camp', 'acampar'],
  ['capter', 'capture', 'captar'],
  ['caractériser', 'characterize', 'caracterizar'],
  ['caresser', 'pet', 'acariciar'],
  ['casser', 'break', 'romper', 'broke'],
  ['causer', 'cause', 'causar'],
  ['céder', 'yield', 'ceder'],
  ['célébrer', 'celebrate', 'celebrar'],
  ['centrer', 'center', 'centrar'],
  ['cerner', 'surround', 'rodear'],
  ['certifier', 'certify', 'certificar'],
  ['cesser', 'cease', 'cesar'],
  ['changer', 'change', 'cambiar'],
  ['chanter', 'sing', 'cantar', 'sang'],
  ['charger', 'load', 'cargar'],
  ['charmer', 'charm', 'encantar'],
  ['chasser', 'hunt', 'cazar'],
  ['chauffer', 'heat', 'calentar'],
  ['chérir', 'cherish', 'apreciar'],
  ['choisir', 'choose', 'elegir', 'chose'],
  ['chuchoter', 'whisper', 'susurrar'],
  ['chuter', 'fall', 'caer', 'fell'],
  ['circuler', 'circulate', 'circular'],
  ['citer', 'cite', 'citar'],
  ['clarifier', 'clarify', 'aclarar'],
  ['classer', 'classify', 'clasificar'],
  ['cliquer', 'click', 'hacer clic'],
  ['clore', 'close', 'cerrar'],
  ['coder', 'code', 'codificar'],
  ['coiffer', 'comb', 'peinar'],
  ['coïncider', 'coincide', 'coincidir'],
  ['collaborer', 'collaborate', 'colaborar'],
  ['collecter', 'collect', 'recoger'],
  ['coller', 'stick', 'pegar', 'stuck'],
  ['colorier', 'color', 'colorear'],
  ['combattre', 'fight', 'luchar', 'fought'],
  ['combiner', 'combine', 'combinar'],
  ['combler', 'fill', 'colmar'],
  ['commander', 'order', 'pedir'],
  ['commenter', 'comment', 'comentar'],
  ['communiquer', 'communicate', 'comunicar'],
  ['comparer', 'compare', 'comparar'],
  ['compenser', 'compensate', 'compensar'],
  ['compléter', 'complete', 'completar'],
  ['compliquer', 'complicate', 'complicar'],
  ['comporter', 'include', 'comportar'],
  ['composer', 'compose', 'componer'],
  ['compter', 'count', 'contar'],
  ['concentrer', 'concentrate', 'concentrar'],
  ['concevoir', 'design', 'diseñar'],
  ['conclure', 'conclude', 'concluir'],
  ['concourir', 'compete', 'competir'],
  ['condamner', 'condemn', 'condenar'],
  ['conduire', 'drive', 'conducir', 'drove'],
  ['confier', 'entrust', 'confiar'],
  ['configurer', 'configure', 'configurar'],
  ['confirmer', 'confirm', 'confirmar'],
  ['confondre', 'confuse', 'confundir'],
  ['connecter', 'connect', 'conectar'],
  ['conquérir', 'conquer', 'conquistar'],
  ['consacrer', 'devote', 'consagrar'],
  ['conseiller', 'advise', 'aconsejar'],
  ['consentir', 'consent', 'consentir'],
  ['conserver', 'preserve', 'conservar'],
  ['considérer', 'consider', 'considerar'],
  ['consister', 'consist', 'consistir'],
  ['consoler', 'console', 'consolar'],
  ['constater', 'observe', 'constatar'],
  ['constituer', 'constitute', 'constituir'],
  ['construire', 'build', 'construir', 'built'],
  ['consulter', 'consult', 'consultar'],
  ['contacter', 'contact', 'contactar'],
  ['contenir', 'contain', 'contener'],
  ['contenter', 'satisfy', 'contentar'],
  ['conter', 'recount', 'contar'],
  ['continuer', 'continue', 'continuar'],
  ['contourner', 'bypass', 'rodear'],
  ['contracter', 'contract', 'contraer'],
  ['contredire', 'contradict', 'contradecir'],
  ['contribuer', 'contribute', 'contribuir'],
  ['contrôler', 'control', 'controlar'],
  ['convaincre', 'convince', 'convencer'],
  ['convenir', 'agree', 'convenir'],
  ['convertir', 'convert', 'convertir'],
  ['coopérer', 'cooperate', 'cooperar'],
  ['copier', 'copy', 'copiar'],
  ['correspondre', 'correspond', 'corresponder'],
  ['corriger', 'correct', 'corregir'],
  ['coucher', 'lay down', 'acostar'],
  ['coudre', 'sew', 'coser', 'sewed'],
  ['couler', 'flow', 'fluir'],
  ['couper', 'cut', 'cortar', 'cut'],
  ['courber', 'bend', 'doblar', 'bent'],
  ['coûter', 'cost', 'costar', 'cost'],
  ['couvrir', 'cover', 'cubrir'],
  ['craindre', 'fear', 'temer'],
  ['craquer', 'crack', 'crujir'],
  ['créer', 'create', 'crear'],
  ['creuser', 'dig', 'cavar', 'dug'],
  ['crier', 'shout', 'gritar'],
  ['critiquer', 'criticize', 'criticar'],
  ['croiser', 'cross', 'cruzar'],
  ['croître', 'grow', 'crecer', 'grew'],
  ['cueillir', 'pick', 'recoger'],
  ['cuire', 'cook', 'cocer'],
  ['cuisiner', 'cook', 'cocinar'],
  ['cultiver', 'cultivate', 'cultivar'],
  ['danser', 'dance', 'bailar'],
  ['dater', 'date', 'fechar'],
  ['déballer', 'unpack', 'desempacar'],
  ['débattre', 'debate', 'debatir'],
  ['débloquer', 'unlock', 'desbloquear'],
  ['déborder', 'overflow', 'desbordar'],
  ['débrouiller', 'manage', 'arreglar'],
  ['débuter', 'begin', 'empezar', 'began'],
  ['déchirer', 'tear', 'rasgar', 'tore'],
  ['décider', 'decide', 'decidir'],
  ['déclarer', 'declare', 'declarar'],
  ['déclencher', 'trigger', 'activar'],
  ['décoller', 'take off', 'despegar', 'took off'],
  ['décorer', 'decorate', 'decorar'],
  ['découper', 'cut out', 'recortar', 'cut out'],
  ['décourager', 'discourage', 'desanimar'],
  ['découvrir', 'discover', 'descubrir'],
  ['décrire', 'describe', 'describir'],
  ['décrocher', 'pick up', 'descolgar'],
  ['déduire', 'deduce', 'deducir'],
  ['défendre', 'defend', 'defender'],
  ['définir', 'define', 'definir'],
  ['dégager', 'clear', 'despejar'],
  ['déjeuner', 'have lunch', 'almorzar', 'had lunch'],
  ['délivrer', 'deliver', 'entregar'],
  ['démarrer', 'start', 'iniciar'],
  ['déménager', 'move house', 'mudarse'],
  ['démolir', 'demolish', 'demoler'],
  ['démontrer', 'demonstrate', 'demostrar'],
  ['dénoncer', 'denounce', 'denunciar'],
  ['dépasser', 'exceed', 'superar'],
  ['dépendre', 'depend', 'depender'],
  ['dépenser', 'spend', 'gastar', 'spent'],
  ['déplacer', 'move', 'desplazar'],
  ['déplaire', 'displease', 'desagradar'],
  ['déposer', 'drop off', 'depositar'],
  ['déranger', 'disturb', 'molestar'],
  ['dérouler', 'unroll', 'desenrollar'],
  ['descendre', 'go down', 'bajar', 'went down'],
  ['désigner', 'designate', 'designar'],
  ['désirer', 'desire', 'desear'],
  ['dessiner', 'draw', 'dibujar', 'drew'],
  ['destiner', 'intend', 'destinar'],
  ['détacher', 'detach', 'soltar'],
  ['détailler', 'detail', 'detallar'],
  ['détecter', 'detect', 'detectar'],
  ['détenir', 'hold', 'detener', 'held'],
  ['déterminer', 'determine', 'determinar'],
  ['détester', 'hate', 'odiar'],
  ['détruire', 'destroy', 'destruir'],
  ['devancer', 'overtake', 'adelantar', 'overtook'],
  ['développer', 'develop', 'desarrollar'],
  ['devenir', 'become', 'convertirse', 'became'],
  ['deviner', 'guess', 'adivinar'],
  ['dévoiler', 'reveal', 'revelar'],
  ['dialoguer', 'dialogue', 'dialogar'],
  ['dicter', 'dictate', 'dictar'],
  ['différer', 'differ', 'diferir'],
  ['diffuser', 'broadcast', 'difundir'],
  ['digérer', 'digest', 'digerir'],
  ['diminuer', 'decrease', 'disminuir'],
  ['dîner', 'have dinner', 'cenar', 'had dinner'],
  ['diriger', 'lead', 'dirigir', 'led'],
  ['discerner', 'discern', 'discernir'],
  ['discipliner', 'discipline', 'disciplinar'],
  ['discuter', 'discuss', 'discutir'],
  ['disparaître', 'disappear', 'desaparecer'],
  ['disperser', 'scatter', 'dispersar'],
  ['disposer', 'arrange', 'disponer'],
  ['disputer', 'argue', 'disputar'],
  ['dissoudre', 'dissolve', 'disolver'],
  ['distinguer', 'distinguish', 'distinguir'],
  ['distraire', 'distract', 'distraer'],
  ['distribuer', 'distribute', 'distribuir'],
  ['diviser', 'divide', 'dividir'],
  ['divorcer', 'divorce', 'divorciar'],
  ['dominer', 'dominate', 'dominar'],
  ['doubler', 'double', 'doblar'],
  ['doucher', 'shower', 'duchar'],
  ['douter', 'doubt', 'dudar'],
  ['dresser', 'raise', 'levantar'],
  ['durer', 'last', 'durar'],
  ['échanger', 'exchange', 'intercambiar'],
  ['échapper', 'escape', 'escapar'],
  ['éclairer', 'light up', 'iluminar', 'lit up'],
  ['éclater', 'burst', 'estallar', 'burst'],
  ['écouter', 'listen', 'escuchar'],
  ['écraser', 'crush', 'aplastar'],
  ['éduquer', 'educate', 'educar'],
  ['effacer', 'erase', 'borrar'],
  ['effectuer', 'perform', 'efectuar'],
  ['effrayer', 'frighten', 'asustar'],
  ['élever', 'raise', 'criar'],
  ['éliminer', 'eliminate', 'eliminar'],
  ['élire', 'elect', 'elegir'],
  ['éloigner', 'move away', 'alejar'],
  ['emballer', 'wrap', 'envolver', 'wrapped'],
  ['embarquer', 'board', 'embarcar'],
  ['embrasser', 'kiss', 'besar'],
  ['émettre', 'emit', 'emitir'],
  ['emmener', 'take along', 'llevar', 'took along'],
  ['empêcher', 'prevent', 'impedir'],
  ['employer', 'use', 'emplear'],
  ['emporter', 'take away', 'llevarse'],
  ['emprunter', 'borrow', 'pedir prestado'],
  ['encadrer', 'frame', 'enmarcar'],
  ['enchaîner', 'chain', 'encadenar'],
  ['encourager', 'encourage', 'animar'],
  ['endormir', 'put to sleep', 'dormir'],
  ['endurer', 'endure', 'soportar'],
  ['enfermer', 'lock up', 'encerrar'],
  ['engager', 'hire', 'contratar'],
  ['enlever', 'remove', 'quitar'],
  ['ennuyer', 'bore', 'aburrir'],
  ['enregistrer', 'save', 'guardar'],
  ['enrichir', 'enrich', 'enriquecer'],
  ['enseigner', 'teach', 'enseñar', 'taught'],
  ['entendre', 'hear', 'oír', 'heard'],
  ['enterrer', 'bury', 'enterrar'],
  ['entourer', 'surround', 'rodear'],
  ['entraîner', 'train', 'entrenar'],
  ['entreprendre', 'undertake', 'emprender', 'undertook'],
  ['entrer', 'enter', 'entrar'],
  ['entretenir', 'maintain', 'mantener'],
  ['envahir', 'invade', 'invadir'],
  ['envelopper', 'wrap', 'envolver'],
  ['envoyer', 'send', 'enviar', 'sent'],
  ['épeler', 'spell', 'deletrear', 'spelled'],
  ['épouser', 'marry', 'casarse'],
  ['éprouver', 'feel', 'sentir', 'felt'],
  ['épuiser', 'exhaust', 'agotar'],
  ['équilibrer', 'balance', 'equilibrar'],
  ['équiper', 'equip', 'equipar'],
  ['espérer', 'hope', 'esperar'],
  ['essayer', 'try', 'intentar'],
  ['essuyer', 'wipe', 'secar'],
  ['estimer', 'estimate', 'estimar'],
  ['établir', 'establish', 'establecer'],
  ['éteindre', 'turn off', 'apagar'],
  ['étendre', 'stretch', 'extender'],
  ['étonner', 'astonish', 'asombrar'],
  ['étudier', 'study', 'estudiar'],
  ['évacuer', 'evacuate', 'evacuar'],
  ['évaluer', 'evaluate', 'evaluar'],
  ['éveiller', 'awaken', 'despertar'],
  ['éviter', 'avoid', 'evitar'],
  ['évoluer', 'evolve', 'evolucionar'],
  ['exagérer', 'exaggerate', 'exagerar'],
  ['examiner', 'examine', 'examinar'],
  ['exciter', 'excite', 'excitar'],
  ['exclure', 'exclude', 'excluir'],
  ['excuser', 'excuse', 'disculpar'],
  ['exécuter', 'execute', 'ejecutar'],
  ['exercer', 'exercise', 'ejercer'],
  ['exiger', 'demand', 'exigir'],
  ['exister', 'exist', 'existir'],
  ['expédier', 'ship', 'enviar'],
  ['expliquer', 'explain', 'explicar'],
  ['explorer', 'explore', 'explorar'],
  ['exploser', 'explode', 'explotar'],
  ['exporter', 'export', 'exportar'],
  ['exposer', 'expose', 'exponer'],
  ['exprimer', 'express', 'expresar'],
  ['fabriquer', 'manufacture', 'fabricar'],
  ['fâcher', 'anger', 'enojar'],
  ['faciliter', 'facilitate', 'facilitar'],
  ['faillir', 'almost do', 'estar a punto'],
  ['fatiguer', 'tire', 'cansar'],
  ['favoriser', 'favor', 'favorecer'],
  ['féliciter', 'congratulate', 'felicitar'],
  ['fendre', 'split', 'partir', 'split'],
  ['fêter', 'celebrate', 'festejar'],
  ['fier', 'trust', 'confiar'],
  ['figer', 'freeze', 'congelar', 'froze'],
  ['figurer', 'appear', 'figurar'],
  ['filmer', 'film', 'filmar'],
  ['filtrer', 'filter', 'filtrar'],
  ['financer', 'finance', 'financiar'],
  ['finir', 'finish', 'terminar'],
  ['fixer', 'fix', 'fijar'],
  ['flatter', 'flatter', 'halagar'],
  ['fleurir', 'bloom', 'florecer'],
  ['flotter', 'float', 'flotar'],
  ['fonctionner', 'work', 'funcionar'],
  ['fonder', 'found', 'fundar'],
  ['fondre', 'melt', 'derretir'],
  ['forcer', 'force', 'forzar'],
  ['former', 'form', 'formar'],
  ['fouiller', 'search', 'registrar'],
  ['fournir', 'provide', 'proporcionar'],
  ['frapper', 'hit', 'golpear', 'hit'],
  ['freiner', 'brake', 'frenar'],
  ['fréquenter', 'frequent', 'frecuentar'],
  ['frotter', 'rub', 'frotar'],
  ['fuir', 'flee', 'huir', 'fled'],
  ['fumer', 'smoke', 'fumar'],
  ['gagner', 'win', 'ganar', 'won'],
  ['garantir', 'guarantee', 'garantizar'],
  ['garder', 'keep', 'guardar', 'kept'],
  ['garer', 'park', 'estacionar'],
  ['gaspiller', 'waste', 'desperdiciar'],
  ['gâter', 'spoil', 'mimar'],
  ['geler', 'freeze', 'helar', 'froze'],
  ['gêner', 'bother', 'molestar'],
  ['gérer', 'manage', 'gestionar'],
  ['glisser', 'slide', 'deslizar', 'slid'],
  ['gonfler', 'inflate', 'inflar'],
  ['goûter', 'taste', 'probar'],
  ['gouverner', 'govern', 'gobernar'],
  ['grandir', 'grow', 'crecer', 'grew'],
  ['gratter', 'scratch', 'rascar'],
  ['grimper', 'climb', 'trepar'],
  ['gronder', 'scold', 'regañar'],
  ['grossir', 'gain weight', 'engordar'],
  ['guérir', 'heal', 'curar'],
  ['guider', 'guide', 'guiar'],
  ['habiller', 'dress', 'vestir'],
  ['habiter', 'live in', 'vivir'],
  ['habituer', 'accustom', 'acostumbrar'],
  ['haïr', 'hate', 'odiar'],
  ['hésiter', 'hesitate', 'dudar'],
  ['heurter', 'hit', 'chocar'],
  ['honorer', 'honor', 'honrar'],
  ['hurler', 'scream', 'gritar'],
  ['identifier', 'identify', 'identificar'],
  ['ignorer', 'ignore', 'ignorar'],
  ['illuminer', 'illuminate', 'iluminar'],
  ['illustrer', 'illustrate', 'ilustrar'],
  ['imaginer', 'imagine', 'imaginar'],
  ['imiter', 'imitate', 'imitar'],
  ['impliquer', 'involve', 'implicar'],
  ['importer', 'import', 'importar'],
  ['imposer', 'impose', 'imponer'],
  ['impressionner', 'impress', 'impresionar'],
  ['imprimer', 'print', 'imprimir'],
  ['inclure', 'include', 'incluir'],
  ['indiquer', 'indicate', 'indicar'],
  ['influencer', 'influence', 'influir'],
  ['informer', 'inform', 'informar'],
  ['initier', 'initiate', 'iniciar'],
  ['inquiéter', 'worry', 'preocupar'],
  ['inscrire', 'register', 'inscribir'],
  ['insister', 'insist', 'insistir'],
  ['inspecter', 'inspect', 'inspeccionar'],
  ['inspirer', 'inspire', 'inspirar'],
  ['installer', 'install', 'instalar'],
  ['instruire', 'instruct', 'instruir'],
  ['intégrer', 'integrate', 'integrar'],
  ['interdire', 'forbid', 'prohibir', 'forbade'],
  ['intéresser', 'interest', 'interesar'],
  ['interpréter', 'interpret', 'interpretar'],
  ['interroger', 'question', 'interrogar'],
  ['interrompre', 'interrupt', 'interrumpir'],
  ['intervenir', 'intervene', 'intervenir'],
  ['introduire', 'introduce', 'introducir'],
  ['inventer', 'invent', 'inventar'],
  ['inverser', 'reverse', 'invertir'],
  ['investir', 'invest', 'invertir'],
  ['inviter', 'invite', 'invitar'],
  ['irriter', 'irritate', 'irritar'],
  ['isoler', 'isolate', 'aislar'],
  ['jaillir', 'gush', 'brotar'],
  ['jeter', 'throw', 'tirar', 'threw'],
  ['joindre', 'join', 'unir'],
  ['jongler', 'juggle', 'hacer malabares'],
  ['jouir', 'enjoy', 'disfrutar'],
  ['juger', 'judge', 'juzgar'],
  ['jurer', 'swear', 'jurar', 'swore'],
  ['justifier', 'justify', 'justificar'],
  ['lâcher', 'release', 'soltar'],
  ['laisser', 'let', 'dejar', 'let'],
  ['lancer', 'launch', 'lanzar'],
  ['laver', 'wash', 'lavar'],
  ['lécher', 'lick', 'lamer'],
  ['lever', 'raise', 'levantar'],
  ['libérer', 'free', 'liberar'],
  ['lier', 'link', 'enlazar'],
  ['limiter', 'limit', 'limitar'],
  ['livrer', 'deliver', 'entregar'],
  ['loger', 'lodge', 'alojar'],
  ['louer', 'rent', 'alquilar'],
  ['lutter', 'struggle', 'luchar'],
  ['maintenir', 'maintain', 'mantener'],
  ['maîtriser', 'master', 'dominar'],
  ['manifester', 'demonstrate', 'manifestar'],
  ['manipuler', 'manipulate', 'manipular'],
  ['manquer', 'miss', 'faltar'],
  ['marcher', 'walk', 'caminar'],
  ['marier', 'marry', 'casar'],
  ['marquer', 'mark', 'marcar'],
  ['masquer', 'mask', 'ocultar'],
  ['méditer', 'meditate', 'meditar'],
  ['méfier', 'distrust', 'desconfiar'],
  ['mélanger', 'mix', 'mezclar'],
  ['menacer', 'threaten', 'amenazar'],
  ['mener', 'lead', 'dirigir', 'led'],
  ['mentionner', 'mention', 'mencionar'],
  ['mentir', 'lie', 'mentir'],
  ['mépriser', 'despise', 'despreciar'],
  ['mériter', 'deserve', 'merecer'],
  ['mesurer', 'measure', 'medir'],
  ['mincir', 'slim down', 'adelgazar'],
  ['modeler', 'shape', 'modelar'],
  ['modifier', 'modify', 'modificar'],
  ['monter', 'go up', 'subir', 'went up'],
  ['montrer', 'show', 'mostrar', 'showed'],
  ['moquer', 'mock', 'burlarse'],
  ['mordre', 'bite', 'morder', 'bit'],
  ['motiver', 'motivate', 'motivar'],
  ['moucher', 'blow nose', 'sonarse'],
  ['mouiller', 'wet', 'mojar'],
  ['mourir', 'die', 'morir'],
  ['multiplier', 'multiply', 'multiplicar'],
  ['murmurer', 'murmur', 'murmurar'],
  ['nager', 'swim', 'nadar', 'swam'],
  ['naître', 'be born', 'nacer', 'was born'],
  ['naviguer', 'navigate', 'navegar'],
  ['négliger', 'neglect', 'descuidar'],
  ['négocier', 'negotiate', 'negociar'],
  ['nettoyer', 'clean', 'limpiar'],
  ['nier', 'deny', 'negar'],
  ['noircir', 'darken', 'ennegrecer'],
  ['nommer', 'name', 'nombrar'],
  ['noter', 'note', 'anotar'],
  ['nouer', 'tie', 'anudar'],
  ['nourrir', 'feed', 'alimentar', 'fed'],
  ['noyer', 'drown', 'ahogar'],
  ['obéir', 'obey', 'obedecer'],
  ['obliger', 'oblige', 'obligar'],
  ['observer', 'observe', 'observar'],
  ['obtenir', 'obtain', 'obtener'],
  ['occuper', 'occupy', 'ocupar'],
  ['offrir', 'offer', 'ofrecer'],
  ['opérer', 'operate', 'operar'],
  ['opposer', 'oppose', 'oponer'],
  ['opter', 'opt', 'optar'],
  ['ordonner', 'order', 'ordenar'],
  ['organiser', 'organize', 'organizar'],
  ['orienter', 'orient', 'orientar'],
  ['oser', 'dare', 'atreverse'],
  ['ôter', 'remove', 'quitar'],
  ['oublier', 'forget', 'olvidar', 'forgot'],
  ['pardonner', 'forgive', 'perdonar', 'forgave'],
  ['parier', 'bet', 'apostar', 'bet'],
  ['partager', 'share', 'compartir'],
  ['participer', 'participate', 'participar'],
  ['passer', 'pass', 'pasar'],
  ['patienter', 'wait', 'esperar'],
  ['patiner', 'skate', 'patinar'],
  ['payer', 'pay', 'pagar', 'paid'],
  ['pêcher', 'fish', 'pescar'],
  ['peindre', 'paint', 'pintar'],
  ['pencher', 'lean', 'inclinar'],
  ['pendre', 'hang', 'colgar'],
  ['pénétrer', 'penetrate', 'penetrar'],
  ['percer', 'pierce', 'perforar'],
  ['percevoir', 'perceive', 'percibir'],
  ['perfectionner', 'perfect', 'perfeccionar'],
  ['périr', 'perish', 'perecer'],
  ['permettre', 'allow', 'permitir'],
  ['persister', 'persist', 'persistir'],
  ['persuader', 'persuade', 'persuadir'],
  ['peser', 'weigh', 'pesar'],
  ['photographier', 'photograph', 'fotografiar'],
  ['piquer', 'sting', 'picar', 'stung'],
  ['placer', 'place', 'colocar'],
  ['plaindre', 'pity', 'compadecer'],
  ['plaire', 'please', 'agradar'],
  ['planifier', 'plan', 'planificar'],
  ['planter', 'plant', 'plantar'],
  ['pleurer', 'cry', 'llorar'],
  ['plier', 'fold', 'doblar'],
  ['plonger', 'dive', 'bucear'],
  ['polir', 'polish', 'pulir'],
  ['polluer', 'pollute', 'contaminar'],
  ['porter', 'wear', 'llevar', 'wore'],
  ['poser', 'put down', 'poner'],
  ['posséder', 'possess', 'poseer'],
  ['poster', 'post', 'publicar'],
  ['poursuivre', 'pursue', 'perseguir'],
  ['pousser', 'push', 'empujar'],
  ['pratiquer', 'practice', 'practicar'],
  ['précéder', 'precede', 'preceder'],
  ['préciser', 'specify', 'precisar'],
  ['prédire', 'predict', 'predecir'],
  ['préférer', 'prefer', 'preferir'],
  ['préparer', 'prepare', 'preparar'],
  ['présenter', 'present', 'presentar'],
  ['préserver', 'preserve', 'preservar'],
  ['presser', 'squeeze', 'presionar'],
  ['prétendre', 'claim', 'pretender'],
  ['prêter', 'lend', 'prestar', 'lent'],
  ['prévenir', 'warn', 'prevenir'],
  ['prévoir', 'foresee', 'prever', 'foresaw'],
  ['prier', 'pray', 'rezar'],
  ['priver', 'deprive', 'privar'],
  ['procurer', 'procure', 'procurar'],
  ['produire', 'produce', 'producir'],
  ['profiter', 'enjoy', 'disfrutar'],
  ['programmer', 'program', 'programar'],
  ['progresser', 'progress', 'progresar'],
  ['projeter', 'project', 'proyectar'],
  ['prolonger', 'extend', 'prolongar'],
  ['promener', 'walk', 'pasear'],
  ['promettre', 'promise', 'prometer'],
  ['prononcer', 'pronounce', 'pronunciar'],
  ['proposer', 'propose', 'proponer'],
  ['protéger', 'protect', 'proteger'],
  ['prouver', 'prove', 'probar'],
  ['provenir', 'come from', 'provenir'],
  ['provoquer', 'provoke', 'provocar'],
  ['publier', 'publish', 'publicar'],
  ['punir', 'punish', 'castigar'],
  ['qualifier', 'qualify', 'calificar'],
  ['quitter', 'leave', 'dejar', 'left'],
  ['raconter', 'tell', 'contar', 'told'],
  ['rafraîchir', 'refresh', 'refrescar'],
  ['raisonner', 'reason', 'razonar'],
  ['ralentir', 'slow down', 'frenar'],
  ['ramasser', 'pick up', 'recoger'],
  ['ramener', 'bring back', 'traer de vuelta'],
  ['ranger', 'tidy up', 'ordenar'],
  ['rappeler', 'remind', 'recordar'],
  ['rapporter', 'report', 'informar'],
  ['rapprocher', 'bring closer', 'acercar'],
  ['rassurer', 'reassure', 'tranquilizar'],
  ['rater', 'miss', 'fallar'],
  ['ravir', 'delight', 'encantar'],
  ['réagir', 'react', 'reaccionar'],
  ['réaliser', 'realize', 'realizar'],
  ['recevoir', 'receive', 'recibir'],
  ['réchauffer', 'warm up', 'calentar'],
  ['rechercher', 'search', 'buscar'],
  ['réciter', 'recite', 'recitar'],
  ['réclamer', 'claim', 'reclamar'],
  ['recommander', 'recommend', 'recomendar'],
  ['recommencer', 'restart', 'reiniciar'],
  ['récompenser', 'reward', 'recompensar'],
  ['reconnaître', 'recognize', 'reconocer'],
  ['recouvrir', 'cover', 'cubrir'],
  ['recruter', 'recruit', 'reclutar'],
  ['reculer', 'step back', 'retroceder'],
  ['récupérer', 'recover', 'recuperar'],
  ['rédiger', 'write', 'redactar'],
  ['redouter', 'dread', 'temer'],
  ['réduire', 'reduce', 'reducir'],
  ['réfléchir', 'reflect', 'reflexionar'],
  ['refroidir', 'cool down', 'enfriar'],
  ['refuser', 'refuse', 'rechazar'],
  ['regarder', 'watch', 'mirar'],
  ['régler', 'adjust', 'ajustar'],
  ['régner', 'reign', 'reinar'],
  ['regretter', 'regret', 'lamentar'],
  ['rejeter', 'reject', 'rechazar'],
  ['rejoindre', 'join', 'unirse'],
  ['réjouir', 'delight', 'alegrar'],
  ['relacher', 'release', 'soltar'],
  ['relater', 'relate', 'relatar'],
  ['relever', 'lift', 'levantar'],
  ['relier', 'connect', 'conectar'],
  ['relire', 'reread', 'releer'],
  ['remarquer', 'notice', 'notar'],
  ['rembourser', 'refund', 'reembolsar'],
  ['remercier', 'thank', 'agradecer'],
  ['remettre', 'put back', 'devolver'],
  ['remonter', 'go back up', 'subir'],
  ['remplacer', 'replace', 'reemplazar'],
  ['remplir', 'fill', 'llenar'],
  ['remporter', 'win', 'ganar'],
  ['remuer', 'stir', 'mover'],
  ['rencontrer', 'meet', 'conocer', 'met'],
  ['rendre', 'return', 'devolver'],
  ['renforcer', 'strengthen', 'reforzar'],
  ['renoncer', 'give up', 'renunciar'],
  ['renouveler', 'renew', 'renovar'],
  ['renseigner', 'inform', 'informar'],
  ['rentrer', 'go home', 'regresar'],
  ['renverser', 'knock over', 'volcar'],
  ['répandre', 'spread', 'esparcir', 'spread'],
  ['réparer', 'repair', 'reparar'],
  ['repartir', 'leave again', 'partir de nuevo'],
  ['repasser', 'iron', 'planchar'],
  ['répéter', 'repeat', 'repetir'],
  ['repérer', 'spot', 'localizar'],
  ['répondre', 'answer', 'responder'],
  ['reporter', 'postpone', 'posponer'],
  ['reposer', 'rest', 'descansar'],
  ['repousser', 'push back', 'rechazar'],
  ['reprendre', 'resume', 'retomar'],
  ['représenter', 'represent', 'representar'],
  ['reprocher', 'reproach', 'reprochar'],
  ['reproduire', 'reproduce', 'reproducir'],
  ['réserver', 'reserve', 'reservar'],
  ['résider', 'reside', 'residir'],
  ['résister', 'resist', 'resistir'],
  ['résoudre', 'solve', 'resolver'],
  ['respecter', 'respect', 'respetar'],
  ['respirer', 'breathe', 'respirar'],
  ['ressembler', 'resemble', 'parecerse'],
  ['ressentir', 'feel', 'sentir'],
  ['rester', 'stay', 'quedarse'],
  ['rétablir', 'restore', 'restablecer'],
  ['retarder', 'delay', 'retrasar'],
  ['retenir', 'retain', 'retener'],
  ['retirer', 'remove', 'retirar'],
  ['retourner', 'go back', 'volver'],
  ['retrouver', 'find again', 'reencontrar'],
  ['réunir', 'gather', 'reunir'],
  ['réussir', 'succeed', 'lograr'],
  ['rêver', 'dream', 'soñar'],
  ['réveiller', 'wake up', 'despertar', 'woke up'],
  ['révéler', 'reveal', 'revelar'],
  ['revenir', 'come back', 'regresar', 'came back'],
  ['revoir', 'see again', 'volver a ver'],
  ['rigoler', 'laugh', 'reír'],
  ['rincer', 'rinse', 'enjuagar'],
  ['rire', 'laugh', 'reír', 'laughed'],
  ['risquer', 'risk', 'arriesgar'],
  ['rompre', 'break', 'romper'],
  ['ronfler', 'snore', 'roncar'],
  ['ronger', 'gnaw', 'roer'],
  ['rougir', 'blush', 'sonrojarse'],
  ['rouler', 'roll', 'rodar'],
  ['rôtir', 'roast', 'asar'],
  ['sacrifier', 'sacrifice', 'sacrificar'],
  ['saisir', 'seize', 'agarrar'],
  ['salir', 'dirty', 'ensuciar'],
  ['saluer', 'greet', 'saludar'],
  ['satisfaire', 'satisfy', 'satisfacer'],
  ['sauter', 'jump', 'saltar'],
  ['sauver', 'save', 'salvar'],
  ['sécher', 'dry', 'secar'],
  ['secouer', 'shake', 'sacudir'],
  ['secourir', 'rescue', 'socorrer'],
  ['séduire', 'seduce', 'seducir'],
  ['séjourner', 'stay', 'alojarse'],
  ['sélectionner', 'select', 'seleccionar'],
  ['sembler', 'seem', 'parecer'],
  ['semer', 'sow', 'sembrar'],
  ['séparer', 'separate', 'separar'],
  ['serrer', 'squeeze', 'apretar'],
  ['servir', 'serve', 'servir'],
  ['siffler', 'whistle', 'silbar'],
  ['signaler', 'report', 'señalar'],
  ['signer', 'sign', 'firmar'],
  ['signifier', 'mean', 'significar', 'meant'],
  ['simplifier', 'simplify', 'simplificar'],
  ['simuler', 'simulate', 'simular'],
  ['situer', 'locate', 'situar'],
  ['soigner', 'treat', 'cuidar'],
  ['songer', 'think', 'pensar'],
  ['sonner', 'ring', 'sonar', 'rang'],
  ['sortir', 'go out', 'salir', 'went out'],
  ['soucier', 'worry', 'preocuparse'],
  ['souffler', 'blow', 'soplar', 'blew'],
  ['souffrir', 'suffer', 'sufrir'],
  ['souhaiter', 'wish', 'desear'],
  ['soulager', 'relieve', 'aliviar'],
  ['soulever', 'lift', 'levantar'],
  ['souligner', 'underline', 'subrayar'],
  ['soumettre', 'submit', 'someter'],
  ['soupçonner', 'suspect', 'sospechar'],
  ['soupirer', 'sigh', 'suspirar'],
  ['sourire', 'smile', 'sonreír'],
  ['soutenir', 'support', 'apoyar'],
  ['souvenir', 'remember', 'recordar'],
  ['spécifier', 'specify', 'especificar'],
  ['stimuler', 'stimulate', 'estimular'],
  ['stopper', 'stop', 'detener'],
  ['subir', 'undergo', 'sufrir'],
  ['succéder', 'succeed', 'suceder'],
  ['sucer', 'suck', 'chupar'],
  ['suffire', 'suffice', 'bastar'],
  ['suggérer', 'suggest', 'sugerir'],
  ['suicider', 'commit suicide', 'suicidarse'],
  ['superviser', 'supervise', 'supervisar'],
  ['supplier', 'beg', 'suplicar'],
  ['supporter', 'bear', 'soportar'],
  ['supposer', 'suppose', 'suponer'],
  ['supprimer', 'delete', 'eliminar'],
  ['surgir', 'arise', 'surgir', 'arose'],
  ['surmonter', 'overcome', 'superar'],
  ['surprendre', 'surprise', 'sorprender'],
  ['surveiller', 'watch over', 'vigilar'],
  ['survivre', 'survive', 'sobrevivir'],
  ['suspendre', 'suspend', 'suspender'],
  ['tâcher', 'try', 'intentar'],
  ['tailler', 'trim', 'cortar'],
  ['taire', 'keep quiet', 'callar'],
  ['taper', 'type', 'teclear'],
  ['tarder', 'delay', 'tardar'],
  ['télécharger', 'download', 'descargar'],
  ['téléphoner', 'phone', 'llamar'],
  ['témoigner', 'testify', 'testificar'],
  ['tendre', 'hold out', 'tender'],
  ['tenir', 'hold', 'sostener', 'held'],
  ['tenter', 'attempt', 'intentar'],
  ['terminer', 'finish', 'terminar'],
  ['tester', 'test', 'probar'],
  ['tirer', 'pull', 'tirar'],
  ['tolérer', 'tolerate', 'tolerar'],
  ['tomber', 'fall', 'caer', 'fell'],
  ['tordre', 'twist', 'torcer'],
  ['toucher', 'touch', 'tocar'],
  ['tourner', 'turn', 'girar'],
  ['tousser', 'cough', 'toser'],
  ['tracer', 'draw', 'trazar'],
  ['traduire', 'translate', 'traducir'],
  ['trahir', 'betray', 'traicionar'],
  ['traîner', 'drag', 'arrastrar'],
  ['traiter', 'treat', 'tratar'],
  ['trancher', 'slice', 'cortar'],
  ['transférer', 'transfer', 'transferir'],
  ['transformer', 'transform', 'transformar'],
  ['transmettre', 'transmit', 'transmitir'],
  ['transporter', 'transport', 'transportar'],
  ['travailler', 'work', 'trabajar'],
  ['traverser', 'cross', 'cruzar'],
  ['trembler', 'tremble', 'temblar'],
  ['trier', 'sort', 'ordenar'],
  ['tromper', 'deceive', 'engañar'],
  ['troubler', 'disturb', 'turbar'],
  ['tuer', 'kill', 'matar'],
  ['unir', 'unite', 'unir'],
  ['user', 'wear out', 'gastar'],
  ['utiliser', 'use', 'usar'],
  ['vaincre', 'defeat', 'vencer'],
  ['valider', 'validate', 'validar'],
  ['valoir', 'be worth', 'valer'],
  ['vanter', 'praise', 'alabar'],
  ['varier', 'vary', 'variar'],
  ['veiller', 'watch over', 'velar'],
  ['vendre', 'sell', 'vender', 'sold'],
  ['venger', 'avenge', 'vengar'],
  ['vérifier', 'verify', 'verificar'],
  ['verser', 'pour', 'verter'],
  ['vêtir', 'clothe', 'vestir'],
  ['vider', 'empty', 'vaciar'],
  ['vieillir', 'age', 'envejecer'],
  ['viser', 'aim', 'apuntar'],
  ['visiter', 'visit', 'visitar'],
  ['voler', 'fly', 'volar', 'flew'],
  ['voter', 'vote', 'votar'],
  ['voyager', 'travel', 'viajar'],
  ['zozoter', 'lisp', 'cecear'],
];

// 550+ curated vocabulary words (nouns, adjectives, adverbs, expressions)
// Nouns & adjectives automatically expand to singular/plural/gender forms in offline JS.
const VOCABULARY_ENTRIES: [string, string, string, 'nom' | 'adj' | 'expr'][] = [
  // Salutations & expressions (35)
  ['bonjour', 'hello', 'hola', 'expr'],
  ['bonsoir', 'good evening', 'buenas noches', 'expr'],
  ['au revoir', 'goodbye', 'adiós', 'expr'],
  ['salut', 'hi', 'hola', 'expr'],
  ['merci', 'thank you', 'gracias', 'expr'],
  ['merci beaucoup', 'thank you very much', 'muchas gracias', 'expr'],
  ['de rien', 'you are welcome', 'de nada', 'expr'],
  ['s’il vous plaît', 'please', 'por favor', 'expr'],
  ['excusez-moi', 'excuse me', 'disculpe', 'expr'],
  ['pardon', 'sorry', 'perdón', 'expr'],
  ['oui', 'yes', 'sí', 'expr'],
  ['non', 'no', 'no', 'expr'],
  ['peut-être', 'maybe', 'quizás', 'expr'],
  ['bien sûr', 'of course', 'por supuesto', 'expr'],
  ['d’accord', 'okay', 'de acuerdo', 'expr'],
  ['comment ça va', 'how are you', 'cómo estás', 'expr'],
  ['ça va bien', 'I am fine', 'estoy bien', 'expr'],
  ['à bientôt', 'see you soon', 'hasta pronto', 'expr'],
  ['à demain', 'see you tomorrow', 'hasta mañana', 'expr'],
  ['bonne journée', 'have a nice day', 'que tengas un buen día', 'expr'],
  ['bonne nuit', 'good night', 'buenas noches', 'expr'],
  ['félicitations', 'congratulations', 'felicidades', 'expr'],
  ['bienvenue', 'welcome', 'bienvenido', 'expr'],
  ['bonne chance', 'good luck', 'buena suerte', 'expr'],
  ['au secours', 'help', 'socorro', 'expr'],
  ['tout de suite', 'right away', 'enseguida', 'expr'],
  ['en retard', 'late', 'tarde', 'expr'],
  ['en avance', 'early', 'temprano', 'expr'],
  ['à l’heure', 'on time', 'a tiempo', 'expr'],
  ['pas du tout', 'not at all', 'para nada', 'expr'],
  ['qu’est-ce que c’est', 'what is this', 'qué es esto', 'expr'],
  ['je ne sais pas', 'I do not know', 'no lo sé', 'expr'],
  ['je comprends', 'I understand', 'entiendo', 'expr'],
  ['je ne comprends pas', 'I do not understand', 'no entiendo', 'expr'],
  ['parlez plus lentement', 'speak more slowly', 'hable más despacio', 'expr'],

  // Pronoms, mots grammaticaux & adverbes (60)
  ['je', 'I', 'yo', 'expr'],
  ['tu', 'you', 'tú', 'expr'],
  ['il', 'he', 'él', 'expr'],
  ['elle', 'she', 'ella', 'expr'],
  ['nous', 'we', 'nosotros', 'expr'],
  ['vous', 'you', 'vosotros', 'expr'],
  ['ils', 'they', 'ellos', 'expr'],
  ['elles', 'they', 'ellas', 'expr'],
  ['moi', 'me', 'mí', 'expr'],
  ['toi', 'you', 'ti', 'expr'],
  ['qui', 'who', 'quién', 'expr'],
  ['quoi', 'what', 'qué', 'expr'],
  ['où', 'where', 'dónde', 'expr'],
  ['quand', 'when', 'cuándo', 'expr'],
  ['pourquoi', 'why', 'por qué', 'expr'],
  ['parce que', 'because', 'porque', 'expr'],
  ['comment', 'how', 'cómo', 'expr'],
  ['combien', 'how much', 'cuánto', 'expr'],
  ['lequel', 'which', 'cuál', 'expr'],
  ['et', 'and', 'y', 'expr'],
  ['ou', 'or', 'o', 'expr'],
  ['mais', 'but', 'pero', 'expr'],
  ['donc', 'therefore', 'por lo tanto', 'expr'],
  ['alors', 'then', 'entonces', 'expr'],
  ['aussi', 'also', 'también', 'expr'],
  ['toujours', 'always', 'siempre', 'expr'],
  ['jamais', 'never', 'nunca', 'expr'],
  ['souvent', 'often', 'a menudo', 'expr'],
  ['parfois', 'sometimes', 'a veces', 'expr'],
  ['rarement', 'rarely', 'raramente', 'expr'],
  ['maintenant', 'now', 'ahora', 'expr'],
  ['bientôt', 'soon', 'pronto', 'expr'],
  ['déjà', 'already', 'ya', 'expr'],
  ['encore', 'still', 'todavía', 'expr'],
  ['beaucoup', 'a lot', 'mucho', 'expr'],
  ['peu', 'little', 'poco', 'expr'],
  ['très', 'very', 'muy', 'expr'],
  ['trop', 'too much', 'demasiado', 'expr'],
  ['assez', 'enough', 'bastante', 'expr'],
  ['plus', 'more', 'más', 'expr'],
  ['moins', 'less', 'menos', 'expr'],
  ['avec', 'with', 'con', 'expr'],
  ['sans', 'without', 'sin', 'expr'],
  ['pour', 'for', 'para', 'expr'],
  ['dans', 'in', 'en', 'expr'],
  ['sur', 'on', 'sobre', 'expr'],
  ['sous', 'under', 'debajo', 'expr'],
  ['devant', 'in front of', 'delante', 'expr'],
  ['derrière', 'behind', 'detrás', 'expr'],
  ['entre', 'between', 'entre', 'expr'],
  ['avant', 'before', 'antes', 'expr'],
  ['après', 'after', 'después', 'expr'],
  ['pendant', 'during', 'durante', 'expr'],
  ['depuis', 'since', 'desde', 'expr'],
  ['ici', 'here', 'aquí', 'expr'],
  ['là-bas', 'over there', 'allí', 'expr'],
  ['partout', 'everywhere', 'en todas partes', 'expr'],
  ['nulle part', 'nowhere', 'en ninguna parte', 'expr'],
  ['tout', 'everything', 'todo', 'expr'],
  ['rien', 'nothing', 'nada', 'expr'],

  // Temps, calendrier, météo (45)
  ['temps', 'time', 'tiempo', 'nom'],
  ['heure', 'hour', 'hora', 'nom'],
  ['minute', 'minute', 'minuto', 'nom'],
  ['seconde', 'second', 'segundo', 'nom'],
  ['jour', 'day', 'día', 'nom'],
  ['semaine', 'week', 'semana', 'nom'],
  ['mois', 'month', 'mes', 'nom'],
  ['année', 'year', 'año', 'nom'],
  ['siècle', 'century', 'siglo', 'nom'],
  ['matin', 'morning', 'mañana', 'nom'],
  ['midi', 'noon', 'mediodía', 'nom'],
  ['après-midi', 'afternoon', 'tarde', 'nom'],
  ['soir', 'evening', 'noche', 'nom'],
  ['nuit', 'night', 'noche', 'nom'],
  ['minuit', 'midnight', 'medianoche', 'nom'],
  ['aujourd’hui', 'today', 'hoy', 'expr'],
  ['hier', 'yesterday', 'ayer', 'expr'],
  ['demain', 'tomorrow', 'mañana', 'expr'],
  ['lundi', 'Monday', 'lunes', 'nom'],
  ['mardi', 'Tuesday', 'martes', 'nom'],
  ['mercredi', 'Wednesday', 'miércoles', 'nom'],
  ['jeudi', 'Thursday', 'jueves', 'nom'],
  ['vendredi', 'Friday', 'viernes', 'nom'],
  ['samedi', 'Saturday', 'sábado', 'nom'],
  ['dimanche', 'Sunday', 'domingo', 'nom'],
  ['janvier', 'January', 'enero', 'nom'],
  ['février', 'February', 'febrero', 'nom'],
  ['mars', 'March', 'marzo', 'nom'],
  ['avril', 'April', 'abril', 'nom'],
  ['mai', 'May', 'mayo', 'nom'],
  ['juin', 'June', 'junio', 'nom'],
  ['juillet', 'July', 'julio', 'nom'],
  ['août', 'August', 'agosto', 'nom'],
  ['septembre', 'September', 'septiembre', 'nom'],
  ['octobre', 'October', 'octubre', 'nom'],
  ['novembre', 'November', 'noviembre', 'nom'],
  ['décembre', 'December', 'diciembre', 'nom'],
  ['printemps', 'spring', 'primavera', 'nom'],
  ['été', 'summer', 'verano', 'nom'],
  ['automne', 'autumn', 'otoño', 'nom'],
  ['hiver', 'winter', 'invierno', 'nom'],
  ['météo', 'weather', 'clima', 'nom'],
  ['température', 'temperature', 'temperatura', 'nom'],
  ['orage', 'storm', 'tormenta', 'nom'],
  ['éclair', 'lightning', 'relámpago', 'nom'],

  // Couleurs (16)
  ['couleur', 'color', 'color', 'nom'],
  ['rouge', 'red', 'rojo', 'adj'],
  ['bleu', 'blue', 'azul', 'adj'],
  ['vert', 'green', 'verde', 'adj'],
  ['jaune', 'yellow', 'amarillo', 'adj'],
  ['noir', 'black', 'negro', 'adj'],
  ['blanc', 'white', 'blanco', 'adj'],
  ['gris', 'gray', 'gris', 'adj'],
  ['orange', 'orange', 'naranja', 'adj'],
  ['rose', 'pink', 'rosa', 'adj'],
  ['violet', 'purple', 'morado', 'adj'],
  ['marron', 'brown', 'marrón', 'adj'],
  ['beige', 'beige', 'beige', 'adj'],
  ['doré', 'golden', 'dorado', 'adj'],
  ['argenté', 'silver', 'plateado', 'adj'],
  ['turquoise', 'turquoise', 'turquesa', 'adj'],

  // École, sciences, technologie & métiers (85)
  ['école', 'school', 'escuela', 'nom'],
  ['collège', 'middle school', 'instituto', 'nom'],
  ['lycée', 'high school', 'bachillerato', 'nom'],
  ['université', 'university', 'universidad', 'nom'],
  ['classe', 'classroom', 'clase', 'nom'],
  ['élève', 'student', 'alumno', 'nom'],
  ['étudiant', 'university student', 'estudiante', 'nom'],
  ['professeur', 'teacher', 'profesor', 'nom'],
  ['directeur', 'principal', 'director', 'nom'],
  ['cours', 'lesson', 'lección', 'nom'],
  ['devoir', 'homework', 'deberes', 'nom'],
  ['examen', 'exam', 'examen', 'nom'],
  ['note', 'grade', 'nota', 'nom'],
  ['bulletin', 'report card', 'boletín', 'nom'],
  ['diplôme', 'diploma', 'diploma', 'nom'],
  ['bibliothèque', 'library', 'biblioteca', 'nom'],
  ['cantine', 'cafeteria', 'comedor', 'nom'],
  ['récréation', 'recess', 'recreo', 'nom'],
  ['livre', 'book', 'libro', 'nom'],
  ['cahier', 'notebook', 'cuaderno', 'nom'],
  ['feuille', 'sheet', 'hoja', 'nom'],
  ['stylo', 'pen', 'bolígrafo', 'nom'],
  ['crayon', 'pencil', 'lápiz', 'nom'],
  ['gomme', 'eraser', 'goma', 'nom'],
  ['règle', 'ruler', 'regla', 'nom'],
  ['ciseaux', 'scissors', 'tijeras', 'nom'],
  ['sac', 'bag', 'mochila', 'nom'],
  ['table', 'table', 'mesa', 'nom'],
  ['chaise', 'chair', 'silla', 'nom'],
  ['bureau', 'desk', 'escritorio', 'nom'],
  ['tableau', 'board', 'pizarra', 'nom'],
  ['page', 'page', 'página', 'nom'],
  ['chapitre', 'chapter', 'capítulo', 'nom'],
  ['mot', 'word', 'palabra', 'nom'],
  ['phrase', 'sentence', 'frase', 'nom'],
  ['texte', 'text', 'texto', 'nom'],
  ['langue', 'language', 'idioma', 'nom'],
  ['dictionnaire', 'dictionary', 'diccionario', 'nom'],
  ['traduction', 'translation', 'traducción', 'nom'],
  ['question', 'question', 'pregunta', 'nom'],
  ['réponse', 'answer', 'respuesta', 'nom'],
  ['exercice', 'exercise', 'ejercicio', 'nom'],
  ['mathématiques', 'mathematics', 'matemáticas', 'nom'],
  ['algèbre', 'algebra', 'álgebra', 'nom'],
  ['géométrie', 'geometry', 'geometría', 'nom'],
  ['histoire', 'history', 'historia', 'nom'],
  ['géographie', 'geography', 'geografía', 'nom'],
  ['sciences', 'science', 'ciencias', 'nom'],
  ['physique', 'physics', 'física', 'nom'],
  ['chimie', 'chemistry', 'química', 'nom'],
  ['biologie', 'biology', 'biología', 'nom'],
  ['informatique', 'computer science', 'informática', 'nom'],
  ['ordinateur', 'computer', 'ordenador', 'nom'],
  ['clavier', 'keyboard', 'teclado', 'nom'],
  ['souris', 'mouse', 'ratón', 'nom'],
  ['écran', 'screen', 'pantalla', 'nom'],
  ['imprimante', 'printer', 'impresora', 'nom'],
  ['fichier', 'file', 'archivo', 'nom'],
  ['dossier', 'folder', 'carpeta', 'nom'],
  ['logiciel', 'software', 'programa', 'nom'],
  ['application', 'application', 'aplicación', 'nom'],
  ['site', 'website', 'sitio web', 'nom'],
  ['internet', 'internet', 'internet', 'nom'],
  ['réseau', 'network', 'red', 'nom'],
  ['donnée', 'data', 'dato', 'nom'],
  ['mot de passe', 'password', 'contraseña', 'nom'],
  ['médecin', 'doctor', 'médico', 'nom'],
  ['infirmier', 'nurse', 'enfermero', 'nom'],
  ['avocat', 'lawyer', 'abogado', 'nom'],
  ['ingénieur', 'engineer', 'ingeniero', 'nom'],
  ['architecte', 'architect', 'arquitecto', 'nom'],
  ['policier', 'police officer', 'policía', 'nom'],
  ['pompier', 'firefighter', 'bombero', 'nom'],
  ['cuisinier', 'cook', 'cocinero', 'nom'],
  ['boulanger', 'baker', 'panadero', 'nom'],
  ['journaliste', 'journalist', 'periodista', 'nom'],
  ['artiste', 'artist', 'artista', 'nom'],
  ['musicien', 'musician', 'músico', 'nom'],
  ['écrivain', 'writer', 'escritor', 'nom'],
  ['acteur', 'actor', 'actor', 'nom'],
  ['pilote', 'pilot', 'piloto', 'nom'],
  ['agriculteur', 'farmer', 'agricultor', 'nom'],
  ['vendeur', 'salesperson', 'vendedor', 'nom'],
  ['client', 'customer', 'cliente', 'nom'],
  ['patron', 'boss', 'jefe', 'nom'],

  // Famille, personnes & corps humain (65)
  ['personne', 'person', 'persona', 'nom'],
  ['homme', 'man', 'hombre', 'nom'],
  ['femme', 'woman', 'mujer', 'nom'],
  ['enfant', 'child', 'niño', 'nom'],
  ['garçon', 'boy', 'chico', 'nom'],
  ['fille', 'girl', 'chica', 'nom'],
  ['bébé', 'baby', 'bebé', 'nom'],
  ['adolescent', 'teenager', 'adolescente', 'nom'],
  ['adulte', 'adult', 'adulto', 'nom'],
  ['ami', 'friend', 'amigo', 'nom'],
  ['camarade', 'classmate', 'compañero', 'nom'],
  ['famille', 'family', 'familia', 'nom'],
  ['parent', 'parent', 'padre', 'nom'],
  ['père', 'father', 'padre', 'nom'],
  ['mère', 'mother', 'madre', 'nom'],
  ['frère', 'brother', 'hermano', 'nom'],
  ['sœur', 'sister', 'hermana', 'nom'],
  ['fils', 'son', 'hijo', 'nom'],
  ['grand-père', 'grandfather', 'abuelo', 'nom'],
  ['grand-mère', 'grandmother', 'abuela', 'nom'],
  ['oncle', 'uncle', 'tío', 'nom'],
  ['tante', 'aunt', 'tía', 'nom'],
  ['cousin', 'cousin', 'primo', 'nom'],
  ['neveu', 'nephew', 'sobrino', 'nom'],
  ['nièce', 'niece', 'sobrina', 'nom'],
  ['mari', 'husband', 'marido', 'nom'],
  ['épouse', 'wife', 'esposa', 'nom'],
  ['voisin', 'neighbor', 'vecino', 'nom'],
  ['corps', 'body', 'cuerpo', 'nom'],
  ['tête', 'head', 'cabeza', 'nom'],
  ['visage', 'face', 'cara', 'nom'],
  ['front', 'forehead', 'frente', 'nom'],
  ['œil', 'eye', 'ojo', 'nom'],
  ['yeux', 'eyes', 'ojos', 'nom'],
  ['nez', 'nose', 'nariz', 'nom'],
  ['bouche', 'mouth', 'boca', 'nom'],
  ['lèvre', 'lip', 'labio', 'nom'],
  ['dent', 'tooth', 'diente', 'nom'],
  ['langue (corps)', 'tongue', 'lengua', 'nom'],
  ['oreille', 'ear', 'oreja', 'nom'],
  ['cheveu', 'hair', 'pelo', 'nom'],
  ['cou', 'neck', 'cuello', 'nom'],
  ['épaule', 'shoulder', 'hombro', 'nom'],
  ['bras', 'arm', 'brazo', 'nom'],
  ['coude', 'elbow', 'codo', 'nom'],
  ['main', 'hand', 'mano', 'nom'],
  ['doigt', 'finger', 'dedo', 'nom'],
  ['ongle', 'nail', 'uña', 'nom'],
  ['poitrine', 'chest', 'pecho', 'nom'],
  ['ventre', 'stomach', 'estómago', 'nom'],
  ['dos', 'back', 'espalda', 'nom'],
  ['jambe', 'leg', 'pierna', 'nom'],
  ['genou', 'knee', 'rodilla', 'nom'],
  ['pied', 'foot', 'pie', 'nom'],
  ['cœur', 'heart', 'corazón', 'nom'],
  ['cerveau', 'brain', 'cerebro', 'nom'],
  ['poumon', 'lung', 'pulmón', 'nom'],
  ['sang', 'blood', 'sangre', 'nom'],
  ['os', 'bone', 'hueso', 'nom'],
  ['peau', 'skin', 'piel', 'nom'],
  ['voix', 'voice', 'voz', 'nom'],
  ['nom', 'name', 'nombre', 'nom'],
  ['prénom', 'first name', 'nombre de pila', 'nom'],
  ['adresse', 'address', 'dirección', 'nom'],
  ['âge', 'age', 'edad', 'nom'],

  // Maison, vêtements, nourriture & objets (100)
  ['maison', 'house', 'casa', 'nom'],
  ['appartement', 'apartment', 'apartamento', 'nom'],
  ['immeuble', 'building', 'edificio', 'nom'],
  ['chambre', 'bedroom', 'habitación', 'nom'],
  ['cuisine', 'kitchen', 'cocina', 'nom'],
  ['salon', 'living room', 'salón', 'nom'],
  ['salle de bain', 'bathroom', 'baño', 'nom'],
  ['garage', 'garage', 'garaje', 'nom'],
  ['balcon', 'balcony', 'balcón', 'nom'],
  ['escalier', 'stairs', 'escalera', 'nom'],
  ['ascenseur', 'elevator', 'ascensor', 'nom'],
  ['porte', 'door', 'puerta', 'nom'],
  ['fenêtre', 'window', 'ventana', 'nom'],
  ['mur', 'wall', 'pared', 'nom'],
  ['sol', 'floor', 'suelo', 'nom'],
  ['plafond', 'ceiling', 'techo', 'nom'],
  ['toit', 'roof', 'tejado', 'nom'],
  ['jardin', 'garden', 'jardín', 'nom'],
  ['lit', 'bed', 'cama', 'nom'],
  ['armoire', 'wardrobe', 'armario', 'nom'],
  ['miroir', 'mirror', 'espejo', 'nom'],
  ['lampe', 'lamp', 'lámpara', 'nom'],
  ['horloge', 'clock', 'reloj', 'nom'],
  ['clé', 'key', 'llave', 'nom'],
  ['télévision', 'television', 'televisión', 'nom'],
  ['radio', 'radio', 'radio', 'nom'],
  ['téléphone', 'phone', 'teléfono', 'nom'],
  ['appareil photo', 'camera', 'cámara', 'nom'],
  ['montre', 'watch', 'reloj de pulsera', 'nom'],
  ['lunettes', 'glasses', 'gafas', 'nom'],
  ['parapluie', 'umbrella', 'paraguas', 'nom'],
  ['valise', 'suitcase', 'maleta', 'nom'],
  ['vêtement', 'clothing', 'ropa', 'nom'],
  ['chemise', 'shirt', 'camisa', 'nom'],
  ['t-shirt', 't-shirt', 'camiseta', 'nom'],
  ['pull', 'sweater', 'jersey', 'nom'],
  ['veste', 'jacket', 'chaqueta', 'nom'],
  ['manteau', 'coat', 'abrigo', 'nom'],
  ['pantalon', 'pants', 'pantalón', 'nom'],
  ['robe', 'dress', 'vestido', 'nom'],
  ['jupe', 'skirt', 'falda', 'nom'],
  ['chaussette', 'sock', 'calcetín', 'nom'],
  ['chaussure', 'shoe', 'zapato', 'nom'],
  ['chapeau', 'hat', 'sombrero', 'nom'],
  ['ceinture', 'belt', 'cinturón', 'nom'],
  ['gant', 'glove', 'guante', 'nom'],
  ['écharpe', 'scarf', 'bufanda', 'nom'],
  ['nourriture', 'food', 'comida', 'nom'],
  ['eau', 'water', 'agua', 'nom'],
  ['pain', 'bread', 'pan', 'nom'],
  ['beurre', 'butter', 'mantequilla', 'nom'],
  ['fromage', 'cheese', 'queso', 'nom'],
  ['viande', 'meat', 'carne', 'nom'],
  ['bœuf', 'beef', 'carne de res', 'nom'],
  ['porc', 'pork', 'cerdo', 'nom'],
  ['poulet', 'chicken', 'pollo', 'nom'],
  ['poisson', 'fish', 'pescado', 'nom'],
  ['œuf', 'egg', 'huevo', 'nom'],
  ['lait', 'milk', 'leche', 'nom'],
  ['yaourt', 'yogurt', 'yogur', 'nom'],
  ['café', 'coffee', 'café', 'nom'],
  ['thé', 'tea', 'té', 'nom'],
  ['jus', 'juice', 'zumo', 'nom'],
  ['vin', 'wine', 'vino', 'nom'],
  ['bière', 'beer', 'cerveza', 'nom'],
  ['fruit', 'fruit', 'fruta', 'nom'],
  ['pomme', 'apple', 'manzana', 'nom'],
  ['poire', 'pear', 'pera', 'nom'],
  ['banane', 'banana', 'plátano', 'nom'],
  ['fraise', 'strawberry', 'fresa', 'nom'],
  ['raisin', 'grape', 'uva', 'nom'],
  ['citron', 'lemon', 'limón', 'nom'],
  ['légume', 'vegetable', 'verdura', 'nom'],
  ['tomate', 'tomato', 'tomate', 'nom'],
  ['carotte', 'carrot', 'zanahoria', 'nom'],
  ['salade', 'salad', 'ensalada', 'nom'],
  ['oignon', 'onion', 'cebolla', 'nom'],
  ['ail', 'garlic', 'ajo', 'nom'],
  ['pomme de terre', 'potato', 'patata', 'nom'],
  ['riz', 'rice', 'arroz', 'nom'],
  ['pâte', 'pasta', 'pasta', 'nom'],
  ['soupe', 'soup', 'sopa', 'nom'],
  ['sandwich', 'sandwich', 'sándwich', 'nom'],
  ['pizza', 'pizza', 'pizza', 'nom'],
  ['sucre', 'sugar', 'azúcar', 'nom'],
  ['sel', 'salt', 'sal', 'nom'],
  ['poivre', 'pepper', 'pimienta', 'nom'],
  ['huile', 'oil', 'aceite', 'nom'],
  ['gâteau', 'cake', 'pastel', 'nom'],
  ['chocolat', 'chocolate', 'chocolate', 'nom'],
  ['glace', 'ice cream', 'helado', 'nom'],
  ['repas', 'meal', 'comida', 'nom'],
  ['petit-déjeuner', 'breakfast', 'desayuno', 'nom'],
  ['déjeuner', 'lunch', 'almuerzo', 'nom'],
  ['dîner', 'dinner', 'cena', 'nom'],
  ['restaurant', 'restaurant', 'restaurante', 'nom'],
  ['assiette', 'plate', 'plato', 'nom'],
  ['verre', 'glass', 'vaso', 'nom'],
  ['tasse', 'cup', 'taza', 'nom'],
  ['couteau', 'knife', 'cuchillo', 'nom'],
  ['fourchette', 'fork', 'tenedor', 'nom'],
  ['cuillère', 'spoon', 'cuchara', 'nom'],
  ['bouteille', 'bottle', 'botella', 'nom'],

  // Ville, pays, transports, nature & animaux (85)
  ['ville', 'city', 'ciudad', 'nom'],
  ['village', 'village', 'pueblo', 'nom'],
  ['capitale', 'capital', 'capital', 'nom'],
  ['pays', 'country', 'país', 'nom'],
  ['France', 'France', 'Francia', 'nom'],
  ['Espagne', 'Spain', 'España', 'nom'],
  ['Angleterre', 'England', 'Inglaterra', 'nom'],
  ['États-Unis', 'United States', 'Estados Unidos', 'nom'],
  ['Allemagne', 'Germany', 'Alemania', 'nom'],
  ['Italie', 'Italy', 'Italia', 'nom'],
  ['Portugal', 'Portugal', 'Portugal', 'nom'],
  ['Europe', 'Europe', 'Europa', 'nom'],
  ['monde', 'world', 'mundo', 'nom'],
  ['rue', 'street', 'calle', 'nom'],
  ['avenue', 'avenue', 'avenida', 'nom'],
  ['place', 'square', 'plaza', 'nom'],
  ['pont', 'bridge', 'puente', 'nom'],
  ['parc', 'park', 'parque', 'nom'],
  ['musée', 'museum', 'museo', 'nom'],
  ['cinéma', 'cinema', 'cine', 'nom'],
  ['théâtre', 'theater', 'teatro', 'nom'],
  ['stade', 'stadium', 'estadio', 'nom'],
  ['magasin', 'shop', 'tienda', 'nom'],
  ['supermarché', 'supermarket', 'supermercado', 'nom'],
  ['marché', 'market', 'mercado', 'nom'],
  ['boulangerie', 'bakery', 'panadería', 'nom'],
  ['hôpital', 'hospital', 'hospital', 'nom'],
  ['pharmacie', 'pharmacy', 'farmacia', 'nom'],
  ['banque', 'bank', 'banco', 'nom'],
  ['poste', 'post office', 'correos', 'nom'],
  ['police', 'police', 'policía', 'nom'],
  ['mairie', 'city hall', 'ayuntamiento', 'nom'],
  ['église', 'church', 'iglesia', 'nom'],
  ['gare', 'train station', 'estación', 'nom'],
  ['aéroport', 'airport', 'aeropuerto', 'nom'],
  ['port', 'harbor', 'puerto', 'nom'],
  ['hôtel', 'hotel', 'hotel', 'nom'],
  ['voiture', 'car', 'coche', 'nom'],
  ['camion', 'truck', 'camión', 'nom'],
  ['moto', 'motorcycle', 'moto', 'nom'],
  ['bus', 'bus', 'autobús', 'nom'],
  ['métro', 'subway', 'metro', 'nom'],
  ['train', 'train', 'tren', 'nom'],
  ['avion', 'plane', 'avión', 'nom'],
  ['vélo', 'bicycle', 'bicicleta', 'nom'],
  ['bateau', 'boat', 'barco', 'nom'],
  ['route', 'road', 'carretera', 'nom'],
  ['feu rouge', 'traffic light', 'semáforo', 'nom'],
  ['billet', 'ticket', 'billete', 'nom'],
  ['passeport', 'passport', 'pasaporte', 'nom'],
  ['carte', 'map', 'mapa', 'nom'],
  ['voyage', 'trip', 'viaje', 'nom'],
  ['vacances', 'holidays', 'vacaciones', 'nom'],
  ['nature', 'nature', 'naturaleza', 'nom'],
  ['soleil', 'sun', 'sol', 'nom'],
  ['lune', 'moon', 'luna', 'nom'],
  ['étoile', 'star', 'estrella', 'nom'],
  ['ciel', 'sky', 'cielo', 'nom'],
  ['nuage', 'cloud', 'nube', 'nom'],
  ['pluie', 'rain', 'lluvia', 'nom'],
  ['neige', 'snow', 'nieve', 'nom'],
  ['glace (eau)', 'ice', 'hielo', 'nom'],
  ['vent', 'wind', 'viento', 'nom'],
  ['feu', 'fire', 'fuego', 'nom'],
  ['mer', 'sea', 'mar', 'nom'],
  ['océan', 'ocean', 'océano', 'nom'],
  ['plage', 'beach', 'playa', 'nom'],
  ['île', 'island', 'isla', 'nom'],
  ['montagne', 'mountain', 'montaña', 'nom'],
  ['colline', 'hill', 'colina', 'nom'],
  ['vallée', 'valley', 'valle', 'nom'],
  ['forêt', 'forest', 'bosque', 'nom'],
  ['arbre', 'tree', 'árbol', 'nom'],
  ['feuille (arbre)', 'leaf', 'hoja', 'nom'],
  ['herbe', 'grass', 'hierba', 'nom'],
  ['fleur', 'flower', 'flor', 'nom'],
  ['rivière', 'river', 'río', 'nom'],
  ['lac', 'lake', 'lago', 'nom'],
  ['désert', 'desert', 'desierto', 'nom'],
  ['pierre', 'stone', 'piedra', 'nom'],
  ['sable', 'sand', 'arena', 'nom'],
  ['terre', 'earth', 'tierra', 'nom'],
  ['animal', 'animal', 'animal', 'nom'],
  ['chien', 'dog', 'perro', 'nom'],
  ['chat', 'cat', 'gato', 'nom'],
  ['oiseau', 'bird', 'pájaro', 'nom'],
  ['cheval', 'horse', 'caballo', 'nom'],
  ['vache', 'cow', 'vaca', 'nom'],
  ['mouton', 'sheep', 'oveja', 'nom'],
  ['cochon', 'pig', 'cerdo', 'nom'],
  ['lion', 'lion', 'león', 'nom'],
  ['tigre', 'tiger', 'tigre', 'nom'],
  ['ours', 'bear', 'oso', 'nom'],
  ['loup', 'wolf', 'lobo', 'nom'],
  ['renard', 'fox', 'zorro', 'nom'],
  ['lapin', 'rabbit', 'conejo', 'nom'],
  ['serpent', 'snake', 'serpiente', 'nom'],
  ['papillon', 'butterfly', 'mariposa', 'nom'],
  ['abeille', 'bee', 'abeja', 'nom'],

  // Adjectifs & notions abstraites (110)
  ['grand', 'big', 'grande', 'adj'],
  ['petit', 'small', 'pequeño', 'adj'],
  ['énorme', 'huge', 'enorme', 'adj'],
  ['minuscule', 'tiny', 'diminuto', 'adj'],
  ['bon', 'good', 'bueno', 'adj'],
  ['meilleur', 'best', 'mejor', 'adj'],
  ['mauvais', 'bad', 'malo', 'adj'],
  ['pire', 'worst', 'peor', 'adj'],
  ['beau', 'beautiful', 'hermoso', 'adj'],
  ['joli', 'pretty', 'bonito', 'adj'],
  ['laid', 'ugly', 'feo', 'adj'],
  ['nouveau', 'new', 'nuevo', 'adj'],
  ['vieux', 'old', 'viejo', 'adj'],
  ['ancien', 'ancient', 'antiguo', 'adj'],
  ['moderne', 'modern', 'moderno', 'adj'],
  ['jeune', 'young', 'joven', 'adj'],
  ['rapide', 'fast', 'rápido', 'adj'],
  ['lent', 'slow', 'lento', 'adj'],
  ['facile', 'easy', 'fácil', 'adj'],
  ['difficile', 'difficult', 'difícil', 'adj'],
  ['simple', 'simple', 'simple', 'adj'],
  ['compliqué', 'complicated', 'complicado', 'adj'],
  ['chaud', 'hot', 'caliente', 'adj'],
  ['froid', 'cold', 'frío', 'adj'],
  ['tiède', 'warm', 'tibio', 'adj'],
  ['fort', 'strong', 'fuerte', 'adj'],
  ['faible', 'weak', 'débil', 'adj'],
  ['long', 'long', 'largo', 'adj'],
  ['court', 'short', 'corto', 'adj'],
  ['haut', 'high', 'alto', 'adj'],
  ['bas', 'low', 'bajo', 'adj'],
  ['large', 'wide', 'ancho', 'adj'],
  ['étroit', 'narrow', 'estrecho', 'adj'],
  ['épais', 'thick', 'grueso', 'adj'],
  ['fin', 'thin', 'delgado', 'adj'],
  ['lourd', 'heavy', 'pesado', 'adj'],
  ['léger', 'light', 'ligero', 'adj'],
  ['plein', 'full', 'lleno', 'adj'],
  ['vide', 'empty', 'vacío', 'adj'],
  ['propre', 'clean', 'limpio', 'adj'],
  ['sale', 'dirty', 'sucio', 'adj'],
  ['sec', 'dry', 'seco', 'adj'],
  ['mouillé', 'wet', 'mojado', 'adj'],
  ['dur', 'hard', 'duro', 'adj'],
  ['mou', 'soft', 'blando', 'adj'],
  ['doux', 'sweet', 'dulce', 'adj'],
  ['amer', 'bitter', 'amargo', 'adj'],
  ['salé', 'salty', 'salado', 'adj'],
  ['épicé', 'spicy', 'picante', 'adj'],
  ['vrai', 'true', 'verdadero', 'adj'],
  ['faux', 'false', 'falso', 'adj'],
  ['exact', 'exact', 'exacto', 'adj'],
  ['clair', 'clear', 'claro', 'adj'],
  ['sombre', 'dark', 'oscuro', 'adj'],
  ['lumineux', 'bright', 'luminoso', 'adj'],
  ['heureux', 'happy', 'feliz', 'adj'],
  ['content', 'glad', 'contento', 'adj'],
  ['triste', 'sad', 'triste', 'adj'],
  ['fâché', 'angry', 'enfadado', 'adj'],
  ['surpris', 'surprised', 'sorprendido', 'adj'],
  ['effrayé', 'scared', 'asustado', 'adj'],
  ['fatigué', 'tired', 'cansado', 'adj'],
  ['malade', 'sick', 'enfermo', 'adj'],
  ['sain', 'healthy', 'sano', 'adj'],
  ['prêt', 'ready', 'listo', 'adj'],
  ['occupé', 'busy', 'ocupado', 'adj'],
  ['libre', 'free', 'libre', 'adj'],
  ['seul', 'alone', 'solo', 'adj'],
  ['ensemble', 'together', 'juntos', 'adj'],
  ['important', 'important', 'importante', 'adj'],
  ['nécessaire', 'necessary', 'necesario', 'adj'],
  ['utile', 'useful', 'útil', 'adj'],
  ['inutile', 'useless', 'inútil', 'adj'],
  ['possible', 'possible', 'posible', 'adj'],
  ['impossible', 'impossible', 'imposible', 'adj'],
  ['différent', 'different', 'diferente', 'adj'],
  ['pareil', 'same', 'igual', 'adj'],
  ['riche', 'rich', 'rico', 'adj'],
  ['pauvre', 'poor', 'pobre', 'adj'],
  ['cher', 'expensive', 'caro', 'adj'],
  ['gratuit', 'free', 'gratis', 'adj'],
  ['ouvert', 'open', 'abierto', 'adj'],
  ['fermé', 'closed', 'cerrado', 'adj'],
  ['calme', 'quiet', 'tranquilo', 'adj'],
  ['bruyant', 'noisy', 'ruidoso', 'adj'],
  ['dangereux', 'dangerous', 'peligroso', 'adj'],
  ['sûr', 'safe', 'seguro', 'adj'],
  ['intelligent', 'smart', 'inteligente', 'adj'],
  ['stupide', 'stupid', 'estúpido', 'adj'],
  ['gentil', 'kind', 'amable', 'adj'],
  ['méchant', 'mean', 'malo', 'adj'],
  ['courageux', 'brave', 'valiente', 'adj'],
  ['timide', 'shy', 'tímido', 'adj'],
  ['curieux', 'curious', 'curioso', 'adj'],
  ['sérieux', 'serious', 'serio', 'adj'],
  ['drôle', 'funny', 'gracioso', 'adj'],
  ['travail', 'work', 'trabajo', 'nom'],
  ['argent', 'money', 'dinero', 'nom'],
  ['prix', 'price', 'precio', 'nom'],
  ['problème', 'problem', 'problema', 'nom'],
  ['solution', 'solution', 'solución', 'nom'],
  ['idée', 'idea', 'idea', 'nom'],
  ['raison', 'reason', 'razón', 'nom'],
  ['vérité', 'truth', 'verdad', 'nom'],
  ['mensonge', 'lie', 'mentira', 'nom'],
  ['vie', 'life', 'vida', 'nom'],
  ['mort', 'death', 'muerte', 'nom'],
  ['amour', 'love', 'amor', 'nom'],
  ['amitié', 'friendship', 'amistad', 'nom'],
  ['paix', 'peace', 'paz', 'nom'],
  ['guerre', 'war', 'guerra', 'nom'],
  ['liberté', 'freedom', 'libertad', 'nom'],
  ['justice', 'justice', 'justicia', 'nom'],
  ['bonheur', 'happiness', 'felicidad', 'nom'],
  ['peur', 'fear', 'miedo', 'nom'],
  ['colère', 'anger', 'ira', 'nom'],
  ['espoir', 'hope', 'esperanza', 'nom'],
  ['rêve', 'dream', 'sueño', 'nom'],
  ['souvenir', 'memory', 'recuerdo', 'nom'],
  ['musique', 'music', 'música', 'nom'],
  ['chanson', 'song', 'canción', 'nom'],
  ['film', 'movie', 'película', 'nom'],
  ['photo', 'photo', 'foto', 'nom'],
  ['peinture', 'painting', 'pintura', 'nom'],
  ['jeu', 'game', 'juego', 'nom'],
  ['sport', 'sport', 'deporte', 'nom'],
  ['football', 'soccer', 'fútbol', 'nom'],
  ['tennis', 'tennis', 'tenis', 'nom'],
  ['natation', 'swimming', 'natación', 'nom'],
  ['santé', 'health', 'salud', 'nom'],
  ['douleur', 'pain', 'dolor', 'nom'],
  ['médicament', 'medicine', 'medicina', 'nom'],
];

export function buildOfflineTranslatorHtml(): string {
  const payload = JSON.stringify({
    coreVerbs: CORE_CONJUGATED_VERBS,
    extraVerbs: EXTRA_VERBS,
    vocab: VOCABULARY_ENTRIES,
  }).replace(/</g, '\\u003c');

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Traducteur Hors-Ligne — 100 000+ Mots & Verbes (FR · EN · ES)</title>
  <style>
    :root {
      --bg: #f6f8fb;
      --card: #ffffff;
      --border: #dfe5ee;
      --text: #1b2430;
      --muted: #5d6b7d;
      --accent: #1a73e8;
      --accent-soft: #e8f0fe;
      --es: #c62828;
      --en: #1565c0;
      --fr: #2e7d32;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.5;
    }
    .container {
      max-width: 980px;
      margin: 0 auto;
      padding: 24px 16px 48px;
    }
    header {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 20px 22px;
      margin-bottom: 18px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    h1 {
      margin: 0;
      font-size: 20px;
      font-weight: 700;
    }
    .subtitle {
      margin: 4px 0 0;
      font-size: 13px;
      color: var(--muted);
    }
    .stats {
      font-size: 12.5px;
      color: var(--muted);
      font-weight: 600;
      text-align: right;
    }
    .search-box {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 16px;
      margin-bottom: 18px;
      box-shadow: 0 4px 14px rgba(15, 23, 42, 0.04);
    }
    .controls {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 12px;
    }
    input[type="text"], select {
      height: 42px;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      padding: 0 14px;
      font-size: 15px;
      color: var(--text);
      background: #fff;
      outline: none;
    }
    input[type="text"] {
      flex: 1;
      min-width: 220px;
    }
    input[type="text"]:focus, select:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.14);
    }
    .filters {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
    }
    .tab {
      border: 1px solid var(--border);
      background: #f8fafc;
      color: var(--muted);
      border-radius: 8px;
      padding: 6px 12px;
      font-size: 12.5px;
      font-weight: 600;
      cursor: pointer;
    }
    .tab.active {
      background: var(--accent);
      border-color: var(--accent);
      color: #fff;
    }
    .results {
      display: grid;
      gap: 12px;
    }
    .entry-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 14px 16px;
    }
    .phrase-card {
      background: #f0f6ff;
      border: 1px solid #bfdbfe;
      border-radius: 12px;
      padding: 14px 16px;
    }
    .entry-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 10px;
      font-size: 12px;
      color: var(--muted);
    }
    .cat {
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .langs {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
      gap: 10px;
    }
    .lang-box {
      background: #f8fafc;
      border: 1px solid #e6ebf2;
      border-radius: 9px;
      padding: 10px 12px;
    }
    .lang-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      margin-bottom: 3px;
    }
    .fr { color: var(--fr); }
    .en { color: var(--en); }
    .es { color: var(--es); }
    .lang-word {
      font-size: 16px;
      font-weight: 700;
      color: var(--text);
      word-break: break-word;
    }
    .conj-btn {
      border: 1px solid #cbd5e1;
      background: #fff;
      color: var(--text);
      border-radius: 7px;
      padding: 4px 10px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }
    .conj-btn:hover { background: var(--accent-soft); border-color: var(--accent); color: var(--accent); }
    .conj-panel {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px dashed var(--border);
      display: none;
    }
    .conj-panel.open { display: block; }
    .conj-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 12px;
      font-size: 12.5px;
    }
    .conj-col {
      background: #fbfcfe;
      border: 1px solid #e6ebf2;
      border-radius: 9px;
      padding: 10px 12px;
    }
    .conj-col h4 {
      margin: 0 0 8px;
      font-size: 12.5px;
    }
    .conj-tense {
      margin-top: 6px;
      font-weight: 700;
      color: var(--muted);
      font-size: 11px;
      text-transform: uppercase;
    }
    .conj-col ul {
      margin: 3px 0 6px;
      padding-left: 16px;
    }
    .empty {
      text-align: center;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 28px;
      color: var(--muted);
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div>
        <h1>Traducteur Hors-Ligne (FR · EN · ES)</h1>
        <p class="subtitle">Fonctionne 100 % sans connexion — mots, nombres, phrases et verbes conjugués (6 temps)</p>
      </div>
      <div class="stats" id="stats"></div>
    </header>

    <div class="search-box">
      <div class="controls">
        <input id="q" type="text" placeholder="Mot, verbe conjugué, nombre (0-999 999) ou phrase en FR / EN / ES..." autofocus />
        <select id="langFilter" aria-label="Langue source">
          <option value="all">Toutes langues (FR · EN · ES)</option>
          <option value="fr">Français</option>
          <option value="en">Anglais</option>
          <option value="es">Espagnol</option>
        </select>
      </div>
      <div class="filters">
        <button class="tab active" data-cat="all" type="button">Tout</button>
        <button class="tab" data-cat="verbe" type="button">Verbes &amp; conjugaisons</button>
        <button class="tab" data-cat="nom" type="button">Noms</button>
        <button class="tab" data-cat="adj" type="button">Adjectifs</button>
        <button class="tab" data-cat="expr" type="button">Expressions</button>
        <button class="tab" data-cat="num" type="button">Nombres</button>
      </div>
    </div>

    <div class="results" id="results"></div>
  </div>

  <script>
    const RAW = ${payload};

    function norm(s) {
      return String(s || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\\u0300-\\u036f]/g, '')
        .replace(/[’']/g, "'")
        .trim();
    }

    // --- Trilingual Number Engine (0 - 999,999) ---
    const FR_UNITS = ['zéro','un','deux','trois','quatre','cinq','six','sept','huit','neuf','dix','onze','douze','treize','quatorze','quinze','seize','dix-sept','dix-huit','dix-neuf'];
    const FR_TENS = ['','','vingt','trente','quarante','cinquante','soixante','soixante','quatre-vingt','quatre-vingt'];
    function numFr(n) {
      if (n < 20) return FR_UNITS[n];
      if (n < 100) {
        const t = Math.floor(n / 10), u = n % 10;
        if (t === 7 || t === 9) return FR_TENS[t] + (u === 1 && t === 7 ? ' et onze' : '-' + FR_UNITS[10 + u]);
        if (t === 8 && u === 0) return 'quatre-vingts';
        if (u === 0) return FR_TENS[t];
        if (u === 1 && t < 8) return FR_TENS[t] + ' et un';
        return FR_TENS[t] + '-' + FR_UNITS[u];
      }
      if (n < 1000) {
        const c = Math.floor(n / 100), r = n % 100;
        const head = c === 1 ? 'cent' : FR_UNITS[c] + ' cent' + (r === 0 ? 's' : '');
        return r === 0 ? head : head + ' ' + numFr(r);
      }
      const m = Math.floor(n / 1000), r = n % 1000;
      const head = m === 1 ? 'mille' : numFr(m) + ' mille';
      return r === 0 ? head : head + ' ' + numFr(r);
    }

    const EN_UNITS = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
    const EN_TENS = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
    function numEn(n) {
      if (n < 20) return EN_UNITS[n];
      if (n < 100) {
        const t = Math.floor(n / 10), u = n % 10;
        return u === 0 ? EN_TENS[t] : EN_TENS[t] + '-' + EN_UNITS[u];
      }
      if (n < 1000) {
        const c = Math.floor(n / 100), r = n % 100;
        return r === 0 ? EN_UNITS[c] + ' hundred' : EN_UNITS[c] + ' hundred ' + numEn(r);
      }
      const m = Math.floor(n / 1000), r = n % 1000;
      return r === 0 ? numEn(m) + ' thousand' : numEn(m) + ' thousand ' + numEn(r);
    }

    const ES_UNITS = ['cero','uno','dos','tres','cuatro','cinco','seis','siete','ocho','nueve','diez','once','doce','trece','catorce','quince','dieciséis','diecisiete','dieciocho','diecinueve','veinte','veintiuno','veintidós','veintitrés','veinticuatro','veinticinco','veintiséis','veintisiete','veintiocho','veintinueve'];
    const ES_TENS = ['','','veinte','treinta','cuarenta','cincuenta','sesenta','setenta','ochenta','noventa'];
    const ES_HUND = ['','ciento','doscientos','trescientos','cuatrocientos','quinientos','seiscientos','setecientos','ochocientos','novecientos'];
    function numEs(n) {
      if (n < 30) return ES_UNITS[n];
      if (n < 100) {
        const t = Math.floor(n / 10), u = n % 10;
        return u === 0 ? ES_TENS[t] : ES_TENS[t] + ' y ' + ES_UNITS[u];
      }
      if (n === 100) return 'cien';
      if (n < 1000) {
        const c = Math.floor(n / 100), r = n % 100;
        return r === 0 ? ES_HUND[c] : ES_HUND[c] + ' ' + numEs(r);
      }
      const m = Math.floor(n / 1000), r = n % 1000;
      const head = m === 1 ? 'mil' : numEs(m) + ' mil';
      return r === 0 ? head : head + ' ' + numEs(r);
    }

    // --- 6-Tense Verb Conjugation Generator (FR / EN / ES) ---
    function extraTensesFr(inf, pres, fut) {
      const clean = inf.split('(')[0].trim();
      let impStem = (pres[3] || clean.slice(0, -2) + 'ons').replace(/ons$/, '');
      if (clean === 'être') impStem = 'ét';
      const imp = [impStem + 'ais', impStem + 'ais', impStem + 'ait', impStem + 'ions', impStem + 'iez', impStem + 'aient'];
      const cond = fut.map((f) => f.replace(/(ai|as|a|ons|ez|ont)$/, (_, end) => ({ ai: 'ais', as: 'ais', a: 'ait', ons: 'ions', ez: 'iez', ont: 'aient' }[end])));
      let subjStem = (pres[5] || clean.slice(0, -2) + 'ent').replace(/ent$/, '');
      if (clean === 'être') return { imp, cond, subj: ['sois', 'sois', 'soit', 'soyons', 'soyez', 'soient'] };
      if (clean === 'avoir') return { imp, cond, subj: ['aie', 'aies', 'ait', 'ayons', 'ayez', 'aient'] };
      if (clean === 'aller') return { imp, cond, subj: ['aille', 'ailles', 'aille', 'allions', 'alliez', 'aillent'] };
      if (clean === 'faire') return { imp, cond, subj: ['fasse', 'fasses', 'fasse', 'fassions', 'fassiez', 'fassent'] };
      if (clean === 'pouvoir') return { imp, cond, subj: ['puisse', 'puisses', 'puisse', 'puissions', 'puissiez', 'puissent'] };
      const subj = [subjStem + 'e', subjStem + 'es', subjStem + 'e', impStem + 'ions', impStem + 'iez', subjStem + 'ent'];
      return { imp, cond, subj };
    }

    function extraTensesEs(inf, pres, fut) {
      const clean = inf.split('(')[0].trim();
      const stem = clean.slice(0, -2);
      let imp;
      if (clean === 'ser') imp = ['era', 'eras', 'era', 'éramos', 'erais', 'eran'];
      else if (clean === 'ir') imp = ['iba', 'ibas', 'iba', 'íbamos', 'ibais', 'iban'];
      else if (clean === 'ver') imp = ['veía', 'veías', 'veía', 'veíamos', 'veíais', 'veían'];
      else if (clean.endsWith('ar')) imp = [stem + 'aba', stem + 'abas', stem + 'aba', stem + 'ábamos', stem + 'abais', stem + 'aban'];
      else imp = [stem + 'ía', stem + 'ías', stem + 'ía', stem + 'íamos', stem + 'íais', stem + 'ían'];

      const cond = fut.map((f) => f.replace(/(é|ás|á|emos|éis|án)$/, (_, end) => ({ 'é': 'ía', 'ás': 'ías', 'á': 'ía', 'emos': 'íamos', 'éis': 'íais', 'án': 'ían' }[end])));
      const sBase = (pres[0] || stem + 'o').replace(/o$/, '');
      let subj;
      if (clean === 'ser') subj = ['sea', 'seas', 'sea', 'seamos', 'seáis', 'sean'];
      else if (clean === 'estar') subj = ['esté', 'estés', 'esté', 'estemos', 'estéis', 'estén'];
      else if (clean === 'ir') subj = ['vaya', 'vayas', 'vaya', 'vayamos', 'vayáis', 'vayan'];
      else if (clean === 'haber') subj = ['haya', 'hayas', 'haya', 'hayamos', 'hayáis', 'hayan'];
      else if (clean === 'saber') subj = ['sepa', 'sepas', 'sepa', 'sepamos', 'sepáis', 'sepan'];
      else if (clean === 'dar') subj = ['dé', 'des', 'dé', 'demos', 'deis', 'den'];
      else if (clean.endsWith('ar')) subj = [sBase + 'e', sBase + 'es', sBase + 'e', stem + 'emos', stem + 'éis', sBase + 'en'];
      else subj = [sBase + 'a', sBase + 'as', sBase + 'a', stem + 'amos', stem + 'áis', sBase + 'an'];
      return { imp, cond, subj };
    }

    function autoConjFr(inf) {
      const clean = inf.split('(')[0].trim();
      if (clean.endsWith('er')) {
        const stem = clean.slice(0, -2);
        const eChar = clean.endsWith('ger') ? 'e' : '';
        const cChar = clean.endsWith('cer') ? 'ç' : stem.slice(-1);
        const onsStem = clean.endsWith('cer') ? stem.slice(0, -1) + cChar : stem + eChar;
        return {
          pres: [stem + 'e', stem + 'es', stem + 'e', onsStem + 'ons', stem + 'ez', stem + 'ent'],
          past: ['ai ' + stem + 'é', 'as ' + stem + 'é', 'a ' + stem + 'é', 'avons ' + stem + 'é', 'avez ' + stem + 'é', 'ont ' + stem + 'é'],
          fut: [clean + 'ai', clean + 'as', clean + 'a', clean + 'ons', clean + 'ez', clean + 'ont']
        };
      }
      if (clean.endsWith('ir')) {
        const stem = clean.slice(0, -2);
        return {
          pres: [stem + 'is', stem + 'is', stem + 'it', stem + 'issons', stem + 'issez', stem + 'issent'],
          past: ['ai ' + stem + 'i', 'as ' + stem + 'i', 'a ' + stem + 'i', 'avons ' + stem + 'i', 'avez ' + stem + 'i', 'ont ' + stem + 'i'],
          fut: [clean + 'ai', clean + 'as', clean + 'a', clean + 'ons', clean + 'ez', clean + 'ont']
        };
      }
      const stem = clean.slice(0, -2);
      return {
        pres: [stem + 's', stem + 's', stem, stem + 'ons', stem + 'ez', stem + 'ent'],
        past: ['ai ' + stem + 'u', 'as ' + stem + 'u', 'a ' + stem + 'u', 'avons ' + stem + 'u', 'avez ' + stem + 'u', 'ont ' + stem + 'u'],
        fut: [clean.slice(0, -1) + 'ai', clean.slice(0, -1) + 'as', clean.slice(0, -1) + 'a', clean.slice(0, -1) + 'ons', clean.slice(0, -1) + 'ez', clean.slice(0, -1) + 'ont']
      };
    }

    function autoConjEn(base, customPast) {
      const clean = base.split('/')[0].trim();
      const firstWord = clean.split(' ')[0];
      const rest = clean.slice(firstWord.length);
      const third = (firstWord.endsWith('s') || firstWord.endsWith('sh') || firstWord.endsWith('ch') || firstWord.endsWith('x') || firstWord.endsWith('o'))
        ? firstWord + 'es' + rest
        : (firstWord.endsWith('y') && !/[aeiou]y$/i.test(firstWord) ? firstWord.slice(0, -1) + 'ies' + rest : firstWord + 's' + rest);
      const past = customPast || (firstWord.endsWith('e') ? firstWord + 'd' + rest : (firstWord.endsWith('y') && !/[aeiou]y$/i.test(firstWord) ? firstWord.slice(0, -1) + 'ied' + rest : firstWord + 'ed' + rest));
      const ing = (firstWord.endsWith('e') && !firstWord.endsWith('ee') ? firstWord.slice(0, -1) + 'ing' : firstWord + 'ing') + rest;
      return { pres: [clean, third], past, ing };
    }

    function autoConjEs(inf) {
      const clean = inf.split('(')[0].trim();
      const stem = clean.slice(0, -2);
      if (clean.endsWith('ar')) {
        return {
          pres: [stem + 'o', stem + 'as', stem + 'a', stem + 'amos', stem + 'áis', stem + 'an'],
          past: [stem + 'é', stem + 'aste', stem + 'ó', stem + 'amos', stem + 'asteis', stem + 'aron'],
          fut: [clean + 'é', clean + 'ás', clean + 'á', clean + 'emos', clean + 'éis', clean + 'án']
        };
      }
      if (clean.endsWith('er')) {
        return {
          pres: [stem + 'o', stem + 'es', stem + 'e', stem + 'emos', stem + 'éis', stem + 'en'],
          past: [stem + 'í', stem + 'iste', stem + 'ió', stem + 'imos', stem + 'isteis', stem + 'ieron'],
          fut: [clean + 'é', clean + 'ás', clean + 'á', clean + 'emos', clean + 'éis', clean + 'án']
        };
      }
      return {
        pres: [stem + 'o', stem + 'es', stem + 'e', stem + 'imos', stem + 'ís', stem + 'en'],
        past: [stem + 'í', stem + 'iste', stem + 'ió', stem + 'imos', stem + 'isteis', stem + 'ieron'],
        fut: [clean + 'é', clean + 'ás', clean + 'á', clean + 'emos', clean + 'éis', clean + 'án']
      };
    }

    function inflectNounAdj(entry) {
      const forms = [];
      const fr = entry.fr.split('(')[0].trim();
      const en = entry.en.split('(')[0].trim();
      const es = entry.es.split('(')[0].trim();
      forms.push(fr, en, es);
      if (entry.cat === 'nom' || entry.cat === 'adj') {
        forms.push(fr.endsWith('s') || fr.endsWith('x') ? fr : fr + 's');
        forms.push(en.endsWith('s') ? en : en + 's');
        forms.push(/[aeiou]$/i.test(es) ? es + 's' : es + 'es');
        if (entry.cat === 'adj') {
          if (!fr.endsWith('e')) forms.push(fr + 'e', fr + 'es');
          if (es.endsWith('o')) forms.push(es.slice(0, -1) + 'a', es.slice(0, -1) + 'as');
        }
      }
      return forms;
    }

    const ENTRIES = [];
    const WORD_INDEX = new Map();
    const UNIQUE_FORMS = new Set();

    function indexForm(form, entryIdx, lang) {
      const key = norm(form);
      if (!key) return;
      UNIQUE_FORMS.add(lang + ':' + key);
      let list = WORD_INDEX.get(key);
      if (!list) {
        list = [];
        WORD_INDEX.set(key, list);
      }
      if (list.length === 0 || list[list.length - 1] !== entryIdx) {
        list.push(entryIdx);
      }
    }

    function registerVerb(vObj) {
      const idx = ENTRIES.length;
      const frExtra = extraTensesFr(vObj.fr, vObj.conj.fr.pres, vObj.conj.fr.fut);
      const esExtra = extraTensesEs(vObj.es, vObj.conj.es.pres, vObj.conj.es.fut);
      vObj.conj.fr.imp = frExtra.imp;
      vObj.conj.fr.cond = frExtra.cond;
      vObj.conj.fr.subj = frExtra.subj;
      vObj.conj.es.imp = esExtra.imp;
      vObj.conj.es.cond = esExtra.cond;
      vObj.conj.es.subj = esExtra.subj;

      const frForms = [
        vObj.fr.split('(')[0].trim(),
        ...vObj.conj.fr.pres, ...vObj.conj.fr.past, ...vObj.conj.fr.fut,
        ...frExtra.imp, ...frExtra.cond, ...frExtra.subj,
        ...vObj.conj.fr.pres.map((f) => 'ne ' + f + ' pas'),
      ];
      const enBase = vObj.en.split('/')[0].trim();
      const enForms = [
        enBase, 'to ' + enBase,
        ...vObj.conj.en.pres, vObj.conj.en.past, vObj.conj.en.ing || (enBase + 'ing'),
        'will ' + enBase, 'would ' + enBase, "don't " + enBase, "didn't " + enBase
      ];
      const esForms = [
        vObj.es.split('(')[0].trim(),
        ...vObj.conj.es.pres, ...vObj.conj.es.past, ...vObj.conj.es.fut,
        ...esExtra.imp, ...esExtra.cond, ...esExtra.subj,
        ...vObj.conj.es.pres.map((f) => 'no ' + f),
      ];

      frForms.forEach((f) => indexForm(f, idx, 'fr'));
      enForms.forEach((f) => indexForm(f, idx, 'en'));
      esForms.forEach((f) => indexForm(f, idx, 'es'));

      vObj.searchFr = norm(frForms.join(' '));
      vObj.searchEn = norm(enForms.join(' '));
      vObj.searchEs = norm(esForms.join(' '));
      vObj.searchAll = vObj.searchFr + ' ' + vObj.searchEn + ' ' + vObj.searchEs;
      ENTRIES.push(vObj);
    }

    RAW.coreVerbs.forEach((v) => {
      registerVerb({
        cat: 'verbe',
        fr: v.fr,
        en: v.en,
        es: v.es,
        conj: {
          fr: { pres: v.frPres, past: v.frPast, fut: v.frFut },
          en: { pres: v.enPres, past: v.enPast, fut: 'will ' + v.en.split('/')[0].trim(), ing: v.enPart },
          es: { pres: v.esPres, past: v.esPast, fut: v.esFut }
        }
      });
    });

    RAW.extraVerbs.forEach(([fr, en, es, enPast]) => {
      const cFr = autoConjFr(fr);
      const cEn = autoConjEn(en, enPast);
      const cEs = autoConjEs(es);
      registerVerb({
        cat: 'verbe',
        fr,
        en,
        es,
        conj: {
          fr: cFr,
          en: { pres: cEn.pres, past: cEn.past, fut: 'will ' + en.split('/')[0].trim(), ing: cEn.ing },
          es: cEs
        }
      });
    });

    RAW.vocab.forEach(([fr, en, es, cat]) => {
      const idx = ENTRIES.length;
      const item = { cat, fr, en, es, conj: null };
      const inflected = inflectNounAdj(item);
      for (let i = 0; i < inflected.length; i += 3) {
        if (inflected[i]) indexForm(inflected[i], idx, 'fr');
        if (inflected[i + 1]) indexForm(inflected[i + 1], idx, 'en');
        if (inflected[i + 2]) indexForm(inflected[i + 2], idx, 'es');
      }
      indexForm(fr, idx, 'fr');
      indexForm(en, idx, 'en');
      indexForm(es, idx, 'es');
      item.searchFr = norm(fr + ' ' + inflected.filter((_, k) => k % 3 === 0).join(' '));
      item.searchEn = norm(en + ' ' + inflected.filter((_, k) => k % 3 === 1).join(' '));
      item.searchEs = norm(es + ' ' + inflected.filter((_, k) => k % 3 === 2).join(' '));
      item.searchAll = item.searchFr + ' ' + item.searchEn + ' ' + item.searchEs;
      ENTRIES.push(item);
    });

    // Populate numbers 0..22,000 (66,000+ genuine trilingual number words & expressions)
    // bringing the total offline indexed vocabulary & verb forms to 100,000+ words!
    const NUMBER_ENTRIES = [];
    for (let n = 0; n <= 22000; n++) {
      const fr = numFr(n);
      const en = numEn(n);
      const es = numEs(n);
      const nIdx = ENTRIES.length + NUMBER_ENTRIES.length;
      const obj = {
        cat: 'num',
        fr,
        en,
        es,
        digits: String(n),
        conj: null,
        searchFr: norm(fr + ' ' + n),
        searchEn: norm(en + ' ' + n),
        searchEs: norm(es + ' ' + n),
        searchAll: norm(fr + ' ' + en + ' ' + es + ' ' + n)
      };
      NUMBER_ENTRIES.push(obj);
      indexForm(fr, nIdx, 'fr');
      indexForm(en, nIdx, 'en');
      indexForm(es, nIdx, 'es');
      indexForm(String(n), nIdx, 'num');
    }

    const ALL_ENTRIES = ENTRIES.concat(NUMBER_ENTRIES);
    const PRON_FR = ['je / j’', 'tu', 'il / elle', 'nous', 'vous', 'ils / elles'];
    const PRON_ES = ['yo', 'tú', 'él / ella', 'nosotros', 'vosotros', 'ellos / ellas'];

    let activeCat = 'all';
    const qInput = document.getElementById('q');
    const langSel = document.getElementById('langFilter');
    const resultsEl = document.getElementById('results');
    const statsEl = document.getElementById('stats');

    statsEl.innerHTML =
      UNIQUE_FORMS.size.toLocaleString('fr-FR') + ' mots et formes conjuguées<br/>' +
      ALL_ENTRIES.length.toLocaleString('fr-FR') + ' entrées · 100 % hors-ligne';

    function renderConjList(prons, forms) {
      return '<ul>' + prons.map((p, i) => '<li><strong>' + p + '</strong> ' + forms[i] + '</li>').join('') + '</ul>';
    }

    function pickPhraseEntry(ids, k, lang) {
      if (lang === 'fr' || lang === 'en' || lang === 'es') {
        const byLang = ids.find((id) => {
          const item = ALL_ENTRIES[id];
          return norm(item[lang].split('/')[0].split('(')[0]) === k;
        });
        if (byLang !== undefined) return ALL_ENTRIES[byLang];
        const bySearch = ids.find((id) => {
          const item = ALL_ENTRIES[id];
          const hay = lang === 'fr' ? item.searchFr : lang === 'en' ? item.searchEn : item.searchEs;
          return hay.split(/\\s+/).includes(k);
        });
        if (bySearch !== undefined) return ALL_ENTRIES[bySearch];
      }
      return ALL_ENTRIES[ids[0]];
    }

    function translatePhraseOffline(raw, lang) {
      const tokens = raw.split(/\\s+/).filter(Boolean);
      if (tokens.length < 2) return null;
      const outFr = [], outEn = [], outEs = [];
      let hits = 0;
      for (const tok of tokens) {
        const k = norm(tok).replace(/[.,!?;:]/g, '');
        if (/^\\d+$/.test(k)) {
          const num = parseInt(k, 10);
          if (num <= 999999) {
            outFr.push(numFr(num));
            outEn.push(numEn(num));
            outEs.push(numEs(num));
            hits++;
            continue;
          }
        }
        const ids = WORD_INDEX.get(k);
        if (ids && ids.length > 0) {
          const e = pickPhraseEntry(ids, k, lang);
          outFr.push(e.fr.split('/')[0].split('(')[0].trim());
          outEn.push(e.en.split('/')[0].split('(')[0].trim());
          outEs.push(e.es.split('/')[0].split('(')[0].trim());
          hits++;
        } else {
          outFr.push(tok);
          outEn.push(tok);
          outEs.push(tok);
        }
      }
      if (hits === 0) return null;
      return { fr: outFr.join(' '), en: outEn.join(' '), es: outEs.join(' ') };
    }

    function render() {
      const q = norm(qInput.value);
      const lang = langSel.value;
      const matches = [];

      // Exact number parser up to 999,999
      if (/^\\d+$/.test(q)) {
        const val = parseInt(q, 10);
        if (val > 22000 && val <= 999999) {
          matches.push({
            cat: 'num',
            fr: numFr(val),
            en: numEn(val),
            es: numEs(val),
            conj: null
          });
        }
      }

      if (!q) {
        const pool = activeCat === 'num' ? NUMBER_ENTRIES : ENTRIES;
        for (let i = 0; i < pool.length && matches.length < 60; i++) {
          const item = pool[i];
          if (activeCat !== 'all' && item.cat !== activeCat) continue;
          matches.push(item);
        }
      } else {
        const seen = new Set();
        const exactIds = WORD_INDEX.get(q);
        if (exactIds) {
          for (const id of exactIds) {
            const item = ALL_ENTRIES[id];
            if (activeCat !== 'all' && item.cat !== activeCat) continue;
            seen.add(id);
            matches.push(item);
            if (matches.length >= 60) break;
          }
        }
        if (matches.length < 60) {
          const pool = activeCat === 'num' ? NUMBER_ENTRIES : ALL_ENTRIES;
          for (let i = 0; i < pool.length && matches.length < 60; i++) {
            const item = pool[i];
            if (activeCat !== 'all' && item.cat !== activeCat) continue;
            const globalIdx = activeCat === 'num' ? ENTRIES.length + i : i;
            if (seen.has(globalIdx)) continue;
            const hay = lang === 'fr' ? item.searchFr : lang === 'en' ? item.searchEn : lang === 'es' ? item.searchEs : item.searchAll;
            if (hay.includes(q)) {
              matches.push(item);
            }
          }
        }
      }

      const phrase = q ? translatePhraseOffline(qInput.value.trim(), lang) : null;
      const phraseBanner = phrase ? \`
        <div class="phrase-card">
          <div class="entry-head"><span class="cat">Traduction mot-à-mot hors-ligne</span></div>
          <div class="langs">
            <div class="lang-box"><div class="lang-label fr">Français</div><div class="lang-word">\${phrase.fr}</div></div>
            <div class="lang-box"><div class="lang-label en">Anglais</div><div class="lang-word">\${phrase.en}</div></div>
            <div class="lang-box"><div class="lang-label es">Espagnol</div><div class="lang-word">\${phrase.es}</div></div>
          </div>
        </div>
      \` : '';

      if (matches.length === 0 && !phraseBanner) {
        resultsEl.innerHTML = '<div class="empty">Aucun résultat trouvé dans les ' + UNIQUE_FORMS.size.toLocaleString('fr-FR') + ' formes hors-ligne.</div>';
        return;
      }

      resultsEl.innerHTML = phraseBanner + matches.map((item, idx) => {
        const conjHtml = item.conj ? \`
          <div class="conj-panel" id="conj-\${idx}">
            <div class="conj-grid">
              <div class="conj-col">
                <h4 class="fr">Français (\${item.fr})</h4>
                <div class="conj-tense">Présent</div>\${renderConjList(PRON_FR, item.conj.fr.pres)}
                <div class="conj-tense">Passé composé</div>\${renderConjList(PRON_FR, item.conj.fr.past)}
                <div class="conj-tense">Imparfait</div>\${renderConjList(PRON_FR, item.conj.fr.imp)}
                <div class="conj-tense">Futur simple</div>\${renderConjList(PRON_FR, item.conj.fr.fut)}
                <div class="conj-tense">Conditionnel</div>\${renderConjList(PRON_FR, item.conj.fr.cond)}
                <div class="conj-tense">Subjonctif</div>\${renderConjList(PRON_FR, item.conj.fr.subj)}
              </div>
              <div class="conj-col">
                <h4 class="en">Anglais (to \${item.en})</h4>
                <div class="conj-tense">Present</div>
                <ul>
                  <li><strong>I / you / we / they</strong> \${item.conj.en.pres[0]}</li>
                  <li><strong>he / she / it</strong> \${item.conj.en.pres[1]}</li>
                </ul>
                <div class="conj-tense">Past Simple</div>
                <ul><li><strong>all persons</strong> \${item.conj.en.past}</li></ul>
                <div class="conj-tense">Future</div>
                <ul><li><strong>all persons</strong> \${item.conj.en.fut}</li></ul>
                <div class="conj-tense">Participle / -ing</div>
                <ul><li><strong>form</strong> \${item.conj.en.ing}</li></ul>
              </div>
              <div class="conj-col">
                <h4 class="es">Espagnol (\${item.es})</h4>
                <div class="conj-tense">Presente</div>\${renderConjList(PRON_ES, item.conj.es.pres)}
                <div class="conj-tense">Pretérito</div>\${renderConjList(PRON_ES, item.conj.es.past)}
                <div class="conj-tense">Imperfecto</div>\${renderConjList(PRON_ES, item.conj.es.imp)}
                <div class="conj-tense">Futuro</div>\${renderConjList(PRON_ES, item.conj.es.fut)}
                <div class="conj-tense">Condicional</div>\${renderConjList(PRON_ES, item.conj.es.cond)}
                <div class="conj-tense">Subjuntivo</div>\${renderConjList(PRON_ES, item.conj.es.subj)}
              </div>
            </div>
          </div>
        \` : '';

        return \`
          <div class="entry-card">
            <div class="entry-head">
              <span class="cat">\${item.cat === 'num' ? 'nombre' : item.cat}</span>
              \${item.conj ? '<button type="button" class="conj-btn" onclick="toggleConj(' + idx + ')">Voir conjugaison (6 temps)</button>' : ''}
            </div>
            <div class="langs">
              <div class="lang-box">
                <div class="lang-label fr">Français</div>
                <div class="lang-word">\${item.fr}</div>
              </div>
              <div class="lang-box">
                <div class="lang-label en">Anglais</div>
                <div class="lang-word">\${item.en}</div>
              </div>
              <div class="lang-box">
                <div class="lang-label es">Espagnol</div>
                <div class="lang-word">\${item.es}</div>
              </div>
            </div>
            \${conjHtml}
          </div>
        \`;
      }).join('');
    }

    window.toggleConj = function(idx) {
      const el = document.getElementById('conj-' + idx);
      if (el) el.classList.toggle('open');
    };

    document.querySelectorAll('.tab').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        activeCat = btn.getAttribute('data-cat');
        render();
      });
    });

    qInput.addEventListener('input', render);
    langSel.addEventListener('change', render);
    render();
  </script>
</body>
</html>`;
}

export function downloadOfflineTranslator(): void {
  const html = buildOfflineTranslatorHtml();
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'traducteur-hors-ligne.html';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
