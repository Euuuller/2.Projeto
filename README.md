# SuperStorys — Analytics Dashboard

> Plataforma de inteligência de dados com foco em decisões estratégicas extraordinárias para o varejo corporativo.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)
![Chart.js](https://img.shields.io/badge/Chart.js-4.4-FF6384?logo=chartdotjs&logoColor=white)
![D3.js](https://img.shields.io/badge/D3.js-7.8-F9A03C?logo=d3dotjs&logoColor=white)

---

## 📊 Visão Geral do Projeto

O **SuperStorys Analytics Dashboard** é uma aplicação front-end projetada para transformar um volume massivo de dados transacionais de uma varejista norte-americana em inteligência de negócio acionável. 

Construído com uma arquitetura moderna nativa (Vanilla JS e CSS Modular) aliada ao poder do **Chart.js** e **D3.js**, o dashboard processa e visualiza dinamicamente dados simulados complexos. Ele fornece um fluxo analítico completo, focado em alta legibilidade e performance otimizada, eliminando as fricções visuais que dashboards tradicionais costumam apresentar.

---

## 🎯 Proposta de Valor e Casos de Uso

A ferramenta atende aos principais desafios analíticos e demandas executivas:

- **Retenção & Churn:** Visualização térmica de coortes de clientes para identificar comportamentos de abandono por trimestre e ano.
- **Segmentação Estratégica:** Clusterização de clientes utilizando o método estatístico RFM (Recency, Frequency, Monetary).
- **Concentração Geográfica de Receita:** Mapas coropléticos ilustrando claramente a densidade e o impacto em estados-chave (ex. California).
- **KPIs em Tempo Real:** Margem de lucro consolidada, ROI e Customer Acquisition Cost (CAC) para rápida tomada de decisão.

---

## 🗂️ Arquitetura e Estrutura de Diretórios

O projeto utiliza uma arquitetura modularizada rigorosa (`base`, `layout`, `components`, `pages` para CSS; e `core`, `layout`, `pages` para JS), permitindo alta manutenibilidade e escalabilidade do código do front-end. O ponto de entrada principal é um arquivo hiper-otimizado de página única (`index.html`).

```text
Dashboard-Excel/
├── index.html                  ← HTML principal da Single Page Application (SPA)
├── README.md                   ← Documentação do Projeto
├── LICENSE                     ← Informações Legais Relativas à Licença
└── assets/
    ├── css/                    ← CSS estritamente modular e compartimentado
    │   ├── base/               ← Tokens globais, Reset e Utilitários responsivos
    │   │   ├── variables.css 
    │   │   ├── reset.css     
    │   │   └── utilities.css 
    │   ├── layout/             ← Regras para o App Shell, Sidebar e Main Container
    │   │   └── layout.css    
    │   ├── components/         ← Componentes reusáveis ​​(KPI Cards, Grids, etc.)
    │   │   ├── components.css
    │   │   └── charts.css    
    │   └── pages/              ← Estilizações vinculadas e específicas de abas e telas
    │       ├── cover.css     
    │       └── business.css  
    ├── js/                     ← Lógica modular
    │   ├── core/               ← Funções globais de configuração, mock data e motor
    │   │   ├── config.js
    │   │   ├── utils.js
    │   │   ├── data.js
    │   │   └── main.js
    │   ├── layout/             ← Operações de elementos do layout (navegação e menu)
    │   │   ├── nav.js
    │   │   └── sidebar.js
    │   ├── pages/              ← Lógicas específicas de abas ou transições iniciais
    │   │   └── cover.js
    │   └── charts/             ← Módulos instanciadores das visualizações avançadas
    │       ├── cohort.js
    │       ├── rfm.js
    │       ├── descriptive.js
    │       └── performance.js
    └── data/                   ← (Opcional) JSON complementar
```

---

## 💻 Tech Stack Refinada

A plataforma é completamente independente de frameworks pesados e transpilações complexas, garantido leveza, velocidade de carregamento excepcional e flexibilidade de hosting.

| Tecnologia Limitada | Uso Principal da Implementação Prática |
| :--- | :--- |
| **HTML5** | DOM semântico, atributos ARIA nativos |
| **CSS3 Vanilla** | Flexbox, CSS Grid avançado e animações nativas super responsivas |
| **JS ES6+** | Manuseio inteligente do DOM e modularização através de importações ES6 |
| **Chart.js** (v4.4.0) | Mapeamento gráfico interativo (Line, Bar, Radar, Scatter) |
| **D3.js** (v7.8.5) | Mapeamento Coroplético (Avançado) e Estruturas em Treemap |
| **TopoJSON** | Geometria vetorial hiper enxuta de distritos ou regiões (EUA) |
| **Google Fonts** | Tipografia corporativa moderna (`DM Sans`, `Playfair Display`) |

---

## 🚀 Guia de Configuração e Execução

Embora a aplicação seja inteiramente front-end, ela carece estritamente de um protocolo **HTTP/HTTPS real** localmente para não ser bloqueada nas requisições do Cross-Origin (CORS), especialmente por causa das dependências em leitura do vetor cartográfico (`TopoJSON`). 

Ao clonar este projeto, escolha **apenas uma** das abordagens abaixo baseadas em servidores de desenvolvimento estático rápido:

### Abordagem 1 — VS Code (A mais recomendada)
1. Abra a pasta do projeto através do **VS Code**.
2. Certifique-se de que a extensão de terceiros **Live Server** (do desenvolvedor Ritwick Dey) está instalada.
3. No explorador de arquivos, clique com o **botão direito** no arquivo master central `index.html` → Selecione a aba flutuante **Open with Live Server**.

### Abordagem 2 — CLI Node.js HTTP-Server
```bash
# Na raiz principal do projeto, onde o index.html reside:
npx http-server . -p 5500
# Abra em seu browser favorito: http://localhost:5500
```

### Abordagem 3 — CLI Python Native HTTP Server
```bash
# Muito rápido se Python >= 3 estiver previamente configurado
python -m http.server 5500
# Abra em seu browser favorito: http://localhost:5500
```

> **Aviso de Usabilidade:** O dashboard carrega blocos informativos robustos que podem estar temporariamente otimizados a nível de "mobile-block" num display restrito. Recomendado navegar e executar sua testagem primária através de um **Desktop ou Tablet em landscape**.

---

## 👤 Equipe e Manutenção Técnica

Desenvolvido, Arquitetado e Mantido por:

**Euller Duarte** — Data Analyst & Dashboard Engineer

*Caso precise entrar em contato para expansão ou integrações de APIs Backend:*  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Profile_Connect-0A66C2?logo=linkedin&style=flat)](https://linkedin.com/) 
[![GitHub](https://img.shields.io/badge/GitHub-Profile_Repo-181717?logo=github&style=flat)](https://github.com/eulle)

---

## 📄 Licença de Software Comercial

Distribuído sob a licença de open-source standard **MIT**. Verifique o arquivo secundário [LICENSE](LICENSE) acoplado para permissões diretas de cópia e detalhes de obrigações de marca/reconhecimento.
