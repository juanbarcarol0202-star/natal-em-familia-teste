/* =========================================================
   ESTADO, PERSISTÊNCIA E REGRAS DE NEGÓCIO
   Tudo fica salvo no navegador (localStorage) e pode ser
   exportado/importado em JSON pelo painel administrativo.
   ========================================================= */

const STORAGE_KEY = 'natal-em-familia-2026-v1';

function brl(v) {
  return v == null ? '—' : 'R$ ' + Number(v).toFixed(2).replace('.', ',');
}

function estadoInicial() {
  const pessoas = {};
  PARTICIPANTES.forEach(p => {
    pessoas[p.id] = {
      experiencia: null,        // nunca | uma | algumas | conheco
      combina: [],              // ids de COMBINA
      visitados: {},            // itemId -> nunca | quero_voltar | nao_repetir
      chegada: '2026-12-23', chegadaHora: '14:00',   // datas a confirmar
      saida: '2026-12-27', saidaHora: '12:00',
      carro: false, vagas: 0, dirige: false, precisaCarona: false, partida: '',
    };
  });
  return {
    versao: 1,
    config: { estrategia: 'economico', ceia: '2026-12-24', roteiroLiberado: false },
    pessoas,
    votos: {},      // pessoaId -> itemId -> { interesse, forma }
    precos: {},     // itemId -> { entrada, promo, meia, estacionamento, transporte, extras, confirmado }
    atividades: [], // roteiro: ver criarAtividade()
    sinais: {},     // pessoaId -> atividadeId -> quero | talvez | nao
    amigo: null,    // { data, pares: { quemDá: quemRecebe } }
  };
}

let estado = carregarEstado();

function carregarEstado() {
  const base = estadoInicial();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    return mesclarProfundo(base, JSON.parse(raw));
  } catch (e) {
    console.warn('Não foi possível ler o estado salvo', e);
    return base;
  }
}

function mesclarProfundo(base, extra) {
  if (!extra || typeof extra !== 'object') return base;
  Object.keys(extra).forEach(k => {
    if (extra[k] && typeof extra[k] === 'object' && !Array.isArray(extra[k]) && base[k] && typeof base[k] === 'object') {
      base[k] = mesclarProfundo(base[k], extra[k]);
    } else {
      base[k] = extra[k];
    }
  });
  return base;
}

function salvarEstado() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(estado)); }
  catch (e) { console.warn('Falha ao salvar', e); }
  salvarNuvemAdiada();
}

/* ---------- nuvem: dados guardados só no usuário dono (Artifact db) ---------- */
let NUVEM = null;
let NUVEM_FILA = Promise.resolve();
let NUVEM_T = null;

function enviarNuvem() {
  if (!NUVEM) return;
  const corpo = JSON.parse(JSON.stringify(estado));
  NUVEM_FILA = NUVEM_FILA.then(() => NUVEM.set(corpo)).catch(e => console.warn('Nuvem: não salvou', e && e.code));
}

function salvarNuvemAdiada() {
  if (!NUVEM) return;
  clearTimeout(NUVEM_T);
  NUVEM_T = setTimeout(enviarNuvem, 500);
}

async function iniciarNuvemApp() {
  try {
    if (typeof claude === 'undefined' || !claude.use) return;
    const [db, user] = await Promise.all([claude.use('db'), claude.use('user')]);
    if (!db || !user) return;
    const uid = await user.id();
    if (!uid) return;
    NUVEM = db.doc('data/users/' + uid + '/estado');
    const limite = new Promise(r => setTimeout(() => r(null), 10000));
    const snap = await Promise.race([NUVEM.get(), limite]);
    if (!snap) return;
    if (snap.exists) {
      estado = mesclarProfundo(estadoInicial(), snap.data());
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(estado)); } catch (e) { /* sem armazenamento */ }
      if (typeof render === 'function') render();
    } else {
      enviarNuvem();
    }
  } catch (e) { console.warn('Nuvem indisponível, usando o navegador', e && e.code); }
}

function setPath(obj, caminho, valor) {
  const partes = caminho.split('.');
  let alvo = obj;
  for (let i = 0; i < partes.length - 1; i++) {
    if (alvo[partes[i]] == null || typeof alvo[partes[i]] !== 'object') alvo[partes[i]] = {};
    alvo = alvo[partes[i]];
  }
  alvo[partes[partes.length - 1]] = valor;
}

/* ---------- catálogo / pessoas ---------- */
function itemPorId(id) { return CATALOGO_POR_ID[id] || null; }
function pessoaPorId(id) { return PARTICIPANTES.find(p => p.id === id) || null; }
function nomePessoa(id) { const p = pessoaPorId(id); return p ? p.nome : id; }

