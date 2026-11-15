/* =========================================================
   NATAL EM FAMÍLIA 2026 — dados fixos (participantes e catálogo)
   Preços NÃO são presumidos: ficam vazios até serem cadastrados.
   ========================================================= */

// Os avatares são lidos de ../AVATARES/<avatar>.png (pasta que você está gerando).
// Enquanto a imagem não existir, aparece um avatar pixel com as iniciais.
const PARTICIPANTES = [
  { id: 'pamela', nome: 'Pâmela' },
  { id: 'mezzomo', nome: 'Mezzomo' },
  { id: 'sonia', nome: 'Sônia' },
  { id: 'alexandre',  nome: 'Alexandre' },
  { id: 'carina',     nome: 'Carina' },
  { id: 'fernanda',   nome: 'Fernanda' },
  { id: 'guilherme',  nome: 'Guilherme' },
  { id: 'isadora',    nome: 'Isadora' },
  { id: 'ivonete',    nome: 'Ivonete' },
  { id: 'juan',       nome: 'Juan' },
  { id: 'magnun',     nome: 'Magnun' },
  { id: 'matheus',    nome: 'Matheus' },
  { id: 'romulo',     nome: 'Rômulo' },
];

// Dias possíveis da viagem (ajuste conforme a agenda real)
const DIAS_VIAGEM = [
  '2026-12-22', '2026-12-23', '2026-12-24', '2026-12-25',
  '2026-12-26', '2026-12-27', '2026-12-28',
];

const CATEGORIAS = {
  classico:  'Clássicos da cidade',
  natal:     'Natal gratuito',
  economica: 'Experiências econômicas',
  natureza:  'Natureza e mirantes',
  paga:      'Atrações pagas especiais',
};

const ACESSOS = {
  gratis:    'Gratuito',
  consumo:   'Entrada gratuita, consumo opcional',
  verificar: 'Gratuito a confirmar',
  pago:      'Pago',
};

const DISTANCIAS = {
  perto:  'Perto, dá para ir a pé',
  medio:  'Precisa de transporte',
  longe:  'Distante: transporte obrigatório',
};

const INTERESSES = [
  { v: 'muito', t: 'Quero muito conhecer!' },
  { v: 'tenho', t: 'Tenho interesse.' },
  { v: 'tanto', t: 'Tanto faz.' },
  { v: 'nao',   t: 'Não quero ir.' },
];

const FORMAS = [
  { v: 'todos',  t: 'Quero ir com todo mundo' },
  { v: 'grupo',  t: 'Quero ir mesmo em grupo menor' },
  { v: 'encaixa',t: 'Posso ir se encaixar na programação' },
  { v: 'outra',  t: 'Prefiro fazer outra coisa nesse horário' },
];

const EXPERIENCIAS = [
  { v: 'nunca',  t: 'Nunca fui! Quero conhecer os clássicos.' },
  { v: 'uma',    t: 'Já fui uma vez, mas ainda tenho muito para explorar.' },
  { v: 'algumas',t: 'Já fui algumas vezes e quero conhecer lugares diferentes.' },
  { v: 'conheco',t: 'Conheço bastante e prefiro experiências novas.' },
];

const COMBINA = [
  { v: 'postais',   t: 'Quero visitar todos os cartões-postais.' },
  { v: 'principais',t: 'Quero conhecer apenas os principais pontos.' },
  { v: 'menos',     t: 'Quero descobrir atrações menos tradicionais.' },
  { v: 'gastronomia',t:'Quero priorizar gastronomia.' },
  { v: 'natureza',  t: 'Quero experiências na natureza.' },
  { v: 'familia',   t: 'Quero aproveitar o Natal e a companhia da família.' },
  { v: 'equilibrio',t: 'Quero equilibrar tudo.' },
];

const VISITAS = [
  { v: 'nunca',      t: 'Nunca visitei' },
  { v: 'quero_voltar', t: 'Já visitei e quero voltar' },
  { v: 'nao_repetir',  t: 'Já visitei e não faço questão de repetir' },
];

