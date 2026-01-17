import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import Map from '@arcgis/core/Map.js';
import MapView from '@arcgis/core/views/MapView.js';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";
import Graphic from "@arcgis/core/Graphic.js";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
// CSV Layer //
import CSVLayer from "@arcgis/core/layers/CSVLayer.js";
import HeatmapRenderer from "@arcgis/core/renderers/HeatmapRenderer.js";
import * as geodesicBufferOperator from "@arcgis/core/geometry/operators/geodesicBufferOperator.js";
import Point from "@arcgis/core/geometry/Point.js";
import FeatureEffect from "@arcgis/core/layers/support/FeatureEffect.js";
import FeatureFilter from "@arcgis/core/layers/support/FeatureFilter.js";

@Component({
  selector: 'app-demo-gis-page',
  imports: [CommonModule, ButtonModule, AccordionModule],
  templateUrl: './demo-gis-page.html',
  styleUrl: './demo-gis-page.css',
})
export class DemoGisPage implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('mapViewNode', { static: false }) private mapViewEl!: ElementRef;
  map: Map | null = null;
  mapView: MapView | null = null;
  demoGraphicsLayer = new GraphicsLayer();
  restaurantGraphicsLayer = new GraphicsLayer();
  demoVectorTileLayer = new VectorTileLayer({
    url: "https://tiles.arcgis.com/tiles/jSaRWj2TDlcN1zOC/arcgis/rest/services/Thailand_Transportation/VectorTileServer"
  });
  demoFeatureLayer = new FeatureLayer({
    url: "https://services-ap1.arcgis.com/iA7fZQOnjY9D67Zx/ArcGIS/rest/services/OSM_AS_POIs/FeatureServer/0",
    outFields: ["*"],
    popupTemplate: {
      title: "{name}",
      content:
        "<b>Type:</b> {amenity} <br><b>Place:</b> {place} <br>",
    }
  });

  restaurantCSVLayer = new CSVLayer({
    url: "https://raw.githubusercontent.com/marklukky-art/dataset_for_workshop/refs/heads/main/data.csv",
    latitudeField: "Latitude",
    longitudeField: "Longitude",
    popupTemplate: {
      title: "{Restaurant Name}",
      content: `
      <b>Has Delivery:</b> {Has Online delivery}<br/>
      <b>Cuisines:</b> {Cuisines}<br/>
      <b>Address:</b> {Address}
    `
    }
  });

  provinceFeatureLayer = new FeatureLayer({
    url: "https://services1.arcgis.com/jSaRWj2TDlcN1zOC/ArcGIS/rest/services/Thailand_Province_Boundaries_view/FeatureServer/1",
    outFields: ["*"]
  });

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  demo() {
    if (!this.mapView) return;

    this.mapView.goTo({
      center: [78.52562187378993, 20.39684625056514],
      zoom: 5
    })
    // clear all old graphics
    this.demoGraphicsLayer.removeAll();
    const currentLocationUser = new Point({
      longitude: 78.52562187378993,
      latitude: 20.39684625056514,
    })
    const userSymbol: any = {
      type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
      url: "https://cdn-icons-png.flaticon.com/128/3710/3710297.png",
      width: "34px",
      height: "34px"
    }

    const userGraphic = new Graphic({ geometry: currentLocationUser, symbol: userSymbol });

    if (geodesicBufferOperator.isLoaded()) {
      const bufferGeometry = geodesicBufferOperator.execute(currentLocationUser, 700, { unit: "kilometers" });
      const bufferGraphic = new Graphic({
        geometry: bufferGeometry,
        symbol: {
          type: "simple-fill", // autocasts as new SimpleFillSymbol()
          color: [255, 255, 0, 0.6],
          outline: {
            color: [0, 0, 0, 0.5],
            width: 2
          }
        }
      })
      // this.demoGraphicsLayer.add(bufferGraphic);
      this.demoGraphicsLayer.add(userGraphic);
      ;
      this.restaurantCSVLayer.featureEffect = {
        filter: {
          geometry: bufferGraphic.geometry,
          spatialRelationship: "intersects",
        },
        excludedEffect: "grayscale(100%) opacity(0%)",
      }
    }
  }

  async initializeMap(): Promise<any> {
    const container = this.mapViewEl.nativeElement;

    this.map = new Map({
      basemap: 'streets-vector',
    });

    this.mapView = new MapView({
      container,
      map: this.map,
      center: [100.5433989, 13.7029924], // longitude, latitude
      zoom: 16,
    });

    this.map.add(this.demoGraphicsLayer);
    this.map.add(this.restaurantGraphicsLayer);
    await geodesicBufferOperator.load();
    this.restaurantCSVLayer.renderer = {
      type: "unique-value",  // autocasts as new UniqueValueRenderer()
      field: "Cuisines",
      defaultSymbol: {
        type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
        url: "https://cdn-icons-png.flaticon.com/128/7720/7720630.png",
        width: "34px",
        height: "34px"
      },
      uniqueValueInfos: [
        {
          value: "North Indian",
          symbol: {
            type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
            url: "https://cdn-icons-png.flaticon.com/128/4727/4727322.png",
            width: "28px",
            height: "28px"
          },
        },
        {
          value: "Chinese",
          symbol: {
            type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
            url: "https://cdn-icons-png.flaticon.com/128/6548/6548182.png",
            width: "28px",
            height: "28px"
          },
        },
        {
          value: "Bakery",
          symbol: {
            type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
            url: "https://cdn-icons-png.flaticon.com/128/3081/3081967.png",
            width: "28px",
            height: "28px"
          },
        },
        {
          value: "Cafe",
          symbol: {
            type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
            url: "https://cdn-icons-png.flaticon.com/128/9620/9620771.png",
            width: "28px",
            height: "28px"
          },
        }
      ]
    };
    this.map.add(this.restaurantCSVLayer);
    // https://cdn-icons-png.flaticon.com/128/4714/4714377.png
    this.restaurantCSVLayer.load().then(() => {
      return this.restaurantCSVLayer.queryExtent();
    }).then((result) => {
      if (result.extent) {
        this.mapView!.goTo(
          result.extent.expand(1.2)
        );
      }
    }).catch(err => {
      console.error('CSV zoom error', err);
    });

    this.mapView.on("click", (event) => {
      const { longitude, latitude } = event.mapPoint;

      console.log("Clicked location:");
      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);
    });

    this.mapView.when(() => { });

    return this.mapView.when();
  }

  addGraphics() {
    // zoom to specific location
    this.mapView?.goTo({
      center: [-118.805, 34.020],
      zoom: 13
    })
    // clear all old graphics
    this.demoGraphicsLayer.removeAll();

    // Demo Add Point Graphic to GraphicLayer
    const point: any = {
      //Create a point
      type: "point",
      longitude: -118.80657463861,
      latitude: 34.0005930608889,
    };
    const simpleMarkerSymbol: any = {
      type: "simple-marker",
      color: [226, 119, 40], // Orange
      outline: {
        color: [255, 255, 255], // White
        width: 1,
      },
    };

    const pointGraphic = new Graphic({ geometry: point, symbol: simpleMarkerSymbol });
    this.demoGraphicsLayer.add(pointGraphic);

    // ---------------------------------------------------------------------------
    // Demo Add Polyline Graphic to GraphicLayer
    const polyline: any = {
      type: "polyline",
      paths: [
        [-118.821527826096, 34.0139576938577], //Longitude, latitude
        [-118.814893761649, 34.0080602407843], //Longitude, latitude
        [-118.808878330345, 34.0016642996246], //Longitude, latitude
      ],
    };
    const simpleLineSymbol: any = {
      type: "simple-line",
      color: [226, 119, 40], // Orange
      width: 2,
    };

    const polylineGraphic = new Graphic({ geometry: polyline, symbol: simpleLineSymbol });
    this.demoGraphicsLayer.add(polylineGraphic);

    // ---------------------------------------------------------------------------
    // Demo Add Polygon Graphic to GraphicLayer
    const polygon: any = {
      type: "polygon",
      rings: [
        [-118.818984489994, 34.0137559967283], //Longitude, latitude
        [-118.806796597377, 34.0215816298725], //Longitude, latitude
        [-118.791432890735, 34.0163883241613], //Longitude, latitude
        [-118.79596686535, 34.008564864635], //Longitude, latitude
        [-118.808558110679, 34.0035027131376], //Longitude, latitude
      ],
    };

    const simpleFillSymbol: any = {
      type: "simple-fill",
      color: [227, 139, 79, 0.8], // Orange, opacity 80%
      outline: { color: [255, 255, 255], width: 1 },
    };

    const attributes = { Name: "Graphic", Description: "I am a polygon" };
    const popupTemplate = { title: "{Name}", content: "{Description}" };

    const polygonGraphic = new Graphic({
      geometry: polygon,
      symbol: simpleFillSymbol,
      attributes: attributes,
      popupTemplate: popupTemplate,
    });
    this.demoGraphicsLayer.add(polygonGraphic);
  }
  // ---------------------------------------------------------------------------
  addRestaurantPoint() {
    // zoom to restaurant location - สุกี้ตี๋น้อย ศรีนครินทร์ มาร์เก็ต
    this.mapView?.goTo({
      center: [100.64646713952521, 13.689201171313476],
      zoom: 16
    });

    // clear old restaurant graphics
    this.restaurantGraphicsLayer.removeAll();

    // Create point for สุกี้ตี๋น้อย ศรีนครินทร์ มาร์เก็ต
    const restaurantPoint: any = {
      type: "point",
      longitude: 100.64646713952521,
      latitude: 13.689201171313476,
    };


    // Use PictureMarkerSymbol - Teal marker like Google Maps
    const pictureMarkerSymbol: any = {
      type: "picture-marker",
      url: "https://cdn-icons-png.flaticon.com/512/10726/10726411.png",
      width: "64px",
      height: "64px"
    };

    // Attributes for popup
    const attributes = {
      Name: "สุกี้ตี๋น้อย ศรีนครินทร์ มาร์เก็ต",
      Address: "199 10 ถ. ศรีนครินทร์ แขวงหนองบอน เขตประเวศ กรุงเทพมหานคร 10250",
      Image: "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSwxHGrOp_BXbi8UUlCtifVVQL4DHnkEA75szpbGlYsbbBIegmrFDp-CgG_bV6oP64djQQx44QrUHGlg6Jxym64HG5mb-NfJMgr1UxNlxBuqZCrA50VTDEWw6064lLbj8alBKy_93DvvT-Eg=w408-h306-k-no"
    };

    // Popup Template with image like Google Maps
    const popupTemplate = {
      title: `<div style="font-family: Arial, sans-serif, font-bold;">{Name}</div>`,
      content: `
        <div style="font-family: Arial, sans-serif;">
          <img src="{Image}" style="width: 100%; max-width: 500px; height: auto; border-radius: 8px; margin-bottom: 10px;" />
          <p style="font-weight: bold; font-size: 18px; margin-bottom: 5px;">
            {Name}
          </p>
          <p style="font-size: 13px; color: #787878; font-weight: semi-bold;">
            {Address}
          </p>
        </div>
      `
    };

    const restaurantGraphic = new Graphic({
      geometry: restaurantPoint,
      symbol: pictureMarkerSymbol,
      attributes: attributes,
      popupTemplate: popupTemplate,
    });

    this.restaurantGraphicsLayer.add(restaurantGraphic);
  }

  addVectorTile() {
    if (!this.map) return;

    if (!this.map.layers.includes(this.demoVectorTileLayer)) {
      this.map.add(this.demoVectorTileLayer);
    } else {
      this.demoVectorTileLayer.visible = true;
    }
  }

  addFeatureLayer() {
    if (!this.map) return;

    if (!this.map.layers.includes(this.demoFeatureLayer)) {
      this.map.add(this.demoFeatureLayer);
    } else {
      this.demoFeatureLayer.visible = true;
    }
  }

  zoomFeatureLayer() {
    if (!this.map) return;
    this.provinceFeatureLayer.queryFeatures({
      where: "NAME1='พะเยา'",  // SQL Statement
      returnGeometry: true,
      outFields: ["*"],
      num: 1
    }).then(result => {
      console.log('result', result)
      if (result.features.length > 0) {
        const feature = result.features[0];
        this.demoGraphicsLayer.removeAll();

        // 🔹 สร้าง symbol สำหรับขอบเขตจังหวัด
        const boundarySymbol: any = {
          type: "simple-fill",
          color: [0, 0, 0, 0], // โปร่งใส
          outline: {
            color: [0, 150, 255], // ฟ้า
            width: 3
          }
        };

        // 🔹 สร้าง graphic
        const boundaryGraphic = new Graphic({
          geometry: feature.geometry,
          symbol: boundarySymbol
        });

        // 🔹 วาดขอบเขตจังหวัดลง graphic layer
        this.demoGraphicsLayer.add(boundaryGraphic);

        // 🔹 zoom ไปที่ polygon
        this.mapView?.goTo(
          {
            target: feature.geometry,
            padding: 40
          },
          {
            duration: 1200,
            easing: "ease-in-out"
          }
        );
      }
    });
  }

  // ==================== CSV Layer ==================== //

  demoCSVLayer = new CSVLayer({
    url: "https://raw.githubusercontent.com/jeffprosise/Machine-Learning/refs/heads/master/Data/taxi-fares.csv",
    title: "Taxi Ride",
    latitudeField: "pickup_latitude",
    longitudeField: "pickup_longitude",
    popupTemplate: {
      title: "Taxi Ride",
      content: `
        <b>Fare:</b> {fare_amount} USD<br>
        <b>Passengers:</b> {passenger_count}<br>
        <b>Pickup:</b> {pickup_datetime}
      `
    }
  });

  defaultCSVRenderer: __esri.Renderer | null | undefined = null;

  addCSVLayer() {
    if (!this.map) return;

    if (!this.map.layers.includes(this.demoCSVLayer)) {
      this.map.add(this.demoCSVLayer);

      this.demoCSVLayer.when(() => {
        this.defaultCSVRenderer = this.demoCSVLayer.renderer;
      });
    } else {
      this.demoCSVLayer.visible = true;
    }

    this.mapView?.goTo({
      center: [-73.99737012823125, 40.715763042829096],
      zoom: 12
    });
  }

  analysisCSVLayer() {
    const heatmapRenderer = new HeatmapRenderer({
      colorStops: [
        { color: "rgba(255, 255, 255, 0)", ratio: 0 },
        { color: "rgba(255, 200, 100, 0.5)", ratio: 0.2 },
        { color: "rgba(255, 80, 80, 0.8)", ratio: 0.5 },
        { color: "rgba(200, 0, 0, 1)", ratio: 1 }
      ],
      radius: 8,
      minDensity: 0,
      maxDensity: 0.05,
    });

    this.demoCSVLayer.renderer = heatmapRenderer;
  }

  resetAnalysisCSVLayer() {
    if (this.defaultCSVRenderer) {
      this.demoCSVLayer.renderer = this.defaultCSVRenderer;
    }
  }

  hideCSVLayer() {
    if (!this.map) return;

    if (this.map.layers.includes(this.demoCSVLayer)) {
      this.demoCSVLayer.visible = false;
    }
  }
  //----------------------------------------------------------------------------

  hideFeatureLayer() {
    if (!this.map) return;

    if (this.map.layers.includes(this.demoFeatureLayer)) {
      this.demoFeatureLayer.visible = false;
    }
  }

  hideVectorTile() {
    if (!this.map) return;

    if (this.map.layers.includes(this.demoVectorTileLayer)) {
      this.demoVectorTileLayer.visible = false;
    }
  }

  clearRestaurantLayer() {
    this.restaurantGraphicsLayer.removeAll();
  }

  clearGraphicLayer() {
    this.demoGraphicsLayer.removeAll();
  }



  ngOnDestroy(): void {
    if (this.mapView) {
      this.mapView.destroy();
    }
  }
}
