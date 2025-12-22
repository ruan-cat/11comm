import type { NoticeListItem } from "@01s-11comm/type";

/** Notice 模拟数据 */
export const mockNoticeData: NoticeListItem[] = [
    {
        id: "N001",
        title: "关于春节期间安全管理的通知",
        content: "春节期间请注意安全",
        publisher: "物业服务中心",
        publishTime: "2024-01-15 09:00:00",
        status: "已发布",
        createTime: "2024-01-15 09:00:00",
        updateTime: "2024-01-15 09:00:00",
        remarks: "重要通知",
    },
    {
        id: "N002",
        title: "关于电梯维护保养的通知",
        content: "电梯将于本月20日进行维护保养",
        publisher: "物业服务中心",
        publishTime: "2024-01-16 10:00:00",
        status: "已发布",
        createTime: "2024-01-16 10:00:00",
        updateTime: "2024-01-16 10:00:00",
        remarks: "维护通知",
    },
    {
        id: "N003",
        title: "关于垃圾分类的通知",
        content: "请业主配合做好垃圾分类工作",
        publisher: "物业服务中心",
        publishTime: "2024-01-17 11:00:00",
        status: "已发布",
        createTime: "2024-01-17 11:00:00",
        updateTime: "2024-01-17 11:00:00",
        remarks: "环保宣传",
    },
];
