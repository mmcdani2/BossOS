import { Card, CardBody, Button, Chip, Progress, Avatar } from "@heroui/react";

export default function Dashboard() {
  return (
    <div className="w-full flex justify-center">
    <section className="w-full max-w-7xl grid grid-cols-12 gap-4 px-6 py-16">

      {/* ===== Row 2: KPI Cards (3 + 3 + 3 + 3 = 12) ===== */}
      <Card className="col-span-12 sm:col-span-6 lg:col-span-3 border border-default-200/60 bg-content1/80">
        <CardBody className="space-y-3">
          <div className="text-sm text-default-500">Active Jobs</div>
          <div className="text-3xl font-semibold text-foreground">42</div>
          <div className="h-2 w-full rounded-full bg-default-200/50 overflow-hidden">
            <div className="h-full w-[68%] bg-primary/80 transition-all" />
          </div>
          <div className="text-xs text-default-400">↑ 12% vs. yesterday</div>
        </CardBody>
      </Card>

      <Card className="col-span-12 sm:col-span-6 lg:col-span-3 border border-default-200/60 bg-content1/80">
        <CardBody className="space-y-3">
          <div className="text-sm text-default-500">Technicians On Route</div>
          <div className="text-3xl font-semibold text-foreground">18</div>
          <Progress
            aria-label="On-time rate"
            value={82}
            className="mt-1"
            classNames={{ indicator: "bg-success" }}
          />
          <div className="text-xs text-default-400">On-time rate: 82%</div>
        </CardBody>
      </Card>

      <Card className="col-span-12 sm:col-span-6 lg:col-span-3 border border-default-200/60 bg-content1/80">
        <CardBody className="space-y-3">
          <div className="text-sm text-default-500">Open Invoices</div>
          <div className="text-3xl font-semibold text-foreground">$124.9k</div>
          <div className="h-2 w-full rounded-full bg-default-200/50 overflow-hidden">
            <div className="h-full w-[44%] bg-warning/80 transition-all" />
          </div>
          <div className="text-xs text-default-400">30+ days: $17.4k</div>
        </CardBody>
      </Card>

      <Card className="col-span-12 sm:col-span-6 lg:col-span-3 border border-default-200/60 bg-content1/80">
        <CardBody className="space-y-3">
          <div className="text-sm text-default-500">New Leads (7d)</div>
          <div className="text-3xl font-semibold text-foreground">39</div>
          <div className="h-2 w-full rounded-full bg-default-200/50 overflow-hidden">
            <div className="h-full w-[74%] bg-secondary/80 transition-all" />
          </div>
          <div className="text-xs text-default-400">↑ 8 this week</div>
        </CardBody>
      </Card>

      {/* ===== Row 3: Revenue Trend (6) + Dispatch Board (6) ===== */}
      <Card className="col-span-12 lg:col-span-6 border border-default-200/60 bg-content1/80">
        <CardBody>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Revenue (7d)</h3>
            <Chip size="sm" className="bg-success/10 text-success border border-success/20">
              +$38k
            </Chip>
          </div>
          <div className="h-28 w-full rounded-md border border-default-200/50 bg-background/60">
            {/* sparkline placeholder */}
            <div className="h-full w-full bg-gradient-to-t from-primary/20 via-primary/10 to-transparent" />
          </div>
          <p className="mt-2 text-xs text-default-500">Avg ticket: $612</p>
        </CardBody>
      </Card>

      <Card className="col-span-12 lg:col-span-6 border border-default-200/60 bg-content1/80">
        <CardBody className="h-full">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Dispatch Board</h3>
            <Button size="sm" variant="light" className="text-default-600">
              View full
            </Button>
          </div>
          <div className="relative h-48 w-full rounded-lg border border-default-200/50 bg-background/60">
            <div className="absolute inset-0 grid grid-cols-7 gap-px p-3">
              {Array.from({ length: 14 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-md bg-content2/70 hover:bg-content2 cursor-pointer transition-colors"
                />
              ))}
            </div>
          </div>
          <p className="mt-3 text-xs text-default-500">Drag to assign • Drop to reschedule</p>
        </CardBody>
      </Card>

      {/* ===== Row 4: Pipeline (6) + Team Activity (6) ===== */}
      <Card className="col-span-12 lg:col-span-6 border border-default-200/60 bg-content1/80">
        <CardBody>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Sales Pipeline</h3>
            <Button size="sm" variant="light" className="text-default-600">
              Manage
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "New", value: 23 },
              { label: "Qualified", value: 11 },
              { label: "Estimate Out", value: 7 },
              { label: "Closed Won", value: 5 },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-md border border-default-200/60 bg-background/70 p-3 hover:bg-background transition-colors"
              >
                <div className="text-xs text-default-500">{s.label}</div>
                <div className="text-xl font-semibold text-foreground">{s.value}</div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card className="col-span-12 lg:col-span-6 border border-default-200/60 bg-content1/80">
        <CardBody className="space-y-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Team Activity</h3>
            <Chip size="sm" className="bg-primary/10 text-primary border border-primary/20">
              Live
            </Chip>
          </div>

          <ul className="divide-y divide-default-200/60">
            {[
              { name: "J. Alvarez", action: "Closed job #A-1182", time: "2m", color: "text-success" },
              { name: "M. Patel", action: "Added estimate for #E-904", time: "12m", color: "text-warning" },
              { name: "R. Li", action: "Collected payment #P-771", time: "29m", color: "text-primary" },
            ].map((a, i) => (
              <li key={i} className="flex items-center gap-3 py-3">
                <Avatar
                  className="h-8 w-8 text-tiny"
                  name={a.name}
                  color="primary"
                  radius="full"
                />
                <div className="flex-1">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{a.name}</span>{" "}
                    <span className="text-default-500">{a.action}</span>
                  </p>
                </div>
                <span className={`text-xs ${a.color}`}>{a.time}</span>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>
    </section>
    </div>
  );
}