function hashTexto(t) {
  let h = 0;
  for (const c of t) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return (h % 1000) / 1000;
}

function posicaoItem(item) {
  if (POS_ESPECIAIS[item.id]) return POS_ESPECIAIS[item.id];
  const r1 = hashTexto(item.id), r2 = hashTexto(item.id + 'y');
  if (item.cidade === 'Canela') return [10.5 + r1 * 2.2, 10.5 + r2 * 2.2];
  if (item.cidade === 'Gramado') return [2.2 + r1 * 2.8, 2.2 + r2 * 2.8];
  return [8.5 + r1 * 2, 5.5 + r2 * 2];
}

function votoDe(pid, itemId) {
  return (estado.votos[pid] && estado.votos[pid][itemId]) || { interesse: null, forma: null };
}

/* ---------- presença e datas ---------- */
function inicioPresenca(pid) {
  const p = estado.pessoas[pid];
  return new Date(`${p.chegada}T${p.chegadaHora || '14:00'}`);
}
function fimPresenca(pid) {
  const p = estado.pessoas[pid];
  return new Date(`${p.saida}T${p.saidaHora || '12:00'}`);
}
function estaPresente(pid, dia) {
  const ini = new Date(`${dia}T00:00`), fim = new Date(`${dia}T23:59`);
  return inicioPresenca(pid) < fim && fimPresenca(pid) > ini;
}
function presentesNoDia(dia) {
  return PARTICIPANTES.filter(p => estaPresente(p.id, dia)).map(p => p.id);
}
function intervaloAtividade(a) {
  const s = new Date(`${a.dia}T${a.inicio}`).getTime();
  return [s, s + (a.duracao || 60) * 60000];
}
function atividadeDentroDaPresenca(pid, a) {
  const [s, e] = intervaloAtividade(a);
  return s >= inicioPresenca(pid).getTime() && e <= fimPresenca(pid).getTime();
}
/* Quem está presente durante TODO o intervalo informado */
function presentesEm(dia, inicio, duracao) {
  const ref = { dia, inicio, duracao };
  return PARTICIPANTES.filter(p => atividadeDentroDaPresenca(p.id, ref)).map(p => p.id);
}

/* Maior período em que os 10 estão juntos (interseção de todas as presenças) */
function janelaFamilia() {
  const ini = Math.max(...PARTICIPANTES.map(p => inicioPresenca(p.id).getTime()));
  const fim = Math.min(...PARTICIPANTES.map(p => fimPresenca(p.id).getTime()));
  if (fim <= ini) return null;
  return { ini: new Date(ini), fim: new Date(fim), horas: (fim - ini) / 3600000 };
}

/* Dia com mais pessoas presentes */
function diaComMaisGente() {
  let melhor = DIAS_VIAGEM[0], max = -1;
  DIAS_VIAGEM.forEach(d => {
    const n = presentesNoDia(d).length;
    if (n > max) { max = n; melhor = d; }
  });
  return { dia: melhor, pessoas: max };
}

/* ---------- votos ---------- */
function registrarVoto(pid, itemId, campo, valor) {
  setPath(estado, `votos.${pid}.${itemId}.${campo}`, valor);
  salvarEstado();
}
function pontuacaoInteresse(v) { return { muito: 3, tenho: 2, tanto: 1, nao: 0 }[v] || 0; }

/* ---------- preços e custos ---------- */
function precoEfetivo(itemId) {
  const p = estado.precos[itemId];
  if (!p) return null;
  const v = (p.promo !== '' && p.promo != null) ? p.promo : p.entrada;
  return (v === '' || v == null) ? null : Number(v);
}

function extrasConhecidos(itemId) {
  const p = estado.precos[itemId] || {};
  return ['estacionamento', 'transporte', 'extras']
    .reduce((s, k) => s + (p[k] === '' || p[k] == null ? 0 : Number(p[k])), 0);
}

function faixaPreco(itemId) {
  const item = itemPorId(itemId);
  if (!item) return 'Preço a confirmar';
  const v = precoEfetivo(itemId);
  if (item.acesso === 'gratis') return 'Gratuito';
  if (item.acesso === 'consumo' && v == null) return 'Gratuito';
  if (v == null) return 'Preço a confirmar';
  if (v === 0) return 'Gratuito';
  if (v <= 50) return 'Até R$ 50 por pessoa';
  if (v <= 100) return 'R$ 51 a R$ 100';
  if (v <= 200) return 'R$ 101 a R$ 200';
  return 'Acima de R$ 200';
}

