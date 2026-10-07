const icons = {
  Home: '<path d="m3 10 9-7 9 7M5 9v12h5v-7h4v7h5V9"/>',
  Contacts:
    '<circle cx="12" cy="7" r="4"/><path d="M4 22v-3a8 8 0 0 1 16 0v3Z"/>',
  Companies:
    '<path d="M5 22V5h10v17M15 10h5v12M3 22h19M8 8h1m2 0h1M8 12h1m2 0h1M8 16h1m2 0h1M10 22v-3h2"/>',
  Opportunities: '<path d="M4 21v-9h4v9M10 21V5h4v16M16 21V9h4v12M2 22h20"/>',
  Meetings:
    '<rect x="3" y="5" width="18" height="17" rx="1"/><path d="M7 2v6m10-6v6M3 11h18"/>',
  Reports: '<path d="M5 2h9l5 5v15H5ZM14 2v6h5M9 12h6m-6 4h6m-6 3h4"/>',
  Tasks:
    '<rect x="3" y="3" width="18" height="18" rx="1"/><path d="m7 12 3 3 7-8"/>',
  Complaints:
    '<path d="M21 11a9 8 0 0 1-9 8H7l-5 3 2-6a8 8 0 1 1 17-5Z"/><circle cx="8" cy="11" r=".5"/><circle cx="12" cy="11" r=".5"/><circle cx="16" cy="11" r=".5"/>',
  Settings:
    '<circle cx="12" cy="12" r="4"/><path d="m10 2 4 0 1 3 3 1 3 3-1 3 1 3-3 3-3 1-1 3h-4l-1-3-3-1-3-3 1-3-1-3 3-3 3-1Z"/>',
  "Help & Support":
    '<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 1 1 5 2c-2 1-2 2-2 3m0 3h.01"/>',
  Bell: '<path d="M5 17h14l-2-3V8a5 5 0 0 0-10 0v6ZM10 21h4M12 1v2"/>',
  Clock: '<circle cx="12" cy="12" r="9"/><path d="M12 5v8l5 3"/>',
};
const icon = (n) =>
  `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${icons[n] || icons.Reports}</svg>`;
