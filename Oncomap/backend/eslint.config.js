const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
    // 1. Configurações recomendadas padrão do ESLint
    js.configs.recommended,

    // 2. Nossa configuração personalizada
    {
        files: ["**/*.js"], // Aplica a todos os arquivos .js
        languageOptions: {
            ecmaVersion: 2022, // Suporta recursos modernos do JS
            sourceType: "commonjs", // Indica que usamos 'require' e não 'import'
            globals: {
                ...globals.node, // Adiciona variáveis globais do Node (module, process, etc.)
                ...globals.jest, // Adiciona variáveis globais de teste (describe, it, expect)
            },
        },
        rules: {
            // Regras personalizadas (0 = desliga, 1 = aviso, 2 = erro)
            "no-unused-vars": "warn", // Avisa se criar variável e não usar (amarelo)
            "no-undef": "error",      // Erro se usar variável que não existe (vermelho)
            "no-console": "off",      // Permite console.log (essencial para seus scripts de backend)
        },
    },
    
    // 3. Ignorar pastas (o antigo .eslintignore agora fica aqui)
    {
        ignores: ["node_modules/", "coverage/", "dist/"],
    },
];