const ESTRATEGIAS = [
  { v: 'economico',  t: 'Econômico', d: 'Prioriza atrações gratuitas. Padrão inicial.' },
  { v: 'equilibrado',t: 'Equilibrado', d: 'Combina gratuitos com algumas atrações pagas.' },
  { v: 'completo',   t: 'Completo', d: 'Considera mais atrações pagas.' },
];

/* Catálogo: [id, nome, cidade, categoria, acesso, distância, alternativa gratuita (só para pagas)] */
const CATALOGO_LINHAS = [
  ["rua-coberta", "Rua Coberta", "Gramado", "classico", "gratis", "perto"],
  ["igreja-sao-pedro", "Igreja Matriz São Pedro", "Gramado", "classico", "gratis", "perto"],
  ["rua-torta", "Rua Torta", "Gramado", "classico", "gratis", "perto"],
  ["catedral-pedra", "Catedral de Pedra", "Canela", "classico", "gratis", "medio"],
  ["lago-negro-caminhada", "Lago Negro", "Gramado", "natureza", "gratis", "medio"],
  ["belvedere-quilombo", "Belvedere do Vale do Quilombo", "Gramado", "natureza", "gratis", "medio"],
  ["parque-do-lago", "Parque do Lago", "Canela", "natureza", "gratis", "medio"],
  ["mirantes", "Mirantes da Serra", "Serra Gaúcha", "natureza", "gratis", "medio"],
  ["vila-natal-etnias", "Vila de Natal da Praça das Etnias", "Gramado", "natal", "gratis", "perto"],
  ["decoracoes-noturnas", "Decorações natalinas à noite", "Gramado", "natal", "gratis", "perto"],
  ["musicas-rua-coberta", "Apresentações musicais na Rua Coberta", "Gramado", "natal", "gratis", "perto"],
  ["show-acendimento", "Acendimento das luzes de Natal", "Gramado", "natal", "verificar", "perto"],
  ["chocolate-quente", "Chocolate quente em cafeteria", "Gramado", "economica", "consumo", "perto"],
  ["cafe-cuca", "Café colonial com cuca", "Serra Gaúcha", "economica", "consumo", "perto"],
  ["piquenique", "Piquenique em área verde", "Serra Gaúcha", "economica", "consumo", "medio"],
  ["fabricas-chocolate", "Fábricas e lojas de chocolate", "Gramado", "economica", "verificar", "medio"],
  ["pedalinho-lago-negro", "Pedalinho no Lago Negro", "Gramado", "economica", "pago", "perto", "lago-negro-caminhada"],
  ["parque-olivas", "Parque Olivas", "Gramado", "paga", "pago", "longe", "parque-do-lago"],
  ["parque-caracol", "Parque do Caracol", "Canela", "paga", "pago", "longe", "mirantes"],
  ["skyglass", "Skyglass", "Canela", "paga", "pago", "longe", "mirantes"],
  ["terra-magica", "Terra Mágica Florybal", "Canela", "paga", "pago", "longe", "piquenique"],
  ["snowland", "Snowland", "Gramado", "paga", "pago", "medio", "rua-coberta"],
  ["mini-mundo", "Mini Mundo", "Gramado", "paga", "pago", "medio", "rua-torta"],
  ["alpen-park", "Alpen Park", "Canela", "paga", "pago", "medio", "piquenique"],
];

