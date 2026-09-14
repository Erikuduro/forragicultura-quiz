# Simulado V/F — Plantas Forrageiras

Site estático (HTML/CSS/JS puro, sem build) com simulado interativo das 40 questões de Verdadeiro/Falso comentado sobre Plantas Forrageiras (3ª V.A.).

## Como funciona

- Tela inicial: escolha quais módulos incluir e se a ordem das questões é sequencial ou aleatória.
- Para cada questão, clique em **Verdadeiro** ou **Falso**. O site mostra na hora se você acertou e exibe a justificativa técnica.
- Ao final, você vê a pontuação total, o desempenho por módulo e pode revisar apenas as questões que errou.

## Estrutura

```
index.html   → estrutura da página
style.css    → estilos
script.js    → lógica do simulado
data.js      → banco de questões (editável — basta adicionar novos itens no array QUIZ_DATA)
```

## Rodar localmente

Basta abrir `index.html` no navegador, ou servir a pasta com qualquer servidor estático:

```bash
python3 -m http.server 8000
```

## Deploy no Render (Static Site)

1. Suba esta pasta para um repositório no GitHub.
2. No Render, crie um novo **Static Site** apontando para o repositório.
3. Configurações:
   - **Build Command:** (deixe em branco — não há build)
   - **Publish Directory:** `.` (raiz do repositório)
4. Deploy. Pronto — o site fica disponível na URL gerada pelo Render.

## Adicionar/editar questões

Edite o array `QUIZ_DATA` em `data.js`. Cada módulo tem `modulo`, `icone` e uma lista `questoes`, cada questão com `n` (número), `texto`, `resposta` (`true`/`false`) e `justificativa`.
