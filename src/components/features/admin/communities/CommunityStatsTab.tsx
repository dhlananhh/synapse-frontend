'use client'

import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { communityService } from '@/modules/services/community-service'
import type { CommunityStats } from '@/types/services/community'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  RefreshCw,
  UserPlus,
  UserMinus,
  Users,
  CirclePlus,
  Gavel,
  MessageSquare,
  MessageCircle,
  Trash2,
} from 'lucide-react'
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
import { formatDistanceToNow } from 'date-fns'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

type Props = {
  communityId: string
}

export default function CommunityStatsTab({ communityId }: Props) {
  const [stats, setStats] = useState<CommunityStats | null>(null)
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    if (!communityId) return
    setLoading(true)
    try {
      const resp = await communityService.getCommunityStats(communityId)
      setStats(resp)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load community stats')
      setStats(null)
    } finally {
      setLoading(false)
    }
  }, [communityId])

  useEffect(() => {
    load()
  }, [load])

  const membersChart = useMemo(() => {
    if (!stats) return null
    const owners = stats.members.owners || 0
    const moderators = stats.members.moderators || 0
    // exclude owners from the doughnut since it's usually 1 — show moderators vs regular members
    const regular = Math.max(0, (stats.members.total || 0) - owners - moderators)
    const labels = ['Moderators', 'Members']
    const data = {
      labels,
      datasets: [
        {
          data: [moderators, regular],
          backgroundColor: ['#6366f1', '#06b6d4'],
          hoverBackgroundColor: ['#6366f188', '#06b6d488'],
        },
      ],
    }
    const options = {
      plugins: { legend: { position: 'bottom' as const } },
      maintainAspectRatio: false,
    }
    return { data, options }
  }, [stats])

  const postsBar = useMemo(() => {
    if (!stats) return null
    const labels = ['Published', 'Drafts', 'NSFW', 'Total']
    const data = {
      labels,
      datasets: [
        {
          label: 'Posts',
          data: [
            stats.posts.published || 0,
            stats.posts.drafts || 0,
            stats.posts.nsfw || 0,
            stats.posts.total || 0,
          ],
          backgroundColor: ['#10b981', '#94a3b8', '#ef4444', '#3b82f6'],
        },
      ],
    }
    const options = {
      plugins: { legend: { display: false } },
      scales: {
        x: { beginAtZero: true },
        y: { beginAtZero: true },
      },
      maintainAspectRatio: false,
    }
    return { data, options }
  }, [stats])

  const reportsVotesBar = useMemo(() => {
    if (!stats) return null
    const labels = ['Report total', 'Reports pending', 'Resolved', 'Post votes', 'Comment votes']
    const data = {
      labels,
      datasets: [
        {
          label: 'Counts',
          data: [
            stats.reports.total || 0,
            stats.reports.pending || 0,
            stats.reports.resolved || 0,
            stats.votes.posts || 0,
            stats.votes.comments || 0,
          ],
          backgroundColor: ['#f97316', '#f59e0b', '#10b981', '#3b82f6', '#7c3aed'],
        },
      ],
    }
    const options = {
      plugins: { legend: { display: false } },
      scales: { x: { beginAtZero: true }, y: { beginAtZero: true } },
      maintainAspectRatio: false,
    }
    return { data, options }
  }, [stats])

  if (loading && !stats) {
    return <div className='text-sm text-muted-foreground'>Loading stats...</div>
  }

  if (!stats) {
    return <div className='text-sm text-muted-foreground'>No stats available</div>
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Badge>{new Date(stats.timestamp).toLocaleString()}</Badge>
          <Button size='sm' variant='ghost' onClick={load} aria-label='Refresh stats'>
            <RefreshCw className='w-4 h-4' />
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
        <div className='col-span-1 md:col-span-1 border rounded-md p-3 bg-card'>
          <h5 className='text-xs font-semibold mb-2'>Members breakdown</h5>
          <div className='h-44'>
            {membersChart && <Doughnut data={membersChart.data} options={membersChart.options} />}
          </div>
          <div className='mt-3 flex flex-wrap gap-2'>
            <Badge className='inline-flex items-center gap-2 px-2 py-1 text-sm'>
              <Users className='w-4 h-4' /> <span className='font-medium'>Total</span>:{' '}
              <span className='ml-1'>{stats.members.total}</span>
            </Badge>

            <Badge className='inline-flex items-center gap-2 px-2 py-1 text-sm'>
              <Users className='w-4 h-4' /> <span className='font-medium'>Active</span>:{' '}
              <span className='ml-1'>{stats.members.active}</span>
            </Badge>

            <Badge className='inline-flex items-center gap-2 px-2 py-1 text-sm'>
              <span className='font-medium'>Moderators</span>:{' '}
              <span className='ml-1'>{stats.members.moderators}</span>
            </Badge>

            <Badge className='inline-flex items-center gap-2 px-2 py-1 text-sm bg-green-50 text-green-800'>
              <UserPlus className='w-4 h-4 text-green-600' />{' '}
              <span className='font-medium'>New</span>:{' '}
              <span className='ml-1'>{stats.members.newToday}</span>
            </Badge>

            <Badge className='inline-flex items-center gap-2 px-2 py-1 text-sm bg-red-50 text-red-800'>
              <UserMinus className='w-4 h-4 text-red-600' />{' '}
              <span className='font-medium'>Left</span>:{' '}
              <span className='ml-1'>{stats.members.leftToday}</span>
            </Badge>
          </div>
        </div>

        <div className='col-span-1 md:col-span-1 border rounded-md p-3 bg-card'>
          <h5 className='text-xs font-semibold mb-2'>Posts overview</h5>
          <div className='h-44'>
            {postsBar && <Bar data={postsBar.data} options={postsBar.options} />}
          </div>
          <div className='mt-3 text-sm'>
            <div>
              <Badge className='inline-flex items-center gap-2 px-2 py-1 text-sm bg-green-50 text-green-800'>
                <CirclePlus className='w-4 h-4 text-green-600' />{' '}
                <span className='font-medium'>New</span>:{' '}
                <span className='ml-1'>{stats.posts.newToday}</span>
              </Badge>
            </div>
          </div>
        </div>

        <div className='col-span-1 md:col-span-1 border rounded-md p-3 bg-card'>
          <h5 className='text-xs font-semibold mb-2'>Reports & Votes</h5>
          <div className='h-44'>
            {reportsVotesBar && (
              <Bar data={reportsVotesBar.data} options={reportsVotesBar.options} />
            )}
          </div>
          <div className='mt-3 text-sm'>
            <div className='mb-2'>
              <Badge className='inline-flex items-center gap-2 px-2 py-1 text-sm bg-green-50 text-yellow-800'>
                <Gavel className='w-4 h-4 text-yellow-600' />{' '}
                <span className='font-medium'>Moderation actions taken: </span>:{' '}
                <span className='ml-1'>{stats.moderation.totalActions}</span>
              </Badge>
            </div>
            <div>
              <Badge className='inline-flex items-center gap-2 px-2 py-1 text-sm bg-green-50 text-red-800'>
                <Gavel className='w-4 h-4 text-red-600' />{' '}
                <span className='font-medium'>Bans issued: </span>:{' '}
                <span className='ml-1'>{stats.moderation.bansIssued}</span>
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
        <div className='border rounded-md p-3 bg-card'>
          <h5 className='text-xs font-semibold mb-2'>Comments</h5>
          <div className='flex flex-wrap gap-2'>
            <Badge className='inline-flex items-center gap-2 px-2 py-1 text-sm'>
              <MessageSquare className='w-4 h-4' /> <span className='font-medium'>Total</span>:
              <span className='ml-1'>{stats.comments.total}</span>
            </Badge>

            <Badge className='inline-flex items-center gap-2 px-2 py-1 text-sm'>
              <MessageCircle className='w-4 h-4' /> <span className='font-medium'>Avg / post</span>:
              <span className='ml-1'>{stats.comments.averagePerPost}</span>
            </Badge>

            <Badge className='inline-flex items-center gap-2 px-2 py-1 text-sm bg-red-50 text-red-800'>
              <Trash2 className='w-4 h-4' /> <span className='font-medium'>Removed</span>:
              <span className='ml-1'>{stats.comments.removed}</span>
            </Badge>

            <Badge className='inline-flex items-center gap-2 px-2 py-1 text-sm bg-green-50 text-green-800'>
              <UserPlus className='w-4 h-4 text-green-600' />{' '}
              <span className='font-medium'>New</span>:
              <span className='ml-1'>{stats.comments.newToday}</span>
            </Badge>
          </div>
        </div>

        <div className='border rounded-md p-3 bg-card'>
          <h5 className='text-xs font-semibold mb-2'>Snapshot</h5>
          <div className='flex flex-col gap-2 text-sm'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:gap-3'>
              <Badge className='inline-flex items-center gap-2 px-2 py-1 text-sm'>
                <span className='font-medium'>Created</span>
                <span className='ml-2'>{new Date(stats.metadata.createdAt).toLocaleString()}</span>
              </Badge>
              <span className='text-xs text-muted-foreground'>
                ({formatDistanceToNow(new Date(stats.metadata.createdAt), { addSuffix: true })})
              </span>
            </div>

            <div className='flex items-center gap-2'>
              <Badge className='inline-flex items-center gap-2 px-2 py-1 text-sm'>
                <span className='font-medium'>Snapshot time</span>
                <span className='ml-2'>{new Date(stats.timestamp).toLocaleString()}</span>
              </Badge>
              <span className='text-xs text-muted-foreground'>
                ({formatDistanceToNow(new Date(stats.timestamp), { addSuffix: true })})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