const FAIXAS = ['Gratuito', 'Até R$ 50 por pessoa', 'R$ 51 a R$ 100', 'R$ 101 a R$ 200', 'Acima de R$ 200', 'Preço a confirmar'];

/* Custo por participante: { valor, status: confirmado | estimado | desconhecido }.
   Preço desconhecido NUNCA vira zero. */
function custoAtividade(a) {
  if (a.custo !== '' && a.custo != null) {
    const v = Number(a.custo);
    return { valor: v, status: v === 0 ? 'confirmado' : 'estimado' };
  }
  if (!a.itemId) return { valor: null, status: 'desconhecido' };
  const item = itemPorId(a.itemId);
  const p = estado.precos[a.itemId] || {};
  const v = precoEfetivo(a.itemId);
  if (item && item.acesso === 'gratis') return { valor: 0, status: 'confirmado' };
  if (item && item.acesso === 'consumo' && v == null) return { valor: 0, status: 'estimado', obs: 'consumo à parte' };
  if (v == null) return { valor: null, status: 'desconhecido' };
  return { valor: v + extrasConhecidos(a.itemId), status: p.confirmado ? 'confirmado' : 'estimado' };
}

/* Gastos de UMA pessoa */
function gastosPessoa(pid) {
  let confirmado = 0, estimado = 0, desconhecidos = 0;
  const itens = [];
  estado.atividades.filter(a => a.participantes.includes(pid)).forEach(a => {
    const c = custoAtividade(a);
    if (c.valor == null) desconhecidos++;
    else if (c.status === 'confirmado') confirmado += c.valor;
    else estimado += c.valor;
    itens.push({ a, c });
  });
  return { confirmado, estimado, desconhecidos, itens };
}

/* ---------- conflitos e transporte ---------- */
function conflitos() {
  const res = [], vistos = new Set();
  PARTICIPANTES.forEach(p => {
    const minhas = estado.atividades
      .filter(a => a.participantes.includes(p.id))
      .sort((x, y) => intervaloAtividade(x)[0] - intervaloAtividade(y)[0]);
    minhas.forEach((a, i) => {
      if (!atividadeDentroDaPresenca(p.id, a)) {
        const k = `fora|${p.id}|${a.id}`;
        if (!vistos.has(k)) { vistos.add(k); res.push({ tipo: 'fora', pid: p.id, a }); }
      }
      minhas.slice(i + 1).forEach(b => {
        if (b.dia !== a.dia) return;
        const [s1, e1] = intervaloAtividade(a), [s2, e2] = intervaloAtividade(b);
        if (s1 < e2 && s2 < e1) {
          const k = `sobre|${p.id}|${[a.id, b.id].sort().join('|')}`;
          if (!vistos.has(k)) { vistos.add(k); res.push({ tipo: 'sobreposicao', pid: p.id, a, b }); }
        }
      });
    });
  });
  return res;
}

function distanciaAtividade(a) {
  if (a.dist) return a.dist;
  const it = a.itemId ? itemPorId(a.itemId) : null;
  return it ? it.dist : 'perto';
}

function pendenciasTransporte() {
  const out = [];
  estado.atividades.forEach(a => {
    if (distanciaAtividade(a) === 'perto' || a.transporte) return;
    const parts = a.participantes;
    if (!parts.length) return;
    const motoristas = parts.filter(id => estado.pessoas[id].carro && estado.pessoas[id].dirige);
    const vagas = motoristas.reduce((s, id) => s + (Number(estado.pessoas[id].vagas) || 0), 0);
    const passageiros = parts.filter(id => !motoristas.includes(id));
    if (!motoristas.length) out.push({ a, msg: 'Ninguém disponível para dirigir neste passeio' });
    else if (passageiros.length > vagas) out.push({ a, msg: `Faltam ${passageiros.length - vagas} vaga(s) de carona` });
  });
  return out;
}

/* ---------- atividades ---------- */
function novoId(prefixo) { return prefixo + Math.random().toString(36).slice(2, 9); }

function criarAtividade(dados) {
  return Object.assign({
    id: novoId('a'),
    dia: '2026-12-25', inicio: '09:00', duracao: 180,
    titulo: 'Nova atividade', tipo: 'grupo', grupo: 'A',
    itemId: null, participantes: [], encontro: '', transporte: '',
    custo: null, dist: null, obs: '',
  }, dados);
}

/* Sugestão de roteiro a partir de chegadas, votos e estratégia.
   Ninguém entra numa atividade que marcou "não quero" ou "prefiro outra coisa". */
