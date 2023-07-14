import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MapInfoWindow, MapMarker, MapDirectionsService, GoogleMap } from '@angular/google-maps';
import { map, Observable } from 'rxjs';
import { StylesMap } from './map.style';

@Component({
  selector: 'app-map-track',
  templateUrl: './map-track.component.html',
  styleUrls: ['./map-track.component.css']
})

export class MapTrackComponent implements AfterViewInit {
  letter: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  @ViewChild("mapSearch") searchField: ElementRef | null = null;
  @ViewChild("mapSearch2") searchField2: ElementRef | null = null;
  @ViewChild(GoogleMap) map: GoogleMap | null = null;
  style = {
    pointerEvents: "none",
    opacity: "0",
  }
  show = false;
  cordinateOrigin: google.maps.LatLngBounds | null = null;
  cordinateDestination: google.maps.LatLngBounds | null = null;

  options: google.maps.MapOptions = {
    disableDefaultUI: true,
    styles: StylesMap.dark,
  };

  center: google.maps.LatLngLiteral = { lat: 48.8588548, lng: 2.347035 };
  zoom = 15;
  markers: google.maps.MarkerOptions[] = [];

  addMarker(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.markers.push({
      position: event.latLng.toJSON(),
      animation: google.maps.Animation.DROP,
      label: {
        text: this.letter[this.markers.length],
        color: "#fff",
        fontWeight: "900",
        fontSize: "40px",
        fontFamily: "Century Gothic"
      }
    });
  }

  directionsResults$: Observable<google.maps.DirectionsResult | undefined>;
  constructor(private mapDirectionsService: MapDirectionsService) {
    navigator.geolocation.getCurrentPosition(position => {
      this.center = { lat: position.coords.latitude, lng: position.coords.longitude }
    })
    this.directionsResults$ = new Observable();
  }

  buildRoute() {
    if (this.cordinateOrigin != null && this.cordinateDestination != null) {
      const request: google.maps.DirectionsRequest = {
        origin: this.cordinateOrigin.getCenter(),
        destination: this.cordinateDestination.getCenter(),
        travelMode: google.maps.TravelMode.DRIVING
      };
      this.directionsResults$ = this.mapDirectionsService.route(request).pipe(map(response => response.result));
    }
  }

  buildRoadByPoint() {
    if (this.markers.length > 1) {
      let waypoints: google.maps.DirectionsWaypoint[] = [];
      for (var i = 1; i < this.markers.length - 1; i++) {
        waypoints.push({
          location: this.markers[i].position as google.maps.LatLngLiteral,
          stopover: true
        })
      }
      const request: google.maps.DirectionsRequest = {
        origin: this.markers[0].position as google.maps.LatLngLiteral,
        destination: this.markers[this.markers.length - 1].position as google.maps.LatLngLiteral,
        waypoints: waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: true
      };
      this.markers = [];
      this.directionsResults$ = this.mapDirectionsService.route(request).pipe(map(response => response.result));
    }
  }

  ngAfterViewInit(): void {
    if (this.searchField != null && this.searchField2 != null) {
      let change1 = this.InitSearchInput(this.searchField);
      let change2 = this.InitSearchInput(this.searchField2);

      change1.subscribe(value => {
        this.cordinateOrigin = value;
        this.buildRoute();
      })
      change2.subscribe(value => {
        this.cordinateDestination = value;
        this.buildRoute();
      })
    }
  }

  InitSearchInput(el: ElementRef) {
    let informator = new Observable<google.maps.LatLngBounds>(observ => {
      const SearchBox = new google.maps.places.SearchBox(
        el.nativeElement,
      );

      SearchBox.addListener('places_changed', () => {
        const places = SearchBox.getPlaces();

        if (places?.length === 0) {
          return
        }
        const bounds = new google.maps.LatLngBounds();
        places?.forEach(place => {
          if (!place.geometry || !place.geometry.location) {
            return;
          }
          if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport);
          }
          else {
            bounds.extend(place.geometry.location);
          }
        });
        observ.next(bounds)
      })
    });
    return informator;
  }

  MenuShow() {
    this.show = !this.show;
    let clone = { ...(this.style) };
    if (this.show) {
      clone.opacity = "0.9";
      clone.pointerEvents = "auto";
    }
    else {
      clone.opacity = "0";
      clone.pointerEvents = "none";
    }
    this.style = clone;
  }
}
