"use client";

import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity } from "@/types";
import "react-calendar-heatmap/dist/styles.css";

interface ActivityCalendarProps {
  activityData: Activity[];
}

export default function ActivityCalendar({
  activityData,
}: ActivityCalendarProps) {
  const today = new Date();
  const oneYearAgo = new Date(
    new Date().setFullYear(today.getFullYear() - 1)
  );

  const totalContributions = activityData.reduce(
    (sum, day) => sum + day.count,
    0
  );

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>
            {totalContributions.toLocaleString()}{" "}
            contributions in the last year
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6">
          <CalendarHeatmap
            startDate={oneYearAgo}
            endDate={today}
            values={activityData}
            classForValue={(value) => {
              if (!value) {
                return "color-empty";
              }
              return `color-scale-${value.level}`;
            }}
            tooltipDataAttrs={(value: Activity) => {
              return {
                "data-tooltip-id": "heatmap-tooltip",
                "data-tooltip-content": `${value.count} contributions on ${value.date}`,
              };
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
