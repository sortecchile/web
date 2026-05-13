import { NextResponse } from 'next/server';

const NOTION_API = 'https://api.notion.com/v1/pages';
const NOTION_VERSION = '2022-06-28';

const HECTAREAS_MAP: Record<string, string> = {
  'menos-50': 'Menos de 50 ha',
  '50-200': '50 – 200 ha',
  '200-500': '200 – 500 ha',
  'mas-500': 'Más de 500 ha',
};

const ESPECIE_MAP: Record<string, string> = {
  palto: 'Palto',
  cereza: 'Cereza',
  arandano: 'Arándano',
  uva: 'Uva de mesa',
  manzana: 'Manzana',
  otro: 'Otra',
};

type WaitlistPayload = {
  nombre?: string;
  apellido?: string;
  email?: string;
  empresa?: string;
  cargo?: string;
  hectareas?: string;
  especie?: string;
  region?: string;
  temporada?: string;
};

function text(value?: string) {
  return { rich_text: [{ text: { content: value ?? '' } }] };
}

function select(value?: string) {
  if (!value) return undefined;
  return { select: { name: value } };
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

  const required: (keyof WaitlistPayload)[] = [
    'nombre', 'apellido', 'email', 'empresa', 'cargo', 'hectareas', 'especie', 'region',
  ];
  const missing = required.filter((key) => !body[key]?.toString().trim());
  if (missing.length) {
    return NextResponse.json(
      { error: `Faltan campos: ${missing.join(', ')}` },
      { status: 400 },
    );
  }

  const properties: Record<string, unknown> = {
    Nombre: { title: [{ text: { content: body.nombre! } }] },
    Apellido: text(body.apellido),
    Email: { email: body.email },
    Empresa: text(body.empresa),
    Cargo: text(body.cargo),
    Temporada: text(body.temporada),
  };

  const hectareas = select(HECTAREAS_MAP[body.hectareas!]);
  if (hectareas) properties['Hectáreas'] = hectareas;

  const especie = select(ESPECIE_MAP[body.especie!]);
  if (especie) properties['Especie principal'] = especie;

  const region = select(body.region);
  if (region) properties['Región'] = region;

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
