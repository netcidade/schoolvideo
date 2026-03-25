/**
 * Script de setup do Appwrite — criar database, collections e bucket
 * Execute UMA VEZ: node scripts/setup-appwrite.mjs
 */
import { Client, Databases, Storage, ID, Permission, Role } from 'node-appwrite';
process.loadEnvFile();

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const db      = new Databases(client);
const storage = new Storage(client);

async function setup() {
  console.log('🚀 Iniciando setup do Appwrite...\n');

  // ── Database ───────────────────────────────────────────────
  let database;
  try {
    database = await db.create(ID.unique(), 'Escola em Vídeo');
    console.log('✅ Database criado:', database.$id);
    console.log('\n⚠️  IMPORTANTE: adicione ao seu .env:');
    console.log(`APPWRITE_DATABASE_ID=${database.$id}\n`);
  } catch (e) {
    console.error('❌ Erro ao criar database:', e.message);
    process.exit(1);
  }

  const dbId = database.$id;
  const adminAccess = [Permission.read(Role.label('admin')), Permission.write(Role.label('admin'))];

  // ── Collection: professores ────────────────────────────────
  const profs = await db.createCollection(dbId, 'professores', 'Professores', [
    Permission.read(Role.any()),
    ...adminAccess,
  ]);
  const profAttrs = [
    { key: 'nome',         size: 100,  required: true  },
    { key: 'especialidade',size: 100,  required: true  },
    { key: 'bio',          size: 5000, required: false },
    { key: 'bio_en',       size: 5000, required: false },
    { key: 'email',        size: 200,  required: false },
    { key: 'whatsapp',     size: 30,   required: false },
    { key: 'endereco',     size: 300,  required: false },
    { key: 'cidade',       size: 100,  required: false },
    { key: 'estado',       size: 100,  required: false },
    { key: 'pais',         size: 100,  required: false },
    { key: 'cor_tema',     size: 10,   required: false },
    { key: 'foto_id',      size: 255,  required: false },
  ];
  for (const a of profAttrs) {
    await db.createStringAttribute(dbId, profs.$id, a.key, a.size, a.required);
  }
  console.log('✅ Collection "professores" criada');

  // ── Collection: videos ─────────────────────────────────────
  const vids = await db.createCollection(dbId, 'videos', 'Vídeos', [
    Permission.read(Role.any()),
    ...adminAccess,
  ]);
  await db.createStringAttribute(dbId, vids.$id, 'professor_id', 36,  true);
  await db.createStringAttribute(dbId, vids.$id, 'titulo',       150, true);
  await db.createStringAttribute(dbId, vids.$id, 'descricao',    5000, false);
  await db.createStringAttribute(dbId, vids.$id, 'descricao_en', 5000, false);
  await db.createStringAttribute(dbId, vids.$id, 'duracao',      30,  false);
  await db.createFloatAttribute(dbId, vids.$id, 'preco', true, 0, 99999);
  await db.createBooleanAttribute(dbId, vids.$id, 'is_preview', false);
  await db.createStringAttribute(dbId, vids.$id, 'video_url', 255, true);
  await db.createEnumAttribute(dbId, vids.$id, 'provider', ['vimeo','youtube'], false, 'vimeo');
  console.log('✅ Collection "videos" criada');

  // ── Collection: compras ────────────────────────────────────
  const comp = await db.createCollection(dbId, 'compras', 'Compras', adminAccess);
  await db.createStringAttribute(dbId, comp.$id, 'usuario_id',        36,  true);
  await db.createStringAttribute(dbId, comp.$id, 'video_id',          36,  true);
  await db.createStringAttribute(dbId, comp.$id, 'stripe_session_id', 255, false);
  await db.createEnumAttribute(dbId, comp.$id, 'status', ['pendente','pago','cancelado'], false, 'pendente');
  console.log('✅ Collection "compras" criada');

  // ── Storage Bucket ─────────────────────────────────────────
  await storage.createBucket('professor-photos', 'Professor Photos', [
    Permission.read(Role.any()),
    ...adminAccess,
  ], false, true, 3 * 1024 * 1024, ['jpg','jpeg','png','webp']);
  console.log('✅ Bucket "professor-photos" criado');

  // ── Seed Data ──────────────────────────────────────────────
  await seedData(db, dbId, profs.$id, vids.$id);

  console.log('\n✅ Setup concluído! Configure o APPWRITE_DATABASE_ID no .env e reinicie o servidor.');
}

