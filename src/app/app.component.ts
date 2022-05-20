import { Component, ViewChild } from '@angular/core';
import breedersJson from '../assets/json/breeders.json';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

declare var ol: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  @ViewChild('content') modalContent : any;

  title = 'breeders-osm';

  latitude: number = 53.1424;
  longitude: number = -7.6921;

  closeResult = ''; 
  map: any;
  breederName: string = '';
  breederImage: string = '';
  animalsBred: string = '';
  breederLocation: string = '';
  breederPhoneNumber: string = '';
  breederEmail: string = '';

  constructor(private modalService: NgbModal) {}

  ngOnInit() {
    this.map = this.getMap();
    
    this.setInitialMapView();
    this.setMarkerOnClick(this);

    this.loadMarkers();
  }

  open(content: any) {
    this.modalService.open(this.modalContent);
    // console.log(content);
    // this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    //   this.closeResult = `Closed with: ${result}`;
    // }, (reason) => {
    //   this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    // });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  private getMap (): any {
    return new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([this.longitude, this.latitude]),
        zoom: 8
      })
    });
  }

  private setInitialMapView () : void {
    const view = this.map.getView();
    view.setCenter(ol.proj.fromLonLat([this.longitude, this.latitude]));
    view.setZoom(7);
  }

  private setBreederDetails (name: string, image: string, animals: string, location: string, phoneNumber: string, email: string): void {
    this.breederName = name;
    this.breederImage = image;
    this.animalsBred = animals;
    this.breederLocation = location;
    this.breederPhoneNumber = phoneNumber;
    this.breederEmail = email;
  }

  private setMarkerOnClick (thisRef: AppComponent): void {
      this.map.on('singleclick', function (evt: any) {
        thisRef.map.forEachLayerAtPixel(evt.pixel, function(this: AppComponent, layer: any) {
            const name = layer.get('name');
            const image = layer.get('image');
            const animals = layer.get('animals');
            const location = layer.get('location');
            const phoneNumber = layer.get('phoneNumber');
            const email = layer.get('email');
            if(name != undefined) {
              thisRef.setBreederDetails(name, image, animals, location, phoneNumber, email);
              thisRef.open('test');
            }
        });
    });
  }

  private loadMarkers () : void {
    for(let i = 0; i < breedersJson.length; i ++) {
      let markers = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: new ol.style.Style({
          image: new ol.style.Icon({
            anchor: [0.5, 1],
            size: [512, 512],
            scale: 0.1,
            src: 'assets/images/map-marker.png',
          })
        }),
        name: breedersJson[i].name,
        image: 'assets/images/' + breedersJson[i].image,
        animals: breedersJson[i].animalsBred,
        location: breedersJson[i].location,
        phoneNumber: breedersJson[i].phone,
        email: breedersJson[i].email
      });
      this.map.addLayer(markers);
      const marker = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([breedersJson[i].longitude, breedersJson[i].latitude])));
      markers.getSource().addFeature(marker);
    }
  }
}
