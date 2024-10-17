<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Super Hero CL</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://canvasjs.com/assets/script/canvasjs.min.js"></script>
</head>


<body>

    <input id="superH" placeholder="ingresa un numero" />
    <button id="buscarBtn">Buscar</button>
  
    <img id="superheroImg" src="" alt="Imagen del superhéroe" style="width: 200px; height: 200px; display: none;">
  
    <div id="superhero-info"></div>
  
    <div id="chartContainer" style="height: 370px; width: 100%;"></div>
  
</body>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous">
</script>

<script src="./assets/js/index.js"></script>


</html>



=================================================




$(document).ready(() => {
    $('#buscarBtn').click(() => {
      // Obtener el ID del superhéroe ingresado por el usuario y convertirlo a número entero
      const idSuperheroe = parseInt($('#superH').val());

      // Validar que el ID sea un número válido (mayor o igual a 1)
      if (isNaN(idSuperheroe) || idSuperheroe < 1) {
        alert('Por favor, ingresa un número de ID válido y mayor a 0.');
        return;
      }

      // Hacer la solicitud a la API
      $.ajax({
        url: `https://superheroapi.com/api/ACCESS_TOKEN/${idSuperheroe}`,  // Reemplaza 'ACCESS_TOKEN' con tu token
        success: (result) => {
          if (result.response === 'success') {
            // Mostrar la imagen y ejecutar una función cuando se cargue
            $('#superheroImg')
              .attr('src', result.image.url)
              .on('load', function() {
                $(this).show();
              })
              .error(function() {
                alert('No se pudo cargar la imagen.');
              });

            // Mostrar información del superhéroe
            $('#superhero-info').html(`
              <strong>Nombre:</strong> ${result.name}<br>
              <strong>Inteligencia:</strong> ${result.powerstats.intelligence}<br>
              <strong>Fuerza:</strong> ${result.powerstats.strength}
            `);

            // Preparar datos para el gráfico
            let powerStats = result.powerstats;
            let chartData = [
              { label: "Inteligencia", y: parseInt(powerStats.intelligence) },
              { label: "Fuerza", y: parseInt(powerStats.strength) },
              { label: "Velocidad", y: parseInt(powerStats.speed) },
              { label: "Durabilidad", y: parseInt(powerStats.durability) },
              { label: "Poder", y: parseInt(powerStats.power) },
              { label: "Combate", y: parseInt(powerStats.combat) }
            ];

            // Generar gráfico de barras con CanvasJS
            let chart = new CanvasJS.Chart("chartContainer", {
              animationEnabled: true,
              theme: "light2",
              title: {
                text: `Estadísticas de poder de ${result.name}`
              },
              axisY: {
                title: "Nivel de poder"
              },
              data: [{
                type: "column",
                dataPoints: chartData
              }]
            });

            chart.render();
          } else {
            $('#superhero-info').html('Superhéroe no encontrado.');
            $('#superheroImg').hide(); // Ocultar la imagen si no se encuentra el superhéroe
          }
        },
        error:() => {
        alert('Ocurrió un error al buscar al superhéroe. Por favor, verifica el ID y vuelve a intentarlo.');
      }
    });
  });
});

      