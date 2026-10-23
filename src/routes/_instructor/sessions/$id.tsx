import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_instructor/sessions/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_instructor/sessions/$id"!</div>
}
