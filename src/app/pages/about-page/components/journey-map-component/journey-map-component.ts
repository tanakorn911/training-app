import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy, signal, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import Map from '@arcgis/core/Map.js';
import SceneView from '@arcgis/core/views/SceneView.js';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer.js';
import Graphic from '@arcgis/core/Graphic.js';
import Point from '@arcgis/core/geometry/Point.js';
import { ThemeService } from '../../../../shared/services/theme.service';

export interface JourneyLocation {
  id: string;
  name: string;
  description: string;
  details: string;
  type: 'home' | 'school' | 'university';
  longitude: number;
  latitude: number;
  year?: string;
}

@Component({
  selector: 'app-journey-map-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './journey-map-component.html'
})
export class JourneyMapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapViewNode', { static: false }) private mapViewEl!: ElementRef;

  private readonly themeService = inject(ThemeService);
  private map: Map | null = null;
  private sceneView: SceneView | null = null;
  private graphicsLayer = new GraphicsLayer();
  private isMapInitialized = false;

  activeLocation = signal<JourneyLocation | null>(null);

  // Expose theme mode for template
  isDarkMode = this.themeService.isDarkMode;

  // Light and Dark basemaps
  private readonly LIGHT_BASEMAP = 'streets-navigation-vector';
  private readonly DARK_BASEMAP = 'dark-gray-vector';

  constructor() {
    // Effect to watch theme changes and update basemap
    effect(() => {
      const isDark = this.themeService.isDarkMode();
      if (this.isMapInitialized && this.map) {
        this.updateBasemap(isDark);
      }
    });
  }

  private updateBasemap(isDark: boolean): void {
    if (this.map) {
      this.map.basemap = isDark ? this.DARK_BASEMAP : this.LIGHT_BASEMAP;
    }
  }

  // Real location data
  locations: JourneyLocation[] = [
    {
      id: '1',
      name: 'Hometown',
      description: 'Nan Province, Thailand',
      details: 'Born and raised in Nan Province, a land of mountains and beautiful nature in Northern Thailand.',
      type: 'home',
      longitude: 100.43773128808279,
      latitude: 18.845311107597368,
      year: 'Hometown'
    },
    {
      id: '2',
      name: 'Phrapariyattidhamma School',
      description: 'Wat Phra That Chae Haeng, Nan',
      details: 'Completed secondary education at Phrapariyattidhamma School, Wat Phra That Chae Haeng, Nan Province.',
      type: 'school',
      longitude: 100.79172392392576,
      latitude: 18.758385343533547,
      year: 'High School'
    },
    {
      id: '3',
      name: 'University of Phayao',
      description: 'CS/ICT, Phayao Province',
      details: 'Currently pursuing a Bachelor\'s degree in Computer Science and Information and Communication Technology (CS/ICT) at the University of Phayao.',
      type: 'university',
      longitude: 99.90025936692174,
      latitude: 19.027166968684686,
      year: '2024 - Present'
    }
  ];

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  async initializeMap(): Promise<void> {
    const container = this.mapViewEl.nativeElement;

    // Use theme-aware basemap
    const isDark = this.themeService.isDarkMode();
    this.map = new Map({
      basemap: isDark ? this.DARK_BASEMAP : this.LIGHT_BASEMAP,
      ground: 'world-elevation'
    });

    // 3D SceneView
    this.sceneView = new SceneView({
      container,
      map: this.map,
      camera: {
        position: {
          longitude: 100.3,
          latitude: 17.5,
          z: 120000 // 120km altitude
        },
        tilt: 45,
        heading: 0
      },
      environment: {
        atmosphereEnabled: true,
        starsEnabled: true,
        lighting: {
          type: 'sun',
          date: new Date(),
          directShadowsEnabled: true
        }
      },
      ui: {
        components: ['zoom', 'compass', 'navigation-toggle']
      },
      popup: {
        dockEnabled: true,
        dockOptions: {
          buttonEnabled: false,
          breakpoint: false,
          position: 'bottom-right'
        }
      }
    });

    this.map.add(this.graphicsLayer);

    await this.sceneView.when();
    this.isMapInitialized = true;
    this.addLocationMarkers();
  }

  addLocationMarkers(): void {
    this.locations.forEach(location => {
      const point = new Point({
        longitude: location.longitude,
        latitude: location.latitude,
        z: 2000 // Elevated markers higher to avoid terrain clipping (Phayao mountains)
      });

      const markerSymbol: any = {
        type: 'point-3d',
        symbolLayers: [{
          type: 'icon',
          resource: { href: this.getMarkerUrl(location.type) },
          size: 48,
          anchor: 'bottom'
        }, {
          type: 'text',
          material: { color: '#dc2626' },
          halo: { color: 'white', size: 2 },
          text: location.name,
          font: { size: 12, weight: 'bold' },
          verticalOffset: {
            screenLength: 60,
            maxWorldLength: 2000,
            minWorldLength: 100
          },
          callout: {
            type: 'line',
            color: '#dc2626',
            size: 2,
            border: { color: 'white' }
          }
        }]
      };

      // Red themed popup
      const popupTemplate = {
        title: `<span style="color: #dc2626;">${this.getTypeIcon(location.type)}</span> ${location.name}`,
        content: `
          <div style="font-family: sans-serif; padding: 8px 0;">
            <p style="margin: 0 0 12px 0; color: #374151; font-size: 14px; line-height: 1.5;">
              ${location.details}
            </p>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <span style="background: linear-gradient(135deg, #dc2626, #991b1b); color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px;">
                ${location.year}
              </span>
              <span style="background: #1f2937; color: #f3f4f6; padding: 4px 12px; border-radius: 12px; font-size: 12px;">
                📍 ${location.description}
              </span>
            </div>
          </div>
        `
      };

      const graphic = new Graphic({
        geometry: point,
        symbol: markerSymbol,
        attributes: location,
        popupTemplate: popupTemplate
      });

      this.graphicsLayer.add(graphic);
    });
  }

  getMarkerUrl(type: string): string {
    const icons: Record<string, string> = {
      home: 'https://cdn-icons-png.flaticon.com/128/619/619153.png',
      school: 'https://cdn-icons-png.flaticon.com/128/2602/2602414.png',
      university: 'https://cdn-icons-png.flaticon.com/128/3976/3976631.png',
    };
    return icons[type];
  }

  getTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      home: '🏠',
      school: '🏫',
      university: '🎓',
    };
    return icons[type];
  }

  // Helper method for card classes (Red/Black theme vs Clean Light theme)
  getCardClasses(location: JourneyLocation): string {
    const isActive = this.activeLocation()?.id === location.id;
    const isDark = this.isDarkMode();

    if (isActive) {
      return isDark
        ? 'bg-gradient-to-r from-red-900/40 to-black border-l-red-500 shadow-xl shadow-red-900/20 translate-x-1'
        : 'bg-white border-l-red-500 shadow-xl translate-x-1';
    }

    return isDark
      ? 'bg-transparent border-l-transparent hover:bg-white/5 hover:translate-x-1'
      : 'bg-transparent border-l-transparent hover:bg-white hover:shadow-md hover:translate-x-1';
  }

  flyToLocation(location: JourneyLocation): void {
    if (!this.sceneView) return;

    this.activeLocation.set(location);

    this.sceneView.goTo({
      target: new Point({
        longitude: location.longitude,
        latitude: location.latitude,
        z: 2000
      }),
      zoom: 14,
      tilt: 60,
      heading: 45
    }, {
      duration: 2000,
      easing: 'ease-in-out'
    });

    // Open popup for this location
    const graphic = this.graphicsLayer.graphics.find(
      g => g.attributes?.id === location.id
    );
    if (graphic) {
      this.sceneView.openPopup({
        features: [graphic],
        location: graphic.geometry as Point
      });
    }
  }

  showAllLocations(): void {
    if (!this.sceneView || !this.graphicsLayer.graphics.length) return;

    this.activeLocation.set(null);
    this.sceneView.closePopup();

    this.sceneView.goTo(this.graphicsLayer.graphics, {
      duration: 2000,
      easing: 'ease-in-out'
    });
  }

  resetView(): void {
    if (!this.sceneView) return;

    this.activeLocation.set(null);
    this.sceneView.closePopup();

    this.sceneView.goTo({
      position: {
        longitude: 100.3,
        latitude: 17.5,
        z: 120000
      },
      tilt: 45,
      heading: 0
    }, {
      duration: 2000,
      easing: 'ease-in-out'
    });
  }

  ngOnDestroy(): void {
    if (this.sceneView) {
      this.sceneView.destroy();
    }
  }
}
