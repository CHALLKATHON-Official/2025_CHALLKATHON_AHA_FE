package com.taewoo.silenth.common;

import java.time.LocalTime;

public enum TimeSlot {
    EARLY_DAWN, // 이른 새벽
    LATE_DAWN, // 늦은 새벽
    MORNING, // 아침
    AFTERNOON, // 점심(낮)
    EVENING;

    public static TimeSlot Eof(LocalTime time) {
        final int hour = time.getHour();

        if (hour >= 0 && hour < 3) {
            return EARLY_DAWN;
        } else if (hour >= 3 && hour < 6) {
            return LATE_DAWN;
        } else if (hour >= 6 && hour < 12) {
            return MORNING;
        } else if (hour >= 12 && hour < 18) {
            return AFTERNOON;
        } else {
            return EVENING;
        }
    }
}