function home() {
  return `<div class="welcome"><div><h1>Good morning, ${esc(user.name.split(" ")[0])}</h1><div class="subtitle">Here’s what’s happening today.</div></div><div class="day"><div>${new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Riyadh" })}<div class="weather">Riyadh, KSA &nbsp; | &nbsp; ${new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Riyadh" })}</div></div><div class="quote">Progress<br>happens through<br>people.</div></div></div><div class="alerts"><button class="alert red" data-page="Complaints"><span class="round">!</span><div><b>${recordsFor("Complaints", "Home").filter((x) => x.status === "Open").length} complaints require attention</b><small>${recordsFor("Complaints", "Home").filter((x) => x.overdue && x.status !== "Resolved").length} overdue &nbsp;·&nbsp; ${recordsFor("Complaints", "Home").filter((x) => x.status === "Open" && !x.overdue).length} open</small></div><span class="arrow">›</span></button><button class="alert orange" data-page="Tasks"><span class="round">${icon("Clock")}</span><div><b>${recordsFor("Tasks", "Home").filter((x) => x.status !== "Completed").length} follow-ups need attention</b><small>${recordsFor("Tasks", "Home").filter((x) => taskStatus(x) === "Overdue").length} overdue &nbsp;·&nbsp; ${recordsFor("Tasks", "Home").filter((x) => taskStatus(x) === "Today").length} due</small></div><span class="arrow">›</span></button><button class="alert green" data-page="Meetings"><span class="round">${icon("Meetings")}</span><div><b>You have ${recordsFor("Meetings", "Home").filter((x) => x.date === todayISO() && x.status === "Scheduled").length} meetings today</b><small>${recordsFor("Meetings", "Home").find((x) => x.date === todayISO() && x.status === "Scheduled") ? esc(recordsFor("Meetings", "Home").find((x) => x.date === todayISO() && x.status === "Scheduled").name) : "No meetings scheduled"}</small></div><span class="arrow">›</span></button></div><div class="stats">${Object.keys(
    initialCounts,
  )
    .map(
      (k, i) =>
        `<button class="stat" data-page="${k}"><span class="ico">${icon(k)}</span><div><small>${k}</small><strong>${count(k)}</strong></div><span class="delta ${i === 4 ? "bad" : i === 5 ? "gray" : ""}">—</span></button>`,
    )
    .join(
      "",
    )}<div class="addwrap"><button class="primary" id="add">＋ &nbsp;Add New &nbsp;⌄</button><div class="menu" id="addmenu" hidden>${Object.keys(
    initialCounts,
  )
    .map(
      (k) => `<button data-new="${k}">${icon(k)} &nbsp;${singular(k)}</button>`,
    )
    .join(
      "",
    )}</div></div></div><div class="grid"><section class="panel">${head("Complaints", 'data-page="Complaints"')}${tabs(
    ["Open", "In Progress", "Overdue", "Resolved"].map((x) => [
      x,
      `${x} (${recordsFor("Complaints", "Home").filter((c) => (x === "Overdue" ? c.overdue && c.status !== "Resolved" : c.status === x)).length})`,
    ]),
    complaintTab,
    "data-ctab",
  )}${
    recordsFor("Complaints", "Home")
      .filter((x) =>
        complaintTab === "Overdue"
          ? x.overdue && x.status !== "Resolved"
          : x.status === complaintTab,
      )
      .map(
        (x) =>
          `<div class="row"><i class="dot"></i><button class="grow" style="text-align:left;padding:0" ${editbtn("Complaints", x.id)}>${esc(x.name)}<small>${esc(x.company)}</small></button><span class="pill red">${x.overdue ? "Overdue" : esc(x.status)}</span><span class="date">${dateLabel(x.date)}</span></div>`,
      )
      .join("") || '<div class="empty">No complaints in this category.</div>'
  }</section><section class="panel">${head("Tasks", 'data-page="Tasks"')}${tabs(
    [
      [
        "My Tasks",
        "My Tasks (" +
          recordsFor("Tasks", "Home").filter(
            (x) => x.ownerId === user.id && x.status !== "Completed",
          ).length +
          ")",
      ],
      [
        "Overdue",
        "Overdue (" +
          recordsFor("Tasks", "Home").filter((x) => taskStatus(x) === "Overdue")
            .length +
          ")",
      ],
      ["Due This Week", "Due This Week"],
      ["Completed", "Completed"],
    ],
    taskTab,
    "data-ttab",
  )}${
    recordsFor("Tasks", "Home")
      .filter((x) =>
        taskTab === "Completed"
          ? x.status === "Completed"
          : taskTab === "Overdue"
            ? taskStatus(x) === "Overdue"
            : taskTab === "My Tasks"
              ? x.ownerId === user.id && x.status !== "Completed"
              : x.status !== "Completed" &&
                x.date >= todayISO() &&
                x.date <=
                  isoDate(
                    new Date(dayStamp(todayISO()) + 7 * 86400000 + 3 * 3600000),
                  ),
      )
      .map(
        (x) =>
          `<div class="row taskrow"><input aria-label="Complete ${esc(x.name)}" type="checkbox" data-check="${esc(x.id)}" ${x.status === "Completed" ? "checked" : ""}><button class="grow" style="text-align:left;padding:0" ${editbtn("Tasks", x.id)}>${esc(x.name)}</button>${["Today", "Overdue"].includes(x.status) ? `<span class="${taskStatus(x) === "Overdue" ? "pill red" : "pill"}">${x.status}</span>` : ""}<span class="date">${dateLabel(x.date)}</span></div>`,
      )
      .join("") || '<div class="empty">No tasks in this category.</div>'
  }</section><section class="panel">${head("Today’s Meetings", 'data-page="Meetings"', "View Calendar")}${recordsFor(
    "Meetings",
    "Home",
  )
    .filter((x) => x.date === todayISO() && x.status === "Scheduled")
    .slice(0, 3)
    .map(
      (x, i) =>
        `<div class="row meeting"><div class="time" style="${i === 0 ? "color:#a92629" : ""}">${timeLabel(x.time)}<br><span class="muted">${timeLabel(x.end)}</span></div><button class="grow" style="text-align:left;padding:0" ${editbtn("Meetings", x.id)}><b>${esc(x.name)}</b><small>${esc(x.company)}</small></button>${i === 0 ? `<button class="join" data-join="${esc(x.id)}">♧ &nbsp; Join</button>` : `<span class="pill">In ${i === 1 ? "4" : "6"}h</span>`}<button class="more" aria-label="Meeting details" ${editbtn("Meetings", x.id)}>•••</button></div>`,
    )
    .join(
      "",
    )}</section><section class="panel mid">${head("Opportunities Overview", 'data-page="Opportunities"')}${tabs(
    [
      ["By Stage", "By Stage"],
      ["By Service Line", "By Service Line"],
      ["By Region", "By Region"],
    ],
    chartTab,
    "data-chart",
  )}<div class="chartbody"><div class="donut"><div class="hole"><b>${count("Opportunities")}</b><small>Total</small></div></div><div class="legend">${chartLegend()}</div></div></section><section class="panel mid"><div class="panelhead"><h2>Opportunities by Region</h2></div><div class="regionbody"><img class="regionmap" src="assets/saudi-map.png" alt="Map of Saudi Arabia"><div class="legend">${["Riyadh", "Makkah", "Eastern Province", "NEOM", "Qiddiya", "Other"].map((x, i) => `<button class="legendrow" style="width:100%;text-align:left" data-region="${x}"><i style="background:${["#8d8471", "#919681", "#adb09a", "#a2aa93", "#bbc0aa", "#b8b69e"][i]}"></i><span>${x}</span><b>${recordsFor("Opportunities", "Home").filter((o) => (o.region || "Other") === x).length}</b></button>`).join("")}</div></div></section><section class="panel mid activity">${head("Recent Activity", 'data-activity="true"')}${activityHTML()}</section><section class="panel milestone">${head("Upcoming Milestones", 'data-page="Tasks"')}${recordsFor(
    "Tasks",
    "Home",
  )
    .filter((t) => t.date >= todayISO() && t.status !== "Completed")
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3)
    .map((t) => [
      dateLabel(t.date),
      t.name,
      dayDiff(todayISO(), t.date) === 0
        ? "Today"
        : "In " + dayDiff(todayISO(), t.date) + " days",
    ])
    .map(
      (x) =>
        `<button class="row" style="width:100%;text-align:left" data-new="Tasks" data-prefill="${x[1]}"><span class="when">${x[0]}</span><span class="grow muted">${x[1]}</span><span class="pill">${x[2]}</span></button>`,
    )
    .join(
      "",
    )}</section><img class="banner" src="assets/dgj-banner.png" alt="Turning opportunities into impact. DGJ. Same goals. A brighter tomorrow."><section class="panel"><div class="panelhead"><h2>Quick Actions</h2></div><div class="quickactions">${[
    ["Contacts", "Add Contact"],
    ["Opportunities", "Add Opportunity"],
    ["Meetings", "Schedule Meeting"],
    ["Reports", "Create Report"],
  ]
    .map(([k, l]) => `<button data-new="${k}">${icon(k)}${l}</button>`)
    .join("")}</div></section></div>`;
}
// Presentation filters complement the authenticated server's access checks.
const RECORD_TYPES = [
  "Contacts",
  "Opportunities",
  "Meetings",
  "Reports",
  "Complaints",
  "Tasks",
];
const USERS = [];
icons.Trash = '<path d="M3 6h18M9 6V3h6v3M6 6l1 16h10l1-16M10 10v8m4-8v8"/>';
icons.Email =
  '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 5 10 8L22 5"/>';
let db;
function normalizeDB(raw) {
  const base =
    raw && typeof raw === "object"
      ? raw
      : {
          ...Object.fromEntries(RECORD_TYPES.map((k) => [k, []])),
          activity: [],
          emailDrafts: [],
          employmentHistory: [],
          notes: [],
          attachments: [],
          savedViews: [],
          preferences: {},
          preferenceVersion: 0,
        };
  for (const k of RECORD_TYPES) {
    if (!Array.isArray(base[k])) base[k] = [];
    base[k] = base[k]
      .filter(
        (x) => x && typeof x.id === "string" && typeof x.name === "string",
      )
      .map((x) => ({
        ...x,
        ownerId: String(x.ownerId || ""),
        visibility: x.visibility === "private" ? "private" : "shared",
        entityType: k,
        contactIds: Array.isArray(x.contactIds) ? x.contactIds : [],
        history: Array.isArray(x.history) ? x.history : [],
      }));
  }
  if (!Array.isArray(base.activity)) base.activity = [];
  if (!Array.isArray(base.emailDrafts)) base.emailDrafts = [];
  if (!Array.isArray(base.employmentHistory)) base.employmentHistory = [];
  base.schemaVersion = 3;
  return base;
}
db = normalizeDB(null);
let user = { id: "", name: "", initials: "", role: "member" };
let page = "Home",
  query = "",
  regionFilter = "",
  complaintTab = "Open",
  taskTab = "My Tasks",
  chartTab = "By Stage";
const scopes = {};
const isManager = () => user.role === "manager";
const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const normal = (s) =>
  String(s || "")
    .normalize("NFKC")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
const userName = (id) => USERS.find((x) => x.id === id)?.name || "Team member";
const baseReadable = (x) =>
  x && (x.visibility !== "private" || x.ownerId === user.id);
const canRead = (x) =>
  x &&
  (["Contacts", "Opportunities"].includes(x.entityType)
    ? baseReadable(x)
    : linkedAccess(x));
const inScope = (x, p = page) =>
  !isManager() || (scopes[p] || "all") === "all" || x.ownerId === user.id;
const recordsFor = (k, p = page) =>
  db[k].filter((x) => !x.deletedAt && canRead(x) && inScope(x, p));
const visibleRecord = (k, id) =>
  RECORD_TYPES.includes(k)
    ? db[k].find((x) => x.id === id && !x.deletedAt && canRead(x))
    : null;
const count = (k) => recordsFor(k, "Home").length;
// Keep the original card layout. Totals now count actual available records.
const initialCounts = Object.fromEntries(RECORD_TYPES.map((k) => [k, 0]));
function persist(next) {
  throw new Error("Connection adapter is not ready.");
}
async function transact(change) {
  const next = structuredClone(db);
  change(next);
  return await persist(next);
}
function addLog(next, text, record, k) {
  next.activity.unshift({
    id: crypto.randomUUID(),
    text,
    company: record.name,
    time: Date.now(),
    actorId: user.id,
    ownerId: record.ownerId,
    visibility: record.visibility,
    recordId: record.id,
    recordType: k,
    contactIds: record.contactIds || [],
    opportunityId: record.opportunityId || "",
  });
  next.activity = next.activity.slice(0, 100);
}
function toast(s) {
  const t = document.getElementById("toast");
  t.textContent = s;
  t.style.display = "block";
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => (t.style.display = "none"), 4000);
}
const dateLabel = (d) =>
  d
    ? new Date(d + "T12:00").toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      })
    : "—";
const fullDate = (t) =>
  new Date(t).toLocaleString("en-GB", { timeZone: "Asia/Riyadh" });
const singular = (k) =>
  k === "Companies"
    ? "Company"
    : k === "Opportunities"
      ? "Opportunity"
      : k.slice(0, -1);
function go(p) {
  if (p === "Trash" && !isManager())
    return toast("Trash is available to the General Manager only.");
  if (p === "Companies") return;
  activeProfile = null;
  page = p;
  query = "";
  regionFilter = "";
  document.getElementById("search").value = "";
  render();
}
const head = (title, action, label = "View All") =>
  `<div class="panelhead"><h2>${title}</h2><button class="link" ${action}>${label} →</button></div>`;
const tabs = (items, active, attr) =>
  `<div class="tabs">${items.map(([v, label]) => `<button class="${active === v ? "selected" : ""}" ${attr}="${v}">${label}</button>`).join("")}</div>`;
const editbtn = (k, id) => `data-edit="${k}" data-id="${esc(id)}"`;
function scopeControl() {
  return isManager()
    ? `<div class="scopebar"><span>View</span><div class="scopes" aria-label="Record scope"><button data-scope="all" aria-pressed="${(scopes[page] || "all") === "all"}" class="${(scopes[page] || "all") === "all" ? "selected" : ""}">All</button><button data-scope="my" aria-pressed="${scopes[page] === "my"}" class="${scopes[page] === "my" ? "selected" : ""}">My</button></div></div>`
    : "";
}
function timeLabel(t) {
  if (!t) return "—";
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}
function chartLegend() {
  const rows = recordsFor("Opportunities", "Home");
  const key =
    chartTab === "By Stage"
      ? "status"
      : chartTab === "By Region"
        ? "region"
        : "service";
  const groups = rows.reduce((a, x) => {
    const k = x[key] || "Other";
    a[k] = (a[k] || 0) + 1;
    return a;
  }, {});
  const labels =
    chartTab === "By Stage" ? statuses.Opportunities : Object.keys(groups);
  return (
    labels
      .map(
        (x, i) =>
          `<div class="legendrow"><i style="background:${["#686456", "#8b957f", "#ead8bd", "#c4c9b7", "#a1ad95", "#dedbd3"][i % 6]}"></i><span>${esc(x)}</span><b>${groups[x] || 0}${rows.length ? " (" + Math.round(((groups[x] || 0) / rows.length) * 100) + "%)" : ""}</b></div>`,
      )
      .join("") || '<p class="muted">No opportunities</p>'
  );
}
function chartGradient() {
  const rows = recordsFor("Opportunities", "Home");
  if (!rows.length) return "#eeede7";
  const key =
    chartTab === "By Stage"
      ? "status"
      : chartTab === "By Region"
        ? "region"
        : "service";
  const values = rows.reduce((a, x) => {
    a[x[key] || "Other"] = (a[x[key] || "Other"] || 0) + 1;
    return a;
  }, {});
  const names =
    chartTab === "By Stage" ? statuses.Opportunities : Object.keys(values);
  let pos = 0;
  const colors = [
    "#686456",
    "#8b957f",
    "#ead8bd",
    "#c4c9b7",
    "#a1ad95",
    "#dedbd3",
  ];
  return (
    "conic-gradient(" +
    names
      .map((name, i) => {
        let start = pos;
        pos += ((values[name] || 0) / rows.length) * 100;
        return `${colors[i % 6]} ${start}% ${pos}%`;
      })
      .join(",") +
    ")"
  );
}
function activityRows() {
  return db.activity.filter((x) => {
    if (x.recordType) {
      const record = db[x.recordType]?.find((r) => r.id === x.recordId);
      if (!record || record.deletedAt || !canRead(record) || !inScope(record))
        return false;
    }
    return (
      canRead(x) &&
      (isManager()
        ? (scopes[page] || "all") === "all" || x.actorId === user.id
        : x.actorId === user.id)
    );
  });
}
function activityHTML(all = false) {
  const rows = activityRows();
  return (
    rows
      .slice(0, all ? 100 : 5)
      .map(
        (x) =>
          `<div class="row"><i class="timeline"></i><span class="activityicon">${icon(x.recordType || "Reports")}</span><div class="grow">${esc(x.text)}<small>${esc(x.company)} · ${esc(userName(x.actorId))}</small></div><span class="ago">${new Date(x.time).toLocaleDateString("en-GB")}</span></div>`,
      )
      .join("") || '<div class="empty">No activity yet.</div>'
  );
}
function listRows(k = page) {
  return recordsFor(k).filter(
    (x) =>
      [x.name, x.company, x.email, x.status, x.region, x.service]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (!regionFilter || x.region === regionFilter),
  );
}
function list() {
  const rows = listRows();
  return `<div class="welcome"><div><h1>${page}</h1><div class="subtitle">Manage your ${page.toLowerCase()} and keep every detail connected.</div></div><button class="primary" data-new="${page}">＋ Add ${singular(page)}</button></div><div class="toolbar"><div><input id="listsearch" aria-label="Search this page" placeholder="Search ${page.toLowerCase()}..." value="${esc(query)}"> ${regionFilter ? `<button class="secondary" id="clearregion">${esc(regionFilter)} ×</button>` : ""}</div>${isManager() ? '<button class="secondary" id="export">Export CSV</button>' : ""}</div><section class="panel tablewrap"><table class="table"><thead><tr><th>Name / Title</th><th>Company / Location</th><th>Status</th><th>${page === "Contacts" ? "Email" : page === "Opportunities" ? "Value (SAR)" : "Date"}</th>${isManager() ? "<th>Owner / Visibility</th>" : ""}<th>Actions</th></tr></thead><tbody>${rows.map((x) => `<tr><td><button ${["Contacts", "Opportunities"].includes(page) ? `data-profile="${page}" data-id="${esc(x.id)}"` : editbtn(page, x.id)}>${esc(x.name)}</button></td><td>${esc(x.company)}</td><td><span class="pill ${x.status === "Overdue" ? "red" : ""}">${esc(x.status)}</span></td><td>${page === "Contacts" ? esc(x.email) : page === "Opportunities" ? Number(x.value || 0).toLocaleString() : dateLabel(x.date)}</td>${isManager() ? `<td><small class="muted">${esc(userName(x.ownerId))}</small><br><span class="pill ${x.visibility === "private" ? "private" : ""}">${x.visibility === "private" ? "Private" : "Shared"}</span></td>` : ""}<td class="actioncell"><button class="secondary" ${editbtn(page, x.id)}>Edit</button>${page === "Opportunities" ? ` <button class="secondary" data-email="${esc(x.id)}">${icon("Email")} Email</button>` : ""}${isManager() ? ` <button class="secondary dangertext" data-delete="${page}" data-id="${esc(x.id)}">Delete</button>` : ""}${page === "Meetings" ? ` <button class="secondary" data-ics="${esc(x.id)}">Calendar</button>` : ""}</td></tr>`).join("")}</tbody></table>${rows.length ? "" : '<div class="empty">No matching records. Add a new record to get started.</div>'}</section>`;
}
function trashPage() {
  if (!isManager()) return '<div class="empty">Access restricted.</div>';
  const rows = RECORD_TYPES.flatMap((k) =>
    db[k]
      .filter((x) => x.deletedAt && canRead(x) && inScope(x))
      .map((x) => ({ ...x, type: k })),
  ).filter((x) => normal(x.name + " " + x.company).includes(normal(query)));
  return `<div class="welcome"><div><h1>Trash</h1><div class="subtitle">Deleted records remain here until you restore or permanently delete them.</div></div></div><div class="toolbar"><input id="listsearch" placeholder="Search deleted records..." value="${esc(query)}"></div><section class="panel tablewrap"><table class="table"><thead><tr><th>Record</th><th>Type</th><th>Deleted</th><th>Owner</th><th>Actions</th></tr></thead><tbody>${rows.map((x) => `<tr><td>${esc(x.name)}<br><small class="muted">${esc(x.company)}</small></td><td>${x.type}</td><td>${fullDate(x.deletedAt)}</td><td>${esc(userName(x.ownerId))}</td><td><button class="secondary" data-restore="${x.type}" data-id="${esc(x.id)}">Restore</button> <button class="secondary dangertext" data-purge="${x.type}" data-id="${esc(x.id)}">Delete permanently</button></td></tr>`).join("")}</tbody></table>${rows.length ? "" : '<div class="empty">Trash is empty.</div>'}</section>`;
}
function settings() {
  return "<h1>Settings</h1>";
}

