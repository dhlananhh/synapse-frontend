"use client";


import React, {
  useEffect,
  useState
} from "react";
import { StatsPieChart } from "@/components/features/admin/charts/StatsPieChart"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Library,
  FileText,
  ShieldAlert,
  Activity,
  UserPlus,
  PlusSquare,
  Loader2
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimateOnScroll } from "@/components/shared/AnimateOnScroll";
import Link from "next/link";
// import { adminService } from "@/modules/services/admin-service"; 


// --- MOCK DATA ---
interface Stats {
  totalUsers: number;
  totalCommunities: number;
  totalPosts: number;
  pendingReports: number;
}

interface RecentActivity {
  id: string;
  type: "NEW_USER" | "NEW_COMMUNITY";
  description: string;
  timestamp: Date;
  link: string;
}


const mockStats: Stats = {
  totalUsers: 13,       // Dữ liệu từ seed
  totalCommunities: 12, // Dữ liệu từ seed
  totalPosts: 152,      // Dữ liệu giả
  pendingReports: 3,    // Dữ liệu giả
};


const mockRecentActivities: RecentActivity[] = [
  {
    id: "1",
    type: "NEW_USER",
    description: "User @lananh888 has registered.",
    timestamp: new Date(),
    link: "/u/user888"
  },
  {
    id: "2",
    type: "NEW_COMMUNITY",
    description: "Community r/meme-central was created.",
    timestamp: new Date(Date.now() - 3600000),
    link: "/c/meme-central"
  },
  {
    id: "3",
    type: "NEW_USER",
    description: "User @khang999 has registered.",
    timestamp: new Date(Date.now() - 7200000),
    link: "/u/user999"
  },
];


const mockUserDistribution = [
  { name: 'Active Users', value: 10, color: '#10B981' }, // Màu xanh lá
  { name: 'Suspended Users', value: 2, color: '#F59E0B' }, // Màu cam
  { name: 'Pending Users', value: 1, color: '#6B7280' }, // Màu xám
];

const mockCommunityDistribution = [
  { name: 'Public Communities', value: 9, color: '#3B82F6' }, // Màu xanh dương
  { name: 'Private Communities', value: 2, color: '#8B5CF6' }, // Màu tím
  { name: 'Suspended Communities', value: 1, color: '#EF4444' }, // Màu đỏ
]


export default function AdminDashboardPage() {
  const [ stats, setStats ] = useState<Stats | null>(null);
  const [ activities, setActivities ] = useState<RecentActivity[]>([]);
  const [ isLoading, setIsLoading ] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // TODO: Gọi API để lấy dữ liệu thật
        // const [statsData, activitiesData] = await Promise.all([
        //   adminService.getPlatformStats(),
        //   adminService.getRecentActivities(),
        // ]);
        // setStats(statsData);
        // setActivities(activitiesData);

        await new Promise(resolve => setTimeout(resolve, 1000));
        setStats(mockStats);
        setActivities(mockRecentActivities);

      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const statCards = [
    {
      title: "Total Users",
      icon: Users,
      value: stats?.totalUsers,
      color: "text-blue-500",
      href: "/admin/users",
    },
    {
      title: "Total Communities",
      icon: Library,
      value: stats?.totalCommunities,
      color: "text-green-500",
      href: "/admin/communities",
    },
    {
      title: "Total Posts",
      icon: FileText,
      value: stats?.totalPosts,
      color: "text-orange-500",
      href: "#",
    },
    {
      title: "Pending Reports",
      icon: ShieldAlert,
      value: stats?.pendingReports,
      color: "text-red-500",
      href: "#",
    },
  ];

  return (
    <div className="space-y-8">
      <AnimateOnScroll
        delay={ 0.1 }
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            An overview of the Synapse platform"s activity.
          </p>
        </div>
      </AnimateOnScroll>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {
          statCards.map((card, index) => (
            <Link
              href={ card.href }
              key={ card.title }
            >
              <Card
                key={ index }
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    { card.title }
                  </CardTitle>
                  <card.icon
                    className={
                      `h-4 w-4 text-muted-foreground ${card.color}`
                    }
                  />
                </CardHeader>
                <CardContent>
                  {
                    isLoading ? (
                      <Skeleton className="h-8 w-1/2" />
                    ) : (
                      <div className="text-2xl font-bold">
                        { card.value?.toLocaleString() ?? "N/A" }
                      </div>
                    )
                  }
                  <p className="text-xs text-muted-foreground">
                    Click to view details
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))
        }
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>
              User Status Distribution
            </CardTitle>
            <CardDescription>
              Breakdown of users by their account status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {
              isLoading ? (
                <div className="flex justify-center items-center h-[250px]">
                  <Skeleton className="h-48 w-48 rounded-full" />
                </div>
              ) : (
                <StatsPieChart
                  data={ mockUserDistribution }
                />
              )
            }
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              Community Type Distribution
            </CardTitle>
            <CardDescription>
              Breakdown of communities by their privacy and status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {
              isLoading ? (
                <div className="flex justify-center items-center h-[250px]">
                  <Skeleton className="h-48 w-48 rounded-full" />
                </div>
              ) : (
                <StatsPieChart
                  data={ mockCommunityDistribution }
                />
              )
            }
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity />
            Recent Platform Activity
          </CardTitle>
          <CardDescription>
            A log of the latest user registrations and community creations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {
            isLoading ? (
              <div className="space-y-4">
                {
                  [ ...Array(3) ].map(
                    (_, i) => (
                      <Skeleton
                        key={ i }
                        className="h-10 w-full"
                      />
                    )
                  )
                }
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                    activities.map((activity) => (
                      <TableRow
                        key={ activity.id }
                      >
                        <TableCell>
                          <Badge
                            variant={ activity.type === "NEW_USER" ? "default" : "secondary" }
                            className="gap-1"
                          >
                            {
                              activity.type === "NEW_USER"
                                ? <UserPlus className="h-3 w-3" />
                                : <PlusSquare className="h-3 w-3" />
                            }
                            {
                              activity.type.replace("_", " ")
                            }
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <a
                            href={ activity.link }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            { activity.description }
                          </a>
                        </TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground">
                          { new Date(activity.timestamp).toLocaleTimeString() }
                        </TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            )
          }
        </CardContent>
      </Card>
    </div>
  );
}
