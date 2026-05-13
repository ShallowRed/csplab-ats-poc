import type { Preview } from '@storybook/vue3-vite'
import { setup } from '@storybook/vue3'
import { createPinia } from 'pinia'
import '../src/styles/index.css'
import { storybookRouter } from '../src/router/storybook'

setup((app) => {
  app.use(createPinia())
  app.use(storybookRouter)
})

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },

    options: {
      // prettier-ignore
      storySort: {
        method: 'alphabetical',
        locales: 'fr-FR',
        order: [
          '00 — Design System', [
            'Introduction',
            'DDR', [
              'DDR-000 — Pourquoi des DDR',
              'DDR-001 — Couches de composition',
              'DDR-002 — Drawer vs Modal vs Page',
              'DDR-003 — Kanban zone de refus',
              'DDR-004 — Sélection et bulk actions',
              'DDR-005 — Badges sémantiques de statut',
              'DDR-006 — Évaluation sans note neutre',
              'DDR-007 — Filtres chips et popover',
              'DDR-008 — États standards',
              'DDR-009 — Densité réglable',
              'DDR-010 — AppShell en grille',
            ],
            'Catalogue UI',
          ],
          '01 — Fondations',    ['Tokens', 'États standards'],
          '02 — Atomes',
          '03 — Molécules',
          '04 — Composants métier', ['Dashboard', 'Offres', 'Pipeline', 'Entretiens'],
          '05 — Sections génériques',
          '06 — Sections ATS',  ['Pipeline', 'Candidatures', 'Entretiens', 'Evaluation'],
          '07 — Vues ATS',      [
            'Tableau de bord (page)',
            'Offres — Liste (page)',
            'Pipeline — Kanban (page)',
            'Candidatures — Table (page)',
            'Candidature — Détail (page)',
            'Entretiens — Planning (page)',
            'Evaluation — Saisie (page)',
            'Paramètres (page)',
          ],
          '*',
        ],
      },
    },
  },
};

export default preview;