// Detalhes objetivos: descrição, duração aproximada e tópicos. Foto: fotos/<id>.jpg
const CATALOGO_DETALHES = {
  "rua-coberta": {"desc": "Calçadão com lojas de chocolate, artesanato e vitrines natalinas.", "dur": "30–60 min", "tops": ["Ponto mais movimentado do centro", "Fica mais bonita à noite", "Compras são opcionais"]},
  "igreja-sao-pedro": {"desc": "Igreja de pedra de estilo europeu, um dos cartões-postais do centro.", "dur": "20 min", "tops": ["Entrada gratuita", "Fachada ideal para foto", "Perto da Rua Coberta"]},
  "rua-torta": {"desc": "Rua sinuosa com casas de arquitetura alemã.", "dur": "20 min", "tops": ["Ótima para fotos", "Trecho curto a pé", "Cuidado com o trânsito"]},
  "catedral-pedra": {"desc": "Igreja de pedra com vitrais, no alto de Canela, com vista para a serra.", "dur": "40–60 min", "tops": ["Confirmar horário de visitação", "Vista do mirante", "Acesso de carro ou a pé"]},
  "lago-negro-caminhada": {"desc": "Lago cercado de pinheiros, com trilha de caminhada ao redor.", "dur": "1–1h30", "tops": ["Trilha plana e fácil", "Leve agasalho", "Pedalinho aluga na beira"]},
  "belvedere-quilombo": {"desc": "Mirante com vista ampla do Vale do Quilombo.", "dur": "30–45 min", "tops": ["Vista bonita no fim da tarde", "Acesso de carro", "Confirmar estado da estrada"]},
  "parque-do-lago": {"desc": "Parque com lago e área de convivência em Canela.", "dur": "1 h", "tops": ["Bom para caminhar", "Área para piquenique", "Gratuito"]},
  "mirantes": {"desc": "Roteiro de mirantes da serra para fotos e paisagens.", "dur": "2 h", "tops": ["Vários pontos em um dia", "Leve roupa de frio", "Melhor de carro"]},
  "vila-natal-etnias": {"desc": "Vila temática de Natal na Praça das Etnias, com casinhas decoradas.", "dur": "1 h", "tops": ["Gratuita", "Ótima para crianças", "Melhor no fim da tarde"]},
  "decoracoes-noturnas": {"desc": "Passeio pelas ruas iluminadas e decoradas para o Natal.", "dur": "1h30", "tops": ["Vá de carro ou a pé", "Leve roupa quente", "Ótimo passeio à noite"]},
  "musicas-rua-coberta": {"desc": "Apresentações musicais e corais no calçadão, no período natalino.", "dur": "40 min", "tops": ["Confirmar a programação do dia", "Gratuito", "Acontece na Rua Coberta"]},
  "show-acendimento": {"desc": "Cerimônia de acendimento das luzes de Natal da cidade.", "dur": "1 h", "tops": ["Confirmar data e horário", "Chegue cedo para ver bem", "Gratuito"]},
  "chocolate-quente": {"desc": "Chocolate quente cremoso em cafeterias do centro.", "dur": "30–45 min", "tops": ["Cobrado por pedido", "Ótimo para o frio", "Opção econômica"]},
  "cafe-cuca": {"desc": "Café colonial com cucas, geleias e produtos da região.", "dur": "1h30", "tops": ["Pago por consumo", "Dá para dividir", "Reserve em dias de movimento"]},
  "piquenique": {"desc": "Piquenique com produtos comprados no mercado, em área verde.", "dur": "2 h", "tops": ["Opção mais econômica", "Leve mantas e agasalho", "Confirme as regras do local"]},
  "fabricas-chocolate": {"desc": "Lojas e fábricas de chocolate, com degustação.", "dur": "1 h", "tops": ["Confirmar se a visita é gratuita", "Degustações", "Compras são opcionais"]},
  "pedalinho-lago-negro": {"desc": "Passeio de pedalinho no Lago Negro.", "dur": "30 min", "tops": ["Pago por embarcação", "Alternativa gratuita: caminhada", "Ideal com crianças"]},
  "parque-olivas": {"desc": "Parque com olivais, mirantes e áreas de convivência.", "dur": "2 h", "tops": ["Ingresso a confirmar", "Conferir horário de funcionamento", "Vista ampla da região"]},
  "parque-caracol": {"desc": "Parque com cascata alta e trilhas de acesso.", "dur": "2 h", "tops": ["Ingresso a confirmar", "Trilha com escadas", "Calçado confortável"]},
  "skyglass": {"desc": "Mirante com passarela de vidro sobre o vale.", "dur": "1 h", "tops": ["Ingresso a confirmar", "Bom para o pôr do sol", "Agende o horário"]},
  "terra-magica": {"desc": "Parque temático com brinquedos e shows para o dia inteiro.", "dur": "5–8 h", "tops": ["Ingresso a confirmar", "Ideal com crianças", "Chegue cedo e leve lanche"]},
  "snowland": {"desc": "Parque com neve artificial e atividades de frio.", "dur": "1–2 h", "tops": ["Ingresso a confirmar", "Roupa de frio no local", "Confirmar horários"]},
  "mini-mundo": {"desc": "Miniaturas de cidades e monumentos do Brasil e do mundo.", "dur": "1h30", "tops": ["Ingresso a confirmar", "Bom para todas as idades", "Perto do centro"]},
  "alpen-park": {"desc": "Parque com trilhas, tirolesa e atividades ao ar livre.", "dur": "2–3 h", "tops": ["Ingresso a confirmar", "Atividades de aventura", "Confirmar idade mínima"]},
};


