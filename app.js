const systems = [
  "octubre.osperyh.org.ar",
  "octubre.osperyhra.org.ar",
  "octubre2.osperyhra.org.ar",
  "cajas3octubre.osperyh.org.ar",
  "miobra.osperyh.org.ar",
  "issa.edificarseguros.com.ar",
  "guau.umet.edu.ar",
  "miweb.umet.edu.ar",
  "union.umet.edu.ar",
  "app.edificarseguros.com.ar",
  "siga.octubre.org.ar",
  "intranet.seracarh.org.ar",
  "eltrineo.osperyh.org.ar",
  "octubre.mepadip.com.ar",
  "rrhh.octubre.org.ar",
  "app.osperyhra.org.ar",
  "gitlab.octubre.org.ar",
  "octubre.fateryh.org.ar",
  "cad.fateryh.org.ar",
  "auth.octubre.org.ar",
  "pedidos.octubre.org.ar",
  "socios.suterh.org.ar",
  "acceso.suterh.org.ar",
  "planescolar.suterh.org.ar",
  "acceso.umet.edu.ar",
  "apache-hop.deux.net",
  "app.osperyh.org.ar",
  "cajasoctubre.osperyh.org.ar",
  "carte.deux.net",
  "cc.fateryh.org.ar",
  "cloud.suterh.org.ar",
  "consulta.fateryh.org.ar",
  "estudios-visualmedical.osperyh.org.ar",
  "miobra.osperyhra.org.ar",
  "miweb.fateryh.org.ar",
  "miweb.iso.edu.ar",
  "miweb.mepadip.com.ar",
  "miweb.suterh.org.ar",
  "octubre.suterh.org.ar",
  "octubre.virreyessalud.com.ar",
  "webspoon.intranet.octubre.org",
  "airflow.octubre.org.ar",
  "sentry.octubre.org.ar",
  "servicios.octubre.org.ar",
  "servicios.seracarh.org.ar",
  "servicios.suterh.org.ar",
  "tableros.suterh.org.ar",
  "turnos.suterh.org.ar",
];

const delegaciones = [
  "Central - Sarmiento 2040",
  "Centro de la mujer y el Niño",
  "Puerto Madero",
  "La Maternidad",
  "Clinica de la Ciudad",
  "Belgrano - Clinica Octubre",
  "Ramos Mejia",
  "Lomas de Zamora",
  "Quilmes",
  "San Martin",
  "San Isidro",
  "San Miguel",
  "Pilar",
];

function getReportJson(form) {
  var serialized = $("form").serializeArray();
  // console.log("fields", serialized);
  var data = {
    systems: [],
    affectedLocations: [],
  };
  for (var i in serialized) {
    if (
      serialized[i]["name"].startsWith("system_") &&
      serialized[i]["value"] === "on"
    ) {
      data.systems.push(
        serialized[i]["name"].replace("system_", "").replaceAll("_", ".")
      );
    } else if (
      serialized[i]["name"].startsWith("delegacion_") &&
      serialized[i]["value"] === "on"
    ) {
      data.affectedLocations.push(
        serialized[i]["name"].replace("delegacion_", "").replaceAll("_", " ")
      );
    } else if (serialized[i]["name"] === "otherLocations") {
      data.affectedLocations.push(serialized[i]["value"]);
    } else {
      data[serialized[i]["name"]] = serialized[i]["value"];
    }
  }

  var dataJson = JSON.stringify(data);

  return dataJson;
}

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
    var delegacionId = `delegacion_${value
      .replaceAll(" ", "_")
      .replaceAll("-", "_")}`;

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

  $("#delegacion_other").click(function () {
    console.log(this);
    if (this.checked) {
      $("#otherLocations").show();
      $("#otherLocations").attr("required", true);
    } else {
      $("#otherLocations").hide();
      $("#otherLocations").attr("required", false);
    }
  });
});

var form = $("#report")[0];

form.addEventListener(
  "submit",
  (event) => {
    console.log("submit");
    event.preventDefault();
    event.stopPropagation();
    if (!form.checkValidity()) {
      alert("Debe completar todos los campos requeridos");
      form.classList.add("was-validated");
    } else {
      var dataJson = getReportJson(form);
      console.log(dataJson);

      $.ajax({
        type: "POST",
        url: "https://func-imhelper-iprd-ue.azurewebsites.net/api/SendIncidentReport",
        // The key needs to match your method's input parameter (case-sensitive).
        data: dataJson,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
          location.href = "https://status.octubre.org.ar";
        },
        error: function (err) {
          alert("El incidente no pudo ser reportado. Descarge el reporte y envíelo por chat al canal de Incidentes");
          console.error(err);
          form.classList.add("was-validated");
        },
      });
    }
  },
  false
);

