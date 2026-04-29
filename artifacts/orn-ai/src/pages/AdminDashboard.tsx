import { Shell } from "@/components/layout/Shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAdminPipeline, getAdminPipelineQueryKey, useAdminActivity, getAdminActivityQueryKey } from "@workspace/api-client-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from "recharts";
import { Loader2, ArrowUpRight, Activity, Users, Star, GraduationCap } from "lucide-react";

export default function AdminDashboard() {
  const { data: pipeline, isLoading: isLoadingPipeline } = useAdminPipeline({
    query: { queryKey: getAdminPipelineQueryKey() }
  });

  const { data: activities, isLoading: isLoadingActivity } = useAdminActivity({
    query: { queryKey: getAdminActivityQueryKey() }
  });

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

  return (
    <Shell>
      <div className="p-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Platform Administration</h1>
          <p className="text-muted-foreground mt-1">Macro-level pipeline analytics and system velocity.</p>
        </div>

        {/* High-level KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Candidates", value: pipeline?.totalCandidates, icon: Users, color: "text-blue-500" },
            { label: "Evaluated Profiles", value: pipeline?.evaluated, icon: Star, color: "text-purple-500" },
            { label: "Active Upskilling", value: pipeline?.upskillingActive, icon: GraduationCap, color: "text-orange-500" },
            { label: "Q3 Placements", value: pipeline?.placementsThisQuarter, icon: ArrowUpRight, color: "text-green-500" },
          ].map((kpi, i) => (
            <Card key={i} className="border-muted shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
                  <kpi.icon className={`size-4 ${kpi.color}`} />
                </div>
                <div className="text-3xl font-bold">
                  {isLoadingPipeline ? <div className="h-9 w-20 bg-muted animate-pulse rounded" /> : kpi.value?.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Main Chart - Growth */}
          <Card className="lg:col-span-2 border-muted shadow-sm">
            <CardHeader>
              <CardTitle>Platform Growth</CardTitle>
              <CardDescription>Monthly candidate registrations vs AI evaluations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                {isLoadingPipeline ? (
                  <div className="w-full h-full bg-muted/20 animate-pulse rounded-md flex items-center justify-center">
                    <Loader2 className="size-6 animate-spin text-muted-foreground/50" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={pipeline?.monthlyGrowth} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorEval" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Area type="monotone" dataKey="registrations" name="Registrations" stroke="hsl(var(--chart-2))" fillOpacity={1} fill="url(#colorReg)" />
                      <Area type="monotone" dataKey="evaluations" name="Evaluations" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorEval)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Readiness Distribution */}
          <Card className="border-muted shadow-sm">
            <CardHeader>
              <CardTitle>Readiness Distribution</CardTitle>
              <CardDescription>Current state of the evaluated talent pool</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="h-[260px] w-full">
                {isLoadingPipeline ? (
                  <div className="w-full h-full bg-muted/20 animate-pulse rounded-md flex items-center justify-center">
                    <Loader2 className="size-6 animate-spin text-muted-foreground/50" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pipeline?.byReadiness}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="count"
                        nameKey="tier"
                      >
                        {pipeline?.byReadiness.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                        formatter={(value) => [`${value} candidates`, 'Count']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
              
              {/* Custom Legend */}
              {!isLoadingPipeline && pipeline?.byReadiness && (
                <div className="grid grid-cols-2 gap-2 mt-4 text-sm w-full absolute bottom-6 px-6">
                  {pipeline.byReadiness.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="size-3 rounded-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span className="capitalize text-muted-foreground truncate">{entry.tier}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Regional Breakdown */}
          <Card className="border-muted shadow-sm">
            <CardHeader>
              <CardTitle>Regional Sourcing Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                {isLoadingPipeline ? (
                  <div className="w-full h-full bg-muted/20 animate-pulse rounded-md" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={pipeline?.byCountry} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                      <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis dataKey="country" type="category" stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip cursor={{fill: 'hsl(var(--muted)/0.5)'}} />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Live Activity Feed */}
          <Card className="border-muted shadow-sm flex flex-col">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Activity className="size-5 text-primary" /> Live Platform Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto max-h-[250px] pr-2">
              {isLoadingActivity ? (
                <div className="space-y-4">
                  {Array(4).fill(0).map((_, i) => <div key={i} className="h-12 bg-muted/30 animate-pulse rounded-md" />)}
                </div>
              ) : (
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-muted before:to-transparent">
                  {activities?.map((activity) => (
                    <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center size-10 rounded-full border bg-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                        {activity.kind === 'registration' && <Users className="size-4 text-blue-500" />}
                        {activity.kind === 'evaluation' && <Star className="size-4 text-purple-500" />}
                        {activity.kind === 'upskilling' && <GraduationCap className="size-4 text-orange-500" />}
                        {activity.kind === 'placement' && <ArrowUpRight className="size-4 text-green-500" />}
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-muted/20 p-3 rounded-lg border group-hover:border-primary/30 transition-colors">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm">{activity.candidateName}</span>
                          <span className="text-xs text-muted-foreground">{new Date(activity.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{activity.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Shell>
  );
}