var systems = [
    'octubre.osperyh.org.ar', 
    'octubre.osperyhra.org.ar',
    'cajas2.octubre.osperyh.org.ar',
    'issa.edificarseguros.com.ar',
    'miseguro.edificarseguros.com.ar',
    'miobra.osperyh.org.ar',
    'guau.umet.edu.ar',
    'miweb.umet.edu.ar',
    'siga.octubre.org.ar',
    'rrhh.octubre.org.ar',
    'app.osperyhra.org.ar',
    'app.edificarseguros.com.ar',
    'intranet.seracarh.org.ar',
    'arrabal.sportivobarracas.com.ar',
    'eltrineo.suterh.org.ar',
    'helios.osperyh.org.ar',
    'wiki.octubre.org.ar',
    'gitlab.octubre.org.ar',
    'sentry.octubre.org.ar'
    ];

    

$(document).ready(function () {
    systems.forEach((value, index) => {
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
});


var form = $('#report')[0];

form.addEventListener('submit', (event) => {
    if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    }, false);

$('#system-list').on('change', 'input[type="checkbox"]', function (e) {
    
    var $checkbox = $(this)
    var $group = $checkbox.parents('#system-list')
    var checkedItems = $('input[type="checkbox"]:checked').length
    $('input[type=checkbox]', $group).attr('required', checkedItems === 0)
});

$('input[name="incidentType"]').click(function () {
    if ($(this).attr('value') == 'degradation') {
        $(".degradation-fields").show('slow');
        $(".error-fields").hide('slow');
    }
    if ($(this).attr('value') == 'error') {
        $(".error-fields").show('slow');
        $(".degradation-fields").hide('slow');

    }
});

// Attach an event for when the user submits the form

$('form').on('submit', function (event) {

    // Prevent the page from reloading
    event.preventDefault();

    // var selectedSystems = $('#system-list input[id^=system_]:checked');
    
    var serialized = $('form').serializeArray();
    var data = {
        systems: []
    };
    for(var i in serialized){
        if(serialized[i]['name'].startsWith('system_') && serialized[i]['value'] === 'on') {
            data.systems.push(serialized[i]['name'].replace('system_','').replaceAll('_','.'))
        }
        else {
            data[serialized[i]['name']] = serialized[i]['value']
        }
    }
    console.log("Formulario enviado", JSON.stringify(data));
});


