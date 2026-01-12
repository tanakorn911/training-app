# 📚 อธิบาย Code: CSV Layer & HeatmapRenderer

## สารบัญ
1. [Import](#1️⃣-import)
2. [สร้าง CSVLayer](#2️⃣-สร้าง-csvlayer)
3. [เก็บ Default Renderer](#3️⃣-เก็บ-default-renderer)
4. [Method: addCSVLayer()](#4️⃣-method-addcsvlayer)
5. [Method: analysisCSVLayer()](#5️⃣-method-analysiscsvlayer)
6. [Method: resetAnalysisCSVLayer()](#6️⃣-method-resetanalysiscsvlayer)
7. [Method: hideCSVLayer()](#7️⃣-method-hidecsvlayer)
8. [Flow การทำงาน](#🎯-flow-การทำงาน)

---

## 1️⃣ Import

```typescript
import CSVLayer from "@arcgis/core/layers/CSVLayer.js";
import HeatmapRenderer from "@arcgis/core/renderers/HeatmapRenderer.js";
```

| Module | หน้าที่ |
|--------|--------|
| `CSVLayer` | Layer สำหรับโหลดข้อมูลจากไฟล์ CSV แล้วแสดงเป็นจุดบนแผนที่ |
| `HeatmapRenderer` | Renderer สำหรับแสดงข้อมูลแบบ Heatmap (แผนที่ความหนาแน่น) |

---

## 2️⃣ สร้าง CSVLayer

```typescript
demoCSVLayer = new CSVLayer({
  url: "https://raw.githubusercontent.com/.../taxi-fares.csv",  // 👈 URL ของไฟล์ CSV
  title: "Taxi Ride",                                           // 👈 ชื่อ Layer
  latitudeField: "pickup_latitude",                             // 👈 column ที่เก็บ latitude
  longitudeField: "pickup_longitude",                           // 👈 column ที่เก็บ longitude
  popupTemplate: {                                              // 👈 กำหนดรูปแบบ Popup
    title: "Taxi Ride",
    content: [
      {
        type: "fields",                                         // 👈 แสดงเป็นตาราง field
        fieldInfos: [
          { fieldName: "fare_amount", label: "Fare" },          // 👈 แสดง fare_amount เป็น "Fare"
          { fieldName: "passenger_count", label: "Passengers" },
          { fieldName: "pickup_datetime", label: "Pickup" }
        ]
      }
    ]
  }
});
```

### สิ่งสำคัญ:
- `url` → URL ของไฟล์ CSV (ต้องเป็น public URL)
- `latitudeField` / `longitudeField` → ต้องตรงกับ **ชื่อ column ใน CSV**
- `popupTemplate` → กำหนดว่า popup แสดงอะไรเมื่อคลิกจุด

### ตัวอย่างข้อมูลใน CSV:
| pickup_latitude | pickup_longitude | fare_amount | passenger_count | pickup_datetime |
|-----------------|------------------|-------------|-----------------|-----------------|
| 40.7580 | -73.9855 | 10.5 | 2 | 7/9/2010 1:29 PM |

---

## 3️⃣ เก็บ Default Renderer

```typescript
defaultCSVRenderer: __esri.Renderer | null | undefined = null;
```

### ทำไมต้องมี?
- เมื่อโหลด CSV มาครั้งแรก จะมี **default renderer** (จุดสีส้ม)
- เราต้องเก็บไว้เพื่อให้ **Reset Analysis** กลับมาเป็นแบบเดิมได้

### Type:
- `__esri.Renderer` → type ของ Renderer จาก ArcGIS
- `null | undefined` → รองรับกรณียังไม่ได้โหลด layer

---

## 4️⃣ Method: addCSVLayer()

```typescript
addCSVLayer() {
  if (!this.map) return;  // 👈 ถ้าไม่มี map ก็ออก

  // ถ้ายังไม่ได้เพิ่ม layer
  if (!this.map.layers.includes(this.demoCSVLayer)) {
    this.map.add(this.demoCSVLayer);              // 👈 เพิ่ม layer เข้า map
    
    this.demoCSVLayer.when(() => {                // 👈 รอ layer โหลดเสร็จ
      this.defaultCSVRenderer = this.demoCSVLayer.renderer;  // 👈 เก็บ renderer เดิม
    });
  } else {
    this.demoCSVLayer.visible = true;             // 👈 ถ้ามีแล้วก็แค่ทำให้เห็น
  }

  // Zoom ไปที่ New York
  this.mapView?.goTo({
    center: [-73.99737012823125, 40.715763042829096],  // 👈 พิกัด New York
    zoom: 12
  });
}
```

### สิ่งสำคัญ:
| Code | อธิบาย |
|------|--------|
| `this.map.layers.includes()` | เช็คว่า layer นี้อยู่ใน map แล้วหรือยัง |
| `this.map.add()` | เพิ่ม layer เข้า map |
| `this.demoCSVLayer.when()` | รอ layer โหลดข้อมูลเสร็จก่อนค่อยทำอะไรต่อ |
| `this.mapView?.goTo()` | Zoom แผนที่ไปยังตำแหน่งที่กำหนด |

---

## 5️⃣ Method: analysisCSVLayer()

```typescript
analysisCSVLayer() {
  const heatmapRenderer = new HeatmapRenderer({
    colorStops: [
      { color: "rgba(255, 255, 255, 0)", ratio: 0 },      // 👈 โปร่งใส (ความหนาแน่นต่ำ)
      { color: "rgba(255, 200, 100, 0.5)", ratio: 0.2 },  // 👈 เหลืองอ่อน
      { color: "rgba(255, 80, 80, 0.8)", ratio: 0.5 },    // 👈 ส้มแดง
      { color: "rgba(200, 0, 0, 1)", ratio: 1 }           // 👈 แดงเข้ม (ความหนาแน่นสูง)
    ],
    radius: 10,         // 👈 รัศมีของ heatmap (pixel)
    minDensity: 0,      // 👈 ความหนาแน่นต่ำสุด
    maxDensity: 1,      // 👈 ความหนาแน่นสูงสุดที่จะแสดงสีเข้มสุด
    referenceScale: 50000  // 👈 scale อ้างอิง (ปรับขนาดตาม zoom)
  });

  this.demoCSVLayer.renderer = heatmapRenderer;  // 👈 เปลี่ยน renderer ของ layer
}
```

### อธิบาย colorStops:

| ratio | ความหมาย | สี |
|-------|----------|-----|
| `0` | ความหนาแน่น = 0% | โปร่งใส |
| `0.2` | ความหนาแน่น = 20% | เหลืองอ่อน |
| `0.5` | ความหนาแน่น = 50% | ส้มแดง |
| `1` | ความหนาแน่น = 100% | แดงเข้ม |

### รูปแบบสี RGBA:
```
rgba(red, green, blue, alpha)
```
- red, green, blue: 0-255
- alpha: 0 (โปร่งใส) ถึง 1 (ทึบ)

### Parameters:
| Parameter | หน้าที่ | ค่าแนะนำ |
|-----------|--------|---------|
| `radius` | รัศมีของแต่ละจุด (pixel) | 5-50 |
| `minDensity` | ค่าความหนาแน่นต่ำสุด | 0 |
| `maxDensity` | ค่าความหนาแน่นสูงสุดที่จะแสดงสีเข้มสุด | 0.05 |


---

## 6️⃣ Method: resetAnalysisCSVLayer()

```typescript
resetAnalysisCSVLayer() {
  if (this.defaultCSVRenderer) {
    this.demoCSVLayer.renderer = this.defaultCSVRenderer;  // 👈 เปลี่ยนกลับเป็น renderer เดิม
  }
}
```

### ทำไมต้อง check `if`?
- ถ้ายังไม่เคยกด Add Demo มาก่อน → `defaultCSVRenderer` จะเป็น `null`
- ป้องกัน error

---

## 7️⃣ Method: hideCSVLayer()

```typescript
hideCSVLayer() {
  if (!this.map) return;

  if (this.map.layers.includes(this.demoCSVLayer)) {
    this.demoCSVLayer.visible = false;  // 👈 ซ่อน layer (ไม่ลบออก)
  }
}
```

### ต่างจาก remove:
| วิธี | ผลลัพธ์ |
|-----|--------|
| `visible = false` | **ซ่อน** - layer ยังอยู่ใน map |
| `map.remove(layer)` | **ลบ** - layer หายไปจาก map |

---

## 🎯 Flow การทำงาน

```
┌─────────────┐     ┌─────────────────┐     ┌──────────────────┐
│  Add Demo   │ ──▶ │ แสดงจุดสีส้ม     │ ──▶ │ เก็บ renderer เดิม │
└─────────────┘     └─────────────────┘     └──────────────────┘
                              │
                              ▼
┌─────────────┐     ┌─────────────────┐
│  Analysis   │ ──▶ │ เปลี่ยนเป็น Heatmap│
└─────────────┘     └─────────────────┘
                              │
                              ▼
┌─────────────┐     ┌─────────────────┐
│Reset Analysis│ ──▶│ กลับเป็น renderer เดิม│
└─────────────┘     └─────────────────┘
                              │
                              ▼
┌─────────────┐     ┌─────────────────┐
│  Hide Demo  │ ──▶ │ ซ่อน CSV Layer  │
└─────────────┘     └─────────────────┘
```

---

## 📖 Reference

- [CSVLayer | ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-CSVLayer.html)
- [HeatmapRenderer | ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/latest/api-reference/esri-renderers-HeatmapRenderer.html)
- [PopupTemplate | ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/latest/api-reference/esri-PopupTemplate.html)