async function seedData(db, dbId, profColId, vidColId) {
  console.log('\n📦 Inserindo dados de demonstração...');

  const profs = [
    { nome:'Helena Voss',    especialidade:'Ballet Clássico', bio:'Bailarina principal formada pelo Royal Ballet, com 15 anos de experiência.', cor_tema:'#E8C547' },
    { nome:'Caio Drummond',  especialidade:'Contemporâneo',   bio:'Coreógrafo premiado que une expressão corporal e improvisação.', cor_tema:'#6B9EFF' },
    { nome:'Sione Makoa',    especialidade:'Salsa & Bachata',  bio:'Campeão latino-americano de ritmo e sensualidade.', cor_tema:'#5ECFA0' },
    { nome:'Arjun Mehta',    especialidade:'Street Dance',     bio:'Pioneiro do Hip-Hop brasileiro.', cor_tema:'#FF7E6B' },
  ];

  const profIds = [];
  for (const p of profs) {
    const doc = await db.createDocument(dbId, profColId, ID.unique(), p);
    profIds.push(doc.$id);
  }
  console.log('  👤 Professores inseridos');

  const videos = [
    { pi: 0, titulo:'Fundamentos do Plié',     preco: 0,     is_preview: true,  duracao:'45min',    video_url:'76979871', provider:'vimeo', descricao:'Aprenda a base fundamental do ballet clássico.' },
    { pi: 0, titulo:'Técnica de Pontas',         preco: 49.90, is_preview: false, duracao:'1h 20min', video_url:'76979871', provider:'vimeo', descricao:'Domine a técnica de pontas com dicas profissionais.' },
    { pi: 1, titulo:'Expressão e Fluidez',       preco: 0,     is_preview: true,  duracao:'50min',    video_url:'76979871', provider:'vimeo', descricao:'Como conectar movimentos com a emoção.' },
    { pi: 1, titulo:'Improviso e Composição',    preco: 39.90, is_preview: false, duracao:'1h 10min', video_url:'76979871', provider:'vimeo', descricao:'Técnicas de improviso que libertam o corpo.' },
    { pi: 2, titulo:'Introdução à Salsa',        preco: 0,     is_preview: true,  duracao:'40min',    video_url:'76979871', provider:'vimeo', descricao:'Primeiros passos da Salsa.' },
    { pi: 2, titulo:'Giros e Viradas Avançadas', preco: 44.90, is_preview: false, duracao:'55min',    video_url:'76979871', provider:'vimeo', descricao:'Técnicas para giros limpos na Salsa.' },
    { pi: 3, titulo:'Fundamentos do Hip-Hop',    preco: 0,     is_preview: true,  duracao:'35min',    video_url:'76979871', provider:'vimeo', descricao:'Groove, isolações e vocabulário básico.' },
    { pi: 3, titulo:'Breaking e Power Moves',    preco: 54.90, is_preview: false, duracao:'1h 30min', video_url:'76979871', provider:'vimeo', descricao:'Técnicas de breaking para dançarinos intermediários.' },
  ];

  for (const v of videos) {
    await db.createDocument(dbId, vidColId, ID.unique(), {
      professor_id: profIds[v.pi],
      titulo: v.titulo, descricao: v.descricao,
      duracao: v.duracao, preco: v.preco,
      is_preview: v.is_preview, video_url: v.video_url, provider: v.provider,
    });
  }
  console.log('  🎬 Vídeos inseridos');
}

setup().catch(console.error);