$("#downloadReport").on("click", function () {
  console.log("download");
  if (!form.checkValidity()) {
    alert("Debe completar todos los campos requeridos");
    form.classList.add("was-validated");
  } else {
    const dataJson = getReportJson(form);

    // Step 2: Convert the JSON string to base64
    const base64String = btoa(dataJson);

    // Create a Blob with the base64 content
    const blob = new Blob([base64String], { type: "text/plain" });

    // Create a link element
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    const currentDate = new Date();
    const dateString = currentDate.toISOString().split('T')[0];
    link.download = `reporte-incidente-${dateString}.txt`;

    // Append the link to the body
    $("body").append(link);

    // Programmatically click the link to trigger the download
    link.click();

    // Remove the link from the document
    $(link).remove();
  }
});

$("#hasUserProblemReport").on("click", function () {
  if (this.checked) {
    $(".user-report").show("slow");
    $(".user-report textarea,.user-report input").attr("required", true);
    $(".incident-details").hide("slow");
    $(".incident-details textarea,.incident-details input").attr(
      "required",
      false
    );

    // Limpio el div .incident-details #system-list
    $('.incident-details #system-list input[type="checkbox"]').prop(
      "checked",
      false
    );
  } else {
    $(".user-report").hide("slow");
    $(".user-report textarea,.user-report input").attr("required", false);
    $(".incident-details").show("slow");
    $(".incident-details textarea,.incident-details input").attr(
      "required",
      true
    );

    // Limpio el div .user-report
    $('.user-report input[type="text"]').val("");
    $('.user-report input[type="number"]').val("");
  }
});

$("#searchUserProblemReport").on("click", function () {
  var id = $("#userProblemReportId").val();
  $("#searchUserProblemReport").prop("disabled", true);
  if (!!id) {
    $.ajax({
      type: "GET",
      url:
        "https://func-imhelper-iprd-ue.azurewebsites.net/api/GetUserProblemReportSummary?userReportId=" +
        id,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (data) {
        console.log(data);
        $("#userProblemReportTitle").val(data.title);
        $("#userProblemReportIssueLink").val(data.url);
        $("#userProblemReportSite").val(data.site);
        $("#searchUserProblemReport").prop("disabled", false);
      },
      error: function (err) {
        $("#searchUserProblemReport").prop("disabled", false);
        if (!!err.status && err.status === 404) {
          alert("No existe el reporte de usuario " + id);
        }
      },
    });
  } else alert("Debe completar el número de reporte de usuario");
});

$("#system-list").on("change", 'input[type="checkbox"]', function (e) {
  var $checkbox = $(this);
  var $group = $checkbox.parents("#system-list");
  var checkedItems = $('input[type="checkbox"]:checked').length;
  $("input[type=checkbox]", $group).attr("required", checkedItems === 0);
});

$("#delegaciones-list").on("change", 'input[type="checkbox"]', function (e) {
  var $checkbox = $(this);
  var $group = $checkbox.parents("#delegaciones-list");
  var checkedItems = $('input[type="checkbox"]:checked').length;
  $("input[type=checkbox]", $group).attr("required", checkedItems === 0);
});

$('input[name="incidentType"]').click(function () {
  if ($(this).attr("value") == "degradation") {
    $(".degradation-fields").show("slow");
    $(".error-fields").hide("slow");

    $(".degradation-fields textarea,.degradation-fields input").attr(
      "required",
      true
    );
    $(".error-fields textarea,.error-fields input").attr("required", false);
  }
  if ($(this).attr("value") == "error") {
    $(".error-fields").show("slow");
    $(".degradation-fields").hide("slow");
    $(".degradation-fields textarea,.degradation-fields input").attr(
      "required",
      false
    );
    $(".error-fields textarea,.error-fields input").attr("required", true);
  }
});

$('input[name="clientFacing"]').click(function () {
  if ($(this).attr("value") == "yes") {
    $(".deadtime").hide("slow");
  }
  if ($(this).attr("value") == "no") {
    $(".deadtime").show("slow");
  }
});
