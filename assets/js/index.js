$(document).ready(function() {
    $("#buscarBtn").on("click", function() {
        let valorIngresado = $("#superH").val();
        let validacion = validarRangos(valorIngresado);

        if (!validacion) return; // Detener si la validación falla

        const url = 'https://www.superheroapi.com/api.php/4905856019427443/';
        const apiUrl = url + valorIngresado;

        // Primera solicitud AJAX para obtener la información del superhéroe
        $.ajax({
            url: apiUrl,
            type: "GET",
            dataType: "json",
            success: function(data) {
                $("#superhero-name").text(data.name);
                $("#superheroImg").attr("src", data.image.url).show();
                $("#superhero-info").html(`
                    <p>Publicado: ${data.biography.publisher}</p>
                    <p>Conexiones: ${data.connections["group-affiliation"]}</p>
                    <p>Trabajo: ${data.work.occupation}</p>
                    <p>Aparición: ${data.biography["first-appearance"]}</p>
                    <p>Altura: ${data.appearance.height.join(" / ")}</p>
                    <p>Peso: ${data.appearance.weight.join(" / ")}</p>
                    <p>Alianzas: ${data.biography.aliases.join(", ")}</p>
                `);
                $("#superhero-card").show();
            },
            error: function(error) {
                console.error("Error al obtener los datos del superhéroe:", error);
            }
        });

        // Segunda solicitud AJAX estadísticas de poder
        $.ajax({
            url: apiUrl,
            type: "GET",
            dataType: "json",
            success: function(data) {
                var chart = new CanvasJS.Chart("chartContainer", {
                    exportEnabled: true,
                    animationEnabled: true,
                    title: {
                        text: `Estadísticas de Poder para ${data.name}`
                    },
                    data: [{
                        type: "pie",    //esta linea define el estilo visual del grafico
                        showInLegend: true,
                        toolTipContent: "{label}: <strong>{y}%</strong>",
                        legendText: "{label}",
                        indexLabel: "{label} {y}",
                        dataPoints: [
                            { y: data.powerstats.intelligence, label: "Intelligence" },
                            { y: data.powerstats.strength, label: "Strength" },
                            { y: data.powerstats.speed, label: "Speed" },
                            { y: data.powerstats.durability, label: "Durability" },
                            { y: data.powerstats.power, label: "Power" },
                            { y: data.powerstats.combat, label: "Combat" }
                        ]
                    }]
                });
                chart.render();
            },
            error: function(error) {
                console.error("Error al obtener las estadísticas de poder:", error);
            }
        });
    });
  // funcion error para numeros fuera de rango
    function validarRangos(valorIngresado) {
        if (valorIngresado <= 0 || valorIngresado >= 732) {
            alert("Numero fuera de rango");
            return false;
        }
        return true;
    }
});
