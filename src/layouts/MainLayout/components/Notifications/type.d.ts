import type { templates } from './Notifications'


declare global {
  type Notifications = {
    [K in keyof typeof templates]: Parameters<typeof templates[K]>[0]
  }
}
