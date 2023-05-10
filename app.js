const systems = [
    'octubre.osperyh.org.ar', 
    'octubre.osperyhra.org.ar',
    'octubre2.osperyhra.org.ar',
    'cajas2.octubre.osperyh.org.ar',
    'miobra.osperyh.org.ar',
    'issa.edificarseguros.com.ar',
    'guau.umet.edu.ar',
    'miweb.umet.edu.ar',
    'union.umet.edu.ar',
    'app.edificarseguros.com.ar',
    'siga.octubre.org.ar',
    'intranet.seracarh.org.ar',
    'arrabal.sportivobarracas.com.ar',
    'eltrineo.osperyh.org.ar',
    'octubre.mepadip.com.ar',
    'rrhh.octubre.org.ar',
    'app.osperyhra.org.ar',
    'helios.osperyh.org.ar',
    'gitlab.octubre.org.ar',
    'sentry.octubre.org.ar',
    'octubre.fateryh.org.ar',
    'cad.fateryh.org.ar',
    'auth.octubre.org.ar',
    'pedidos.octubre.org.ar',
    'socios.suterh.org.ar',
    'acceso.suterh.org.ar',
    'planescolar.suterh.org.ar'
];

const delegaciones = [
    'Central - Sarmiento 2040',
    'Centro de la mujer y el Niño',
    'Puerto Madero',
    'La Maternidad',
    'Clinica de la Ciudad',
    'Belgrano - Clinica Octubre',
    'Ramos Mejia',
    'Lomas de Zamora',
    'Quilmes',
    'San Martin',
    'San Isidro',
    'San Miguel',
    'Pilar'
];

$(document).ready(function () {

    systems.sort().forEach((value, index) => {
        var systemId = `system_${value.replaceAll(".", "_")}`;

        $("#system-list").append(`
            <div class="form-check form-checkbox">
            <input
                class="form-check-input"
                type="checkbox"
                id="${systemId}"
                name="${systemId}"
                required
            />
            <label class="form-check-label" for="${systemId}">
                ${value}
            </label>
            </div>
        `);
    });

    delegaciones.forEach((value, index) => {
        var delegacionId = `delegacion_${value.replaceAll(" ", "_").replaceAll("-", "_")}`;

        $("#delegaciones-list").append(`
            <div class="form-check form-checkbox">
            <input
                class="form-check-input"
                type="checkbox"
                id="${delegacionId}"
                name="${delegacionId}"
                required
            />
            <label class="form-check-label" for="${delegacionId}">
                ${value}
            </label>
            </div>
        `);
    });

    $("#delegaciones-list").append(`
        <div class="form-check form-checkbox">
        <input
            class="form-check-input"
            type="checkbox"
            id="delegacion_other"
            name="delegacion_other"
            required
        />
        <label class="form-check-label" for="delegacion_other">
            Otra
        </label>
        </div>
    `);
    

    $('#delegacion_other').click(function(){
        console.log(this)
        if(this.checked){
            $('#otherLocations').show();
            $('#otherLocations').attr('required', true);
        }else{
            $('#otherLocations').hide();
            $('#otherLocations').attr('required', false);
        }
    });
});


var form = $('#report')[0];

form.addEventListener('submit', (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!form.checkValidity()) {
        alert('Debe completar todos los campos requeridos');
        form.classList.add('was-validated');
    }
    else {
        
        var serialized = $('form').serializeArray();
        // console.log("fields", serialized);
        var data = {
            systems: [],
            affectedLocations: []
        };
        for(var i in serialized){
            if(serialized[i]['name'].startsWith('system_') && serialized[i]['value'] === 'on') {
                data.systems.push(serialized[i]['name'].replace('system_','').replaceAll('_','.'));
            }
            else if(serialized[i]['name'].startsWith('delegacion_') && serialized[i]['value'] === 'on') {
                data.affectedLocations.push(serialized[i]['name'].replace('delegacion_','').replaceAll('_',' '));
            }
            else if(serialized[i]['name'] === 'otherLocations') {
                data.affectedLocations.push(serialized[i]['value']);
            }
            else {
                data[serialized[i]['name']] = serialized[i]['value']
            }
        }
        // console.log(data)
        $.ajax({
            type: "POST",
            url: "https://incident-report-backend.oct-softlab.workers.dev/",
            // The key needs to match your method's input parameter (case-sensitive).
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(data){
                location.href = 'https://octubre-softlab.github.io/octubre-upptime/';
            },
            error: function(err) {                
                alert("El incidente no pudo ser reportado");
                console.error(err);
                form.classList.add('was-validated');
            }
        });
        
    }
}, false);

$('#system-list').on('change', 'input[type="checkbox"]', function (e) {
    
    var $checkbox = $(this)
    var $group = $checkbox.parents('#system-list')
    var checkedItems = $('input[type="checkbox"]:checked').length
    $('input[type=checkbox]', $group).attr('required', checkedItems === 0)
});

$('#delegaciones-list').on('change', 'input[type="checkbox"]', function (e) {
    
    var $checkbox = $(this)
    var $group = $checkbox.parents('#delegaciones-list')
    var checkedItems = $('input[type="checkbox"]:checked').length
    $('input[type=checkbox]', $group).attr('required', checkedItems === 0)
});

$('input[name="incidentType"]').click(function () {
    
    if ($(this).attr('value') == 'degradation') {
        $(".degradation-fields").show('slow');
        $(".error-fields").hide('slow');

        $(".degradation-fields textarea,.degradation-fields input").attr('required', true);
        $(".error-fields textarea,.error-fields input").attr('required', false);
    }
    if ($(this).attr('value') == 'error') {
        $(".error-fields").show('slow');
        $(".degradation-fields").hide('slow');
        $(".degradation-fields textarea,.degradation-fields input").attr('required', false);
        $(".error-fields textarea,.error-fields input").attr('required', true);

    }
});

$('input[name="clientFacing"]').click(function () {
    
    if ($(this).attr('value') == 'yes') {
        $(".deadtime").hide('slow');
    }
    if ($(this).attr('value') == 'no') {
        $(".deadtime").show('slow');

    }
});
