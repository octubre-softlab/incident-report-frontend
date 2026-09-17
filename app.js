const systems = [
  "octubre.osperyh.org.ar",
  "octubre.osperyhra.org.ar",
  "octubre2.osperyhra.org.ar",
  "cajasoctubre.osperyh.org.ar",
  "miobra.osperyh.org.ar",
  "app.osperyh.org.ar",
  "issa.edificarseguros.com.ar",
  "guau.umet.edu.ar",
  "miweb.umet.edu.ar",
  "union.umet.edu.ar",
  "union.suterh.org.ar",
  "app.edificarseguros.com.ar",
  "app.fateryh.org.ar",
  "siga.octubre.org.ar",
  "sigaauth.octubre.org.ar",
  "intranet.seracarh.org.ar",
  "informes.osperyh.org.ar",
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
  "webspoon.intranet.octubre.org.ar",
  "airflow.octubre.org.ar",
  "servicios.octubre.org.ar",
  "servicios.seracarh.org.ar",
  "servicios.suterh.org.ar",
  "tableros.suterh.org.ar",
  "turnos.suterh.org.ar",
  "gotenberg.intraservices.octubre.org.ar",
  "beneficios.suterh.org.ar",
  "arti.umet.edu.ar",
  "pgadmin4.intranet.octubre.org.ar",
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
const form = document.getElementById("report");

function getRegistrableDomain(hostname) {
  const labels = hostname.split(".");
  return labels.slice(-3).join(".");
}
function systemId(hostname) {
  return `system_${hostname.replaceAll(".", "_")}`;
}
function showStatus(message, type) {
  const status = document.getElementById("form-status");
  status.textContent = message;
  status.className = `alert alert-${type}`;
  status.hidden = false;
  status.focus();
}
function selectedValues(selector) {
  return Array.from(document.querySelectorAll(selector))
    .filter((input) => input.checked)
    .map((input) => input.value);
}
function updateGroupValidity(containerId, errorId, summaryId) {
  const selected = selectedValues(`#${containerId} input[type="checkbox"]`);
  const valid = selected.length > 0;
  document.getElementById(errorId).hidden =
    valid || !form.classList.contains("was-validated");
  if (summaryId)
    document.getElementById(summaryId).textContent = valid
      ? `${selected.length} sistema${selected.length === 1 ? "" : "s"} seleccionado${selected.length === 1 ? "" : "s"}: ${selected.join(", ")}.`
      : "No seleccionaste sistemas.";
  return valid;
}
function validateGroups() {
  return (
    updateGroupValidity(
      "system-list",
      "system-selection-error",
      "system-selection-summary",
    ) && updateGroupValidity("delegaciones-list", "location-selection-error")
  );
}
function getReportJson() {
  const data = {
    systems: selectedValues('#system-list input[type="checkbox"]'),
    affectedLocations: selectedValues(
      '#delegaciones-list input[type="checkbox"]',
    ),
  };
  new FormData(form).forEach((value, name) => {
    if (
      !name.startsWith("system_") &&
      !name.startsWith("delegacion_") &&
      name !== "otherLocations"
    )
      data[name] = value;
  });
  const otherLocation = document.getElementById("otherLocations");
  if (otherLocation.value.trim())
    data.affectedLocations.push(otherLocation.value.trim());
  return JSON.stringify(data);
}
function addCheckbox(container, id, value, label) {
  const wrapper = document.createElement("div");
  wrapper.className = "form-check form-checkbox";
  const input = document.createElement("input");
  input.className = "form-check-input";
  input.type = "checkbox";
  input.id = id;
  input.name = id;
  input.value = value;
  const inputLabel = document.createElement("label");
  inputLabel.className = "form-check-label";
  inputLabel.htmlFor = id;
  inputLabel.textContent = label;
  wrapper.append(input, inputLabel);
  container.append(wrapper);
}
function renderSystems() {
  const list = document.getElementById("system-list");
  const groups = new Map();
  systems
    .slice()
    .sort((a, b) => a.localeCompare(b))
    .forEach((hostname) => {
      const domain = getRegistrableDomain(hostname);
      if (!groups.has(domain)) groups.set(domain, []);
      groups.get(domain).push(hostname);
    });
  Array.from(groups.keys())
    .sort((a, b) => a.localeCompare(b))
    .forEach((domain) => {
      const group = document.createElement("fieldset");
      group.className = "system-domain-group";
      const legend = document.createElement("legend");
      legend.textContent = domain;
      group.append(legend);
      groups
        .get(domain)
        .forEach((hostname) =>
          addCheckbox(group, systemId(hostname), hostname, hostname),
        );
      list.append(group);
    });
}
function renderLocations() {
  const list = document.getElementById("delegaciones-list");
  delegaciones.forEach((location) =>
    addCheckbox(
      list,
      `delegacion_${location.replaceAll(" ", "_").replaceAll("-", "_")}`,
      location,
      location,
    ),
  );
  addCheckbox(list, "delegacion_other", "other", "Otra");
}
function setConditionalFields(container, required) {
  document
    .querySelectorAll(`${container} input, ${container} textarea`)
    .forEach((field) => {
      field.required = required;
    });
}
function updateImpactScopeRequirement() {
  document.getElementById("affectedUserGroups").required =
    document.getElementById("impactScope").value === "sector";
}
function displayRoutingResult(data) {
  if (!data || typeof data !== "object") return false;
  const classification =
    typeof data.classification === "string" ? data.classification : "";
  const routing = typeof data.routing === "string" ? data.routing : "";
  if (!classification && !routing) return false;
  showStatus([classification, routing].filter(Boolean).join(" — "), "info");
  return true;
}
function downloadReport() {
  const blob = new Blob([btoa(unescape(encodeURIComponent(getReportJson())))], {
    type: "text/plain",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `reporte-incidente-${new Date().toISOString().split("T")[0]}.txt`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
}

renderSystems();
renderLocations();
updateImpactScopeRequirement();
document
  .getElementById("impactScope")
  .addEventListener("change", updateImpactScopeRequirement);
document
  .getElementById("system-list")
  .addEventListener("change", () =>
    updateGroupValidity(
      "system-list",
      "system-selection-error",
      "system-selection-summary",
    ),
  );
document
  .getElementById("delegaciones-list")
  .addEventListener("change", (event) => {
    const isOther = event.target.id === "delegacion_other";
    if (isOther) {
      const other = document.getElementById("otherLocations");
      other.hidden = !event.target.checked;
      other.required = event.target.checked;
      if (!event.target.checked) other.value = "";
    }
    updateGroupValidity("delegaciones-list", "location-selection-error");
  });
document
  .getElementById("hasUserProblemReport")
  .addEventListener("change", (event) => {
    const lookup = document.querySelector(".user-report");
    const details = document.querySelector(".incident-details");
    lookup.hidden = !event.target.checked;
    details.hidden = event.target.checked;
    setConditionalFields(".user-report", event.target.checked);
    setConditionalFields(".incident-details", !event.target.checked);
    updateGroupValidity(
      "system-list",
      "system-selection-error",
      "system-selection-summary",
    );
  });
document
  .getElementById("hasUserProblemReport")
  .dispatchEvent(new Event("change"));
document.querySelectorAll('input[name="incidentType"]').forEach((input) =>
  input.addEventListener("change", () => {
    const degradation = input.value === "degradation";
    document.querySelector(".degradation-fields").hidden = !degradation;
    document.querySelector(".error-fields").hidden = degradation;
    setConditionalFields(".degradation-fields", degradation);
    setConditionalFields(".error-fields", !degradation);
  }),
);
form.addEventListener("submit", (event) => {
  event.preventDefault();
  form.classList.add("was-validated");
  if (!form.checkValidity() || !validateGroups()) {
    showStatus(
      "Revisá los campos requeridos antes de enviar el reporte.",
      "danger",
    );
    return;
  }
  $.ajax({
    type: "POST",
    url: "https://func-imhelper-iprd-ue.azurewebsites.net/api/SendIncidentReport",
    data: getReportJson(),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success(data) {
      if (!displayRoutingResult(data))
        location.href = "https://status2.octubre.org.ar";
    },
    error() {
      showStatus(
        "El envío no se completó. Descargá el reporte y envialo por chat al canal de Incidentes.",
        "danger",
      );
      document.getElementById("downloadReport").focus();
    },
  });
});
document.getElementById("downloadReport").addEventListener("click", () => {
  form.classList.add("was-validated");
  if (!form.checkValidity() || !validateGroups()) {
    showStatus(
      "Completá los campos requeridos antes de descargar el reporte.",
      "danger",
    );
    return;
  }
  downloadReport();
});
document
  .getElementById("searchUserProblemReport")
  .addEventListener("click", () => {
    const id = document.getElementById("userProblemReportId").value;
    const button = document.getElementById("searchUserProblemReport");
    if (!id) {
      showStatus("Completá el número de reporte de usuario.", "danger");
      return;
    }
    button.disabled = true;
    $.ajax({
      type: "GET",
      url: `https://func-imhelper-iprd-ue.azurewebsites.net/api/GetUserProblemReportSummary?userReportId=${encodeURIComponent(id)}`,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success(data) {
        document.getElementById("userProblemReportTitle").value =
          data.title || "";
        document.getElementById("userProblemReportIssueLink").value =
          data.url || "";
        document.getElementById("userProblemReportSite").value =
          data.site || "";
        button.disabled = false;
      },
      error(xhr) {
        button.disabled = false;
        showStatus(
          xhr.status === 404
            ? `No existe el reporte de usuario ${id}.`
            : "No se pudo consultar el reporte de usuario.",
          "danger",
        );
      },
    });
  });
