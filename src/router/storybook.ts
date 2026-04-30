import { createMemoryHistory } from 'vue-router'
import { createAppRouter } from './index'

export const storybookRouter = createAppRouter(createMemoryHistory())