function sugerirRoteiro(estrategia, opts = {}) {
  const acts = [];
  const add = d => acts.push(criarAtividade(d));
  const ocupado = (pid, dia, inicio, duracao) => {
    const s = new Date(`${dia}T${inicio}`).getTime(), e = s + duracao * 60000;
    return acts.some(a => a.dia === dia && a.participantes.includes(pid) && (() => {
      const [s2, e2] = intervaloAtividade(a); return s < e2 && s2 < e;
    })());
  };
  const podeIr = (pid, itemId) => {
    const v = votoDe(pid, itemId);
    return v.interesse !== null && v.interesse !== 'nao' && v.forma !== 'outra';
  };

  const dias = DIAS_VIAGEM.filter(d => presentesNoDia(d).length >= 2);
  const diaFamilia = diaComMaisGente().dia;
  const usados = new Set();
  const naoClassicos = CATALOGO.filter(i => !['classico', 'paga'].includes(i.cat) && i.acesso !== 'pago');

  dias.forEach((dia, idx) => {
    const pManha = presentesEm(dia, '09:00', 180);
    const primeiraVez = pManha.filter(pid => ['nunca', 'uma'].includes(estado.pessoas[pid].experiencia));
    const resto = pManha.filter(pid => !primeiraVez.includes(pid));

    // Manhã · Grupo A (primeira vez): centro clássico gratuito
    if (primeiraVez.length) {
      add({ dia, inicio: '09:00', duracao: 180, tipo: 'grupo', grupo: 'A', itemId: 'rua-torta',
        titulo: 'Centro clássico: Rua Torta, Igreja São Pedro, Rua Coberta e Praça das Etnias',
        participantes: primeiraVez, custo: 0, dist: 'perto', obs: 'Passeio gratuito a pé.' });
    }

    // Manhã · Grupo B (já conhece): melhor opção nova que o grupo quer
    let melhor = null, melhorScore = 0, melhorPart = [];
    naoClassicos.filter(i => !usados.has(i.id)).forEach(item => {
      const part = resto.filter(pid => {
        const v = votoDe(pid, item.id);
        return ['muito', 'tenho'].includes(v.interesse) && podeIr(pid, item.id);
      });
      const score = part.reduce((s, pid) => s + pontuacaoInteresse(votoDe(pid, item.id).interesse), 0);
      if (part.length && score > melhorScore) { melhor = item; melhorScore = score; melhorPart = part; }
    });
    if (melhor) {
      usados.add(melhor.id);
      add({ dia, inicio: '09:00', duracao: 180, tipo: melhorPart.length === pManha.length ? 'coletiva' : 'grupo',
        grupo: 'B', itemId: melhor.id, titulo: melhor.nome, participantes: melhorPart, dist: melhor.dist,
        obs: 'Sugestão baseada nos votos. Quem não quis fica no tempo livre.' });
    }

    // Tarde · pagas: no modo econômico só entram se houver grupo pequeno muito interessado
    const pTarde = presentesEm(dia, '14:00', 300);
    const candidatasPagas = CATALOGO.filter(i => i.acesso === 'pago' && i.cat !== 'economica' && !usados.has(i.id))
      .filter(i => {
        const muitos = pTarde.filter(pid => votoDe(pid, i.id).interesse === 'muito' && podeIr(pid, i.id));
        const quer = pTarde.filter(pid => ['muito', 'tenho'].includes(votoDe(pid, i.id).interesse) && podeIr(pid, i.id));
        if (estrategia === 'economico') return muitos.length >= 2;
        if (estrategia === 'equilibrado') return muitos.length >= 1;
        return quer.length >= 1;
      });
    if (!opts.semPagas && candidatasPagas.length && idx % 2 === 1) {
      const it = candidatasPagas[0];
      usados.add(it.id);
      const part = pTarde.filter(pid => ['muito', 'tenho'].includes(votoDe(pid, it.id).interesse) && podeIr(pid, it.id));
      add({ dia, inicio: '14:00', duracao: 300, tipo: 'grupo', grupo: 'B', itemId: it.id, titulo: it.nome,
        participantes: part, dist: it.dist,
        obs: 'Opcional. Preço a confirmar. Quem não quiser fica no tempo livre.' });
    }

    // Almoço coletivo no dia com mais gente
    if (dia === diaFamilia) {
      const pAlmoco = presentesEm(dia, '12:30', 90);
      if (pAlmoco.length) add({ dia, inicio: '12:30', duracao: 90, tipo: 'coletiva', grupo: 'Todos',
        titulo: 'Almoço em família', participantes: pAlmoco, obs: 'Momento de todos juntos.' });
    }

    // Tempo livre à tarde para quem não ficou em nenhuma atividade 14h–17h
    const livres = pTarde.filter(pid => !ocupado(pid, dia, '14:00', 180));
    if (livres.length) add({ dia, inicio: '14:00', duracao: 180, tipo: 'livre', grupo: 'Livre',
      titulo: 'Tempo livre: descanso, compras ou passeio por conta própria', participantes: livres, custo: 0 });

    // Noite coletiva gratuita
    const pNoite = presentesEm(dia, '19:30', 90);
    if (pNoite.length >= 2) {
      add({ dia, inicio: '19:30', duracao: 90, tipo: 'coletiva', grupo: 'Todos', itemId: 'decoracoes-noturnas',
        titulo: 'Passeio pelas decorações natalinas à noite', participantes: pNoite, custo: 0 });
    }

    // Ceia e Amigo Secreto
    if (dia === estado.config.ceia) {
      const pCeia = presentesEm(dia, '21:00', 180);
      if (pCeia.length >= 2) {
        add({ dia, inicio: '21:00', duracao: 150, tipo: 'coletiva', grupo: 'Todos', titulo: 'Ceia de Natal',
          participantes: pCeia, obs: 'Conforme combinado com a família.' });
        add({ dia, inicio: '23:30', duracao: 60, tipo: 'coletiva', grupo: 'Todos', titulo: 'Amigo Secreto',
          participantes: pCeia, custo: 0 });
      }
    }
  });

  return acts;
}

