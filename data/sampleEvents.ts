import type { NormalizedEvent } from '@/lib/eventsSchema';

export const sampleEvents: NormalizedEvent[] = [
  {
    id: 'sample_1',
    title: 'Bitka na Kosovu',
    description: 'Odlučujuća bitka između srpske i osmanske vojske na Kosovu polju. Ova bitka je imala značajan utjecaj na historiju Balkana.',
    rawLocation: 'Kosovo polje, Srbija',
    dateISO: '1389-06-28',
    lat: 42.6026,
    lng: 21.4361,
    source: 'sample',
    slike: {
      slikaPath: '/dogadjaji/sample/kosovo-battle.png',
      naslov: 'Bitka na Kosovu'
    }
  },
  {
    id: 'sample_2',
    title: 'Osvajanje Bosne',
    description: 'Osmanska vojska pod vodstvom Mehmeda II osvaja Bosansko kraljevstvo, čime završava nezavisnost Bosne.',
    rawLocation: 'Bosna i Hercegovina',
    dateISO: '1463-05-29',
    lat: 43.8563,
    lng: 18.4131,
    source: 'sample',
    slike: {
      slikaPath: '/dogadjaji/sample/bosnia-conquest.png',
      naslov: 'Osvajanje Bosne'
    }
  },
  {
    id: 'sample_3',
    title: 'Bitka kod Mohača',
    description: 'Osmanska pobjeda nad ugarsko-hrvatskom vojskom. Kralj Lajoš II je poginuo u bitci.',
    rawLocation: 'Mohač, Mađarska',
    dateISO: '1526-08-29',
    lat: 45.9931,
    lng: 18.6831,
    source: 'sample'
  },
  {
    id: 'sample_4',
    title: 'Prvi svjetski rat',
    description: 'Početak Prvog svjetskog rata nakon atentata na nadvojvodu Franza Ferdinanda u Sarajevu.',
    rawLocation: 'Sarajevo, Bosna i Hercegovina',
    dateISO: '1914-06-28',
    lat: 43.8563,
    lng: 18.4131,
    source: 'sample',
    slike: {
      slikaPath: '/dogadjaji/sample/ww1-start.png',
      naslov: 'Prvi svjetski rat'
    }
  },
  {
    id: 'sample_5',
    title: 'Oslobođenje Beograda',
    description: 'Sovjetska Crvena armija i jugoslovenski partizani oslobađaju Beograd od nemačkih okupatora.',
    rawLocation: 'Beograd, Srbija',
    dateISO: '1944-10-20',
    lat: 44.7866,
    lng: 20.4489,
    source: 'sample'
  },
  {
    id: 'sample_6',
    title: 'Proglašenje nezavisnosti Hrvatske',
    description: 'Hrvatski sabor proglašava nezavisnost Republike Hrvatske od SFRJ.',
    rawLocation: 'Zagreb, Hrvatska',
    dateISO: '1991-06-25',
    lat: 45.8150,
    lng: 15.9819,
    source: 'sample'
  },
  {
    id: 'sample_7',
    title: 'Daytonski sporazum',
    description: 'Potpisan Daytonski mirovni sporazum koji je završio rat u Bosni i Hercegovini.',
    rawLocation: 'Dayton, Ohio, SAD',
    dateISO: '1995-11-21',
    lat: 39.7589,
    lng: -84.1916,
    source: 'sample'
  },
  {
    id: 'sample_8',
    title: 'NATO bombardovanje',
    description: 'Početak NATO bombardovanja SRJ zbog kosovske krize.',
    rawLocation: 'Srbija',
    dateISO: '1999-03-24',
    lat: 44.0165,
    lng: 21.0059,
    source: 'sample'
  },
  {
    id: 'sample_9',
    title: 'Proglašenje nezavisnosti Kosova',
    description: 'Kosovo proglašava nezavisnost od Srbije.',
    rawLocation: 'Priština, Kosovo',
    dateISO: '2008-02-17',
    lat: 42.6629,
    lng: 21.1655,
    source: 'sample'
  },
  {
    id: 'sample_10',
    title: 'Pridruživanje Hrvatske EU',
    description: 'Hrvatska postaje 28. članica Evropske unije.',
    rawLocation: 'Hrvatska',
    dateISO: '2013-07-01',
    lat: 45.8150,
    lng: 15.9819,
    source: 'sample'
  },
  // Events without coordinates (to test geocoding)
  {
    id: 'sample_11',
    title: 'Historijski događaj u Crnoj Gori',
    description: 'Važan historijski događaj koji se odigrao u Crnoj Gori.',
    rawLocation: 'Crna Gora',
    dateISO: '1850-01-01',
    source: 'sample'
  },
  {
    id: 'sample_12',
    title: 'Događaj u Sloveniji',
    description: 'Značajan događaj u historiji Slovenije.',
    rawLocation: 'Slovenija',
    dateISO: '1900-01-01',
    source: 'sample'
  },
  {
    id: 'sample_13',
    title: 'Makedonski historijski događaj',
    description: 'Važan događaj u historiji Sjeverne Makedonije.',
    rawLocation: 'Sjeverna Makedonija',
    dateISO: '1950-01-01',
    source: 'sample'
  },
  {
    id: 'sample_14',
    title: 'Događaj u Njemačkoj',
    description: 'Historijski događaj koji se odigrao u Njemačkoj.',
    rawLocation: 'Njemačka',
    dateISO: '1930-01-01',
    source: 'sample'
  },
  {
    id: 'sample_15',
    title: 'Francuski historijski događaj',
    description: 'Značajan događaj u historiji Francuske.',
    rawLocation: 'Francuska',
    dateISO: '1920-01-01',
    source: 'sample'
  }
];

export default sampleEvents;
