var map = L.map('mapid').on('load', onMapLoad).setView([41.400, 2.206], 11);
//map.locate({setView: true, maxZoom: 17});
	
var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);

//en el clusters almaceno todos los markers
var markers = L.markerClusterGroup();
var data_markers;

function onMapLoad() {

	console.log("Mapa cargado");
    /*
	FASE 3.1
		1) Relleno el data_markers con una petición a la api
		2) Añado de forma dinámica en el select los posibles tipos de restaurantes
		3) Llamo a la función para --> render_to_map(data_markers, 'all'); <-- para mostrar restaurantes en el mapa
	*/
	$.ajax({
		type:'GET',
		url: 'http://localhost/mapa/api/apiRestaurants.php',
		dataType:'json',
		success: function (result){
			console.log(result);
			data_markers = result;

			var types = [];
			
			for(var i=0; i<data_markers.length; i++){
				types.push(data_markers[i].kind_food.split(','));			
			}

	
			var alltypes = types.toString().split(',');
			var uniqueTypes = [];

			for (var j=0; j<alltypes.length; j++){
				if(uniqueTypes.indexOf(alltypes[j]) == -1){
					uniqueTypes.push(alltypes[j])	
				}				
			}

			for (k=0; k<uniqueTypes.length; k++){
				$('#kind_food_selector').append('<option>' + uniqueTypes[k]  + '</option>');
			}
			

			for (var i=0; i<data_markers.length; i++){
			markers.addLayer(L.marker([data_markers[i].lat,data_markers[i].lng]).bindPopup(data_markers[i].name + "<br>" + data_markers[i].address).openPopup());
			map.addLayer(markers);
			

			}
			
			

		}
	});


}

$('#kind_food_selector').on('change', function() {
  console.log(this.value);
  render_to_map(data_markers, this.value);
});



function render_to_map(data_markers,filter){

		/*
	FASE 3.2
		1) Limpio todos los marcadores
		2) Realizo un bucle para decidir que marcadores cumplen el filtro, y los agregamos al mapa
	*/	

	/* opció via classes amb jquery
	$(".leaflet-marker-icon").remove();
	$(".leaflet-marker-shadow").remove();
	*/
	
	markers.clearLayers();
	//map.removeLayer(markers);
    




	for (var i=0; i<data_markers.length; i++){
		if(data_markers[i].kind_food.includes(filter)){
		markers.addLayer(L.marker([data_markers[i].lat,data_markers[i].lng]).bindPopup(data_markers[i].name + "<br>" + data_markers[i].address).openPopup());
		map.addLayer(markers);
		}
		
	}
   		
}