/* ---------- versões do roteiro ---------- */
function assinaturaRoteiro(acts) {
  return acts.map(a => [a.dia, a.inicio, a.itemId || a.titulo, [...a.participantes].sort().join(',')].join('|'))
    .sort().join('||');
}

function resumoVersao(acts) {
  let conhecido = 0, desconhecidos = 0, pagas = 0, participacoes = 0;
  acts.forEach(a => {
    const c = custoAtividade(a);
    if (c.valor == null) desconhecidos++;
    else conhecido += c.valor * a.participantes.length;
    const it = a.itemId ? itemPorId(a.itemId) : null;
    if (it && it.acesso === 'pago') pagas++;
    participacoes += a.participantes.length;
  });
  const comTransporte = acts.filter(a => distanciaAtividade(a) !== 'perto').length;
  return { n: acts.length, conhecido, desconhecidos, pagas, participacoes, comTransporte, assinatura: assinaturaRoteiro(acts) };
}

function versoesRoteiro() {
  const A = sugerirRoteiro('economico', { semPagas: true });
  const B = sugerirRoteiro('equilibrado');
  const salvo = estado.atividades.length > 0;
  const C = salvo ? estado.atividades : sugerirRoteiro('completo');
  return {
    A, B, C,
    Cnota: salvo ? 'Roteiro salvo no editor.' : 'Ainda não há roteiro salvo; usei a combinação mais completa como ponto de partida.',
  };
}

/* Quanto podemos economizar: só com preços cadastrados. Troca paga → alternativa gratuita. */
function indicadorEconomia(acts) {
  const linhas = [];
  let total = 0;
  acts.forEach(a => {
    if (!a.itemId) return;
    const item = itemPorId(a.itemId);
    if (!item || item.acesso !== 'pago') return;
    const alt = item.alt ? itemPorId(item.alt) : null;
    const nomeAlt = alt ? alt.nome : 'uma alternativa gratuita';
    const v = precoEfetivo(a.itemId);
    if (v == null) {
      linhas.push({ a, valor: null, texto: `${item.nome}: preço a confirmar. A troca por ${nomeAlt} ainda não pode ser calculada.` });
    } else {
      const economia = v * a.participantes.length;
      total += economia;
      linhas.push({ a, valor: economia, texto: `${item.nome}: trocar por ${nomeAlt} economiza ${brl(v)} por pessoa (${a.participantes.length} pessoa(s)).` });
    }
  });
  return { linhas, total };
}

/* ---------- amigo secreto ---------- */
function sortearAmigoSecreto() {
  const ids = PARTICIPANTES.map(p => p.id);
  for (let tentativa = 0; tentativa < 10000; tentativa++) {
    const emb = [...ids];
    for (let i = emb.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [emb[i], emb[j]] = [emb[j], emb[i]];
    }
    if (ids.every((id, i) => id !== emb[i])) {
      const pares = {};
      ids.forEach((id, i) => pares[id] = emb[i]);
      estado.amigo = { data: new Date().toISOString(), pares };
      salvarEstado();
      return true;
    }
  }
  return false;
}