function help() {
  return `<h1>Help & Support</h1><section class="panel" style="margin-top:20px"><p>Use Add New or Quick Actions to add records. Open a record to edit it. Complete tasks with the checkboxes. Search finds records you can see.</p><p>General Manager: All / My is available at the top of each page. Only the manager can delete or export. Trash supports restore and permanent removal.</p><p>Manager-owned contacts and opportunities can be Private (owner only) or Shared (team). Member-created records are shared. Create team accounts and change your password in Settings.</p><p>Duplicate contact checks compare email, phone or name + company. Continue creates a separate record. Update Existing merges into the selected record and retains a change history.</p><p>Opportunity → Email opens the composer. Choose company contacts, add recipients, and save drafts. Open in email app requires an installed email client. Sending inside the CRM is unavailable until company Outlook is connected. A saved or opened draft is not a sent email.</p><p>Records, notes and attachments are saved in the shared CRM database. Sign out before another person uses this browser. Use Refresh to load teammates' recent changes.</p></section>`;
}
function searchResults() {
  const groups = RECORD_TYPES.map((k) => [
    k,
    recordsFor(k, "Search").filter((x) =>
      normal(
        [x.name, x.company, x.email, x.status, x.region].join(" "),
      ).includes(normal(query)),
    ),
  ]);
  return `<h1>Search results</h1><div class="subtitle" style="margin:15px 0">Results for “${esc(query)}”</div>${groups.map(([k, a]) => (a.length ? `<section class="panel" style="margin:10px 0"><h2>${k}</h2>${a.map((x) => `<button class="row" style="width:100%;text-align:left" ${["Contacts", "Opportunities"].includes(k) ? `data-profile="${k}" data-id="${esc(x.id)}"` : editbtn(k, x.id)}><span class="grow">${esc(x.name)}</span><span class="muted">${esc(x.company)}</span></button>`).join("")}</section>` : "")).join("") || '<div class="empty">No matching records.</div>'}`;
}
const statuses = {
  Contacts: ["Active", "Inactive"],
  Opportunities: [
    "Prospecting",
    "Qualification",
    "Proposal",
    "Negotiation",
    "Won",
    "Lost",
  ],
  Complaints: ["Open", "In Progress", "Resolved"],
  Tasks: ["Open", "Today", "Overdue", "Completed"],
  Meetings: ["Scheduled", "Completed", "Cancelled"],
  Reports: ["Draft", "Submitted"],
};
function showDialog(html) {
  const d = document.getElementById("modal");
  d.innerHTML = html;
  if (!d.open) d.showModal();
  return d;
}
function closeDialog() {
  const dialog = document.getElementById("modal");
  dialog.close();
  dialog.innerHTML = "";
}
function historyHTMLLegacy(x) {
  if (!x.history?.length) return "";
  return `<details class="history"><summary>Change history (${x.history.length})</summary>${x.history
    .slice()
    .reverse()
    .map(
      (h) =>
        `<div class="historyitem"><b>${fullDate(h.at)}</b><small>by ${esc(userName(h.actorId))}</small><div>${esc(h.before?.name)} · ${esc(h.before?.company)}<br>${esc(h.before?.email || "")} ${esc(h.before?.phone || "")}</div></div>`,
    )
    .join("")}</details>`;
}
function openForm(k, id, prefill = "", suggested) {
  if (!RECORD_TYPES.includes(k)) return;
  const existing = id ? visibleRecord(k, id) : null;
  if (id && !existing) return toast("Record is not available.");
  const x = {
    ...(existing || {
      name: prefill,
      status: statuses[k][0],
      visibility: "shared",
    }),
    ...suggested,
  };
  const field = (label, key, type = "text", required = false) =>
    `<label class="formfield">${label}<input name="${key}" type="${type}" value="${esc(x[key])}" ${required ? "required" : ""} ${key === "value" ? 'min="0"' : ""}></label>`;
  const opts = (label, key, values) =>
    `<label class="formfield">${label}<select name="${key}">${values.map((v) => `<option ${x[key] === v ? "selected" : ""}>${esc(v)}</option>`).join("")}</select></label>`;
  const privacy =
    isManager() &&
    ["Contacts", "Opportunities"].includes(k) &&
    (!existing || existing.ownerId === user.id)
      ? `<fieldset class="visibility"><legend>Who can see this ${singular(k).toLowerCase()}?</legend><label><input type="radio" name="visibility" value="private" ${x.visibility === "private" ? "checked" : ""}> Private — only me</label><label><input type="radio" name="visibility" value="shared" ${x.visibility !== "private" ? "checked" : ""}> Shared — team members</label></fieldset>`
      : isManager() && existing
        ? `<p class="smallnote">Owner: ${esc(userName(existing.ownerId))} · ${existing.visibility === "private" ? "Private" : "Shared"}</p>`
        : "";
  const d = showDialog(
    `<form id="recordform"><h2>${id ? "Edit" : "Add"} ${singular(k)}</h2>${field("Name / Title", "name", "text", true)}${field("Company / Location", "company")}${opts("Status", "status", statuses[k])}${k === "Contacts" ? field("Email", "email", "email") + field("Phone", "phone", "tel") : ""}${["Meetings", "Tasks", "Complaints", "Reports"].includes(k) ? field("Date", "date", "date") : ""}${k === "Meetings" ? field("Start time", "time", "time", true) + field("End time", "end", "time", true) + field("Teams / meeting link", "url", "url") : ""}${k === "Opportunities" ? field("Value (SAR)", "value", "number") + opts("Region", "region", ["Riyadh", "Makkah", "Eastern Province", "NEOM", "Qiddiya", "Other"]) + opts("Service Line", "service", ["Cost Management", "Quantity Surveying", "Project Management", "Other"]) : ""}${extraFields(k, x)}${linkFields(k, x)}${privacy}${k === "Complaints" ? `<label class="formfield"><input name="overdue" type="checkbox" ${x.overdue ? "checked" : ""} style="display:inline;width:auto"> Overdue</label>` : ""}<label class="formfield">Notes<textarea name="notes" rows="3">${esc(x.notes)}</textarea></label>${k === "Contacts" ? historyHTML(existing || {}) : ""}<div class="formbuttons"><button type="button" class="secondary" id="cancel">Cancel</button><button class="primary" type="submit">Save</button></div></form>`,
  );
  d.querySelector("#cancel").onclick = closeDialog;
  d.querySelector("form").onsubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const fd = new FormData(form);
    const draft = Object.fromEntries(fd);
    if (k !== "Contacts") draft.contactIds = fd.getAll("contactIds");
    if (!["Contacts", "Opportunities"].includes(k))
      draft.opportunityId = fd.get("opportunityId") || "";
    draft.name = draft.name.trim();
    draft.company = draft.company?.trim() || "";
    if (!draft.name) return toast("Enter a name");
    if (k === "Meetings" && draft.end <= draft.time)
      return toast("End time must be after start time");
    if (k === "Opportunities") {
      draft.value = Number(draft.value || 0);
      if (!Number.isFinite(draft.value) || draft.value < 0)
        return toast("Enter a valid value");
    }
    if (k === "Complaints") draft.overdue = form.elements.overdue.checked;
    if (k === "Contacts") {
      draft.email = (draft.email || "").trim();
      const matches = findDuplicates(draft, id);
      if (matches.length) return duplicateDialog(k, id, draft, matches);
    }
    await commitRecord(k, id, draft);
  };
}
function findDuplicates(draft, exclude) {
  const phone = (s) => String(s || "").replace(/\D/g, "");
  return db.Contacts.filter(
    (x) => !x.deletedAt && canRead(x) && x.id !== exclude,
  )
    .map((x) => {
      const reasons = [];
      if (draft.email && x.email && normal(draft.email) === normal(x.email))
        reasons.push("same email");
      if (
        phone(draft.phone).length >= 7 &&
        phone(draft.phone) === phone(x.phone)
      )
        reasons.push("same phone");
      if (
        normal(draft.name) === normal(x.name) &&
        normal(draft.company) === normal(x.company)
      )
        reasons.push("same name and company");
      return { record: x, reasons };
    })
    .filter((x) => x.reasons.length);
}
function duplicateDialog(k, id, draft, matches) {
  const d = showDialog(
    `<h2>Possible duplicate contact</h2><p class="notice">We found ${matches.length} existing contact${matches.length === 1 ? "" : "s"}. Update an existing contact or continue with a separate record.</p><div class="duplicatechoices">${matches.map(({ record: x, reasons }, i) => `<label class="duplicate"><input type="radio" name="duplicate" value="${esc(x.id)}" ${i === 0 ? "checked" : ""}><span><b>${esc(x.name)}</b><small>${esc(x.company)} · ${esc(x.email)}</small><small>Match: ${esc(reasons.join(", "))}</small></span></label>`).join("")}</div><div class="formbuttons wrap"><button class="secondary" id="backduplicate">Back</button><button class="secondary" id="continueDuplicate">Continue Anyway</button><button class="primary" id="updateDuplicate">Update Existing</button></div>`,
  );
  d.querySelector("#backduplicate").onclick = () => openForm(k, id, "", draft);
  d.querySelector("#continueDuplicate").onclick = async () =>
    await commitRecord(k, id, draft);
  d.querySelector("#updateDuplicate").onclick = () => {
    const target = d.querySelector("input[name=duplicate]:checked")?.value;
    const old = visibleRecord("Contacts", target);
    if (!old) return toast("Record no longer available");
    const merged = { ...old };
    for (const [key, value] of Object.entries(draft)) {
      if (["id", "ownerId", "visibility", "history"].includes(key)) continue;
      if (value !== "" && value !== undefined) merged[key] = value;
    }
    openForm("Contacts", target, "", merged);
  };
}
async function commitRecord(k, id, draft) {
  if (
    (draft.contactIds || []).some((c) => !visibleRecord("Contacts", c)) ||
    (draft.opportunityId &&
      !visibleRecord("Opportunities", draft.opportunityId))
  )
    return toast("A linked record is no longer available");
  const old = id ? visibleRecord(k, id) : null;
  if (id && !old) return toast("Record no longer available");
  const owned = old ? old.ownerId === user.id : true;
  const allowVisibility =
    isManager() && owned && ["Contacts", "Opportunities"].includes(k);
  const record = {
    ...old,
    ...draft,
    entityType: k,
    id: id || crypto.randomUUID(),
    ownerId: old?.ownerId || user.id,
    visibility: allowVisibility
      ? draft.visibility === "private"
        ? "private"
        : "shared"
      : old?.visibility || "shared",
    createdAt: old ? old.createdAt || null : Date.now(),
    updatedAt: Date.now(),
    history: [...(old?.history || [])],
  };
  if (old) {
    const { history, ...before } = old;
    record.history.push({ at: Date.now(), actorId: user.id, before });
  }
  if (
    !(await transact((next) => {
      if (
        old &&
        k === "Contacts" &&
        (normal(old.company) !== normal(record.company) ||
          normal(old.jobTitle) !== normal(record.jobTitle)) &&
        (old.company || old.jobTitle)
      ) {
        next.employmentHistory.push({
          id: crypto.randomUUID(),
          contactId: old.id,
          company: old.company || "",
          jobTitle: old.jobTitle || "",
          department: old.department || "",
          startDate: "",
          endDate: new Date(Date.now() + 3 * 3600000)
            .toISOString()
            .slice(0, 10),
          notes:
            "Previous role recorded automatically when profile changed. Original start date not recorded.",
          ownerId: old.ownerId,
          visibility: old.visibility,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }
      if (id) next[k] = next[k].map((x) => (x.id === id ? record : x));
      else next[k].push(record);
      addLog(next, `${singular(k)} ${id ? "updated" : "added"}`, record, k);
    }))
  )
    return;
  closeDialog();
  render();
  toast("Saved successfully");
}
function confirmDelete(k, id, permanent = false) {
  if (!isManager())
    return toast("Only the General Manager can delete records.");
  if (!RECORD_TYPES.includes(k)) return;
  const record = db[k].find((x) => x.id === id && canRead(x));
  if (!record || (permanent ? !record.deletedAt : record.deletedAt))
    return toast("Record is not available.");
  const title = permanent ? "Delete permanently?" : "Move to Trash?";
  const d = showDialog(
    `<h2>${title}</h2><p>${esc(record.name)}</p><p class="smallnote">${permanent ? "This permanently removes the record, its profile notes, attached files and email drafts." : "The record will be hidden from active pages. You can restore it from Trash."}</p><div class="formbuttons"><button class="secondary" id="cancel">Cancel</button><button class="primary" id="firstconfirm">Continue</button></div>`,
  );
  d.querySelector("#cancel").onclick = closeDialog;
  d.querySelector("#firstconfirm").onclick = () => {
    d.innerHTML = `<h2>Confirm ${permanent ? "permanent deletion" : "deletion"}</h2><p>Type <b>DELETE</b> to confirm.</p><label class="formfield">Confirmation<input id="deleteword" autocomplete="off"></label><div class="formbuttons"><button class="secondary" id="cancel">Cancel</button><button class="primary" id="confirmdelete" disabled>${permanent ? "Delete permanently" : "Move to Trash"}</button></div>`;
    d.querySelector("#cancel").onclick = closeDialog;
    d.querySelector("#deleteword").oninput = (e) =>
      (d.querySelector("#confirmdelete").disabled =
        e.target.value !== "DELETE");
    d.querySelector("#confirmdelete").onclick = async () => {
      if (!isManager() || d.querySelector("#deleteword").value !== "DELETE")
        return;
      const done = await transact((next) => {
        if (permanent) {
          next[k] = next[k].filter((x) => x.id !== id);
          next.notes = (next.notes || []).filter(
            (x) => !(x.recordType === k && x.recordId === id),
          );
          next.attachments = (next.attachments || []).filter(
            (x) => !(x.recordType === k && x.recordId === id),
          );
          next.activity = next.activity.filter(
            (x) => !(x.recordType === k && x.recordId === id),
          );
          if (k === "Opportunities")
            next.emailDrafts = next.emailDrafts.filter(
              (x) => x.opportunityId !== id,
            );
          if (k === "Contacts")
            next.employmentHistory = next.employmentHistory.filter(
              (x) => x.contactId !== id,
            );
        } else {
          const x = next[k].find((x) => x.id === id);
          x.deletedAt = Date.now();
          x.deletedBy = user.id;
          addLog(next, "Record moved to Trash", x, k);
        }
      });
      if (done) {
        closeDialog();
        render();
        toast(permanent ? "Record permanently deleted" : "Moved to Trash");
        if (!permanent && typeof showUndoDelete === "function")
          showUndoDelete(k, id);
      }
    };
  };
}
async function restoreRecord(k, id) {
  if (!isManager() || !RECORD_TYPES.includes(k))
    return toast("Only the General Manager can restore records.");
  const x = db[k].find((x) => x.id === id && x.deletedAt && canRead(x));
  if (!x) return;
  const done = await transact((next) => {
    const record = next[k].find((x) => x.id === id);
    delete record.deletedAt;
    delete record.deletedBy;
    record.updatedAt = Date.now();
    addLog(next, "Record restored", record, k);
  });
  if (done) {
    render();
    toast("Record restored");
  }
}
function download(name, data, type) {
  const u = URL.createObjectURL(new Blob([data], { type }));
  const a = document.createElement("a");
  a.href = u;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(u), 1000);
}
function csv() {
  if (!isManager() || !RECORD_TYPES.includes(page))
    return toast("Only the General Manager can export.");
  const rows = listRows();
  const cols = [
    "name",
    "company",
    "email",
    "phone",
    "status",
    "date",
    "region",
    "service",
    "value",
    "ownerId",
    "visibility",
    "jobTitle",
    "department",
    "preferredChannel",
    "location",
    "tags",
    "reference",
    "startDate",
    "targetDate",
    "scope",
    "contactIds",
    "opportunityId",
    "notes",
  ];
  const cell = (v) =>
    '"' +
    String(v ?? "")
      .replace(/^[\s]*[=+@-]/, "'$&")
      .replaceAll('"', '""') +
    '"';
  download(
    `DGJ-${page}-${scopes[page] || "all"}.csv`,
    "\ufeff" +
      [cols, ...rows.map((x) => cols.map((k) => x[k]))]
        .map((r) => r.map(cell).join(","))
        .join("\r\n"),
    "text/csv;charset=utf-8",
  );
  toast("Exported current view");
}
function calendar(id) {
  const x = visibleRecord("Meetings", id);
  if (!x) return;
  if (!x.date) return toast("Set a meeting date first");
  const clean = (s) =>
    String(s || "")
      .replace(/\\/g, "\\\\")
      .replace(/\n/g, "\\n")
      .replace(/,/g, "\\,")
      .replace(/;/g, "\\;");
  const dt = (t) =>
    x.date.replaceAll("-", "") + "T" + (t || "09:00").replace(":", "") + "00";
  download(
    "DGJ-meeting.ics",
    [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//DGJ//CRM Demo//EN",
      "BEGIN:VEVENT",
      "UID:" + x.id + "@dgj-demo",
      "DTSTAMP:" +
        new Date()
          .toISOString()
          .replace(/[-:]/g, "")
          .replace(/\.\d{3}/, ""),
      "DTSTART;TZID=Asia/Riyadh:" + dt(x.time),
      "DTEND;TZID=Asia/Riyadh:" + dt(x.end),
      "SUMMARY:" + clean(x.name),
      "LOCATION:" + clean(x.company),
      "DESCRIPTION:" + clean(x.notes),
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n"),
    "text/calendar",
  );
}
function validEmail(email) {
  return /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(email);
}
function parseRecipients(value) {
  return [
    ...new Set(
      String(value || "")
        .split(/[;,\n]+/)
        .map((x) => x.trim().toLowerCase())
        .filter(Boolean),
    ),
  ];
}
function emailComposer(id, draftId) {
  const opportunity = visibleRecord("Opportunities", id);
  if (!opportunity) return toast("Opportunity is not available.");
  const draft = draftId
    ? db.emailDrafts.find(
        (x) =>
          x.id === draftId && x.opportunityId === id && x.ownerId === user.id,
      )
    : null;
  const companyContacts = recordsFor("Contacts", "Email").filter(
    (x) =>
      normal(x.company) === normal(opportunity.company) &&
      x.email &&
      validEmail(x.email),
  );
  const drafts = db.emailDrafts.filter(
    (x) => x.opportunityId === id && x.ownerId === user.id,
  );
  const d = showDialog(
    `<form id="emailform"><h2>Email · ${esc(opportunity.name)}</h2><div class="smallnote">Company: ${esc(opportunity.company)}<br>Outlook is not connected. Save a draft or open it in your email application.</div>${drafts.length ? `<label class="formfield">Your saved drafts<select id="draftpicker"><option value="">New draft</option>${drafts.map((x) => `<option value="${esc(x.id)}" ${x.id === draftId ? "selected" : ""}>${esc(x.subject || "Untitled")} — ${fullDate(x.updatedAt)}</option>`).join("")}</select></label>` : ""}${companyContacts.length ? `<fieldset class="visibility"><legend>Company contacts</legend>${companyContacts.map((x) => `<label><input type="checkbox" data-recipient="${esc(x.email)}" ${draft?.to?.includes(x.email.toLowerCase()) ? "checked" : ""}> ${esc(x.name)} <small>${esc(x.email)}</small></label>`).join("")}</fieldset>` : '<p class="smallnote">No company contacts with email addresses yet. Enter recipients below.</p>'}<label class="formfield">To<input name="to" placeholder="name@company.com; second@company.com" value="${esc(draft?.to?.join("; "))}"></label><label class="formfield">Cc<input name="cc" value="${esc(draft?.cc?.join("; "))}"></label><label class="formfield">Subject<input name="subject" maxlength="250" value="${esc(draft?.subject || opportunity.name)}"></label><label class="formfield">Message<textarea name="body" rows="7">${esc(draft?.body)}</textarea></label><div class="formbuttons wrap"><button type="button" class="secondary" id="cancel">Close</button><button type="submit" class="secondary">Save Draft</button><button type="button" class="primary" id="openmail">Open in email app</button></div><p class="smallnote">Sending inside CRM requires the company Outlook integration. Opening an email app does not send the message.</p></form>`,
  );
  const form = d.querySelector("form");
  let currentId = draft?.id;
  d.querySelector("#cancel").onclick = closeDialog;
  d.querySelector("#draftpicker")?.addEventListener("change", (e) =>
    emailComposer(id, e.target.value),
  );
  d.querySelectorAll("[data-recipient]").forEach(
    (c) =>
      (c.onchange = () => {
        let to = parseRecipients(form.elements.to.value);
        to = to.filter((x) => x !== c.dataset.recipient.toLowerCase());
        if (c.checked) to.push(c.dataset.recipient.toLowerCase());
        form.elements.to.value = to.join("; ");
      }),
  );
  function collect(requireReady) {
    const f = Object.fromEntries(new FormData(form));
    const to = parseRecipients(f.to),
      cc = parseRecipients(f.cc);
    if ([...to, ...cc].some((x) => !validEmail(x))) {
      toast(
        "Check the email addresses. Separate recipients with a comma or semicolon.",
      );
      return null;
    }
    if (requireReady && (!to.length || !f.subject.trim() || !f.body.trim())) {
      toast("Add a recipient, subject and message first.");
      return null;
    }
    if (/[\r\n]/.test(f.subject)) {
      toast("Subject must be a single line.");
      return null;
    }
    return {
      id: currentId || crypto.randomUUID(),
      opportunityId: id,
      ownerId: user.id,
      contactIds: recordsFor("Contacts", "Email")
        .filter(
          (c) => c.email && [...to, ...cc].includes(c.email.toLowerCase()),
        )
        .map((c) => c.id),
      to,
      cc,
      subject: f.subject.trim(),
      body: f.body,
      status: "Draft",
      updatedAt: Date.now(),
    };
  }
  async function saveDraft(data) {
    if (!visibleRecord("Opportunities", id)) return false;
    const ok = await transact((next) => {
      next.emailDrafts = next.emailDrafts.filter((x) => x.id !== data.id);
      next.emailDrafts.push(data);
    });
    if (ok) currentId = data.id;
    return ok;
  }
  form.onsubmit = async (e) => {
    e.preventDefault();
    const data = collect(false);
    if (data && (await saveDraft(data))) toast("Draft saved — no email sent");
  };
  d.querySelector("#openmail").onclick = async () => {
    const data = collect(true);
    if (!data || !(await saveDraft(data))) return;
    const params = new URLSearchParams({
      subject: data.subject,
      body: data.body,
    });
    if (data.cc.length) params.set("cc", data.cc.join(","));
    const href =
      "mailto:" +
      data.to.map(encodeURIComponent).join(",") +
      "?" +
      params.toString().replace(/\+/g, "%20");
    if (href.length > 7000)
      return toast(
        "Message is too long for an email-app link. Copy it from the draft.",
      );
    const a = document.createElement("a");
    a.href = href;
    a.click();
    toast("Requested opening your email app. No email has been sent by CRM.");
  };
}
function render() {
  if (!window.DGJSession.ready) return;
  if (page === "Trash" && !isManager()) page = "Home";
  document.getElementById("nav").innerHTML = [
    "Home",
    "Contacts",
    "Opportunities",
    "Meetings",
    "Tasks",
    "Reports",
    ...(isManager() ? ["Trash"] : []),
  ]
    .map(
      (k) =>
        `<button class="${page === k ? "active" : ""}" data-page="${k}">${icon(k)}<span>${k}</span></button>`,
    )
    .join("");
  document
    .querySelectorAll(".bottom button")
    .forEach(
      (b) =>
        (b.innerHTML = icon(b.dataset.page) + `<span>${b.dataset.page}</span>`),
    );
  const alerts = recordsFor("Complaints", "Home").filter(
    (x) => x.status !== "Resolved",
  ).length;
  document.getElementById("notifications").innerHTML =
    icon("Bell") + (alerts ? `<span class="badge">${alerts}</span>` : "");
  document.querySelector(".account .avatar").textContent = user.initials;
  document.querySelector(".account>span").textContent = user.name;
  document.getElementById("main").innerHTML =
    scopeControl() +
    (activeProfile && page === activeProfile.type
      ? profilePage()
      : page === "Home"
        ? home()
        : page === "Settings"
          ? settings()
          : page === "Help & Support"
            ? help()
            : page === "Search"
              ? searchResults()
              : page === "Trash"
                ? trashPage()
                : list());
  const donut = document.querySelector(".donut");
  if (donut) donut.style.background = chartGradient();
}
function restoreBackup(file) {
  if (!isManager()) return toast("Only the manager can restore a backup.");
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    let data;
    try {
      data = JSON.parse(reader.result);
      for (const k of RECORD_TYPES) {
        if (
          !Array.isArray(data[k]) ||
          data[k].some(
            (x) =>
              !x ||
              typeof x.id !== "string" ||
              typeof x.name !== "string" ||
              (x.visibility === "private" &&
                !USERS.some((u) => u.id === x.ownerId)),
          )
        )
          throw Error();
        const ids = data[k].map((x) => x.id);
        if (new Set(ids).size !== ids.length) throw Error();
      }
      if (
        !Array.isArray(data.activity) ||
        !Array.isArray(data.emailDrafts || [])
      )
        throw Error();
    } catch {
      return toast("Invalid CRM backup file.");
    }
    const d = showDialog(
      '<h2>Replace current data?</h2><p>Restoring updates the CRM records you can access. Missing active records move to Trash. New records belong to your account.</p><div class="formbuttons"><button class="secondary" id="cancel">Cancel</button><button class="primary" id="confirmrestore">Restore</button></div>',
    );
    d.querySelector("#cancel").onclick = closeDialog;
    d.querySelector("#confirmrestore").onclick = async () => {
      if (!isManager()) return;
      if (await persist(normalizeDB(data))) {
        closeDialog();
        render();
        toast("Backup restored");
      }
    };
  };
  reader.readAsText(file);
}
document.addEventListener("click", async (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  const a = b.dataset;
  if (a.page) go(a.page);
  else if (a.scope) {
    if (!isManager()) return;
    scopes[page] = a.scope === "my" ? "my" : "all";
    render();
  } else if (a.new) openForm(a.new, null, a.prefill);
  else if (a.edit) openForm(a.edit, a.id);
  else if (a.delete) confirmDelete(a.delete, a.id);
  else if (a.restore) await restoreRecord(a.restore, a.id);
  else if (a.purge) confirmDelete(a.purge, a.id, true);
  else if (a.email) emailComposer(a.email);
  else if (a.ctab) {
    complaintTab = a.ctab;
    render();
  } else if (a.ttab) {
    taskTab = a.ttab;
    render();
  } else if (a.chart) {
    chartTab = a.chart;
    render();
  } else if (a.region) {
    activeProfile = null;
    page = "Opportunities";
    regionFilter = a.region;
    render();
  } else if (a.join) {
    const m = visibleRecord("Meetings", a.join);
    if (!m) return;
    if (!m.url) return openForm("Meetings", m.id);
    try {
      const u = new URL(m.url);
      if (u.protocol !== "https:") throw Error();
      window.open(u.href, "_blank", "noopener,noreferrer");
    } catch {
      toast("Enter a valid HTTPS meeting URL");
    }
  } else if (a.ics) calendar(a.ics);
  else if (a.activity) {
    showDialog(
      '<h2>Recent Activity</h2><div class="activity">' +
        activityHTML(true) +
        '</div><div class="formbuttons"><button class="secondary" id="closeactivity">Close</button></div>',
    ).querySelector("#closeactivity").onclick = closeDialog;
  } else if (b.id === "add") {
    const menu = document.getElementById("addmenu");
    menu.hidden = !menu.hidden;
  } else if (b.id === "notifications") go("Complaints");
  else if (b.id === "profile") go("Settings");
  else if (b.id === "export") csv();
  else if (b.id === "clearregion") {
    regionFilter = "";
    render();
  } else if (b.id === "backup") {
    backupVisibleData();
    return;
    if (isManager()) {
      const data = structuredClone(db);
      for (const k of RECORD_TYPES) data[k] = data[k].filter(canRead);
      data.activity = data.activity.filter(canRead);
      data.employmentHistory = data.employmentHistory.filter(canRead);
      data.emailDrafts = data.emailDrafts.filter((x) => x.ownerId === user.id);
      download(
        "DGJ-CRM-backup.json",
        JSON.stringify(data, null, 2),
        "application/json",
      );
    }
  } else if (b.id === "reset") {
    toast("Demo reset is unavailable in the connected CRM.");
    return;
    if (!isManager()) return;
    const d = showDialog(
      '<h2>Reset demonstration?</h2><p>This removes local changes. Download a backup first if needed.</p><div class="formbuttons"><button class="secondary" id="cancel">Cancel</button><button class="primary" id="confirmreset">Reset</button></div>',
    );
    d.querySelector("#cancel").onclick = closeDialog;
    d.querySelector("#confirmreset").onclick = async () => {
      if (isManager() && (await persist(normalizeDB(null)))) {
        closeDialog();
        render();
        toast("Demo reset");
      }
    };
  }
});
document.addEventListener("change", async (e) => {
  if (e.target.dataset.check) {
    const id = e.target.dataset.check;
    const record = visibleRecord("Tasks", id);
    if (!record) return;
    const completed = e.target.checked;
    if (
      await transact((next) => {
        const t = next.Tasks.find((x) => x.id === id);
        t.status = completed ? "Completed" : "Open";
        addLog(
          next,
          completed ? "Task completed" : "Task reopened",
          t,
          "Tasks",
        );
      })
    )
      render();
  } else if (e.target.id === "restore") restoreBackup(e.target.files[0]);
});
document.getElementById("search").addEventListener("input", (e) => {
  activeProfile = null;
  query = e.target.value;
  page = query ? "Search" : "Home";
  render();
});
document.addEventListener("input", (e) => {
  if (e.target.id === "listsearch") {
    query = e.target.value;
    const pos = e.target.selectionStart;
    document.getElementById("main").innerHTML =
      scopeControl() + (page === "Trash" ? trashPage() : list());
    const n = document.getElementById("listsearch");
    n.focus();
    n.setSelectionRange(pos, pos);
  }
});
document.getElementById("modal").addEventListener("close", () => {
  const d = document.getElementById("modal");
  if (!d.open) d.innerHTML = "";
});
// Profiles use explicit record IDs. Matching a company name never associates past events.
let activeProfile = null,
  profileTab = "Timeline";
const BASE_READ = baseReadable;
function linkedAccess(x) {
  if (!x) return false;
  const inheritsParent =
    ((x.recordType === "Contacts" || x.recordType === "Opportunities") &&
      x.recordId) ||
    x.contactId;
  if (!inheritsParent && !BASE_READ(x)) return false;
  if (x.recordType === "Contacts" || x.recordType === "Opportunities") {
    const parent = db[x.recordType]?.find((r) => r.id === x.recordId);
    if (!parent || parent.deletedAt || !BASE_READ(parent)) return false;
  }
  if (x.opportunityId) {
    const p = db.Opportunities.find((r) => r.id === x.opportunityId);
    if (!p || p.deletedAt || !BASE_READ(p)) return false;
  }
  for (const id of Array.isArray(x.contactIds) ? x.contactIds : []) {
    const p = db.Contacts.find((r) => r.id === id);
    if (!p || p.deletedAt || !BASE_READ(p)) return false;
  }
  if (x.contactId) {
    const p = db.Contacts.find((r) => r.id === x.contactId);
    if (!p || p.deletedAt || !BASE_READ(p)) return false;
  }
  return true;
}
function profileLink(k, id, label) {
  return `<button class="profilelink" data-profile="${k}" data-id="${esc(id)}">${esc(label)}</button>`;
}
function profileFor(k, id) {
  if (!["Contacts", "Opportunities"].includes(k)) return;
  const x = visibleRecord(k, id);
  if (!x) return toast("Profile is not available.");
  activeProfile = { type: k, id };
  profileTab = "Timeline";
  page = k;
  query = "";
  regionFilter = "";
  document.getElementById("search").value = "";
  render();
}
function relatedTo(x, k, id) {
  return k === "Contacts"
    ? x.contactId === id ||
        (Array.isArray(x.contactIds) && x.contactIds.includes(id)) ||
        (x.recordType === "Contacts" && x.recordId === id)
    : x.opportunityId === id ||
        (x.recordType === "Opportunities" && x.recordId === id);
}
function relatedRows(type, k, id) {
  return recordsFor(type).filter((x) => relatedTo(x, k, id));
}
function visibleHistoryRows(k, id) {
  return db.employmentHistory.filter(
    (x) => x.contactId === id && linkedAccess(x) && inScope(x),
  );
}
function timelineFor(k, id) {
  const events = [];
  for (const a of db.activity) {
    if (relatedTo(a, k, id) && linkedAccess(a) && inScope(a)) {
      if (
        a.recordType === k &&
        a.recordId === id &&
        a.text === singular(k) + " updated" &&
        visibleRecord(k, id)?.history?.length
      )
        continue;
      events.push({
        id: "activity:" + a.id,
        title: a.text || a.subject || "Activity",
        detail:
          a.kind === "interaction"
            ? [a.body, a.nextStep ? "Next step: " + a.nextStep : ""]
                .filter(Boolean)
                .join("\n")
            : a.company || "",
        kind:
          a.kind === "interaction"
            ? a.channel || "Note"
            : a.recordType || "Update",
        date: a.occurredAt || a.time || Date.now(),
        actor: a.actorId,
        status: a.outcome || "",
        isInteraction: a.kind === "interaction",
      });
    }
  }
  for (const type of ["Meetings", "Tasks", "Reports", "Complaints"])
    for (const r of relatedRows(type, k, id)) {
      events.push({
        id: type + ":" + r.id,
        title: r.name,
        detail: r.company || "",
        kind: type,
        date: r.date
          ? new Date(r.date + "T" + (r.time || "12:00") + ":00+03:00").getTime()
          : r.updatedAt || r.createdAt || 0,
        actor: r.ownerId,
        status: r.status,
        type,
        recordId: r.id,
      });
    }
  if (k === "Contacts")
    for (const r of visibleHistoryRows(k, id))
      events.push({
        id: "employment:" + r.id,
        title: r.jobTitle || "Employment history",
        detail: [r.company, r.department].filter(Boolean).join(" · "),
        kind: "Employment",
        date: r.startDate
          ? new Date(r.startDate + "T12:00").getTime()
          : r.createdAt || 0,
        actor: r.ownerId,
        status: r.endDate ? "Ended" : "Current",
      });
  for (const draft of db.emailDrafts) {
    if (
      draft.ownerId === user.id &&
      relatedTo(draft, k, id) &&
      linkedAccess(draft) &&
      inScope(draft)
    ) {
      events.push({
        id: "draft:" + draft.id,
        title: "Email draft saved — " + (draft.subject || "Untitled"),
        detail: (draft.to || []).join("; "),
        kind: "Email Draft",
        date: draft.updatedAt || 0,
        actor: draft.ownerId,
        status: "Draft — not sent",
        isInteraction: true,
      });
    }
  }
  const x = visibleRecord(k, id);
  for (let i = 0; i < (x?.history || []).length; i++) {
    const h = x.history[i];
    events.push({
      id: "history:" + i,
      title: singular(k) + " updated",
      detail:
        [
          ["Name", "name"],
          ["Company", "company"],
          ["Job title", "jobTitle"],
          ["Status", "status"],
          ["Email", "email"],
          ["Phone", "phone"],
          ["Value (SAR)", "value"],
          ["Visibility", "visibility"],
        ]
          .filter(
            ([l, key]) =>
              String(h.before?.[key] || "") !==
              String((x.history[i + 1]?.before || x)[key] || ""),
          )
          .map(
            ([l, key]) =>
              l +
              ": " +
              (h.before?.[key] || "Not recorded") +
              " → " +
              ((x.history[i + 1]?.before || x)[key] || "Not recorded"),
          )
          .join("\n") || "Previous version retained in change history",
      kind: "History",
      date: h.at || 0,
      actor: h.actorId,
    });
  }
  if (x?.createdAt)
    events.push({
      id: "created",
      title: singular(k) + " created",
      detail: x.company || "",
      kind: "Created",
      date: x.createdAt,
      actor: x.ownerId,
    });
  return events.sort((a, b) => b.date - a.date);
}
function profileTimeline(k, id, onlyCommunication = false) {
  const events = timelineFor(k, id).filter(
    (x) => !onlyCommunication || x.isInteraction,
  );
  return `<div class="profiletimeline">${events.map((e) => `<article class="profileevent"><span class="eventicon">${icon(e.kind === "Meetings" ? "Meetings" : e.isInteraction ? "Email" : "Reports")}</span><div><div class="eventtitle">${e.type ? `<button data-edit="${e.type}" data-id="${esc(e.recordId)}">${esc(e.title)}</button>` : esc(e.title)} <span class="pill">${esc(e.kind)}</span>${e.status ? ` <span class="pill">${esc(e.status)}</span>` : ""}</div>${e.detail ? `<p class="eventdetail">${esc(e.detail)}</p>` : ""}<small class="muted">${e.date ? fullDate(e.date) : "Date not recorded"}${e.actor ? " · " + esc(userName(e.actor)) : ""}</small></div></article>`).join("") || `<div class="empty">No ${onlyCommunication ? "communication" : "linked activity"} recorded yet.</div>`}</div>`;
}
function relationTable(type, k, id) {
  const rows = relatedRows(type, k, id);
  return `<div class="sectiontoolbar"><span class="muted">${rows.length} linked ${type.toLowerCase()}</span><button class="primary" data-profile-new="${type}">＋ Add ${singular(type)}</button></div><div class="tablewrap"><table class="table"><thead><tr><th>Title</th><th>Status</th><th>Date</th><th>Action</th></tr></thead><tbody>${rows.map((r) => `<tr><td><button data-edit="${type}" data-id="${esc(r.id)}">${esc(r.name)}</button></td><td><span class="pill">${esc(r.status)}</span></td><td>${dateLabel(r.date)}${r.time ? " · " + timeLabel(r.time) : ""}</td><td><button class="secondary" data-edit="${type}" data-id="${esc(r.id)}">Open</button></td></tr>`).join("")}</tbody></table>${rows.length ? "" : '<div class="empty">No linked records yet. Existing records can be linked using their Edit form.</div>'}</div>`;
}
function employmentSection(id) {
  const rows = visibleHistoryRows("Contacts", id);
  return `<div class="sectiontoolbar"><span class="muted">Roles, companies and employment dates</span><button class="primary" id="addemployment">＋ Add Employment</button></div>${rows.map((r) => `<div class="employmentcard"><div><h3>${esc(r.jobTitle || "Role not recorded")}</h3><p>${esc(r.company)}${r.department ? " · " + esc(r.department) : ""}</p><small class="muted">${dateLabel(r.startDate)} — ${r.endDate ? dateLabel(r.endDate) : "Present"}</small>${r.notes ? '<p class="eventdetail">' + esc(r.notes) + "</p>" : ""}</div><button class="secondary" data-employment-edit="${esc(r.id)}">Edit</button></div>`).join("") || '<div class="empty">No employment history recorded yet.</div>'}`;
}
function detailFields(x, k) {
  const keys =
    k === "Contacts"
      ? [
          ["Full name", "name"],
          ["Company", "company"],
          ["Job title", "jobTitle"],
          ["Department", "department"],
          ["Email", "email"],
          ["Phone", "phone"],
          ["Alternate phone", "alternatePhone"],
          ["Preferred contact method", "preferredChannel"],
          ["Location", "location"],
          ["LinkedIn", "linkedIn"],
          ["Tags", "tags"],
          ["Status", "status"],
          ["Notes", "notes"],
        ]
      : [
          ["Opportunity", "name"],
          ["Company / Client", "company"],
          ["Reference", "reference"],
          ["Stage", "status"],
          ["Service line", "service"],
          ["Region", "region"],
          ["Value (SAR)", "value"],
          ["Start date", "startDate"],
          ["Target date", "targetDate"],
          ["Project scope", "scope"],
          ["Website", "website"],
          ["Notes", "notes"],
        ];
  return `<dl class="profiledetails">${keys.map(([l, key]) => `<div><dt>${l}</dt><dd>${esc(x[key] || "—")}</dd></div>`).join("")}</dl>${historyHTML(x)}`;
}
function relatedPeople(k, x) {
  const contacts =
    k === "Contacts"
      ? recordsFor("Contacts").filter(
          (c) => c.id !== x.id && normal(c.company) === normal(x.company),
        )
      : recordsFor("Contacts").filter(
          (c) => Array.isArray(x.contactIds) && x.contactIds.includes(c.id),
        );
  const opportunities =
    k === "Contacts"
      ? recordsFor("Opportunities").filter(
          (o) => Array.isArray(o.contactIds) && o.contactIds.includes(x.id),
        )
      : [];
  return `<div class="sectiontoolbar"><span class="muted">${k === "Contacts" ? "Contacts at the same company and explicitly linked opportunities" : "Contacts linked to this opportunity"}</span>${k === "Contacts" ? '<button class="primary" data-profile-new="Opportunities">＋ Add Opportunity</button>' : `<button class="primary" data-edit="Opportunities" data-id="${esc(x.id)}">Manage Contacts</button>`}</div>${opportunities.length ? '<h3 class="subheading">Linked Opportunities</h3>' + opportunities.map((o) => `<div class="row"><div class="grow">${profileLink("Opportunities", o.id, o.name)}</div><span class="pill">${esc(o.status)}</span></div>`).join("") : k === "Contacts" ? '<p class="muted">No opportunities linked yet.</p>' : ""}<h3 class="subheading">${k === "Contacts" ? "Same Company" : "Linked Contacts"}</h3>${contacts.map((c) => `<div class="row"><div class="grow">${profileLink("Contacts", c.id, c.name)}<small>${esc(c.jobTitle || c.company)}</small></div><span class="muted">${esc(c.email || c.phone || "")}</span></div>`).join("") || '<div class="empty">No related contacts yet.</div>'}`;
}
function draftSection(opportunity) {
  const drafts = db.emailDrafts.filter(
    (x) => x.opportunityId === opportunity.id && x.ownerId === user.id,
  );
  return `<div class="sectiontoolbar"><span class="muted">Your email drafts for this opportunity</span><button class="primary" data-email="${esc(opportunity.id)}">＋ Compose Email</button></div><p class="smallnote">Outlook is not connected. Drafts are not sent emails. Record an externally sent email using Log Communication if needed.</p>${drafts.map((x) => `<button class="draftcard" data-open-draft="${esc(x.id)}"><b>${esc(x.subject || "Untitled draft")}</b><small>${esc((x.to || []).join("; "))}</small><span class="pill">Draft</span><small>${fullDate(x.updatedAt)}</small></button>`).join("") || '<div class="empty">No saved email drafts.</div>'}`;
}
function profilePage() {
  const { type: k, id } = activeProfile;
  const x = visibleRecord(k, id);
  if (!x)
    return '<div class="empty">This profile is no longer available.<br><button class="secondary" id="backprofiles">Back to list</button></div>';
  const isContact = k === "Contacts";
  const menu = isContact
    ? [
        "Timeline",
        "Meetings",
        "Communication",
        "Related Records",
        "Tasks",
        "Reports",
        "Complaints",
        "Employment History",
        "Details",
      ]
    : [
        "Timeline",
        "Meetings",
        "Communication",
        "Contacts",
        "Tasks",
        "Reports",
        "Complaints",
        "Details",
      ];
  let content;
  if (profileTab === "Timeline") content = profileTimeline(k, id);
  else if (profileTab === "Communication")
    content =
      `<div class="sectiontoolbar"><span class="muted">Calls, emails, messages and notes</span><button class="primary" id="logcommunication">＋ Log Communication</button></div>` +
      profileTimeline(k, id, true) +
      (!isContact ? draftSection(x) : "");
  else if (profileTab === "Employment History") content = employmentSection(id);
  else if (profileTab === "Details") content = detailFields(x, k);
  else if (profileTab === "Related Records" || profileTab === "Contacts")
    content = relatedPeople(k, x);
  else content = relationTable(profileTab, k, id);
  const linkedOpps = isContact
    ? recordsFor("Opportunities").filter((o) => o.contactIds?.includes(id))
    : [];
  const avatar = isContact
    ? x.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((y) => y[0])
        .join("")
        .toUpperCase()
    : "↗";
  return `<div class="profilebreadcrumb"><button id="backprofiles">← ${k}</button><span>/</span><span>${esc(x.name)}</span></div><section class="profilehero"><div class="profileavatar">${esc(avatar)}</div><div class="profileheading"><div class="profiletype">${isContact ? "CONTACT PROFILE" : "OPPORTUNITY PROFILE"}</div><h1>${esc(x.name)}</h1><p>${esc(x.company)}${isContact && x.jobTitle ? " · " + esc(x.jobTitle) : ""}</p><div class="profilebadges"><span class="pill">${esc(x.status)}</span><span class="pill ${x.visibility === "private" ? "private" : ""}">${x.visibility === "private" ? "Private — only owner" : "Shared with team"}</span><small class="muted">Owner: ${esc(userName(x.ownerId))}</small></div></div><div class="profileactions"><button class="primary" data-edit="${k}" data-id="${esc(id)}">Edit Profile</button>${!isContact ? `<button class="secondary" data-email="${esc(id)}">${icon("Email")} Email Company</button>` : ""}<button class="secondary" id="logcommunication">＋ Log Communication</button>${isManager() ? `<button class="secondary dangertext" data-delete="${k}" data-id="${esc(id)}">Delete</button>` : ""}</div></section><div class="profilelayout"><aside class="profileinfo"><h2>${isContact ? "Contact Information" : "Opportunity Details"}</h2>${isContact ? `<dl><dt>Email</dt><dd>${esc(x.email || "Not recorded")}</dd><dt>Phone</dt><dd>${esc(x.phone || "Not recorded")}</dd><dt>Preferred Method</dt><dd>${esc(x.preferredChannel || "Not recorded")}</dd><dt>Company</dt><dd>${esc(x.company || "Not recorded")}</dd><dt>Job Title</dt><dd>${esc(x.jobTitle || "Not recorded")}</dd><dt>Location</dt><dd>${esc(x.location || "Not recorded")}</dd><dt>Tags</dt><dd>${esc(x.tags || "—")}</dd></dl>` : `<dl><dt>Reference</dt><dd>${esc(x.reference || "—")}</dd><dt>Company</dt><dd>${esc(x.company || "—")}</dd><dt>Stage</dt><dd>${esc(x.status)}</dd><dt>Value (SAR)</dt><dd>${Number(x.value || 0).toLocaleString()}</dd><dt>Service Line</dt><dd>${esc(x.service || "—")}</dd><dt>Target Date</dt><dd>${dateLabel(x.targetDate)}</dd></dl>`}<div class="profilesummary"><div><b>${relatedRows("Meetings", k, id).length}</b><span>Meetings</span></div><div><b>${relatedRows("Tasks", k, id).length}</b><span>Tasks</span></div><div><b>${relatedRows("Reports", k, id).length}</b><span>Reports</span></div></div><button class="secondary fullwidth" data-profile-new="Meetings">＋ Schedule Meeting</button><button class="secondary fullwidth" data-profile-new="Tasks">＋ Add Task</button><button class="secondary fullwidth" data-profile-new="Reports">＋ Add Report</button>${isContact && linkedOpps.length ? '<h3 class="subheading">Linked Opportunities</h3>' + linkedOpps.map((o) => profileLink("Opportunities", o.id, o.name)).join("") : ""}</aside><section class="panel profilecontent"><div class="profiletabs">${menu.map((t) => `<button data-profiletab="${t}" class="${profileTab === t ? "selected" : ""}">${t}</button>`).join("")}</div>${content}</section></div>`;
}
function linkFields(k, x) {
  const parentOpp = x.opportunityId || "";
  const selected = Array.isArray(x.contactIds) ? x.contactIds : [];
  let content = "";
  if (k !== "Contacts") {
    content = `<fieldset class="visibility"><legend>${k === "Opportunities" ? "Linked contacts" : "Contacts / attendees"}</legend><div class="linkchoices">${
      recordsFor("Contacts", "Linking")
        .map(
          (c) =>
            `<label><input type="checkbox" name="contactIds" value="${esc(c.id)}" ${selected.includes(c.id) ? "checked" : ""}> ${esc(c.name)} <small>${esc(c.company)}</small></label>`,
        )
        .join("") ||
      "<small>No available contacts. Create a contact first.</small>"
    }</div></fieldset>`;
  }
  if (!["Contacts", "Opportunities"].includes(k)) {
    content += `<label class="formfield">Linked opportunity<select name="opportunityId"><option value="">None</option>${recordsFor(
      "Opportunities",
      "Linking",
    )
      .map(
        (o) =>
          `<option value="${esc(o.id)}" ${parentOpp === o.id ? "selected" : ""}>${esc(o.name)} — ${esc(o.company)}</option>`,
      )
      .join("")}</select></label>`;
  }
  return content;
}
function extraFields(k, x) {
  const f = (l, key, type = "text") =>
    `<label class="formfield">${l}<input name="${key}" type="${type}" value="${esc(x[key])}"></label>`;
  if (k === "Contacts")
    return (
      f("Job title", "jobTitle") +
      f("Department", "department") +
      f("Alternate phone", "alternatePhone", "tel") +
      `<label class="formfield">Preferred contact method<select name="preferredChannel">${["Not recorded", "Email", "Phone", "Teams", "WhatsApp", "In person"].map((v) => `<option ${x.preferredChannel === v ? "selected" : ""}>${v}</option>`).join("")}</select></label>` +
      f("Location", "location") +
      f("LinkedIn URL", "linkedIn", "url") +
      f("Tags (comma separated)", "tags")
    );
  if (k === "Opportunities")
    return (
      f("Opportunity reference", "reference") +
      f("Start date", "startDate", "date") +
      f("Target date", "targetDate", "date") +
      f("Company website", "website", "url") +
      `<label class="formfield">Project scope<textarea name="scope" rows="3">${esc(x.scope)}</textarea></label>`
    );
  return "";
}
function communicationForm() {
  if (!activeProfile) return;
  const { type: k, id } = activeProfile;
  const x = visibleRecord(k, id);
  if (!x) return;
  const d = showDialog(
    `<form id="communicationform"><h2>Log Communication</h2><p class="smallnote">Linked to ${esc(x.name)}. This records communication that happened outside CRM; it does not make a call or send a message.</p><label class="formfield">Channel<select name="channel">${["Phone", "Email", "Teams", "WhatsApp", "In person", "Note"].map((v) => "<option>" + v + "</option>").join("")}</select></label><label class="formfield">Subject<input name="subject" required maxlength="250"></label><label class="formfield">When<input name="occurredAt" type="datetime-local" required value="${new Date(Date.now() + 3 * 3600000).toISOString().slice(0, 16)}"></label><label class="formfield">Outcome<select name="outcome"><option>Recorded</option><option>Follow-up needed</option><option>Completed</option><option>No answer</option></select></label><label class="formfield">Details<textarea name="body" required rows="5"></textarea></label>${linkFields("Reports", { contactIds: k === "Contacts" ? [id] : x.contactIds || [], opportunityId: k === "Opportunities" ? id : "" })}<label class="formfield">Next step<input name="nextStep"></label><div class="formbuttons"><button type="button" class="secondary" id="cancel">Cancel</button><button class="primary" type="submit">Save Activity</button></div></form>`,
  );
  d.querySelector("#cancel").onclick = closeDialog;
  if (k === "Opportunities")
    d.querySelector("[name=opportunityId]").disabled = true;
  d.querySelector("form").onsubmit = async (e) => {
    e.preventDefault();
    if (!visibleRecord(k, id)) return toast("Profile is not available");
    const f = new FormData(e.target),
      v = Object.fromEntries(f);
    const linkedContacts = [
      ...new Set([
        ...(k === "Contacts" ? [id] : []),
        ...f.getAll("contactIds"),
      ]),
    ];
    const opp = k === "Opportunities" ? id : v.opportunityId || "";
    if (
      linkedContacts.some((c) => !visibleRecord("Contacts", c)) ||
      (opp && !visibleRecord("Opportunities", opp))
    )
      return toast("A linked record is not available");
    const t = new Date(v.occurredAt + ":00+03:00").getTime();
    if (!Number.isFinite(t) || !v.subject.trim() || !v.body.trim())
      return toast("Enter the subject, date and details");
    const event = {
      id: crypto.randomUUID(),
      kind: "interaction",
      text: v.subject.trim(),
      subject: v.subject.trim(),
      body: v.body,
      channel: v.channel,
      outcome: v.outcome,
      nextStep: v.nextStep,
      recordType: k,
      recordId: id,
      contactIds: linkedContacts,
      opportunityId: opp,
      company: x.company,
      time: Date.now(),
      occurredAt: t,
      actorId: user.id,
      ownerId: user.id,
      visibility: x.visibility,
    };
    if (await transact((next) => next.activity.unshift(event))) {
      closeDialog();
      profileTab = "Communication";
      render();
      toast("Communication recorded");
    }
  };
}
function employmentForm(id) {
  if (activeProfile?.type !== "Contacts") return;
  const contact = visibleRecord("Contacts", activeProfile.id);
  if (!contact) return;
  const old = id
    ? db.employmentHistory.find(
        (x) => x.id === id && x.contactId === contact.id && linkedAccess(x),
      )
    : null;
  if (id && !old) return;
  const x = old || { company: contact.company, jobTitle: contact.jobTitle };
  const field = (l, key, type = "text", required = false) =>
    `<label class="formfield">${l}<input name="${key}" type="${type}" value="${esc(x[key])}" ${required ? "required" : ""}></label>`;
  const d = showDialog(
    `<form id="employmentform"><h2>${old ? "Edit" : "Add"} Employment</h2>${field("Company", "company", "text", true)}${field("Job title", "jobTitle")}${field("Department", "department")}${field("Start date", "startDate", "date")}${field("End date (leave blank for current role)", "endDate", "date")}<label class="formfield">Notes<textarea name="notes" rows="3">${esc(x.notes)}</textarea></label><div class="formbuttons"><button type="button" class="secondary" id="cancel">Cancel</button><button class="primary" type="submit">Save</button></div></form>`,
  );
  d.querySelector("#cancel").onclick = closeDialog;
  d.querySelector("form").onsubmit = async (e) => {
    e.preventDefault();
    const v = Object.fromEntries(new FormData(e.target));
    if (v.startDate && v.endDate && v.endDate < v.startDate)
      return toast("End date cannot precede start date");
    const record = {
      ...old,
      ...v,
      id: old?.id || crypto.randomUUID(),
      contactId: contact.id,
      ownerId: old?.ownerId || user.id,
      visibility: contact.visibility,
      createdAt: old?.createdAt || Date.now(),
      updatedAt: Date.now(),
    };
    if (
      await transact((next) => {
        next.employmentHistory = next.employmentHistory.filter(
          (h) => h.id !== record.id,
        );
        next.employmentHistory.push(record);
        addLog(
          next,
          "Employment history " + (old ? "updated" : "added"),
          contact,
          "Contacts",
        );
      })
    ) {
      closeDialog();
      profileTab = "Employment History";
      render();
      toast("Employment saved");
    }
  };
}
function profileNew(k) {
  if (!activeProfile) return;
  const { type, id } = activeProfile;
  const parent = visibleRecord(type, id);
  if (!parent) return;
  openForm(k, null, "", {
    company: parent.company,
    contactIds: type === "Contacts" ? [id] : parent.contactIds || [],
    opportunityId: type === "Opportunities" ? id : "",
  });
}
document.addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  const a = b.dataset;
  if (a.profile) profileFor(a.profile, a.id);
  else if (a.profiletab) {
    profileTab = a.profiletab;
    render();
  } else if (a.profileNew) profileNew(a.profileNew);
  else if (a.openDraft) {
    const draft = db.emailDrafts.find(
      (x) => x.id === a.openDraft && x.ownerId === user.id,
    );
    if (draft) emailComposer(draft.opportunityId, draft.id);
  } else if (a.employmentEdit) employmentForm(a.employmentEdit);
  else if (b.id === "backprofiles") {
    activeProfile = null;
    render();
  } else if (b.id === "logcommunication") communicationForm();
  else if (b.id === "addemployment") employmentForm();
});

function historyHTML(x) {
  if (!x.history?.length) return "";
  return `<details class="history"><summary>Change history (${x.history.length})</summary>${x.history
    .slice()
    .reverse()
    .map(
      (h) =>
        `<div class="historyitem"><b>${fullDate(h.at)}</b><small>by ${esc(userName(h.actorId))}</small><div>${[
          ["Name", "name"],
          ["Company", "company"],
          ["Job title", "jobTitle"],
          ["Email", "email"],
          ["Phone", "phone"],
          ["Status", "status"],
          ["Value (SAR)", "value"],
          ["Notes", "notes"],
          ["Scope", "scope"],
        ]
          .filter(
            ([l, key]) =>
              h.before?.[key] !== undefined && h.before?.[key] !== "",
          )
          .map(
            ([l, key]) =>
              `<div><strong>${l}:</strong> ${esc(h.before[key])}</div>`,
          )
          .join("")}</div></div>`,
    )
    .join("")}</details>`;
}
