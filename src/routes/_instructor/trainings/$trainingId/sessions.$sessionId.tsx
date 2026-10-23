import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_instructor/trainings/$trainingId/sessions/$sessionId',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>Hello "/_instructor/trainings/$trainingId/sessions/$sessionId"!</div>
  )
}
