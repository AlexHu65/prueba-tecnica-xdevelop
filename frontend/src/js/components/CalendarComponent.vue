<template>
    <div class="calendar-wrapper">
		<div class="flex flex-between">
			<div class="flex flex-column">
				<h1>Schedules</h1>
				<small>Seleccione Fecha</small>
				<div class="flex caledar-selection border-radius-20">
					09/08/2022 - 09/08/2022
					<img src="../../../assets/img/calendar-vector.png" alt="Calendar vector">
				</div>
			</div>
			<div class="flex flex-column">
				<div class="profile flex align-center">
					<div class="form-search">
						<form action="#">
							<input class="search-input" type="text" name="search" id="search" placeholder="Search...">
						</form>
					</div>
					<div class="notification">
						<img src="../../../assets/img/notification-vector.png" alt="Notificacion">
					</div>
					<div class="profile-picture">
						<img src="../../../assets/img/profile-photo.png" alt="Profile photo">
					</div>
				</div>	
			</div>
		</div>
		<div class="flex">
			<div class="calendar border-radius-20">
				<div class="flex header-calendar">
					<div id="month">
						<h1 class="pointer">{{currentMonth}} {{ currentYear }}</h1>
					</div>
					<div class="flex controls">
						<div @click="previous()" class="flex prev">
							<i class="icon chevron-left"></i>
						</div>
						<div @click="next()" class="flex next">
							<i class="icon chevron-right"></i>
						</div>
					</div>
				</div>
				<table class="table-calendar w-100" id="calendar">
					<thead>
						<tr>
							<th>Domingo</th>
							<th>Lunes</th>
							<th>Martes</th>
							<th>Miercoles</th>
							<th>Jueves</th>
							<th>Viernes</th>
							<th>Sabado</th>
						</tr>
					</thead>
					<tbody id="calendar-body"></tbody>
				</table>
			</div>
			<div class="calendar-sidebar border-radius-20">
				<h2>Rutas Disponibles</h2>
				<ul v-if="routes.length > 0">
					<li v-for="(route, index) in routes" :key="index">{{ route.title }}</li>
				</ul>
			
			</div>
		</div>
	</div>
</template>

<script>

	import axios from "axios";

    export default {
		data(){
			return {
				url: 'http://localhost:8000',
				currentMonth: null,
				currentYear: null,
				selectYear: null,
				selectMonth: null,
				months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
				routes: [],
				disabled: [],
				daysDisabledMonth:[]
			}
		},
        mounted() {
			this.configCalendar();		
			this.getAllRoutes();	
        },
		methods: {
			daysInMonth(iMonth, iYear) {
				return 32 - new Date(iYear, iMonth, 32).getDate();
			},			
			renderCalendar(month, year, data){

				console.log('data al renderizar', data);

				let today = new Date();

				this.currentMonth = this.months[month];
				this.currentYear = year;

				//Setear los valores seleccionados
				this.selectMonth = month;
				this.selectYear = year;

				let tbl = "";

				let firstDay = (new Date(year, month)).getDay();
	
				tbl = document.getElementById("calendar-body"); // body of the calendar
				// clearing all previous cells
				tbl.innerHTML = "";
				
				// creating all cells
				let date = 1;
				for (let i = 0; i < 6; i++) {
					// creates a table row
					let row = document.createElement("tr");
					//creating individual cells, filing them up with data.
					for (let j = 0; j < 7; j++) {
						if (i === 0 && j < firstDay) {
							let cell = document.createElement("td");
							cell.setAttribute('v-model', date);
							let cellText = document.createTextNode("");
							cell.appendChild(cellText);							
							row.appendChild(cell);
						}else if (date > this.daysInMonth(month, year)) {
							break;
						}else {
							let cell = document.createElement("td");
							cell.setAttribute('v-model', date);
							let cellText = document.createTextNode(date);
							if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
								cell.classList.add("bg-info");
							} // color today's date

							//Vamos a recorrer la data
							data.map((data => {

								let disabledDate = new Date(`${data.day}`);

								let dayDisabled = disabledDate.getDate();

								if(date == dayDisabled){
									cell.classList.add("bg-disabled");
								}
								
							}));


							cell.appendChild(cellText);
							row.appendChild(cell);

							
							
							date++;
						}
					}
					tbl.appendChild(row); // appending each row into calendar body.
				}
			},
			configCalendar(){

				let today = new Date();
				let currentMonth = today.getMonth();
				let currentYear = today.getFullYear();				
				
				//Renderizamos el calendario
				this.getDisabled(currentMonth, currentYear);
			},
			next() {
				let currentMonth = this.selectMonth;
				let currentYear = this.selectYear;
				currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
				currentMonth = (currentMonth + 1) % 12;				
				this.getDisabled(currentMonth, currentYear);

			},
			previous() {

				let currentMonth = this.selectMonth;
				let currentYear = this.selectYear;

				currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
				currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;				
				this.getDisabled(currentMonth, currentYear);

			},
			getAllRoutes(){
				axios.get(`${this.url}/api/routes`).then((response) => {
					
					if(response.data.data){
						this.routes = response.data.data;

						console.log('Todas las rutas', this.routes);
					}
				})
				.catch((error) => {
					console.log("There was an error: " + error);
				});

			},
			getRoutes(currentMonth, currentYear){

				let start = `1-${currentMonth+1}-${currentYear}`;
				let end = `${this.daysInMonth(currentMonth, currentYear)}-${currentMonth+1}-${currentYear}`;

				axios.get(`${this.url}/api/routes/${start}/${end}`).then((response) => {

					if(response.data.data){
						this.routes = response.data.data;
					}

				})
				.catch((error) => {
					console.log("There was an error: " + error);
				});

			},
		    getDisabled(currentMonth, currentYear){

				//Datos que vamos a utilizar para traer los dias desabilitados
				let startDate = `1-${currentMonth+1}-${currentYear}`;
				let endDate = `${this.daysInMonth(currentMonth, currentYear)}-${currentMonth+1}-${currentYear}`;
				let query = `/api/routes/disabled/${startDate}/${endDate}`;	

				axios.get(`${this.url}${query}`).then((response) => {

					if(response.data.data){
						this.disabled = response.data.data;
					}

					this.renderCalendar(currentMonth, currentYear, response.data.data);

				})
				.catch((error) => {
					console.log("There was an error: " + error);
				});

			}
		},
    }
</script>
