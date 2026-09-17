# Backend Health Classification Trust Boundary

The browser must not probe reported services. It only submits canonical hostnames selected from the frontend catalog and may display optional classification and routing strings returned by the report endpoint.

## Required backend extension

The report service may classify a submission after validating every submitted `systems` value against a server-owned allowlist of the same canonical hostnames. Never accept a browser-supplied URL, host override, scheme, port, redirect target, or network address.

For each allowlisted reported service, the backend may request its approved health resource with all of these safeguards:

- short, bounded connect and total timeouts;
- redirects disabled;
- a small, bounded response body with content-type validation;
- DNS and outbound-network controls that prevent access to private, link-local, loopback, or metadata destinations;
- failure isolation: one failed probe must not block receipt of the incident report.

Interpret results only at this trusted boundary:

- A successful health response whose declared status is `Unhealthy` means **service down**.
- An HTTP `400` or `500` health response means **server down**.
- Other results remain unclassified or require manual review; do not infer a disaster category.

The backend may return an optional response such as `{ "classification": "…", "routing": "…" }`. These are display-only, server-authored values. They must not expose endpoint URLs, internal topology, credentials, or probe diagnostics beyond the canonical hostnames selected in the report.

## Routing authority

Classified service-down or server-down reports are directed to SRE. Whether to escalate to NOC remains an SRE decision; neither the frontend nor automated classification has NOC escalation authority.
