type Stat = {
  label: string
  value: string
  detail: string
}

type ListItem = {
  title: string
  meta: string
}

type WorkspacePageProps = {
  title: string
  description: string
  stats: Stat[]
  items: ListItem[]
}

export function WorkspacePage({
  title,
  description,
  stats,
  items,
}: WorkspacePageProps) {
  return (
    <section className="min-h-svh bg-background px-6 py-8 md:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-2">
          <p className="text-sm font-medium text-muted-foreground">
            Nova Lance
          </p>
          <h1 className="text-3xl font-semibold tracking-normal text-foreground">
            {title}
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <article
              className="rounded-lg border bg-card p-5 text-card-foreground"
              key={stat.label}
            >
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="mt-3 text-2xl font-semibold">{stat.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {stat.detail}
              </p>
            </article>
          ))}
        </div>

        <div className="rounded-lg border bg-card text-card-foreground">
          <div className="border-b px-5 py-4">
            <h2 className="text-base font-semibold">Current Work</h2>
          </div>
          <div className="divide-y">
            {items.map((item) => (
              <div
                className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                key={item.title}
              >
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.meta}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
