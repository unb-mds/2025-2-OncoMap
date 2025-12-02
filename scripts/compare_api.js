const BASE = process.env.API_BASE || 'http://localhost:3001';

const parseCurrency = (str) => {
  if (str == null) return 0;
  if (typeof str === 'number') return str;
  try {
    return Number(String(str).replace(/[^0-9,-]+/g, '').replace(',', '.'));
  } catch (e) {
    return 0;
  }
};

const fetchJson = async (url) => {
  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText} for ${url}`);
  return res.json();
};

const run = async () => {
  console.log('Comparador de APIs - começando');
  try {
    const regionSlug = 'norte';
    const regionData = await fetchJson(`${BASE}/api/v1/map/regiao/${regionSlug}`);
    console.log('\nRegião:', regionData.regiao);

    const regionReported = parseCurrency(regionData.investimentosGerais?.[0]?.valor || 0);
    console.log('  - Total reportado (investimentosGerais[0].valor):', regionReported);

    let regionSum = 0;
    (regionData.municipios || []).forEach(estado => {
      (estado.investimentos || []).forEach(mun => {
        regionSum += parseCurrency(mun.valor);
      });
    });
    console.log('  - Soma calculada (soma de municípios):', regionSum);
    if (Math.abs(regionReported - regionSum) > 1) {
      console.warn('  => Diferença detectada na região entre reportado e soma de municípios');
    } else {
      console.log('  => Região consistente');
    }

    const estado = (regionData.municipios || [])[0];
    if (!estado) {
      console.warn('Nenhum estado retornado pela região para testar estado/município.');
      return;
    }
    console.log('\nEstado selecionado:', estado.nome, 'codarea=', estado.codarea);

    const stateData = await fetchJson(`${BASE}/api/v1/map/estado/${estado.codarea}`);
    console.log('  - total_invested (estado):', stateData.total_invested);

    let stateSumFromRegion = 0;
    estado.investimentos.forEach(m => stateSumFromRegion += parseCurrency(m.valor));
    console.log('  - soma dos municípios (segundo /regiao):', stateSumFromRegion);
    if (Math.abs(stateData.total_invested - stateSumFromRegion) > 1) {
      console.warn('  => Diferença detectada entre /estado/:codIbge e soma listada em /regiao');
    } else {
      console.log('  => Estado consistente com /regiao');
    }

    const municipio = estado.investimentos?.[0];
    if (!municipio || !municipio.codarea_municipio) {
      console.warn('Nenhum município com IBGE disponível para testar detalhes.');
      return;
    }
    console.log('\nMunicípio selecionado:', municipio.nome, 'ibge=', municipio.codarea_municipio);
    const munData = await fetchJson(`${BASE}/api/v1/map/municipio/${municipio.codarea_municipio}`);
    console.log('  - total_invested (mun):', munData.total_invested);

    const cats = munData.categories || {};
    const catsSum = Object.values(cats).reduce((s, v) => s + Number(v || 0), 0);
    console.log('  - soma das categorias (mun):', catsSum);
    if (Math.abs(munData.total_invested - catsSum) > 1) {
      console.warn('  => Diferença entre total do município e soma por categorias');
    } else {
      console.log('  => Município consistente internamente');
    }

    try {
      const stats = await fetchJson(`${BASE}/api/v1/stats/general`);
      const states = stats.states || {};
      const stateReportedInStats = states[stateData.uf] || states[estado.uf] || states[estado.codarea] || null;
      console.log('\nEstatísticas gerais (states) têm entrada para este estado?:', !!stateReportedInStats);
      if (stateReportedInStats != null) {
        console.log('  - valor em /stats/general para UF:', stateReportedInStats);
        if (Math.abs(stateReportedInStats - stateData.total_invested) > 1) {
          console.warn('  => Diferença entre /stats/general e /map/estado/:codIbge');
        } else {
          console.log('  => /stats/general e /map/estado parecem consistentes');
        }
      }
    } catch (e) {
      console.warn('Não foi possível consultar /api/v1/stats/general:', e.message);
    }

    console.log('\nComparação concluída. Se houveram diferenças, verifique ETL e valores de final_extracted_value no DB.');

  } catch (error) {
    console.error('Erro durante comparação:', error.message);
    console.error('Verifique se o backend está rodando em', BASE);
  }
};

run();
