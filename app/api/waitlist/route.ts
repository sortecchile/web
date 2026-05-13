import { NextResponse } from 'next/server';

const NOTION_API = 'https://api.notion.com/v1/pages';
const NOTION_VERSION = '2022-06-28';

const HECTAREAS_MAP: Record<string, string> = {
  'menos-50': 'Menos de 50 ha',
  '<50ha': 'Menos de 50 ha',
  '50-200': '50 – 200 ha',
  '50-100ha': '50 – 200 ha',
  '100-500ha': '200 – 500 ha',
  '200-500': '200 – 500 ha',
  'mas-500': 'Más de 500 ha',
  '500+ha': 'Más de 500 ha',
  'Menos de 50 ha': 'Menos de 50 ha',
  '50 – 200 ha': '50 – 200 ha',
  '200 – 500 ha': '200 – 500 ha',
  'Más de 500 ha': 'Más de 500 ha',
};

const ESPECIE_MAP: Record<string, string> = {
  palto: 'Palto',
  Palto: 'Palto',
  cereza: 'Cereza',
  Cereza: 'Cereza',
  arandano: 'Arándano',
  Arándano: 'Arándano',
  uva: 'Uva de mesa',
  Uva: 'Uva de mesa',
  'Uva de mesa': 'Uva de mesa',
  manzana: 'Manzana',
  Manzana: 'Manzana',
  otro: 'Otra',
  Otro: 'Otra',
  Otra: 'Otra',
};

const REGION_MAP: Record<string, string> = {
  'Arica y Parinacota': 'Arica y Parinacota',
  Tarapaca: 'Tarapacá',
  Tarapacá: 'Tarapacá',
  Antofagasta: 'Antofagasta',
  Atacama: 'Atacama',
  Coquimbo: 'Coquimbo',
  Valparaiso: 'Valparaíso',
  Valparaíso: 'Valparaíso',
  Metropolitana: 'Metropolitana',
  OHiggins: "O'Higgins",
  "O'Higgins": "O'Higgins",
  Maule: 'Maule',
  Nuble: 'Ñuble',
  Ñuble: 'Ñuble',
  Biobio: 'Biobío',
  Biobío: 'Biobío',
  'La Araucania': 'La Araucanía',
  'La Araucanía': 'La Araucanía',
  'Los Rios': 'Los Ríos',
  'Los Ríos': 'Los Ríos',
  'Los Lagos': 'Los Lagos',
  Aysen: 'Aysén',
  Aysén: 'Aysén',
  Magallanes: 'Magallanes',
};

type WaitlistPayload = {
  name?: string;
  nombre?: string;
  apellido?: string;
  email?: string;
  company?: string;
  empresa?: string;
  position?: string;
  cargo?: string;
  hectares?: string;
  hectareas?: string;
  species?: string;
  especie?: string;
  region?: string;
  needDate?: string;
  temporada?: string;
};

function text(value?: string): { rich_text: { text: { content: string } }[] } {
  return { rich_text: [{ text: { content: value ?? '' } }] };
}

function select(value?: string): { select: { name: string } } | undefined {
  if (!value) return undefined;
  return { select: { name: value } };
}

function clean(value?: string): string {
  return value?.toString().trim() ?? '';
}

function splitName(fullName: string): { nombre: string; apellido: string } {
  const parts = fullName.split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return { nombre: fullName, apellido: '' };

  return {
    nombre: parts.slice(0, -1).join(' '),
    apellido: parts.at(-1) ?? '',
  };
}

export async function POST(request: Request) {
  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_WAITLIST_DATABASE_ID;

  if (!token || !databaseId) {
    return NextResponse.json(
      { error: 'Server is missing Notion credentials.' },
      { status: 500 },
    );
  }

  let body: WaitlistPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const fullName = clean(body.name) || [clean(body.nombre), clean(body.apellido)].filter(Boolean).join(' ');
  const splitFullName = splitName(fullName);
  const nombre = clean(body.nombre) || splitFullName.nombre || fullName;
  const apellido = clean(body.apellido) || splitFullName.apellido;
  const email = clean(body.email);
  const empresa = clean(body.empresa) || clean(body.company);
  const cargo = clean(body.cargo) || clean(body.position);
  const hectareas = HECTAREAS_MAP[clean(body.hectareas) || clean(body.hectares)];
  const especie = ESPECIE_MAP[clean(body.especie) || clean(body.species)];
  const region = REGION_MAP[clean(body.region)];
  const temporada = clean(body.temporada) || clean(body.needDate);

  const missing = [
    !fullName && 'nombre',
    !email && 'email',
    !empresa && 'empresa',
    !cargo && 'cargo',
    !hectareas && 'hectareas',
    !especie && 'especie',
    !region && 'region',
  ].filter(Boolean);

  if (missing.length) {
    return NextResponse.json(
      { error: `Faltan campos: ${missing.join(', ')}` },
      { status: 400 },
    );
  }

  const properties: Record<string, unknown> = {
    Nombre: { title: [{ text: { content: fullName || nombre } }] },
    Apellido: text(apellido),
    Email: { email },
    Empresa: text(empresa),
    Cargo: text(cargo),
    Temporada: text(temporada),
    'Hectáreas': select(hectareas),
    'Especie principal': select(especie),
    Región: select(region),
  };

  const res = await fetch(NOTION_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error('Notion API error:', res.status, detail);
    return NextResponse.json(
      { error: 'No pudimos registrar tu inscripción. Intenta nuevamente.' },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
