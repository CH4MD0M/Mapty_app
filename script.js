'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App {
    #map;
    #mapEvent;

    constructor() {
        this._getPosition();

        form.addEventListener('submit', this._newWorkOut.bind(this));

        inputType.addEventListener('change', this._toggleElevationField);
    }

    _getPosition() {
        if (navigator.geolocation)
            navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function () {
                alert('위치를 가져올 수 없습니다!');
            });
    }

    _loadMap(position) {
        const { latitude, longitude } = position.coords;
        const coords = [latitude, longitude];

        // this 확인
        // console.log(this);

        this.#map = L.map('map').setView(coords, 13);
        // console.log(map);

        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(this.#map);

        // ✔map의 클릭 이벤트
        this.#map.on('click', this._showForm.bind(this));
    }

    _showForm(mapE) {
        // mapE는 leaflet의 이벤트.
        /*  ↓↓↓ mapE ↓↓↓
            {originalEvent: MouseEvent, containerPoint: k, layerPoint: k, latlng: D, type: "click", …}
            containerPoint: k {x: 837, y: 343}
            ✔✔ latlng: D {lat: 37.46436733315239, lng: 126.690731048584} ✔✔
            layerPoint: k {x: 837, y: 343}
            originalEvent: MouseEvent {isTrusted: true, screenX: 1362, screenY: 471, clientX: 1362, clientY: 368, …}
            sourceTarget: i {options: {…}, _handlers: Array(6), _layers: {…}, _zoomBoundLayers: {…}, _sizeChanged: false, …}
            target: i {options: {…}, _handlers: Array(6), _layers: {…}, _zoomBoundLayers: {…}, _sizeChanged: false, …}
            type: "click"
            __proto__: Object 
        */
        // 클래스필드 mapEvent에 mapE를 저장.
        // console.log(mapE);
        this.#mapEvent = mapE;
        form.classList.remove('hidden');
        inputDistance.focus();
    }

    _toggleElevationField() {
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    }

    _newWorkOut(e) {
        // ✔이벤트 취소
        e.preventDefault();

        // ✔필드 초기화
        inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';

        // ✔마커 표시
        // leaflet의 이벤트 중 latlng의 값을 불러와 marker를 display
        const { lat, lng } = this.#mapEvent.latlng;
        L.marker([lat, lng])
            .addTo(this.#map)
            .bindPopup(
                L.popup({
                    maxWidth: 250,
                    minWidth: 100,
                    autoClose: false,
                    closeOnClick: false,
                    className: 'running-popup',
                })
            )
            .setPopupContent('실행됨')
            .openPopup();
    }
}

const app = new App();
