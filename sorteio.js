/* Sorteio circular: cada participante presenteia uma pessoa diferente. */
(function (root) {
  function sortear(ids, random = crypto.getRandomValues.bind(crypto)) {
    if (!Array.isArray(ids) || ids.length < 2 || new Set(ids).size !== ids.length) {
      throw new Error('São necessárias pelo menos duas pessoas diferentes.');
    }
    const ordem = ids.slice();
    for (let i = ordem.length - 1; i > 0; i--) {
      const limite = Math.floor(0x100000000 / (i + 1)) * (i + 1);
      const valor = new Uint32Array(1);
      do { random(valor); } while (valor[0] >= limite);
      const j = valor[0] % (i + 1);
      [ordem[i], ordem[j]] = [ordem[j], ordem[i]];
    }
    return ordem.map((pessoa, i) => ({ pessoa, presenteia: ordem[(i + 1) % ordem.length] }));
  }
  root.NatalSorteio = { sortear };
  if (typeof module !== 'undefined') module.exports = { sortear };
})(typeof window === 'undefined' ? globalThis : window);
