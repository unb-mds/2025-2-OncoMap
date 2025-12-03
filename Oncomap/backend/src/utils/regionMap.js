const REGION_TO_STATES = {
    'norte': ['AC', 'AM', 'AP', 'PA', 'RO', 'RR', 'TO'],
    'nordeste': ['AL', 'BA', 'CE', 'MA', 'PB', 'PE', 'PI', 'RN', 'SE'],
    'centro-oeste': ['DF', 'GO', 'MT', 'MS'],
    'sudeste': ['ES', 'MG', 'RJ', 'SP'],
    'sul': ['PR', 'RS', 'SC']
};

const getStatesByRegion = (regionName) => {
    if (!regionName) return [];
    const key = regionName.toLowerCase().replace('-', '').replace(' ', '').trim();
    if (key === 'centrooeste' || key === 'centro oeste') {
            return REGION_TO_STATES['centro-oeste'];
        }

    return REGION_TO_STATES[key] || [];
};

module.exports = { getStatesByRegion };