// Posições ilustrativas no mapa isométrico (grade 0–12)
const POS_ESPECIAIS = {
  'parque-olivas': [12.2, 2.6],
  'parque-caracol': [14, 9.2],
  'skyglass': [13.4, 13.4],
  'terra-magica': [14.2, 4.6],
  'lago-negro-caminhada': [2.3, 10],
};

// Endereço da casa alugada (ponto de partida dos grupos no mapa)
const ENDERECO_CASA = 'Gramado, RS';
// Hash SHA-256 da senha do modo organizador (a senha não fica no código)
const ADM_HASH = 'a3dcb9ebaef3ee8b12b1a636ac63c13e643c694d2a40a933298267939f50e2b7';

// Fotos: imagens de Wikimedia Commons (licença livre), com crédito exibido no card.
const FOTOS = {
  'rua-coberta': {url: 'foto-rua-coberta.jpg', autor: 'Foto do organizador', licenca: 'uso familiar', pagina: ''},
  'igreja-sao-pedro': {url: 'foto-igreja-sao-pedro.jpg', autor: 'Foto do organizador', licenca: 'uso familiar', pagina: ''},
  'catedral-pedra': {url: 'foto-catedral-pedra.jpg', autor: 'Foto do organizador', licenca: 'uso familiar', pagina: ''},
  'lago-negro-caminhada': {url: 'foto-lago-negro-caminhada.jpg', autor: 'Foto do organizador', licenca: 'uso familiar', pagina: ''},
  'belvedere-quilombo': {url: 'foto-belvedere-quilombo.jpg', autor: 'Foto do organizador', licenca: 'uso familiar', pagina: ''},
  'parque-do-lago': {url: 'foto-parque-do-lago.jpg', autor: 'Imagem de IA', licenca: 'uso familiar', pagina: ''},
  'mirantes': {url: 'foto-mirantes.jpg', autor: 'Imagem de IA', licenca: 'uso familiar', pagina: ''},
  'vila-natal-etnias': {url: 'foto-vila-natal-etnias.jpg', autor: 'Imagem de IA', licenca: 'uso familiar', pagina: ''},
  'show-acendimento': {url: 'foto-show-acendimento.jpg', autor: 'Imagem de IA', licenca: 'uso familiar', pagina: ''},
  'chocolate-quente': {url: 'foto-chocolate-quente.jpg', autor: 'Imagem de IA', licenca: 'uso familiar', pagina: ''},
  'terra-magica': {url: 'foto-terra-magica.jpg', autor: 'Foto de divulgação', licenca: 'uso familiar', pagina: ''},
  'snowland': {url: 'foto-snowland.jpg', autor: 'Foto de divulgação', licenca: 'uso familiar', pagina: ''},
  'mini-mundo': {url: 'foto-mini-mundo.jpg', autor: 'Foto de divulgação', licenca: 'uso familiar', pagina: ''},
  'decoracoes-noturnas': {url: 'foto-decoracoes-noturnas.jpg', autor: 'Foto de divulgação', licenca: 'uso familiar', pagina: ''},
  'cafe-cuca': {url: 'foto-cafe-cuca.jpg', autor: 'Imagem de IA', licenca: 'uso familiar', pagina: ''},
  'fabricas-chocolate': {url: 'foto-fabricas-chocolate.jpg', autor: 'Imagem de IA', licenca: 'uso familiar', pagina: ''},
  'parque-caracol': {url: 'foto-parque-caracol.jpg', autor: 'Imagem de IA', licenca: 'uso familiar', pagina: ''},
  'skyglass': {url: 'foto-skyglass.jpg', autor: 'Foto do organizador', licenca: 'uso familiar', pagina: ''},
  'pedalinho-lago-negro': {url: 'foto-pedalinho-lago-negro.jpg', autor: 'Foto do organizador', licenca: 'uso familiar', pagina: ''},
  'musicas-rua-coberta': {url: 'foto-musicas-rua-coberta.jpg', autor: 'Foto do organizador', licenca: 'uso familiar', pagina: ''},
  'piquenique': {url: 'foto-piquenique.jpg', autor: 'Foto do organizador', licenca: 'uso familiar', pagina: ''},
  'rua-torta': {url: 'foto-rua-torta.jpg', autor: 'Foto do organizador', licenca: 'uso familiar', pagina: ''},
  'parque-olivas': {url: 'foto-parque-olivas.jpg', autor: 'Foto do organizador', licenca: 'uso familiar', pagina: ''},
  'alpen-park': {url: 'foto-alpen-park.jpg', autor: 'Foto do organizador', licenca: 'uso familiar', pagina: ''},
};

