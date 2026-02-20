export type CollectorLevel = 'GENERAL' | 'VIP';

export interface Dimensions {
    h: number; // height in cm
    w: number; // width in cm
    d: number; // depth in cm
}

export interface Artwork {
    id: string;
    accessionNumber: string; // 典藏編號
    objectTitle: string;     // 物件名稱
    artistMaker: string;     // 藝術家/製作者
    creationDate: string;    // 年代 (如 "1990", "Edo Period")
    mediumMaterials: string; // 材質
    dimensions: Dimensions;  // 尺寸

    // 業務狀態 (畫廊屬性)
    status: 'AVAILABLE' | 'RESERVED' | 'SOLD';
    createdAt: Date;
    updatedAt: Date;
}

export interface ArtworkPrice {
    artworkId: string;
    price: number;
    isVipOnly: boolean;
}

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export interface Reservation {
    id: string;
    artworkId: string;
    collectorId: string;
    status: ReservationStatus;
    createdAt: Date;
    updatedAt: Date;
}

export interface Collector {
    id: string;
    authUserId: string;      // 綁定 Authentication ID
    name: string;
    email: string;
    level: CollectorLevel;   //一般會員 vs VIP
    createdAt: Date;
    updatedAt: Date;
}

export interface Exhibition {
    id: string;
    title: string;           // 展覽主題
    description: string;
    startDate: Date;
    endDate: Date;

    // 關聯的藝術品 ID 列表
    artworkIds: string[];

    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface GalleryInfo {
    id: string;              // 通常只有一筆紀錄 (Singleton)
    purpose: string;         // 成立目的
    offlineHours: string;    // 營業時間
    address: string;         // 營業地址
    updatedAt: Date;
}
