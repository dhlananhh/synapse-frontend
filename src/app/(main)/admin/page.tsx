'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  Activity,
  UserPlus,
  ShieldAlert,
  UserCheck,
  UserMinus,
  Globe,
  Layers,
  FileText,
  MessageSquare,
  BarChart,
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll'
import Link from 'next/link'
import { authService } from '@/modules/services/auth-service'
import { communityService } from '@/modules/services/community-service'
import type { AccountSummary } from '@/types/services/auth'
import type { SystemStats } from '@/types/services/community'
import { formatDistanceToNow } from 'date-fns'

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<AccountSummary | null>(null)
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const [summaryResp, systemResp] = await Promise.all([
          authService.fetchAccountSummary(),
          communityService.fetchSystemStats(),
        ])
        setSummary(summaryResp)
        setSystemStats(systemResp)
      } catch (error) {
        console.error('Failed to load dashboard data', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const statCards = [
    {
      title: 'Total Users',
      icon: Users,
      value: summary?.totalUsers,
      color: 'text-blue-500',
      href: '/admin/users',
    },
    {
      title: 'Total Communities',
      icon: Activity,
      value: systemStats?.communities.totalCommunities,
      color: 'text-green-500',
      href: '/admin/communities',
    },
  ]

  const accumulatedChart = useMemo(() => {
    // statuses are strictly ACTIVE | SUSPENDED | PENDING — show only those slices
    if (!summary) return null
    const active = Math.max(0, summary.activeUsers ?? 0)
    const suspended = Math.max(0, summary.suspendedUsers ?? 0)
    const pending = Math.max(0, summary.pendingUsers ?? 0)

    const total = active + suspended + pending
    // if there's no data at all, return null so we don't paint a fake slice
    if (total === 0) return null

    const values = [active, suspended, pending]

    const labels = ['Active', 'Suspended', 'Pending']
    const data = {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: ['#10b981', '#ef4444', '#f59e0b'],
          hoverOffset: 6,
        },
      ],
    }
    const options = {
      plugins: { legend: { position: 'bottom' as const } },
      maintainAspectRatio: false,
    }
    return { data, options }
  }, [summary])

  const dailyChart = useMemo(() => {
    // visualize proportions of daily/new user categories (exclude the total newUsers slice)
    if (!summary) return null
    const newActive = Math.max(0, summary.newActiveUsers ?? 0)
    const newSuspended = Math.max(0, summary.newSuspendedUsers ?? 0)
    const newPending = Math.max(0, summary.newPendingUsers ?? 0)
    const newBanned = Math.max(0, summary.newBannedUsers ?? 0)

    const total = newActive + newSuspended + newPending + newBanned
    // if there's no daily data, don't render a fake slice
    if (total === 0) return null

    const values = [newActive, newSuspended, newPending, newBanned]

    const labels = ['New Active', 'New Suspended', 'New Pending', 'New Banned']
    const data = {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: ['#06b6d4', '#fb923c', '#fbbf24', '#ef4444'],
          hoverOffset: 6,
        },
      ],
    }
    const options = {
      plugins: { legend: { position: 'bottom' as const } },
      maintainAspectRatio: false,
    }
    return { data, options }
  }, [summary])

  // --- new charts for system stats ---
  // Communities: status breakdown (ACTIVE / SUSPENDED / DELETED)
  const communitiesStatusChart = useMemo(() => {
    if (!systemStats) return null
    const active = Math.max(0, systemStats.communities.activeCommunities ?? 0)
    const suspended = Math.max(0, systemStats.communities.suspendedCommunities ?? 0)
    const deleted = Math.max(0, systemStats.communities.deletedCommunities ?? 0)
    const total = active + suspended + deleted
    if (total === 0) return null
    return {
      data: {
        labels: ['Active', 'Suspended', 'Deleted'],
        datasets: [
          {
            data: [active, suspended, deleted],
            backgroundColor: ['#10b981', '#ef4444', '#6b7280'],
          },
        ],
      },
      options: { plugins: { legend: { position: 'bottom' as const } }, maintainAspectRatio: false },
    }
  }, [systemStats])

  // Communities: mode/privacy breakdown (NSFW / Private / Public inferred)
  const communitiesModeChart = useMemo(() => {
    if (!systemStats) return null
    const nsfw = Math.max(0, systemStats.communities.nsfwCommunities ?? 0)
    const priv = Math.max(0, systemStats.communities.privateCommunities ?? 0)
    const totalCommunities = Math.max(0, systemStats.communities.totalCommunities ?? 0)
    // infer public = total - (nsfw ∪ private). We assume nsfw/private may overlap; best-effort:
    const inferredPublic = Math.max(0, totalCommunities - Math.max(nsfw, 0) - Math.max(priv, 0))
    const total = nsfw + priv + inferredPublic
    if (total === 0) return null
    return {
      data: {
        labels: ['NSFW', 'Private', 'Public (inferred)'],
        datasets: [
          {
            data: [nsfw, priv, inferredPublic],
            backgroundColor: ['#fb7185', '#7c3aed', '#3b82f6'],
          },
        ],
      },
      options: { plugins: { legend: { position: 'bottom' as const } }, maintainAspectRatio: false },
    }
  }, [systemStats])

  const membershipsChart = useMemo(() => {
    if (!systemStats) return null
    const active = Math.max(0, systemStats.memberships.activeMemberships ?? 0)
    const pending = Math.max(0, systemStats.memberships.pendingMemberships ?? 0)
    const banned = Math.max(0, systemStats.memberships.bannedMemberships ?? 0)
    const total = active + pending + banned
    if (total === 0) return null
    return {
      data: {
        labels: ['Active', 'Pending', 'Banned'],
        datasets: [
          { data: [active, pending, banned], backgroundColor: ['#10b981', '#f59e0b', '#ef4444'] },
        ],
      },
      options: { plugins: { legend: { position: 'bottom' as const } }, maintainAspectRatio: false },
    }
  }, [systemStats])

  const contentChart = useMemo(() => {
    if (!systemStats) return null
    const published = Math.max(0, systemStats.content.posts.publishedPosts ?? 0)
    const drafts = Math.max(0, systemStats.content.posts.draftPosts ?? 0)
    const nsfw = Math.max(0, systemStats.content.posts.nsfwPosts ?? 0)
    const comments = Math.max(0, systemStats.content.comments.totalComments ?? 0)
    const votes = Math.max(0, systemStats.content.votes.totalVotes ?? 0)
    const postsTotal = published + drafts + nsfw
    // if there's effectively no meaningful content data, skip chart
    if (postsTotal === 0 && comments === 0 && votes === 0) return null
    return {
      data: {
        labels: ['Published', 'Drafts', 'NSFW', 'Comments', 'Votes'],
        datasets: [
          {
            label: 'Counts',
            data: [published, drafts, nsfw, comments, votes],
            backgroundColor: ['#3b82f6', '#94a3b8', '#fb7185', '#06b6d4', '#7c3aed'],
          },
        ],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { x: { beginAtZero: true }, y: { beginAtZero: true } },
        maintainAspectRatio: false,
      },
    }
  }, [systemStats])

  const reportsChart = useMemo(() => {
    if (!systemStats) return null
    const pending = Math.max(0, systemStats.reports.pendingReports ?? 0)
    const resolved = Math.max(0, systemStats.reports.resolvedReports ?? 0)
    const dismissed = Math.max(0, systemStats.reports.dismissedReports ?? 0)
    const total = pending + resolved + dismissed
    if (total === 0) return null
    return {
      data: {
        labels: ['Pending', 'Resolved', 'Dismissed'],
        datasets: [
          {
            data: [pending, resolved, dismissed],
            backgroundColor: ['#f59e0b', '#10b981', '#94a3b8'],
          },
        ],
      },
      options: { plugins: { legend: { position: 'bottom' as const } }, maintainAspectRatio: false },
    }
  }, [systemStats])

  const moderationChart = useMemo(() => {
    if (!systemStats) return null
    const actions = Math.max(0, systemStats.moderation.moderationActions ?? 0)
    const bans = Math.max(0, systemStats.moderation.bansIssued ?? 0)
    const unbans = Math.max(0, systemStats.moderation.unbansIssued ?? 0)
    const total = actions + bans + unbans
    if (total === 0) return null
    return {
      data: {
        labels: ['Actions', 'Bans', 'Unbans'],
        datasets: [
          {
            label: 'Count',
            data: [actions, bans, unbans],
            backgroundColor: ['#7c3aed', '#ef4444', '#06b6d4'],
          },
        ],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { x: { beginAtZero: true }, y: { beginAtZero: true } },
        maintainAspectRatio: false,
      },
    }
  }, [systemStats])

  return (
    <div className='space-y-8'>
      <AnimateOnScroll delay={0.1}>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Admin Dashboard</h1>
          <p className='text-muted-foreground'>An overview of the Synapse platform's activity.</p>
        </div>
      </AnimateOnScroll>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {statCards.map((card) => (
          <Link href={card.href} key={card.title}>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-sm font-medium'>{card.title}</CardTitle>
                <card.icon className={`h-4 w-4 text-muted-foreground ${card.color}`} />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className='h-8 w-1/2' />
                ) : (
                  <div className='text-2xl font-bold'>{(card.value ?? 0).toLocaleString()}</div>
                )}
                <p className='text-xs text-muted-foreground'>Click to view details</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Expanded snapshot details */}
      <Card>
        <CardHeader>
          <CardTitle className='text-sm flex items-center justify-between'>
            Platform snapshot - {new Date(summary.summaryDate).toLocaleDateString()}
            <span className='text-xs text-muted-foreground'>
              {summary
                ? `${new Date(summary.summaryDate).toLocaleDateString()} • ${formatDistanceToNow(
                    new Date(summary.summaryDate),
                    { addSuffix: true }
                  )}`
                : ''}
            </span>
          </CardTitle>
          <CardDescription>Detailed counts for the selected snapshot</CardDescription>
        </CardHeader>

        <CardContent>
          {isLoading || !summary ? (
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className='h-8 w-full' />
              ))}
            </div>
          ) : (
            <>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                {/* Accumulated totals (snapshot) */}
                <div className='border rounded-md p-3 bg-card'>
                  <div className='flex items-center justify-between mb-2'>
                    <div className='text-sm font-medium'>Accumulated totals</div>
                    <div className='text-xs text-muted-foreground'>snapshot</div>
                  </div>
                  <div className='text-xs text-muted-foreground mb-2'>
                    Total users: {summary.totalUsers}
                  </div>
                  <div className='h-44'>
                    {accumulatedChart ? (
                      <Doughnut data={accumulatedChart.data} options={accumulatedChart.options} />
                    ) : (
                      <div className='h-44 flex items-center justify-center text-sm text-muted-foreground'>
                        No breakdown data for this snapshot
                      </div>
                    )}
                  </div>

                  <div className='mt-3 flex flex-wrap gap-2'>
                    <Badge className='inline-flex items-center gap-2 px-2 py-1'>
                      <Users className='w-4 h-4' /> <span className='text-xs'>Total</span>
                      <span className='ml-2 font-semibold'>{summary.totalUsers}</span>
                    </Badge>
                    <Badge className='inline-flex items-center gap-2 px-2 py-1'>
                      <UserCheck className='w-4 h-4 text-green-600' />{' '}
                      <span className='text-xs'>Active</span>
                      <span className='ml-2 font-semibold'>{summary.activeUsers}</span>
                    </Badge>
                    <Badge className='inline-flex items-center gap-2 px-2 py-1'>
                      <ShieldAlert className='w-4 h-4 text-red-600' />{' '}
                      <span className='text-xs'>Suspended</span>
                      <span className='ml-2 font-semibold'>{summary.suspendedUsers}</span>
                    </Badge>
                    <Badge className='inline-flex items-center gap-2 px-2 py-1'>
                      <UserMinus className='w-4 h-4 text-yellow-600' />{' '}
                      <span className='text-xs'>Pending</span>
                      <span className='ml-2 font-semibold'>{summary.pendingUsers}</span>
                    </Badge>
                  </div>
                </div>

                {/* Daily / snapshot deltas */}
                <div className='border rounded-md p-3 bg-card'>
                  <div className='flex items-center justify-between mb-2'>
                    <div className='text-sm font-medium'>Daily / Snapshot deltas</div>
                    <div className='text-xs text-muted-foreground'>daily</div>
                  </div>
                  <div className='h-44'>
                    {dailyChart ? (
                      <Doughnut data={dailyChart.data} options={dailyChart.options} />
                    ) : (
                      <div className='h-44 flex items-center justify-center text-sm text-muted-foreground'>
                        No daily changes to display
                      </div>
                    )}
                  </div>

                  <div className='mt-3 flex flex-wrap gap-2'>
                    <Badge className='inline-flex items-center gap-2 px-2 py-1'>
                      <UserPlus className='w-4 h-4 text-indigo-600' />{' '}
                      <span className='text-xs'>New (snapshot)</span>
                      <span className='ml-2 font-semibold'>{summary.newUsers}</span>
                    </Badge>
                    <Badge className='inline-flex items-center gap-2 px-2 py-1'>
                      <UserCheck className='w-4 h-4 text-green-600' />{' '}
                      <span className='text-xs'>New Active</span>
                      <span className='ml-2 font-semibold'>{summary.newActiveUsers}</span>
                    </Badge>
                    <Badge className='inline-flex items-center gap-2 px-2 py-1'>
                      <ShieldAlert className='w-4 h-4 text-orange-600' />{' '}
                      <span className='text-xs'>New Suspended</span>
                      <span className='ml-2 font-semibold'>{summary.newSuspendedUsers}</span>
                    </Badge>
                    <Badge className='inline-flex items-center gap-2 px-2 py-1'>
                      <UserMinus className='w-4 h-4 text-yellow-600' />{' '}
                      <span className='text-xs'>New Pending</span>
                      <span className='ml-2 font-semibold'>{summary.newPendingUsers}</span>
                    </Badge>
                    <Badge className='inline-flex items-center gap-2 px-2 py-1'>
                      <UserMinus className='w-4 h-4 text-red-600' />{' '}
                      <span className='text-xs'>New Banned</span>
                      <span className='ml-2 font-semibold'>{summary.newBannedUsers}</span>
                    </Badge>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* System-wide community & content stats */}
      <Card>
        <CardHeader>
          <CardTitle className='text-sm flex items-center justify-between'>
            System-wide community & content stats -{' '}
            {new Date(systemStats.timestamp).toLocaleString()}
            <span className='text-xs text-muted-foreground'>
              {systemStats
                ? `${new Date(systemStats.timestamp).toLocaleString()} • ${formatDistanceToNow(
                    new Date(systemStats.timestamp),
                    { addSuffix: true }
                  )}`
                : ''}
            </span>
          </CardTitle>
          <CardDescription>
            Aggregated community and content metrics across the platform
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isLoading || !systemStats ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className='h-16 w-full' />
              ))}
            </div>
          ) : (
            <div className='space-y-4'>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
                <div className='border rounded-md p-3 bg-card'>
                  <div className='flex items-center gap-2'>
                    <Globe className='w-4 h-4' />
                    <div className='text-sm font-medium'>Communities</div>
                  </div>
                  <div className='mt-2 text-xs text-muted-foreground'>
                    Total: {systemStats.communities.totalCommunities}
                  </div>

                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3'>
                    <div className='p-2 border rounded-md'>
                      <div className='text-xs font-medium mb-1'>STATUS</div>
                      <div className='h-64'>
                        {communitiesStatusChart ? (
                          <Doughnut
                            data={communitiesStatusChart.data}
                            options={communitiesStatusChart.options}
                          />
                        ) : (
                          <div className='h-36 flex items-center justify-center text-sm text-muted-foreground'>
                            No status data
                          </div>
                        )}
                      </div>
                      <div className='mt-2 flex flex-col gap-2'>
                        <Badge className='px-2 py-1 text-xs'>
                          Active: {systemStats.communities.activeCommunities}
                        </Badge>
                        <Badge className='px-2 py-1 text-xs'>
                          Suspended: {systemStats.communities.suspendedCommunities}
                        </Badge>
                        <Badge className='px-2 py-1 text-xs'>
                          Deleted: {systemStats.communities.deletedCommunities}
                        </Badge>
                      </div>
                    </div>

                    <div className='p-2 border rounded-md'>
                      <div className='text-xs font-medium mb-1'>MODE</div>
                      <div className='h-64'>
                        {communitiesModeChart ? (
                          <Doughnut
                            data={communitiesModeChart.data}
                            options={communitiesModeChart.options}
                          />
                        ) : (
                          <div className='h-36 flex items-center justify-center text-sm text-muted-foreground'>
                            No mode data
                          </div>
                        )}
                      </div>
                      <div className='mt-2 flex flex-col gap-2'>
                        <Badge className='px-2 py-1 text-xs'>
                          NSFW: {systemStats.communities.nsfwCommunities}
                        </Badge>
                        <Badge className='px-2 py-1 text-xs'>
                          Private: {systemStats.communities.privateCommunities}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className='mt-3 flex flex-wrap gap-2'>
                    <Badge className='px-2 py-1 text-xs'>
                      New communities: {systemStats.communities.newCommunitiesPreviousDay}
                    </Badge>
                  </div>
                </div>

                <div className='border rounded-md p-3 bg-card'>
                  <div className='flex items-center gap-2'>
                    <Layers className='w-4 h-4' />
                    <div className='text-sm font-medium'>Memberships</div>
                  </div>
                  <div className='mt-2 text-xs text-muted-foreground'>
                    Total memberships: {systemStats.memberships.totalMemberships}
                  </div>
                  <div className='h-64 mt-2'>
                    {membershipsChart ? (
                      <Doughnut data={membershipsChart.data} options={membershipsChart.options} />
                    ) : (
                      <div className='h-40 flex items-center justify-center text-sm text-muted-foreground'>
                        No breakdown
                      </div>
                    )}
                  </div>
                  <div className='mt-3 flex flex-wrap gap-2'>
                    <Badge className='px-2 py-1 text-xs'>
                      Active: {systemStats.memberships.activeMemberships}
                    </Badge>
                    <Badge className='px-2 py-1 text-xs'>
                      Pending: {systemStats.memberships.pendingMemberships}
                    </Badge>
                    <Badge className='px-2 py-1 text-xs'>
                      Banned: {systemStats.memberships.bannedMemberships}
                    </Badge>
                    <Badge className='px-2 py-1 text-xs'>
                      Owners: {systemStats.memberships.totalOwners}
                    </Badge>
                    <Badge className='px-2 py-1 text-xs'>
                      Moderators: {systemStats.memberships.totalModerators}
                    </Badge>
                  </div>
                </div>

                <div className='border rounded-md p-3 bg-card'>
                  <div className='flex items-center gap-2'>
                    <FileText className='w-4 h-4' />
                    <div className='text-sm font-medium'>Content</div>
                  </div>
                  <div className='mt-2 text-xs text-muted-foreground'>
                    Posts: {systemStats.content.posts.totalPosts} • Comments:{' '}
                    {systemStats.content.comments.totalComments}
                  </div>
                  <div className='h-64 mt-2'>
                    {contentChart ? (
                      <Bar data={contentChart.data} options={contentChart.options} />
                    ) : (
                      <div className='h-40 flex items-center justify-center text-sm text-muted-foreground'>
                        No content metrics
                      </div>
                    )}
                  </div>
                  <div className='mt-3 flex flex-wrap gap-2'>
                    <Badge className='px-2 py-1 text-xs'>
                      Total posts: {systemStats.content.posts.totalPosts}
                    </Badge>
                    <Badge className='px-2 py-1 text-xs'>
                      Published: {systemStats.content.posts.publishedPosts}
                    </Badge>
                    <Badge className='px-2 py-1 text-xs'>
                      Drafts: {systemStats.content.posts.draftPosts}
                    </Badge>
                    <Badge className='px-2 py-1 text-xs'>
                      NSFW posts: {systemStats.content.posts.nsfwPosts}
                    </Badge>
                    <Badge className='px-2 py-1 text-xs'>
                      Comments: {systemStats.content.comments.totalComments}
                    </Badge>
                    {systemStats.content.votes && (
                      <Badge className='px-2 py-1 text-xs'>
                        Votes: {systemStats.content.votes.totalVotes}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                <div className='border rounded-md p-3 bg-card'>
                  <div className='flex items-center gap-2'>
                    <MessageSquare className='w-4 h-4' />
                    <div className='text-sm font-medium'>Reports</div>
                  </div>
                  <div className='mt-2 text-xs text-muted-foreground'>
                    Total: {systemStats.reports.totalReports}
                  </div>
                  <div className='h-40 mt-2'>
                    {reportsChart ? (
                      <Doughnut data={reportsChart.data} options={reportsChart.options} />
                    ) : (
                      <div className='h-40 flex items-center justify-center text-sm text-muted-foreground'>
                        No report breakdown
                      </div>
                    )}
                  </div>
                  <div className='mt-3 flex flex-wrap gap-2'>
                    <Badge className='px-2 py-1 text-xs'>
                      Pending: {systemStats.reports.pendingReports}
                    </Badge>
                    <Badge className='px-2 py-1 text-xs'>
                      Resolved: {systemStats.reports.resolvedReports}
                    </Badge>
                    <Badge className='px-2 py-1 text-xs'>
                      Dismissed: {systemStats.reports.dismissedReports}
                    </Badge>
                  </div>
                </div>

                <div className='border rounded-md p-3 bg-card'>
                  <div className='flex items-center gap-2'>
                    <BarChart className='w-4 h-4' />
                    <div className='text-sm font-medium'>Moderation</div>
                  </div>
                  <div className='mt-2 text-xs text-muted-foreground'>
                    Actions: {systemStats.moderation.moderationActions}
                  </div>
                  <div className='h-40 mt-2'>
                    {moderationChart ? (
                      <Bar data={moderationChart.data} options={moderationChart.options} />
                    ) : (
                      <div className='h-40 flex items-center justify-center text-sm text-muted-foreground'>
                        No moderation metrics
                      </div>
                    )}
                  </div>
                  <div className='mt-3 flex flex-wrap gap-2'>
                    <Badge className='px-2 py-1 text-xs'>
                      Actions: {systemStats.moderation.moderationActions}
                    </Badge>
                    <Badge className='px-2 py-1 text-xs'>
                      Bans: {systemStats.moderation.bansIssued}
                    </Badge>
                    <Badge className='px-2 py-1 text-xs'>
                      Unbans: {systemStats.moderation.unbansIssued}
                    </Badge>
                    {typeof systemStats.moderation.postsRemoved === 'number' && (
                      <Badge className='px-2 py-1 text-xs'>
                        Posts removed: {systemStats.moderation.postsRemoved}
                      </Badge>
                    )}
                    {typeof systemStats.moderation.commentsRemoved === 'number' && (
                      <Badge className='px-2 py-1 text-xs'>
                        Comments removed: {systemStats.moderation.commentsRemoved}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className='text-xs text-muted-foreground mt-2'>
                Snapshot created: {new Date(systemStats.timestamps.createdAt).toLocaleString()} (
                {formatDistanceToNow(new Date(systemStats.timestamps.createdAt), {
                  addSuffix: true,
                })}
                )
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