// Dados conferidos em fontes públicas (ver data da informação em cada item). Sobrepõem os detalhes gerais.
const DETALHES_EXTRAS = {
 "catedral-pedra": {
  "dur": "40–60 min",
  "preco": "Entrada gratuita (subida da torre é paga)",
  "horario": "Todos os dias, 9h–17h30"
 },
 "snowland": {
  "dur": "Dia inteiro (recomendado)",
  "preco": "R$ 179 (out/2026) · À confirmar valor em alta temporada",
  "horario": "Qui a ter, 10h–17h · fecha às quartas (exceto jul, nov e dez)"
 },
 "mini-mundo": {
  "dur": "40 min a 2 h",
  "preco": "À confirmar valor",
  "horario": "Todos os dias, 9h–17h"
 },
 "alpen-park": {
  "dur": "Meio dia a um dia",
  "preco": "Passaporte R$ 158 (fev/2026) · À confirmar valor atual",
  "horario": "Todos os dias, 9h–17h20"
 },
 "terra-magica": {
  "preco": "À confirmar valor",
  "horario": "Todos os dias, 9h–16h30"
 },
 "skyglass": {
  "preco": "À confirmar valor",
  "horario": "Todos os dias, 9h–18h"
 },
 "parque-caracol": {
  "preco": "À confirmar valor"
 }
};

const CATALOGO = CATALOGO_LINHAS.map(([id, nome, cidade, cat, acesso, dist, alt]) => ({
  id, nome, cidade, cat, acesso, dist, alt: alt || null,
  ...(CATALOGO_DETALHES[id] || { desc: '', dur: '', tops: [] }),
  ...(DETALHES_EXTRAS[id] || {}),
  foto: (FOTOS[id] || {}).url || '',
  credito: FOTOS[id] || null,
}));

const CATALOGO_POR_ID = Object.fromEntries(CATALOGO.map(i => [i.id, i]));
